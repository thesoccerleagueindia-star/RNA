# Backend setup — Waitlist + Registration (Supabase primary)

This powers the **rna-clinic-nodejs** package (`server.js` + `/api/*`).

## Data flow

```
Browser form
  → POST /api/waitlist  or  POST /api/register
    → Insert into Supabase table (waitlist | registrations)  ← primary
    → Optional: also append Google Sheet row if Apps Script configured
    → Email alert → CONTACT@AISEORG.INFO (if Resend/SMTP/Apps Script email set)
    → Confirmation email → parent/player email (same)
    → (register only) Razorpay Payment Link if API keys set
         else open static razorpay.me URL
  Fallback: browser inserts directly to Supabase via publishable key
  Last resort: localStorage on device only
```

## 1. Supabase (required for Hostinger package)

### Project

- URL: `https://vwxldsmgpzbamueskchl.supabase.co`
- Publishable key: set as `SUPABASE_PUBLISHABLE_KEY` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` on the host (see `.env.example`)

### Create tables + RLS (required)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project  
2. **SQL Editor** → New query  
3. Paste and **Run** `supabase/schema.sql` from the zip  

If forms already show  
`new row violates row-level security policy`  
run **`supabase/fix-rls-for-public-forms.sql`** once (tables exist; policies missing/too strict).

That creates:

| Table | Purpose |
|-------|---------|
| `public.waitlist` | Waitlist form rows |
| `public.registrations` | Registration form rows |

**RLS policies:**

- Anyone with the publishable key may **INSERT** (public brochure forms)
- `authenticated` may **SELECT**
- No public SELECT for anon — view rows in Table Editor (service role)

### Static Hostinger (no Node)

Use **`web-brochure-html.zip`**. Forms talk to Supabase **from the browser** via `config.js` (publishable key). No `/api` required. After RLS fix SQL, waitlist/register work on plain static hosting.

### Env on host

```
SUPABASE_URL=https://vwxldsmgpzbamueskchl.supabase.co
SUPABASE_PUBLISHABLE_KEY=<your publishable key>
# aliases also work:
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

The deploy zip may include a private `.env` for Hostinger; do **not** commit `.env` to public git.

### Smoke test after SQL is applied

```bash
npm start
curl -s http://127.0.0.1:3000/api/health
# expect: "supabase": true

curl -s -X POST http://127.0.0.1:3000/api/waitlist \
  -H 'Content-Type: application/json' \
  -d '{"playerName":"Test","guardianName":"Parent","age":12,"city":"Mumbai","category":"Juniors","interest":"Clinic","email":"you@example.com","phone":"+910000000000","consent":true}'
```

Then check **Table Editor → waitlist** for the new row.

## 2. Email (optional until configured)

| Method | Env |
|--------|-----|
| Resend | `RESEND_API_KEY`, `EMAIL_FROM`, `ORGANISER_ALERT_EMAIL` |
| SMTP | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` |
| Apps Script Gmail | `EMAIL_VIA_APPS_SCRIPT=true` + `SHEETS_APPS_SCRIPT_URL` |

Without email env, submissions still store in Supabase; `/api/*` returns a warning. Edge Functions for mail can be added later.

## 3. Razorpay

Pay Now still opens after a successful registration insert.

- Default: static `RAZORPAY_ME_URL` (₹3,850)
- Upgrade: `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` → Payment Link per `REG-…`

## 4. Google Sheets (optional secondary)

Confirmed IDs (if you also want Sheet copies):

| Role | Spreadsheet ID |
|------|----------------|
| Waitlist | `1DuoOtwG6g_tzNyQi275VxF7QUzMXbNx3ygybODGCzCM` |
| Registration | `15fKInC0I1udku9ChOvMGoIUYy3ehCzpFNAwsUCIoDnU` |

Set Script Properties + `SHEETS_APPS_SCRIPT_URL` as before. When both Supabase and Sheets are configured, rows go to **both**.

### Sheet headers (if using Sheets)

**Waitlist:**  
`submittedAt | id | playerName | guardianName | age | city | category | interest | email | phone | consent`

**Registration:**  
`submittedAt | id | playerName | guardianName | age | city | category | interest | email | guardianContact | feePayable | feeNote | paymentStatus | paymentProvider | paymentUrl | razorpayPaymentLinkId | guardianConsent | privacyAck`

## 5. Re-upload package

Use `/cursor/stores/self/docs/rna-clinic-nodejs.zip`:

1. Extract so `package.json` + `server.js` are at app root  
2. Ensure `.env` has Supabase URL + publishable key  
3. Run SQL schema once in Supabase  
4. `npm start` (or host start command → `node server.js`)

Live-compatible for Hostinger Node hosting.
