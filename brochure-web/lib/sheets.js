"use strict";

const config = require("./config");

/**
 * Append a row to Waitlist or Registration Google Sheet.
 * Primary: Apps Script web app (SHEETS_APPS_SCRIPT_URL).
 * Optional: Google service account + googleapis (if installed + credentials set).
 */

async function appendViaAppsScript(payload) {
  if (!config.sheetsAppsScriptUrl) {
    throw new Error("SHEETS_APPS_SCRIPT_URL is not configured");
  }
  const res = await fetch(config.sheetsAppsScriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Sheets Apps Script non-JSON response: ${text.slice(0, 200)}`);
  }
  if (!res.ok || json.ok === false) {
    throw new Error(json.error || `Sheets Apps Script HTTP ${res.status}`);
  }
  return { method: "apps_script", ...json };
}

async function appendViaServiceAccount(payload) {
  const sheetId =
    payload.sheet === "registration" ? config.registrationSheetId : config.waitlistSheetId;
  if (!sheetId) throw new Error(`Missing sheet ID for ${payload.sheet}`);
  if (!config.googleServiceAccountEmail || !config.googlePrivateKey) {
    throw new Error("Google service account credentials not configured");
  }

  let google;
  try {
    google = require("googleapis");
  } catch {
    throw new Error(
      "googleapis package not installed. Run: npm install googleapis — or use SHEETS_APPS_SCRIPT_URL instead."
    );
  }

  const auth = new google.google.auth.JWT({
    email: config.googleServiceAccountEmail,
    key: config.googlePrivateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.google.sheets({ version: "v4", auth });
  const values = [payload.row];
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Sheet1!A1",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
  return { method: "service_account", sheetId };
}

function waitlistRow(record) {
  return [
    record.submittedAt,
    record.id,
    record.playerName,
    record.guardianName,
    record.age,
    record.city,
    record.category,
    record.interest,
    record.email,
    record.phone,
    record.consent ? "yes" : "no",
  ];
}

function registrationRow(record) {
  return [
    record.submittedAt,
    record.id,
    record.playerName,
    record.guardianName,
    record.age,
    record.city,
    record.category,
    record.interest,
    record.email,
    record.guardianContact,
    record.feePayable,
    record.feeNote,
    record.paymentStatus,
    record.paymentProvider || "",
    record.paymentUrl || "",
    record.razorpayPaymentLinkId || "",
    record.guardianConsent ? "yes" : "no",
    record.privacyAck ? "yes" : "no",
  ];
}

async function appendWaitlist(record) {
  const payload = {
    sheet: "waitlist",
    row: waitlistRow(record),
    headers: [
      "submittedAt",
      "id",
      "playerName",
      "guardianName",
      "age",
      "city",
      "category",
      "interest",
      "email",
      "phone",
      "consent",
    ],
    record,
  };
  if (config.sheetsAppsScriptUrl) return appendViaAppsScript(payload);
  return appendViaServiceAccount(payload);
}

async function appendRegistration(record) {
  const payload = {
    sheet: "registration",
    row: registrationRow(record),
    headers: [
      "submittedAt",
      "id",
      "playerName",
      "guardianName",
      "age",
      "city",
      "category",
      "interest",
      "email",
      "guardianContact",
      "feePayable",
      "feeNote",
      "paymentStatus",
      "paymentProvider",
      "paymentUrl",
      "razorpayPaymentLinkId",
      "guardianConsent",
      "privacyAck",
    ],
    record,
  };
  if (config.sheetsAppsScriptUrl) return appendViaAppsScript(payload);
  return appendViaServiceAccount(payload);
}

function sheetsConfigured() {
  if (config.sheetsAppsScriptUrl) return true;
  return Boolean(
    config.googleServiceAccountEmail &&
      config.googlePrivateKey &&
      config.waitlistSheetId &&
      config.registrationSheetId
  );
}

module.exports = {
  appendWaitlist,
  appendRegistration,
  sheetsConfigured,
  waitlistRow,
  registrationRow,
};
