# Paper details

- Portrait opens an accessible note; footer provides the same discovery on every section.
- Four notes explain the human behind the portrait, orchestration hand, palette and hidden keyboard sequence.
- Up, up, down, down, left, right, left, right reveals a short paper flourish. It does not intercept native scrolling, typing, focused widgets or dialogs and respects disabled shortcuts. Reduced motion shows only the note. Temporary nodes are removed after 2.6 seconds or when the page is hidden.
- Back to top preserves the selected section and returns keyboard focus to its heading.
- Selection colors, touch feedback, focus restoration, paper borders and button spacing use the existing palette.
- No additional audio engine, tracking, persistent collectible state or idle animation.

Validation: scripts/check-delights.cjs covers narrow/desktop layout, dialogs, focus return, same-section scroll, secret activation and reduced motion. Existing mobile and production checks cover the rest of the portfolio.
