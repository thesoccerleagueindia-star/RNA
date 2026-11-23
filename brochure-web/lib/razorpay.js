"use strict";

const crypto = require("crypto");
const config = require("./config");

/**
 * Razorpay feasibility (researched):
 *
 * razorpay.me/@handle?amount=…  — static payment page. No customer email binding,
 * no server-side order id, no webhook payload tied to our REG- id, no invoice API.
 * Receipts are Razorpay’s default payment confirmation to the payer’s entered email only.
 *
 * Payment Links API (needs KEY_ID + KEY_SECRET):
 * - Create link with amount, customer.email, reference_id = our REG id
 * - notify.email / notify.sms can send the link to the parent
 * - callback_url for return; webhook payment_link.paid for reconciliation
 * - Razorpay FAQ: Invoices API cannot auto-send a post-payment invoice after a Payment Link;
 *   generate your own receipt/confirmation email (we do that) or issue a separate Invoice to collect payment.
 *
 * Invoices API (optional RAZORPAY_CREATE_INVOICE=true):
 * - Creates a Razorpay Invoice that also requests payment (not a post-pay GST tax invoice).
 * - Useful as an emailed “pay this invoice” document with line items.
 */

function razorpayApiConfigured() {
  return Boolean(config.razorpayKeyId && config.razorpayKeySecret);
}

async function razorpayRequest(path, method, body) {
  const auth = Buffer.from(`${config.razorpayKeyId}:${config.razorpayKeySecret}`).toString("base64");
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json.error?.description || json.error?.code || `Razorpay HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

async function createPaymentLink(record) {
  const callback =
    config.razorpayCallbackBase
      ? `${config.razorpayCallbackBase.replace(/\/$/, "")}/payment-complete.html`
      : undefined;

  const payload = {
    amount: config.feePaise,
    currency: "INR",
    accept_partial: false,
    reference_id: record.id.slice(0, 40),
    description: `Clinic registration · ${record.city} · ${record.playerName}`,
    customer: {
      name: record.guardianName || record.playerName,
      email: record.email,
      contact: String(record.guardianContact || "").replace(/\D/g, "").slice(-10) || undefined,
    },
    notify: {
      sms: Boolean(record.guardianContact),
      email: Boolean(record.email),
    },
    reminder_enable: true,
    notes: {
      registration_id: record.id,
      city: record.city,
      player: record.playerName,
      category: record.category,
    },
  };
  if (callback) {
    payload.callback_url = callback;
    payload.callback_method = "get";
  }

  const link = await razorpayRequest("/payment_links", "POST", payload);
  return {
    paymentProvider: "razorpay_payment_link",
    paymentUrl: link.short_url || link.payment_url,
    razorpayPaymentLinkId: link.id,
    paymentStatus: "unpaid",
    raw: link,
  };
}

async function createInvoice(record) {
  // Razorpay Invoice = payment request document emailed to customer (not automatic post-pay tax invoice).
  const invoice = await razorpayRequest("/invoices", "POST", {
    type: "invoice",
    description: `Clinic India Tour 2027 · ${record.city}`,
    customer: {
      name: record.guardianName || record.playerName,
      email: record.email,
      contact: String(record.guardianContact || "").replace(/\D/g, "").slice(-10) || undefined,
    },
    line_items: [
      {
        name: "Clinic registration (incl. GST)",
        description: `${record.playerName} · ${record.category} · ${record.city} · Ref ${record.id}`,
        amount: config.feePaise,
        currency: "INR",
        quantity: 1,
      },
    ],
    sms_notify: 1,
    email_notify: 1,
    currency: "INR",
    notes: {
      registration_id: record.id,
      city: record.city,
    },
  });
  return {
    paymentProvider: "razorpay_invoice",
    paymentUrl: invoice.short_url || invoice.invoice_url,
    razorpayInvoiceId: invoice.id,
    paymentStatus: "unpaid",
    raw: invoice,
  };
}

/**
 * Resolve payment handoff for a registration.
 * Prefer Payment Link (or Invoice if enabled); else static razorpay.me URL.
 */
async function resolvePayment(record) {
  if (!razorpayApiConfigured()) {
    return {
      paymentProvider: "razorpay.me",
      paymentUrl: config.razorpayMeUrl,
      paymentStatus: "unpaid",
      paymentNote:
        "Using static razorpay.me link. Set RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET to create per-registration Payment Links with email notify.",
    };
  }

  if (config.createRazorpayInvoice) {
    try {
      return await createInvoice(record);
    } catch (err) {
      console.error("Invoice create failed, falling back to Payment Link:", err.message);
    }
  }

  try {
    return await createPaymentLink(record);
  } catch (err) {
    console.error("Payment Link create failed, falling back to razorpay.me:", err.message);
    return {
      paymentProvider: "razorpay.me",
      paymentUrl: config.razorpayMeUrl,
      paymentStatus: "unpaid",
      paymentNote: `Payment Link error: ${err.message}`,
    };
  }
}

function verifyWebhookSignature(rawBody, signature) {
  if (!config.razorpayWebhookSecret) return false;
  const expected = crypto
    .createHmac("sha256", config.razorpayWebhookSecret)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ""));
  } catch {
    return false;
  }
}

module.exports = {
  razorpayApiConfigured,
  resolvePayment,
  createPaymentLink,
  createInvoice,
  verifyWebhookSignature,
};
