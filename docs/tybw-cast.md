# TYBW companion expansion — September 11

Current implementation: public/test/bleach-roster.js, soul-cursor.js, tybw.html, tybw-gallery.js and tybw-gallery.css.

16 selectable forms: original Ichigo, Rukia and Renji; Uryu, Orihime, Chad, Urahara, Yoruichi, Byakuya, Toshiro, Kenpachi, Shunsui, Aizen, Yhwach, Grimmjow; and separate true-Shikai Ichigo. This is a first major-cast collection, not every Bleach character or transformation.

## Restored behavior
Renji and Rukia retain the original atlas poses and original short effects restored on user request. The newer attack-v2 sheets and curved Zabimaru overlay are not loaded. New characters use hand-drawn effects in their three action cells. The main companion is still 48 CSS pixels with a 64-pixel hit target. Greetings, independent chasing, corner sitting and sleeping remain intact.

## Production
All 13 new sheets were generated separately with built-in imagegen. Nine equal cells in a 3x3 layout: rest, run A, run B, sit, wave, sleep, windup, release, recovery. Uniform 768x768 WebP conversion, quality 92. Genuine RGBA alpha verified for every source. Source IDs are in tybw-generated-assets.json. Existing Ichigo and Renji retain their dedicated four-frame run atlases. Aizen uses seated drift as a playful adaptation.

The roster records each selected outfit/form and ability. This is generated chibi fan art: silhouettes, garments, markings, colors and timing are simplified, not official animation frames. Horizontal sprite mirroring also mirrors asymmetric details. Do not describe these as 100% canon-perfect.

## References
- https://bleach-anime.com/en/character/ — main character designs and Zanpakuto names
- https://bleach-anime.com/keyword/ — forms and techniques
- https://bleach-anime.com/special/interview03/30.html — Aizen and Kurohitsugi
- https://bleach-ros.bn-ent.net/character/?chara=ichigo-kurosaki_the_blood_warfare — dual Zangetsu / Getsuga Jujisho
- https://pierrot.jp/title/bleach/keyword_sa.html — Santen Kesshun

## PFPs
Two square cel-shaded portraits use the user's September 11 smiling front-facing photo as likeness reference. Their round face, clear rectangular glasses, swept dark hair and beard are the likeness anchors. The Indigo and Crimson variants are saved at 768px, WebP quality 95. Source IDs: exec-81200705-510a-41bc-b48c-1c763e4624ac.png and exec-41a157fe-3e54-43f9-8b62-386321701c0e.png.

The gallery provides preview, download and Use PFP buttons. An allowlisted vasu-tybw-avatar preference selects the portrait on this browser. The original rotation remains the default and is restorable from the gallery. No previously rejected portraits are reintroduced.

## Validation
node scripts/check-bleach-motion.mjs checks every roster asset, run-grid routing, original effects and new sprite-only effects, and synchronous visible corner settling. JavaScript syntax and git diff whitespace checks pass. Browser checks verified all 13 new forms decode and respond to greeting, Rukia's original atlas attack, the gallery's shield preview, and selecting/restoring profile pictures.

Only the local static preview was updated. The live domain has not been deployed by this change.


## Rapid clicks and extended abilities — current
The previous 750ms click lockout and active-attack early return are removed. attack-queue.js completes 80ms windup, 110ms release, and 100ms recovery in order. Up to three follow-ups are buffered; further input replaces the last pending target to bound spam without restarting or starving the current swing. Greetings, character changes, hiding and disabling cancel pending attacks. Page clicks can interrupt a greeting and start an attack.

bleach-effects.js now adds a distinct 660–850ms flat effect for every new form: Quincy arrow, triangular shield, impact punch, crimson Benihime slash, Shunko lightning, petal stream, ice dragon, cleaving impact, dual shadow slash, Kurohitsugi, reishi slash, red Cero and golden crossed Getsuga. They extend roughly 220–390 CSS pixels; the shield is local and Kurohitsugi forms toward the clicked position. Original Renji and Rukia effects remain intact. No procedural segmented Zabimaru is restored.

The gallery uses the same new extended-effect renderer and buffered input. Effects clean themselves up, and a 12-effect limit bounds rendering. The burst suite scripts/check-bleach-attacks.mjs covers three quick clicks, 100-click spam, cancellation/restart, all 13 distinct effects and cleanup. Browser burst checks verified Cero and Senbonzakura render and finish with no leftover nodes while the companion stays visible.
