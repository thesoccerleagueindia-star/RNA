# Rafa Nadal Academy Clinic India Tour 2027 — Static web brochure

Hosting-ready HTML package for **ATLETAS INDIAN SPORTS AND ENTERTAINMENT PVT LTD**.

## What’s included

| Path | Purpose |
|------|---------|
| `index.html` | Landing brochure |
| `register.html` | Form → fee (₹4,250) → demo payment + promo codes |
| `waitlist.html` | Waitlist (no payment) |
| `admin.html` | Demo admin: registrations, waitlist, promo redemptions |
| `privacy-policy.html` / `terms.html` / `refund-policy.html` / `faqs.html` | Legal/FAQ placeholders |
| `css/` `js/` `assets/` | Styles, config, logos, photos, font |

## Upload to shared hosting (cPanel / FTP / SFTP)

1. Download this folder (or the zip `web-brochure-html.zip` beside it).
2. Unzip if needed so you see `index.html` at the top level of the package.
3. Upload **all** files into your web root (`public_html`, `www`, or a subdomain folder).
4. Keep the folder structure (`css/`, `js/`, `assets/`) intact.
5. Visit `https://your-domain.example/` — you should see the brochure.
6. Optional: set `register.html` as a menu link; open `admin.html` only for staff (it is **not** password-protected in this demo).

No build step. No Node required on the server.

## Demo payment & discount codes

- **Payment mode defaults to DEMO.** “Demo Pay” stores a confirmed registration in the browser (`localStorage`) and **does not charge a card**.
- Demo promo codes (edit in `js/config.js`):
  - `INAUGURAL10` — 10% off
  - `FLAT500` — ₹500 off
  - `DEMO100` — 100% off (testing)
- Admin → **Promo code redemptions** lists uses of these codes on this device.

## Going live with Razorpay (not on pure static alone)

Static hosting cannot safely hold `RAZORPAY_KEY_SECRET`. For live charges:

1. Deploy the Next.js app under `/agent/web` (or your own Node/serverless host).
2. Set environment variables:
   - `RAZORPAY_KEY_ID` — publishable key (`rzp_live_…` or `rzp_test_…`)
   - `RAZORPAY_KEY_SECRET` — **server only**
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` — same as key id for Checkout.js
   - `PAYMENT_MODE=live`
   - Optional: `ADMIN_PASSWORD` / database URL when you leave mock storage
3. Implement/use APIs:
   - `POST /api/payments/create-order` — create Razorpay order for server-calculated fee after discount
   - `POST /api/payments/verify` — verify signature, mark registration `confirmed`
4. Until those are live, keep the demo banner and Demo Pay button.

## Contact (confirmed)

- Phone: +91 80131 66131  
- Email: CONTACT@AISEORG.INFO  
- Web: WWW.AISEORG.INFO  

## Branding notes

- Logos: Atletas orange + Rafa Nadal Academy (not Adidas).
- Legal name in footer: **ATLETAS INDIAN SPORTS AND ENTERTAINMENT PVT LTD**.
- Fee: **₹4,250** INR clinic registration.
