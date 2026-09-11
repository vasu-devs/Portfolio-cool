# Bleach companions on /test

Original generated fan-art interpretations, not official anime or game assets. Their small chibi proportions and nine-pose animation are stylized; they are not frame-perfect reproductions.

Reference: https://bleach-anime.com/en/character/ and https://bleach-ros.bn-ent.net/character/

The footer selector chooses Ichigo, Rukia or Renji and persists the choice. The native pointer remains visible. Sprite boxes are 48 CSS pixels, with figures approximately 40–44 pixels tall. Running uses separate frames, a 160 ms reaction delay, acceleration and braking, and a 56-pixel stop radius. There is no permanent idle animation loop. Touch and reduced-motion modes omit the companion.

Attacks are abbreviated visual interpretations: Ichigo's blue-white crescent, Rukia's ice motif, Renji's extending and retracting segmented blade. These are not complete named-technique recreations. No sound, damage or page-input interception.

## Assets and generation

Built-in imagegen was used. Final alpha-bearing PNGs were resized to 768×768 WebP atlases in `public/test/sprites/`, preserving alpha and full color. Rejected checkerboard-backed outputs were not included.

Final shared prompt (one call per character):

> Transparent-background PNG game sprite atlas. [CHARACTER], canonical Bleach original anime Shikai costume, FULL COLOR 2D chibi anime cel art. Exactly 3 columns 3 rows equal square cells. Nine isolated full-body poses centered within each cell. Reading order: stand, run left-leg forward, run right-leg forward, sit, wave, sleep seated, attack windup, attack swing right, attack recovery. Same scale, feet same baseline. All weapons and limbs contained within their cell with 8% margin. Actual transparent alpha background. Full color character sprites only, no backdrop, no grid, no text. Crisp polished game art. Original anime character, no user likeness, no glasses or beard.

Character substitutions:

- Ichigo Kurosaki, orange spiky hair, brown eyes, black shihakusho white sash, original enormous black-and-silver cleaver Zangetsu with white cloth hilt and no guard.
- Rukia Kuchiki, black bob with bang between eyes, violet eyes, black shihakusho white sash, Sode no Shirayuki ALL WHITE thin sword white circular guard and white ribbon.
- Renji Abarai, crimson red high ponytail, white headband, black angular forehead tattoos, black shihakusho white sash, Zabimaru silver broad serrated segmented blade.

Ichigo and Renji now use dedicated, consistently facing 2×2 four-pose run sheets at a fixed eight frames per second. Their old mismatched run cells are unused. Renji's extension is anchored to the hand and revealed/retracted with clipping; the actor remains in attack state until retraction finishes. Motion regression checks: node scripts/check-bleach-motion.mjs.

Run sheets were generated with built-in imagegen using: transparent full-color 2D chibi run-cycle atlas, four equal cells, all facing right with fixed head registration, identical body scale and weapon angle; left contact, passing, right contact, opposite passing; accurate character colors, no effects or backdrop. Stored as ichigo-run.webp and renji-run.webp.

Verified locally: alpha in all three assets, JavaScript syntax, character selection and decoded asset switching, native cursor retention, attack rendering and navigation. Deployment is pending explicit approval following the earlier automatic review rejection.

## Direct interaction and parking

Clicking the companion itself pauses motion, shows its wave pose and a short character greeting. It does not also trigger the page-wide attack. Pointer hover pauses chasing so the small button can be clicked; keyboard activation works too. After five seconds without pointer movement, or when the pointer leaves the document, the companion walks to the nearest bottom corner, sits, and sleeps after 4.5 seconds. Tab hiding suspends work without removing the pet; return resumes parking. The explicit off switch and reduced-motion setting still hide it.

## September 11 refinement
Renji now uses eight independently animated blade segments following a curved whip sweep. The hilt remains anchored, extension/sweep/recoil take 720ms, and all segment animations cancel together on a character change, greeting or exit. These are stylized fan effects, not frame-exact anime footage.
The profile rotation includes soul-bear.webp and soul-cat.webp. A short personal Bleach note and the existing hidden name-dot interaction add themed details without changing professional content.
Soul cat generated with built-in imagegen, saved as public/test/avatars/soul-cat.webp (448px WebP).
