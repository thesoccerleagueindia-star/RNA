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

## Secrets

Copy `.env.example` → `.env`. Never commit secrets.
