# Paper portfolio sound, revision 8

The user's direction is soothing, cohesive tactile interaction with natural variation, not repeated synthetic impacts. Visual layout and brand remain unchanged.

## Palette

24 recorded key samples, split into four disjoint families of six. Hover is a short, soft touch; press has more body; opening is slightly longer; closing is lighter and darker. Graph feedback uses the hover family with a restrained five-step depth and level range. It does not play a melody.

Source: unicaegames, Keyboard Soundpack #1, CC0, https://opengameart.org/content/keyboard-soundpack-1-typing-and-single-keystrokes . Downloads were obtained from the asset mirror recorded in `assets/foley/provenance.json`. That file contains source hashes and mastered sample measurements. `make-foley.py` reproduces all processing from `audio-source/key-*.wav` using NumPy and the Python standard library. These are processed recordings, not exclusive original recordings.

Mastering removes DC and sub-rumble, rolls off metallic high frequencies, gently emphasizes the body, matches active energy, rounds transients, and fades starts and tails. No oscillators, tonal pings, reverb, or continuous background audio. Sample peaks remain below 0.31 full scale before runtime mixing.

## Interaction rhythm

- Immediate pointer entry and keyboard focus feedback; no hover timer.
- 28 ms duplicate-event guard, with no per-second event cap.
- 80 ms same-target boundary-jitter guard; no queue of stale hover sounds.
- Scrolling does not suppress target feedback. Actions take priority for 45 ms.
- Warm audio starts synchronously in the event handler; cold hovers are discarded instead of replaying late. AudioContext requests interactive latency.
- Sweeps with less than 100 ms between sounds reduce hover gain by 22% to control accumulation without skipping normal crossings.
- Actions fade an existing hover; at most two sustained voices plus a 15 ms retiring fade.
- Shuffle bags exhaust six recordings before reuse and avoid identical samples at bag boundaries.
- Panel observers own navigation/dialog sounds, eliminating duplicate click/open responses.
- Audio starts only after a user gesture. Mute persists, fades voices, and cancels pending playback. Hidden pages suspend sound. Video dialogs suppress interaction sounds.

## Validation

`check-v7.cjs`: no autoplay, repeated intentional hovers, all five graph intensity levels, graph keyboard access, persisted mute, working dialogs, reduced motion, source cleanup, and no horizontal overflow at 1280/390/320 px. Passed, no page errors; `qa-v7.json`.

Historical revision 7 validation: `check-foley.cjs` / `qa-foley.json`. Its fly-by silence and four-per-second assertions have been intentionally superseded by the user's request for immediate feedback. Palette uniqueness, shuffle, and family behavior are unchanged.

Revision 8: `check-responsive-audio.cjs` / `qa-responsive-audio.json`. Native pointer events after scrolling reached source.start in 0.3–0.7 ms; all 24 target crossings at 20/second and all 20 graph crossings at 25/second played. A burst of 100 same-frame calls produced one sound. No delayed queue, duplicate dialog action sounds, mute regression, page errors, or leaked sources. These measurements cover software dispatch, not physical speaker/headphone latency.

The actual in-app browser reports AudioContext running and Test played after reloading. This verifies output, not subjective headphone/speaker quality; final aesthetic judgment belongs to the user.

Local preview only. No deployment or changes to the live portfolio repository.
