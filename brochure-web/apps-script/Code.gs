/**
 * RNA Clinic India Tour 2027 — Google Apps Script bridge
 *
 * CONFIRMED SHEET IDS (client)
 *   WAITLIST_SHEET_ID     = 1DuoOtwG6g_tzNyQi275VxF7QUzMXbNx3ygybODGCzCM
 *   REGISTRATION_SHEET_ID = 15fKInC0I1udku9ChOvMGoIUYy3ehCzpFNAwsUCIoDnU
 *
 * Routing: body.sheet === "waitlist" → Waitlist sheet
 *          body.sheet === "registration" → Registrations sheet
 *
 * SETUP
 * 1. Put headers in row 1 of each sheet (see backend-setup.md) OR leave blank —
 *    first write can add headers from the payload.
 * 2. Extensions → Apps Script → paste this file.
 * 3. Project Settings → Script properties — set EXACTLY:
 *      WAITLIST_SHEET_ID     = 1DuoOtwG6g_tzNyQi275VxF7QUzMXbNx3ygybODGCzCM
 *      REGISTRATION_SHEET_ID = 15fKInC0I1udku9ChOvMGoIUYy3ehCzpFNAwsUCIoDnU
 *      ORGANISER_EMAIL       = CONTACT@AISEORG.INFO   (optional if Node sends email)
 * 4. Deploy → New deployment → Type: Web app
 *      Execute as: Me
 *      Who has access: Anyone  (Node must POST without Google login)
 * 5. Copy the Web app URL into SHEETS_APPS_SCRIPT_URL on the Node host.
 *
 * Optional email-from-script: set EMAIL_VIA_APPS_SCRIPT=true on Node and ensure
 * the script runs as a Google account that can send mail (GmailApp).
 */

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || "{}");

    if (body.action === "email") {
      return json_({ ok: true, result: sendEmail_(body) });
    }

    var sheetKey = body.sheet === "registration" ? "REGISTRATION_SHEET_ID" : "WAITLIST_SHEET_ID";
    var sheetId = PropertiesService.getScriptProperties().getProperty(sheetKey);
    if (!sheetId) {
      return json_({ ok: false, error: "Missing Script Property " + sheetKey });
    }

    var ss = SpreadsheetApp.openById(sheetId);
    var sh = ss.getSheets()[0];

    if (body.headers && body.headers.length && sh.getLastRow() === 0) {
      sh.appendRow(body.headers);
    } else if (body.headers && body.headers.length && sh.getLastRow() === 1) {
      // If only header-ish first row empty cells, ensure headers once
      var first = sh.getRange(1, 1, 1, body.headers.length).getValues()[0];
      var empty = first.every(function (c) { return c === "" || c == null; });
      if (empty) sh.getRange(1, 1, 1, body.headers.length).setValues([body.headers]);
    }

    if (!body.row || !body.row.length) {
      return json_({ ok: false, error: "Missing row" });
    }
    sh.appendRow(body.row);

    return json_({ ok: true, sheet: body.sheet, row: sh.getLastRow() });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: "rna-clinic-sheets-bridge" });
}

function sendEmail_(body) {
  var to = body.to;
  var subject = body.subject || "RNA Clinic notification";
  var html = body.html || body.text || "";
  if (!to) throw new Error("email to required");
  GmailApp.sendEmail(to, subject, body.text || "See HTML version", {
    htmlBody: html,
    name: "ATLETAS INDIA · RNA Clinic Tour",
  });
  return { sent: true, to: to };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
