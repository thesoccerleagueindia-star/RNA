# Backend setup — Waitlist + Registration → Google Sheets + Email + Razorpay

This powers the **rna-clinic-nodejs** package (`server.js` + `/api/*`).

## Data flow

```
Browser form
  → POST /api/waitlist  or  POST /api/register
    → Append row to Google Sheet (Waitlist OR Registrations)
    → Email alert → CONTACT@AISEORG.INFO
    → Confirmation email → parent/player email field
    → (register only) create Razorpay Payment Link if keys set
         else open static razorpay.me URL
Browser also keeps a localStorage copy as offline fallback.
```

## 1. Create two Google Sheets

1. **RNA Clinic Waitlist 2027** — copy the spreadsheet ID from the URL  
   `https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit`
2. **RNA Clinic Registrations 2027** — second spreadsheet, separate ID.

### Waitlist headers (row 1)

`submittedAt | id | playerName | guardianName | age | city | category | interest | email | phone | consent`

### Registration headers (row 1)

`submittedAt | id | playerName | guardianName | age | city | category | interest | email | guardianContact | feePayable | feeNote | paymentStatus | paymentProvider | paymentUrl | razorpayPaymentLinkId | guardianConsent | privacyAck`

## 2. Apps Script bridge (recommended)

1. Open either sheet → **Extensions → Apps Script**.
2. Paste contents of `apps-script/Code.gs` from the zip.
3. **Project Settings → Script properties** add:
   - `WAITLIST_SHEET_ID` = waitlist spreadsheet ID  
   - `REGISTRATION_SHEET_ID` = registration spreadsheet ID
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (Node must POST without Google login)
5. Copy the `/macros/s/.../exec` URL → set as `SHEETS_APPS_SCRIPT_URL` on the host.

Optional: set `EMAIL_VIA_APPS_SCRIPT=true` on Node so the same script sends mail via `GmailApp` (uses the Google account that owns the script). Confirm that account can send as / from your organiser mailbox, or use Resend/SMTP instead.

## 3. Email

Pick one:

| Method | Env vars |
|--------|----------|
| Resend | `RESEND_API_KEY`, `EMAIL_FROM`, `ORGANISER_ALERT_EMAIL` |
| SMTP | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` |
| Apps Script Gmail | `EMAIL_VIA_APPS_SCRIPT=true` + `SHEETS_APPS_SCRIPT_URL` |

Verify `EMAIL_FROM` is allowed by your provider (Resend domain verification, etc.).

## 4. Razorpay

### Current (no API keys)

Uses static link:

`https://razorpay.me/@rnaclinicindia2027?amount=…` (₹3,850)

**Limits:** no per-registration reference on Razorpay’s side, no automatic invoice from our server, no webhook reconciliation to the sheet.

### Upgrade (recommended when you have dashboard access)

Set:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `PUBLIC_BASE_URL=https://your-domain` (for Payment Link callback → `/payment-complete.html`)
- Optional `RAZORPAY_WEBHOOK_SECRET` + webhook URL `https://your-domain/api/razorpay/webhook` (events: `payment_link.paid`, `payment.captured`)

Then each registration creates a **Payment Link** with `reference_id = REG-…`, customer email, and Razorpay can email/SMS the link. Our server also emails the payment URL.

**Invoice API:** Razorpay Invoices are payment-*request* documents, not automatic GST tax invoices after a Payment Link is paid. Set `RAZORPAY_CREATE_INVOICE=true` only if you want an emailed Invoice as the pay instrument instead of a Payment Link. For a true post-payment tax invoice you still generate/send your own (or use accounting software) after webhook confirmation.

## 5. Host env checklist

```
PORT=3000
PUBLIC_BASE_URL=https://…
SHEETS_APPS_SCRIPT_URL=https://script.google.com/macros/s/…/exec
ORGANISER_ALERT_EMAIL=CONTACT@AISEORG.INFO
EMAIL_FROM=CONTACT@AISEORG.INFO
RESEND_API_KEY=…          # or SMTP_* or EMAIL_VIA_APPS_SCRIPT=true
RAZORPAY_KEY_ID=…         # optional
RAZORPAY_KEY_SECRET=…     # optional
RAZORPAY_ME_URL=https://razorpay.me/@rnaclinicindia2027?amount=trAZ1UkbSzNzZMEB9OinbA%3D%3D
CLINIC_FEE_INR=3850
```

Copy `.env.example` → `.env` on the server, or set the same names in cPanel / Cloud secrets.

## 6. Smoke test

```bash
npm start
curl -s http://127.0.0.1:3000/api/health
curl -s -X POST http://127.0.0.1:3000/api/waitlist \
  -H 'Content-Type: application/json' \
  -d '{"playerName":"Test","guardianName":"Parent","age":12,"city":"Mumbai","category":"Juniors","interest":"Clinic","email":"you@example.com","phone":"+910000000000","consent":true}'
```

Check: new sheet row + organiser email + confirmation email.

## What you must do (cannot be automated here)

1. Create the two Google Sheets and paste their IDs into Apps Script properties.  
2. Deploy the Apps Script web app and paste the URL into `SHEETS_APPS_SCRIPT_URL`.  
3. Add Resend (or SMTP) credentials, or enable `EMAIL_VIA_APPS_SCRIPT`.  
4. (Optional) Add Razorpay Key ID/Secret from the Razorpay dashboard for Payment Links.  
5. Never commit real keys — only set them on the host / Cursor secrets.
