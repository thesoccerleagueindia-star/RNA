"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

// Optional local .env (host panels often inject env instead)
(function loadDotEnv() {
  try {
    const p = path.join(__dirname, ".env");
    if (!fs.existsSync(p)) return;
    for (const line of fs.readFileSync(p, "utf8").split(/\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 1) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (process.env[k] == null || process.env[k] === "") process.env[k] = v;
    }
  } catch {
    /* ignore */
  }
})();

const config = require("./lib/config");
const {
  requireFields,
  normalizeWaitlist,
  normalizeRegistration,
  makeId,
} = require("./lib/validate");
const { appendWaitlist, appendRegistration, sheetsConfigured } = require("./lib/sheets");
const {
  emailConfigured,
  sendWaitlistEmails,
  sendRegistrationEmails,
} = require("./lib/email");
const { resolvePayment, razorpayApiConfigured, verifyWebhookSignature } = require("./lib/razorpay");

const ROOT = path.join(__dirname, "public");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".otf": "font/otf",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function safeJoin(root, reqPath) {
  const cleaned = path
    .normalize(decodeURIComponent(reqPath.split("?")[0]))
    .replace(/^(\.\.[/\\])+/, "");
  const full = path.join(root, cleaned);
  return full.startsWith(root) ? full : null;
}

