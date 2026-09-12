# Painted cover prompts for /test

Pipeline:

1. `node scripts/codex-generate-covers.mjs 4` asks the Codex CLI (model gpt-5.5, image_generation enabled) to paint
   one backdrop per project and realm into `public/test/covers/gen/<slug>-<realm>.png`. Existing files are skipped,
   so rerun it to fill gaps or delete a file to repaint it. The focal-object table lives in that script.
2. `PLAYWRIGHT_MODULE=... node scripts/build-scene-covers.mjs` lays the title card (Bleach Display, Geist, JetBrains
   Mono) over each painting and writes `public/test/covers/<slug>-scene-<realm>-v15.webp`. Where no painting exists
   it falls back to the shared realm backgrounds plus a line motif.
3. `node scripts/generate-test-portfolio.mjs` rebuilds the page.

The prompts below are the same ones the driver sends, kept here so they can be reused in the Codex app by hand.
The painting keeps the bottom-left third quiet so the title card has room.

## Shared style, both realms

Anime background painting in the style of a Bleach establishing shot. Clean cel-shaded shapes, soft painted
gradients, no characters, no text, no UI screenshots, no logos. 16:9. One clear focal object that stands
for the project, placed right of centre, at most a third of the frame. Subtle glowing white "reiatsu" light
where the object meets the scene. No lens flare, no HDR look, no photoreal render.

**Hueco Mundo (dark theme):** endless white mineral desert under a black-teal night sky, a thin white
crescent moon high right, pale quartz towers or a domed palace far on the horizon, one dead white tree
allowed. Palette: charcoal, silver, bone white, one cold accent.

**Seireitei (light theme):** bright daylight, white plaster walls and dark tiled roofs stepping down a hill,
big blue sky with soft cumulus, a tall white tower far away. Palette: white, sky blue, navy ink, one warm accent.

## Per project focal object

| slug | focal object |
|---|---|
| justhireme | three paper job cards fanned on a stone plinth, the top one lit, a small graph of threads connecting them |
| svara | a sound wave carved as a ridge in the sand (Hueco) / painted as a banner across the wall (Seireitei) |
| odeon | a ring of standing stones forming a loop with three lit markers, a faint circular path in the sand |
| dreamer | an open scroll on a low table, a second translucent page hovering above it with a pen |
| deep-researcher | a ledger book open on a rock, glowing quote marks rising from it like sparks |
| waldo | a tall stack of documents with one table page pulled out and lit from within |
| socratis | an ink-brush code glyph on a paper screen beside a small floating voice orb |
| forge | nine small lanterns in a chain along a path, one brighter than the rest |
| justhireme-ios | a single tall paper talisman shaped like a phone, cards inside it |
| vaani | a jigokuchō (hell butterfly) resting on an old handset, sound rings in the air |
| branchgpt | a white tree whose trunk splits into two branches and rejoins |
| mapmyrepo | a constellation of stones connected by drawn lines on the sand |
| leetbot | a paper lantern with a hint written as a small diagram glowing through the paper |
| sss | a grid of small framed pictures laid on the ground, one lit by a magnifier of light |
| ori-no-michi | a large paper crane mid-fold, crease lines glowing |
| learnai | an open book with two facing pages, a small orb of light hovering over one exercise |
| estimateio | a small bus beside an enormous whale silhouette drawn in light on the dune |
| reiatsu | drifting ribbons of light over the sand, a single bright disc |
| asciirealtime | a face rendered as tiny glyphs on a hanging cloth |
| pixelforge | a mosaic of square tiles half assembled into a picture |
| gitart | a contribution grid drawn as a field of small stones, some lit |
| habiturtle | a small turtle on a rock with a streak of lit stones behind it |
| maze-pathfinder | a stone maze seen from above with one glowing path through it |
| holeemall | a black hole in the sand swallowing small pale orbs |

## Example prompt

> Bleach-style anime background painting, Hueco Mundo: white mineral desert under a black-teal night sky,
> thin white crescent moon high right, quartz towers far on the horizon. Focal object right of centre: three
> paper job cards fanned on a stone plinth, the top one lit from within, thin glowing threads connecting
> them. No characters, no text, no UI. Bottom-left of the frame stays quiet. 16:9, cel-shaded, painted
> gradients, subtle reiatsu glow, no lens flare.
