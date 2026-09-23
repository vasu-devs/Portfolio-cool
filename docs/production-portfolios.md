# Production portfolios

- `/`: approved sage paper portfolio. Source is `public/paper/index.html`, with styles, modules, illustration assets and recorded keyboard sounds under `public/paper/`.
- `/bleach` and `/bleach/`: a snapshot of the portfolio published on 23 September 2026 before the paper launch. Source is `public/bleach/index.html`; its existing `/test/` styles, scripts and assets remain intact. Only the canonical URL and indexing directive were changed in the snapshot.
- `/old` and `/old/`: the existing React portfolio, retained by the build promotion script.

`npm run build` generates the experimental `/test/` page, builds React, preserves its entry point under `/old/`, then promotes the paper page to the root. Do not replace `public/bleach/index.html` when regenerating `/test/`. Vercel's rewrites resolve both slash forms of the archive routes.

The existing Vercel API endpoints and analytics remain in use. The cancelled inquiry form is not part of the paper portfolio. There is no paper day/night toggle.

After building, run `node scripts/check-production.cjs` with Playwright installed, or set `PLAYWRIGHT_MODULE` to an existing Playwright module. It uses one browser and a temporary local server, closes both on completion, and checks route separation, static dependencies, project dialogs, thumbnails, mobile overflow, sound decoding, archive navigation and the Bleach theme switch. Local verification does not send contact requests or increment production counters.

See `paper-sound-design.md` and `public/paper/assets/foley/provenance.json` for sound behavior and source attribution.

See `paper-welcome-sharing.md` for the scenic opening, default-on sound preference, public social card and crawler metadata. The opening and sharing checks run with `node scripts/check-opening-sharing.cjs` after building.

## Phone refinement — 24 September 2026

`public/paper/mobile.css` provides touch-sized controls, safe-area spacing for the bottom navigation, readable single-column project rows, and dialogs with a fixed toolbar and independently scrolling content. Phone landscape uses the same touch controls. Zoom remains enabled. Desktop structure and the Bleach archive are unchanged.

The contribution calendar scrolls horizontally on phones and starts at the latest recorded day. Tapping a cell or using the previous/next day buttons updates the readout; swiping does not generate hover sounds. Keyboard exploration is retained on desktop.

The approved avatar and sage texture are served as WebP (214,424 and 72,888 bytes), down from 2,094,230 and 1,830,206 bytes. The original PNGs remain as source assets. No new third-party fonts or runtime dependencies were added.

Run `node scripts/check-mobile.cjs` after building, with Chromium and WebKit installed in Playwright. The checks cover 320, 360, 390, 430, 600 and 844px widths, including 844×390 landscape; target sizes, overflow, dialog scrolling, calendar controls and touch swiping. Reports and screenshots go to `.cache/mobile-qa/`. Chromium checks audio and persisted mute; the Windows WebKit test runtime lacks Web Audio, so that specific check is explicitly reported as unavailable there. This is browser emulation, not physical-device testing.
