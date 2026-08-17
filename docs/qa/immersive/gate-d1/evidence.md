# Task 5 Gate D1 — public homepage first fold

Captured from the current public `/` route at `1440×900` and `390×844` in
light and dark OS color schemes. Every image uses a fresh browser context;
`sessionStorage` and `localStorage` are empty before app boot. The persona tray
remains visible and untouched. Configured PostHog API and asset origins are
blocked by the capture harness. The Next.js development indicator is hidden;
no product CSS is changed.

Machine-checked capture facts are in `capture-facts.json`: all four captures
start with `sessionStorage.length === 0`, mount one ready world, one `main`, one
`h1`, two primary CTA links, and a visible persona tray.

## Visual findings for the D1 judge

1. **Mascot contrast is weak in both themes.** In light the guide reads as a
   translucent/washed-out layer; in dark the helmet, face, and body lose most
   of their internal silhouette against the dark panel. The pager remains the
   clearest mascot detail.
2. **The mobile fold does not expose the feature-flag dock.** The persona tray,
   hero copy, and two CTAs fill the complete `390×844` viewport. The only
   visible interaction cues are the persona controls and the small `Replay`
   label; the guide is heavily cropped and partly obscured by the tray/copy.
3. **Desktop board visibility is only a teaser.** At `1440×900`, the next
   section begins at the bottom edge with its heading partially visible; no
   ticket is visible in the first frame.

No selector or composition-contract failures were observed in these captures.
