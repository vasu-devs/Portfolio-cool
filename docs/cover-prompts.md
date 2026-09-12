# Project covers for /test

Covers are the project's **real interface** painted into its realm by the Codex CLI image tool.

Pipeline:

1. Put a real screenshot of the app at `public/test/covers/ui/<slug>-ref.png` (a captured screen, a demo-video
   frame via ffmpeg, or a live-site screenshot). Projects with no capture fall back to a written description of
   the interface in `scripts/codex-ui-covers.mjs`.
2. `node scripts/codex-ui-covers.mjs 4` paints `<slug>-hueco.png` and `<slug>-seireitei.png` (model gpt-5.5,
   image_generation enabled, the screenshot attached as reference). Existing outputs are skipped; delete one to repaint.
3. `python scripts/png-to-webp.py public/test/covers/ui/ -` converts the PNGs to the WebP files the page loads.
4. `node scripts/generate-test-portfolio.mjs` rebuilds the page.

References currently used: JustHireMe (.smoke-web-ui dashboard), JustHireMe iOS (XCTest Workspace capture),
Svara (logs/overlay-preview), Dreamer (video recording frame), LeetBot (Icon/Demo.jpg), Ori no Michi
(work/shots/03-theater), Reiatsu (test-output/studio), PixelForge (SS/pixelforge_native), EstimateIO (local
vinext dev capture), Odeon (local vite capture), Vaani and MapMyRepo (frames from their demo videos).
Described only: BranchGPT, Deep Researcher, Waldo, Socratis, Forge, SSS, habiTurtle, Maze Pathfinder, HoleEmAll,
GitArt, LearnAI, ASCIIRealTime. Capture any of those for real and rerun the two scripts.

The scene-painting prompts below are the earlier approach (symbolic focal objects, no UI), kept for reference.

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
