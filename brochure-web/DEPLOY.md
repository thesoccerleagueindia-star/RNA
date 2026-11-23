# Hostinger deploy — RNA Clinic brochure (mobile + desktop)

Live site: https://rafanadalacademyclinic2027.aiseorg.info/

Use the static package **`web-brochure-html.zip`** (not the Node zip) for Hostinger File Manager / FTP.

## Minimum overwrite (this release)

Upload these files from the zip root `web-brochure-html/` into the site document root (same folders that already exist on Hostinger):

| Local path in zip | Overwrite on Hostinger |
|---|---|
| `styles.css` | `/styles.css` |
| `index.html` | `/index.html` |
| `register.html` | `/register.html` |
| `js/supabase-browser.js` | `/js/supabase-browser.js` |

Keep existing `config.js` if it already has the live Supabase URL + publishable key. Only replace `config.js` if yours is empty or wrong.

## Recommended full static upload

If anything looks stale after the four-file overwrite, upload the **entire** contents of `web-brochure-html/` (overwrite all):

- `index.html`, `register.html`, `styles.css`, `app.js`, `register.js`, `config.js`
- `js/supabase-browser.js`
- `assets/` (images, logos, fonts)
- policy HTML pages (`privacy-policy.html`, etc.)

## What this update includes

- Desktop layout unchanged in brand (Academy blue + light green, fee ₹3,850 incl. GST)
- Phone CSS (`@media (max-width: 719px)`): stacked hero CTAs, compact header, full-width form fields, larger checkboxes, safe-area padding
- Supabase browser inserts use **`Prefer: return=minimal`** (do **not** revert to `return=representation`)

## After upload

1. Hard-refresh the live site (or purge Hostinger/CDN cache if enabled).
2. Phone check (~390px): hero CTAs stack; waitlist/register fields are full width.
3. Submit a test waitlist row — should succeed (HTTP 201 path; no RLS 42501).

## Public downloads (outside Cursor)

Temporary host (tmpfiles.org). Prefer **page** links; open the page and click Download if a direct link 404s.

| Package | Page | Direct |
|---|---|---|
| `web-brochure-html.zip` | https://tmpfiles.org/wHAnj8948371/web-brochure-html.zip | https://tmpfiles.org/dl/1795454552.3947280736ecb9c6/wHAnj8948371/web-brochure-html.zip |
| `rna-clinic-nodejs.zip` | https://tmpfiles.org/w6Agjb97EbJ2/rna-clinic-nodejs.zip | https://tmpfiles.org/dl/1795454553.08fbd6af9cd940ad/w6Agjb97EbJ2/rna-clinic-nodejs.zip |
| `DEPLOY.md` | https://tmpfiles.org/wyA0jl95EYWL/deploy.md | https://tmpfiles.org/dl/1795454554.c81a66d9f2bcd743/wyA0jl95EYWL/deploy.md |

**GitHub:** push/release failed on this agent (no `gh` login / git HTTPS credentials). Cannot publish a GitHub Release asset until the repo owner authenticates GitHub for the agent.

## Artifact locations (agent VM)

- `/opt/cursor/artifacts/web-brochure-html.zip` — static Hostinger package
- `/opt/cursor/artifacts/rna-clinic-nodejs.zip` — Node server package (only if you run Node hosting)
- Split Node parts (if full zip is hard to download): `/opt/cursor/artifacts/rna-nodejs-parts/`

Cursor chat / store download links often fail for this account — prefer a GitHub release asset or Cursor Publish when available, or copy from the paths above via a machine that can reach the agent VM.
