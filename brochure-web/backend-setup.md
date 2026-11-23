# Backend setup — Waitlist + Registration → Google Sheets + Email + Razorpay

This powers the **rna-clinic-nodejs** package (`server.js` + `/api/*`).

## Confirmed Google Sheet IDs

| Role | Spreadsheet ID | Form route |
|------|----------------|------------|
| **Waitlist** | `1DuoOtwG6g_tzNyQi275VxF7QUzMXbNx3ygybODGCzCM` | `POST /api/waitlist` |
| **Registration** | `15fKInC0I1udku9ChOvMGoIUYy3ehCzpFNAwsUCIoDnU` | `POST /api/register` |

Open links:

- Waitlist: https://docs.google.com/spreadsheets/d/1DuoOtwG6g_tzNyQi275VxF7QUzMXbNx3ygybODGCzCM/edit  
- Registration: https://docs.google.com/spreadsheets/d/15fKInC0I1udku9ChOvMGoIUYy3ehCzpFNAwsUCIoDnU/edit  

## Data flow

```
Browser form
  → POST /api/waitlist  or  POST /api/register
    → Append row to the matching Google Sheet (IDs above)
    → Email alert → CONTACT@AISEORG.INFO
    → Confirmation email → parent/player email field
    → (register only) create Razorpay Payment Link if keys set
         else open static razorpay.me URL
Browser also keeps a localStorage copy as offline fallback.
```

## 1. Headers (row 1 of each sheet)

### Waitlist sheet (`1DuoOtwG6g_tzNyQi275VxF7QUzMXbNx3ygybODGCzCM`)

```
submittedAt	id	playerName	guardianName	age	city	category	interest	email	phone	consent
```

### Registration sheet (`15fKInC0I1udku9ChOvMGoIUYy3ehCzpFNAwsUCIoDnU`)

```
submittedAt	id	playerName	guardianName	age	city	category	interest	email	guardianContact	feePayable	feeNote	paymentStatus	paymentProvider	paymentUrl	razorpayPaymentLinkId	guardianConsent	privacyAck
```

Paste as the first row (tab-separated) or leave blank — the Apps Script bridge can write headers on first append.

## 2. Apps Script bridge (recommended)

1. Open either sheet → **Extensions → Apps Script**.
2. Paste contents of `apps-script/Code.gs` from the zip.
3. **Project Settings → Script properties** — set **exactly**:

| Property | Value |
|----------|-------|
| `WAITLIST_SHEET_ID` | `1DuoOtwG6g_tzNyQi275VxF7QUzMXbNx3ygybODGCzCM` |
| `REGISTRATION_SHEET_ID` | `15fKInC0I1udku9ChOvMGoIUYy3ehCzpFNAwsUCIoDnU` |
| `ORGANISER_EMAIL` | `CONTACT@AISEORG.INFO` (optional if Node sends email) |

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
WAITLIST_SHEET_ID=1DuoOtwG6g_tzNyQi275VxF7QUzMXbNx3ygybODGCzCM
REGISTRATION_SHEET_ID=15fKInC0I1udku9ChOvMGoIUYy3ehCzpFNAwsUCIoDnU

ORGANISER_ALERT_EMAIL=CONTACT@AISEORG.INFO
EMAIL_FROM=CONTACT@AISEORG.INFO
RESEND_API_KEY=…          # or SMTP_* or EMAIL_VIA_APPS_SCRIPT=true

RAZORPAY_KEY_ID=…         # optional
RAZORPAY_KEY_SECRET=…     # optional
RAZORPAY_ME_URL=https://razorpay.me/@rnaclinicindia2027?amount=trAZ1UkbSzNzZMEB9OinbA%3D%3D
CLINIC_FEE_INR=3850
```

Copy `.env.example` → `.env` on the server, or set the same names in cPanel / Cloud secrets.

> **Note:** With the Apps Script path, Node only needs `SHEETS_APPS_SCRIPT_URL` (sheet IDs live in Script Properties). The `WAITLIST_SHEET_ID` / `REGISTRATION_SHEET_ID` env vars are required for the optional **service-account** path (`googleapis`).

## 6. Smoke test

```bash
npm start
curl -s http://127.0.0.1:3000/api/health
curl -s -X POST http://127.0.0.1:3000/api/waitlist \
  -H 'Content-Type: application/json' \
  -d '{"playerName":"Test","guardianName":"Parent","age":12,"city":"Mumbai","category":"Juniors","interest":"Clinic","email":"you@example.com","phone":"+910000000000","consent":true}'
```

Check: new row on the **Waitlist** sheet + organiser email + confirmation email.  
Then submit a registration and confirm a row on the **Registration** sheet.

## What you must still do

1. Paste headers (or let first write add them).  
2. Deploy Apps Script with the Script Properties above.  
3. Set `SHEETS_APPS_SCRIPT_URL` + email provider on the host.  
4. (Optional) Razorpay API keys for Payment Links.  
5. Never commit real API keys — only sheet IDs are non-secret identifiers.
