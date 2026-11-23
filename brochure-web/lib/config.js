"use strict";

function env(name, fallback = "") {
  const v = process.env[name];
  return v == null || v === "" ? fallback : v;
}

const FEE_INR = Number(env("CLINIC_FEE_INR", "3850"));
const FEE_PAISE = FEE_INR * 100;

module.exports = {
  port: Number(env("PORT", env("NODE_PORT", "3000"))),
  feeInr: FEE_INR,
  feePaise: FEE_PAISE,
  organiserEmail: env("ORGANISER_ALERT_EMAIL", "CONTACT@AISEORG.INFO"),
  fromEmail: env("EMAIL_FROM", "CONTACT@AISEORG.INFO"),
  siteName: "Rafa Nadal Academy Clinic India Tour 2027",

  // Google Sheets — prefer Apps Script webhook (simplest). Service account is optional.
  sheetsAppsScriptUrl: env("SHEETS_APPS_SCRIPT_URL"),
  waitlistSheetId: env("WAITLIST_SHEET_ID"),
  registrationSheetId: env("REGISTRATION_SHEET_ID"),
  googleServiceAccountEmail: env("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
  googlePrivateKey: env("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),

  // Email — Resend preferred; SMTP optional
  resendApiKey: env("RESEND_API_KEY"),
  smtpHost: env("SMTP_HOST"),
  smtpPort: Number(env("SMTP_PORT", "587")),
  smtpUser: env("SMTP_USER"),
  smtpPass: env("SMTP_PASS"),
  smtpSecure: env("SMTP_SECURE", "false") === "true",

  // Razorpay — Key ID/Secret enable Payment Links + optional Invoice; else razorpay.me fallback
  razorpayKeyId: env("RAZORPAY_KEY_ID"),
  razorpayKeySecret: env("RAZORPAY_KEY_SECRET"),
  razorpayWebhookSecret: env("RAZORPAY_WEBHOOK_SECRET"),
  razorpayMeUrl: env(
    "RAZORPAY_ME_URL",
    "https://razorpay.me/@rnaclinicindia2027?amount=trAZ1UkbSzNzZMEB9OinbA%3D%3D"
  ),
  razorpayCallbackBase: env("PUBLIC_BASE_URL", ""), // e.g. https://yourdomain.com
  createRazorpayInvoice: env("RAZORPAY_CREATE_INVOICE", "false") === "true",

  // Dev / safety
  allowLocalFallbackAck: env("ALLOW_LOCAL_FALLBACK_ACK", "true") === "true",
};
