# Clinic India Tour 2027 — Next.js app

Organised by **ATLETAS INDIAN SPORTS AND ENTERTAINMENT PVT LTD**.

## Scripts

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

## Env (Razorpay live)

Copy `.env.example` → `.env.local` (never commit secrets):

| Variable | Where | Purpose |
|----------|--------|---------|
| `PAYMENT_MODE` | server | `demo` (default) or `live` |
| `RAZORPAY_KEY_ID` | server | Razorpay key id |
| `RAZORPAY_KEY_SECRET` | server only | Order create + signature verify |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | browser | Checkout.js key |
| `ADMIN_PASSWORD` | server | Optional gate for `/api/admin/summary` |

## Discount codes

Server-validated via `POST /api/promo/validate`. Redemptions stored in `.data/store.json` and listed in `/admin`.

Demo codes: `INAUGURAL10`, `FLAT500`, `DEMO100`.

## Static hosting package

For FTP/cPanel upload without Node, use:

`/cursor/stores/self/docs/web-brochure-html/` or `web-brochure-html.zip`
