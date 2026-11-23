# RNA Clinic India Tour 2027 — Node package

Static brochure + **API** for waitlist and registration.

## Start

```bash
npm start
# listens on PORT (default 3000)
```

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Config status |
| POST | `/api/waitlist` | Append Waitlist sheet + emails |
| POST | `/api/register` | Append Registration sheet + emails + payment URL |
| POST | `/api/razorpay/webhook` | Optional payment events |

Full setup: see `docs/backend-setup.md` in the project store, or `backend-setup.md` next to this zip when packaged.

## Google Sheets (confirmed)

| Role | ID | Used by |
|------|----|---------|
| **Waitlist** | `1DuoOtwG6g_tzNyQi275VxF7QUzMXbNx3ygybODGCzCM` | `POST /api/waitlist` |
| **Registration** | `15fKInC0I1udku9ChOvMGoIUYy3ehCzpFNAwsUCIoDnU` | `POST /api/register` |

Set these as Apps Script **Script Properties** (`WAITLIST_SHEET_ID` / `REGISTRATION_SHEET_ID`). See `backend-setup.md`.

## Secrets

Copy `.env.example` → `.env`. Never commit API keys (sheet IDs above are OK to document).
