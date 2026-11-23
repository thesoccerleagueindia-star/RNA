"use strict";

const config = require("./config");

function emailConfigured() {
  if (config.resendApiKey) return true;
  if (config.smtpHost && config.smtpUser && config.smtpPass) return true;
  // Apps Script can send mail when Node asks it to (handled in sheets payload if EMAIL_VIA_SHEETS=1)
  if (process.env.EMAIL_VIA_APPS_SCRIPT === "true" && config.sheetsAppsScriptUrl) return true;
  return false;
}

async function sendViaResend({ to, subject, html, text }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.fromEmail,
      to: [to],
      subject,
      html,
      text,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || `Resend HTTP ${res.status}`);
  }
  return { method: "resend", id: body.id };
}

async function sendViaSmtp({ to, subject, html, text }) {
  let nodemailer;
  try {
    nodemailer = require("nodemailer");
  } catch {
    throw new Error("nodemailer not installed. Run: npm install nodemailer — or set RESEND_API_KEY.");
  }
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: { user: config.smtpUser, pass: config.smtpPass },
  });
  const info = await transporter.sendMail({
    from: config.fromEmail,
    to,
    subject,
    html,
    text,
  });
  return { method: "smtp", id: info.messageId };
}

async function sendViaAppsScript({ to, subject, html, text }) {
  const res = await fetch(config.sheetsAppsScriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "email",
      to,
      subject,
      html,
      text,
      fromAlias: config.fromEmail,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.ok === false) {
    throw new Error(json.error || `Apps Script email HTTP ${res.status}`);
  }
  return { method: "apps_script_email", ...json };
}

async function sendMail(opts) {
  if (config.resendApiKey) return sendViaResend(opts);
  if (config.smtpHost && config.smtpUser && config.smtpPass) return sendViaSmtp(opts);
  if (process.env.EMAIL_VIA_APPS_SCRIPT === "true" && config.sheetsAppsScriptUrl) {
    return sendViaAppsScript(opts);
  }
  throw new Error("No email provider configured (RESEND_API_KEY or SMTP_* or EMAIL_VIA_APPS_SCRIPT)");
}

function waitlistAlertHtml(record) {
  return `
    <h2>New waitlist submission</h2>
    <p><strong>ID:</strong> ${record.id}</p>
    <ul>
      <li>Player: ${escapeHtml(record.playerName)}</li>
      <li>Guardian: ${escapeHtml(record.guardianName)}</li>
      <li>Age: ${escapeHtml(record.age)}</li>
      <li>City: ${escapeHtml(record.city)}</li>
      <li>Category: ${escapeHtml(record.category)}</li>
      <li>Interest: ${escapeHtml(record.interest)}</li>
      <li>Email: ${escapeHtml(record.email)}</li>
      <li>Phone: ${escapeHtml(record.phone)}</li>
      <li>Submitted: ${escapeHtml(record.submittedAt)}</li>
    </ul>`;
}

function waitlistConfirmHtml(record) {
  return `
    <p>Dear ${escapeHtml(record.guardianName || record.playerName)},</p>
    <p>Thank you for joining the waitlist for <strong>${config.siteName}</strong>.</p>
    <p>Your reference ID is <strong>${record.id}</strong>.</p>
    <p>City preference: <strong>${escapeHtml(record.city)}</strong> · Interest: <strong>${escapeHtml(record.interest)}</strong></p>
    <p>We will contact you when places or dates open. No payment has been taken.</p>
    <p>— ATLETAS INDIAN SPORTS AND ENTERTAINMENT PVT LTD<br/>
    +91 80131 66131 · CONTACT@AISEORG.INFO</p>`;
}

function registrationAlertHtml(record) {
  return `
    <h2>New clinic registration</h2>
    <p><strong>ID:</strong> ${record.id}</p>
    <ul>
      <li>Player: ${escapeHtml(record.playerName)}</li>
      <li>Guardian: ${escapeHtml(record.guardianName)}</li>
      <li>Age: ${escapeHtml(record.age)}</li>
      <li>City: ${escapeHtml(record.city)}</li>
      <li>Category: ${escapeHtml(record.category)}</li>
      <li>Interest: ${escapeHtml(record.interest)}</li>
      <li>Email: ${escapeHtml(record.email)}</li>
      <li>Contact: ${escapeHtml(record.guardianContact)}</li>
      <li>Fee: ₹${record.feePayable} (${escapeHtml(record.feeNote)})</li>
      <li>Payment status: ${escapeHtml(record.paymentStatus)}</li>
      <li>Payment URL: ${escapeHtml(record.paymentUrl || "")}</li>
      <li>Submitted: ${escapeHtml(record.submittedAt)}</li>
    </ul>`;
}

function registrationConfirmHtml(record) {
  const payLine = record.paymentUrl
    ? `<p>Please complete payment of <strong>₹${record.feePayable}</strong> (inclusive of GST) here:<br/>
       <a href="${escapeAttr(record.paymentUrl)}">${escapeHtml(record.paymentUrl)}</a></p>`
    : `<p>Please complete payment of <strong>₹${record.feePayable}</strong> (inclusive of GST) via the Razorpay page opened after registration.</p>`;
  return `
    <p>Dear ${escapeHtml(record.guardianName || record.playerName)},</p>
    <p>Thank you for registering for <strong>${config.siteName}</strong>.</p>
    <p>Your reference ID is <strong>${record.id}</strong>.</p>
    <p>${escapeHtml(record.playerName)} · ${escapeHtml(record.city)} · ${escapeHtml(record.category)}</p>
    ${payLine}
    <p>Keep your reference ID for confirmation with the organiser. Clinic fees are non-refundable as per our refund policy.</p>
    <p>— ATLETAS INDIAN SPORTS AND ENTERTAINMENT PVT LTD<br/>
    +91 80131 66131 · CONTACT@AISEORG.INFO</p>`;
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, "&#39;");
}

async function sendWaitlistEmails(record) {
  const results = [];
  results.push(
    await sendMail({
      to: config.organiserEmail,
      subject: `[Waitlist] ${record.id} · ${record.city} · ${record.playerName}`,
      html: waitlistAlertHtml(record),
      text: `Waitlist ${record.id} ${record.playerName} ${record.city} ${record.email}`,
    })
  );
  if (record.email) {
    results.push(
      await sendMail({
        to: record.email,
        subject: `Waitlist confirmation · ${record.id} · ${config.siteName}`,
        html: waitlistConfirmHtml(record),
        text: `Thank you for joining the waitlist. Reference ${record.id}.`,
      })
    );
  }
  return results;
}

async function sendRegistrationEmails(record) {
  const results = [];
  results.push(
    await sendMail({
      to: config.organiserEmail,
      subject: `[Registration] ${record.id} · ${record.city} · ${record.playerName}`,
      html: registrationAlertHtml(record),
      text: `Registration ${record.id} ${record.playerName} ${record.city} ₹${record.feePayable}`,
    })
  );
  if (record.email) {
    results.push(
      await sendMail({
        to: record.email,
        subject: `Registration · ${record.id} · Pay ₹${record.feePayable} · ${config.siteName}`,
        html: registrationConfirmHtml(record),
        text: `Registration ${record.id}. Pay ₹${record.feePayable}: ${record.paymentUrl || ""}`,
      })
    );
  }
  return results;
}

module.exports = {
  emailConfigured,
  sendMail,
  sendWaitlistEmails,
  sendRegistrationEmails,
};
