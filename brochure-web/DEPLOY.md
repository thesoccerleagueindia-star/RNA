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

**Prefer `web-brochure-html.tar.gz`** (often fewer antivirus false positives than zip-from-file-host).

Checksums + links: see **PUBLIC-DOWNLOADS.md** in this folder.

- GoFile (recommended HTML tar.gz): https://gofile.io/d/56LzoLUz
- SHA256 `web-brochure-html.tar.gz`: `c12b54b5462e9654e0e18bcac4e00c62aa9c65441fb18eeaea90ebff421cf8ec`
- SHA256 `web-brochure-html.zip`: `4f4afff21dd1b787426a894e478114f2647b272ef6dbb481b0a1009c310b167f`

**GitHub:** push/release failed on this agent (no credentials).


## Artifact locations (agent VM)

- `/opt/cursor/artifacts/web-brochure-html.zip` — static Hostinger package
- `/opt/cursor/artifacts/rna-clinic-nodejs.zip` — Node server package (only if you run Node hosting)
- Split Node parts (if full zip is hard to download): `/opt/cursor/artifacts/rna-nodejs-parts/`

Cursor chat / store download links often fail for this account — prefer a GitHub release asset or Cursor Publish when available, or copy from the paths above via a machine that can reach the agent VM.
