/**
 * RNA Clinic India Tour 2027 — Google Apps Script bridge
 *
 * SETUP
 * 1. Create two Google Sheets: "RNA Clinic Waitlist 2027" and "RNA Clinic Registrations 2027"
 * 2. On each sheet, put headers in row 1 (see SETUP doc) OR leave blank — first write can add headers.
 * 3. Extensions → Apps Script → paste this file.
 * 4. Set Script Properties (Project Settings → Script properties):
 *      WAITLIST_SHEET_ID = <spreadsheet id from URL>
 *      REGISTRATION_SHEET_ID = <spreadsheet id from URL>
 *      ORGANISER_EMAIL = CONTACT@AISEORG.INFO   (optional if Node sends email)
 * 5. Deploy → New deployment → Type: Web app
 *      Execute as: Me
 *      Who has access: Anyone  (or Anyone with Google account — Node needs to POST)
 * 6. Copy the Web app URL into SHEETS_APPS_SCRIPT_URL on the Node host.
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
