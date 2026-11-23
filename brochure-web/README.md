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

## Storage

**Primary: Supabase** — run `supabase/schema.sql` in the SQL Editor, then set:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_*` aliases)

**Optional secondary: Google Sheets**

| Role | ID |
|------|----|
| Waitlist | `1DuoOtwG6g_tzNyQi275VxF7QUzMXbNx3ygybODGCzCM` |
| Registration | `15fKInC0I1udku9ChOvMGoIUYy3ehCzpFNAwsUCIoDnU` |

See `backend-setup.md`.

## Secrets

Copy `.env.example` → `.env`. Never commit `.env` to public git.