function send(res, status, body, type) {
  const payload = typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": type || "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function parseJson(req) {
  const raw = await readBody(req);
  if (!raw.length) return { raw, json: {} };
  try {
    return { raw, json: JSON.parse(raw.toString("utf8")) };
  } catch {
    const err = new Error("Invalid JSON body");
    err.status = 400;
    throw err;
  }
}

async function handleWaitlist(body) {
  const data = normalizeWaitlist(body);
  const missing = requireFields(data, [
    "playerName",
    "guardianName",
    "age",
    "city",
    "category",
    "interest",
    "email",
    "phone",
  ]);
  if (missing.length) {
    const err = new Error(`Missing fields: ${missing.join(", ")}`);
    err.status = 400;
    throw err;
  }
  if (!data.consent) {
    const err = new Error("Consent is required");
    err.status = 400;
    throw err;
  }

  const record = {
    ...data,
    id: makeId("WL"),
    submittedAt: new Date().toISOString(),
  };

  const result = { ok: true, id: record.id, stored: {}, emails: null, warnings: [] };

  if (!sheetsConfigured()) {
    result.warnings.push(
      "Sheets not configured — set SHEETS_APPS_SCRIPT_URL (recommended) or service-account sheet IDs."
    );
  } else {
    result.stored.sheets = await appendWaitlist(record);
  }

  if (!emailConfigured()) {
    result.warnings.push(
      "Email not configured — set RESEND_API_KEY or SMTP_* or EMAIL_VIA_APPS_SCRIPT=true."
    );
  } else {
    try {
      result.emails = await sendWaitlistEmails(record);
    } catch (e) {
      result.warnings.push(`Email failed: ${e.message}`);
    }
  }

  return result;
}

async function handleRegister(body) {
  const data = normalizeRegistration(body);
  const missing = requireFields(data, [
    "playerName",
    "guardianName",
    "age",
    "city",
    "category",
    "interest",
    "email",
    "guardianContact",
  ]);
  if (missing.length) {
    const err = new Error(`Missing fields: ${missing.join(", ")}`);
    err.status = 400;
    throw err;
  }
  if (!data.guardianConsent || !data.privacyAck) {
    const err = new Error("Guardian consent and privacy acknowledgement are required");
    err.status = 400;
    throw err;
  }

  let record = {
    ...data,
    id: makeId("REG"),
    submittedAt: new Date().toISOString(),
    feeBase: config.feeInr,
    feePayable: config.feeInr,
    feeNote: "inclusive of GST",
    paymentStatus: "unpaid",
  };

  const payment = await resolvePayment(record);
  record = {
    ...record,
    paymentProvider: payment.paymentProvider,
    paymentUrl: payment.paymentUrl,
    razorpayPaymentLinkId: payment.razorpayPaymentLinkId || "",
    razorpayInvoiceId: payment.razorpayInvoiceId || "",
    paymentNote: payment.paymentNote || "",
  };

  const result = {
    ok: true,
    id: record.id,
    paymentUrl: record.paymentUrl,
    paymentProvider: record.paymentProvider,
    feePayable: record.feePayable,
    stored: {},
    emails: null,
    warnings: [],
  };

  if (!sheetsConfigured()) {
    result.warnings.push(
      "Sheets not configured — set SHEETS_APPS_SCRIPT_URL (recommended) or service-account sheet IDs."
    );
  } else {
    result.stored.sheets = await appendRegistration(record);
  }

  if (!emailConfigured()) {
    result.warnings.push(
      "Email not configured — set RESEND_API_KEY or SMTP_* or EMAIL_VIA_APPS_SCRIPT=true."
    );
  } else {
    try {
      result.emails = await sendRegistrationEmails(record);
    } catch (e) {
      result.warnings.push(`Email failed: ${e.message}`);
    }
  }

  return result;
}

function serveStatic(req, res, pathname) {
  let rel = pathname === "/" ? "/index.html" : pathname;
  let filePath = safeJoin(ROOT, rel);
  if (!filePath) return send(res, 403, "Forbidden", "text/plain; charset=utf-8");
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return send(res, 404, "Not found", "text/plain; charset=utf-8");
  }
  const ext = path.extname(filePath).toLowerCase();
  send(res, 200, fs.readFileSync(filePath), TYPES[ext] || "application/octet-stream");
}

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const pathname = u.pathname;

    if (req.method === "OPTIONS") {
      return send(res, 204, "");
    }

    if (req.method === "GET" && pathname === "/api/health") {
      return send(res, 200, {
        ok: true,
        sheets: sheetsConfigured(),
        email: emailConfigured(),
        razorpayApi: razorpayApiConfigured(),
        feeInr: config.feeInr,
      });
    }

    if (req.method === "POST" && pathname === "/api/waitlist") {
      const { json } = await parseJson(req);
      const result = await handleWaitlist(json);
      return send(res, 200, result);
    }

    if (req.method === "POST" && pathname === "/api/register") {
      const { json } = await parseJson(req);
      const result = await handleRegister(json);
      return send(res, 200, result);
    }

    if (req.method === "POST" && pathname === "/api/razorpay/webhook") {
      const raw = await readBody(req);
      const signature = req.headers["x-razorpay-signature"];
      if (config.razorpayWebhookSecret && !verifyWebhookSignature(raw, signature)) {
        return send(res, 400, { ok: false, error: "Invalid signature" });
      }
      let event;
      try {
        event = JSON.parse(raw.toString("utf8"));
      } catch {
        return send(res, 400, { ok: false, error: "Invalid JSON" });
      }
      console.log(
        "[razorpay webhook]",
        event.event,
        event.payload?.payment_link?.entity?.reference_id ||
          event.payload?.payment?.entity?.notes?.registration_id ||
          ""
      );
      // Reconciliation tip: match reference_id / notes.registration_id to Registration sheet and mark paid.
      return send(res, 200, { ok: true, received: event.event || true });
    }

    if (req.method === "GET" || req.method === "HEAD") {
      return serveStatic(req, res, pathname);
    }

    send(res, 405, { ok: false, error: "Method not allowed" });
  } catch (e) {
    console.error(e);
    send(res, e.status || 500, { ok: false, error: e.message || "Server error" });
  }
});

server.listen(config.port, "0.0.0.0", () => {
  console.log(`RNA Clinic Tour listening on :${config.port}`);
  console.log(
    `Sheets: ${sheetsConfigured() ? "configured" : "NOT configured"} · Email: ${
      emailConfigured() ? "configured" : "NOT configured"
    } · Razorpay API: ${razorpayApiConfigured() ? "yes" : "razorpay.me fallback"}`
  );
});
