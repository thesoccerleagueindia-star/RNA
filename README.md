# AISE / aiseorg.info

Brand-forward marketing site for **AISET** (public brand **AISE**) — Sport in Motion.

## Stack

- Vite + React + TypeScript
- React Router
- Responsive CSS (no UI framework)

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/about` | About |
| `/programmes` | Training programmes |
| `/rising-star` | Rising Star Development League (RSDL) |
| `/rsdl` | Redirect → `/rising-star` |
| `/rafa-nadal-academy` | Rafa Nadal Academy by Movistar |
| `/sports-tours` | Sports tours |
| `/athlexna` | Athlexna |
| `/isbi` | International Sports Business Institute |
| `/contact` | Contact (mailto form + WhatsApp) |

Legacy `/tsl` redirects to `/rising-star`.

## Local development

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

Preview defaults to `http://127.0.0.1:4173`.

## Deploy notes (Hostinger)

1. Run `npm run build`.
2. Upload the contents of `dist/` to the site document root (replace the current Manus/Vite build).
3. Ensure SPA fallback: route unknown paths to `index.html` (Hostinger `.htaccess` rewrite or equivalent).
4. Contact form opens a mailto draft to `contact@aiseorg.info` — no backend required.
5. WhatsApp CTAs use `wa.me/918013166131`.

## Brand

- Org: AISET — Atletas India Sports and Entertainment Technology
- League: **Rising Star Development League (RSDL)** — orange / black / white
- Contact: `contact@aiseorg.info` · WhatsApp `+91 80131 66131`
