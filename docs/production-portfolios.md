# Production portfolios

- `/`: approved sage paper portfolio. Source is `public/paper/index.html`, with styles, modules, illustration assets and recorded keyboard sounds under `public/paper/`.
- `/bleach` and `/bleach/`: a snapshot of the portfolio published on 23 September 2026 before the paper launch. Source is `public/bleach/index.html`; its existing `/test/` styles, scripts and assets remain intact. Only the canonical URL and indexing directive were changed in the snapshot.
- `/old` and `/old/`: the existing React portfolio, retained by the build promotion script.

`npm run build` generates the experimental `/test/` page, builds React, preserves its entry point under `/old/`, then promotes the paper page to the root. Do not replace `public/bleach/index.html` when regenerating `/test/`. Vercel's rewrites resolve both slash forms of the archive routes.

The existing Vercel API endpoints and analytics remain in use. The cancelled inquiry form is not part of the paper portfolio. There is no paper day/night toggle.

After building, run `node scripts/check-production.cjs` with Playwright installed, or set `PLAYWRIGHT_MODULE` to an existing Playwright module. It uses one browser and a temporary local server, closes both on completion, and checks route separation, static dependencies, project dialogs, thumbnails, mobile overflow, sound decoding, archive navigation and the Bleach theme switch. Local verification does not send contact requests or increment production counters.

See `paper-sound-design.md` and `public/paper/assets/foley/provenance.json` for sound behavior and source attribution.
