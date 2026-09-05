# Amplitude Funnel Analysis Visual Patterns
**Research Date:** August 18, 2026  
**Sources:** Official Amplitude documentation, product screenshots, and help articles  
**Context:** Neo Futurist "session cockpit" analytics design for single-visitor journey vs. benchmark

---

## 1. STAGE REPRESENTATION

### Current Amplitude Pattern
- **Bar Structure:** Vertical bar chart with stacked regions within each bar
- **Bar Height:** Absolute number of unique users reaching that step (Y-axis labeled "Unique users")
- **Bar Composition:** 
  - Solid color region (bottom): users who converted/progressed to next step
  - Lighter striped region (top): users who dropped off at that step
- **Step Ordering:** Horizontal progression left-to-right, each step labeled on X-axis (e.g., "Email Opened," "Link Clicked," "Purchase Completed")
- **Spacing:** Even intervals between bars; consistent width
- **Cell Content:** Each bar displays step event name below; numeric counts and percentages appear in supporting table below chart, not directly on bars

**Source:** [Interpret your funnel analysis - Amplitude Docs](https://amplitude.com/docs/hc/en-us/articles/360053338671-Interpret-your-funnel-analysis)

---

## 2. CONVERSION / DROP-OFF LABELS

### Current Amplitude Pattern
- **Conversion Rate Display:**
  - Overall conversion percentage (entire funnel completion) shown in accompanying table row below chart
  - Step-over-step conversion: table shows cumulative percentage (first step always 100%, each subsequent step shows % of original cohort that progressed)
  - Conversion difference between segments appears on hover ("microscope" tooltip)

- **Drop-off Visualization:**
  - Drop-off count = visually indicated by striped segment atop solid region of each bar
  - Visual emphasis: lighter stripe contrasts with solid conversion bar, allowing immediate pattern recognition
  - Drop-off is NOT labeled directly on bar; analyst must read table or hover for exact counts

- **Presentation Mode:**
  - **Conversion chart** (default): shows raw user counts per step + drop-off stripe
  - **Conversion over time:** tracks conversion rates by entry date (line chart)
  - **Time to convert:** histogram showing distribution of conversion time intervals
  - **Frequency:** bar chart of repetition counts before step progression

**Source:** [Amplitude Docs - Interpret your funnel analysis](https://amplitude.com/docs/hc/en-us/articles/360053338671-Interpret-your-funnel-analysis); [Identify conversion drivers - Amplitude Docs](https://help.amplitude.com/hc/en-us/articles/360039976551-Funnels-analysis-Conversion-drivers)

---

## 3. COMPARISON / SEGMENT OVERLAYS

### Current Amplitude Pattern
- **Segment Comparison Method:**
  - **A/B Test mode:** displays "conversion rate for each segment across all steps"
  - **Group-by mode:** uses property value bucketing (e.g., compare by device, country, user cohort)
  - **Maximum comparison:** limited to 2 segment group-bys per chart
  - **Visual layout:** Official documentation does NOT specify whether bars are overlaid, side-by-side, or stacked. Implementation details obscured in product UI rather than documented.

- **Color Differentiation:**
  - Segments are color-coded, but specific palette is NOT detailed in official docs
  - Conversion % difference appears in tooltip on hover ("microscope")

- **Table View:**
  - Breakdown table shows segment-specific conversion and drop-off counts per step
  - Each segment row displays cumulative or step-over-step metrics (configurable via UI)

**Note:** Amplitude's official documentation is silent on the *visual rendering* of side-by-side vs. overlaid bars for segment comparison. This is a gap between product capability and documented specification.

**Sources:** [Compare group-by values in your Funnel Analysis chart](https://amplitude.com/docs/hc/en-us/articles/19458300523291-Compare-group-by-values-in-your-Funnel-Analysis-chart-to-each-other); [A/B testing in a Funnel Analysis chart](https://amplitude.com/docs/hc/en-us/articles/19466562128411-A-B-testing-in-a-Funnel-Analysis-chart)

---

## 4. SIDE METRICS

### Current Amplitude Pattern
- **Supporting Metrics (Table Below Chart):**
  - Unique user count per step
  - Overall funnel conversion percentage
  - **Average time to convert** = "The average time it takes users to move from one event to another event" (labeled per step pair)
  - Step-specific user counts (with first step at 100% baseline)

- **Secondary Analysis Views:**
  - **Time to Convert Histogram:** shows distribution of conversion time buckets (0–1h, 1–2h, etc.) with median line overlay
  - **Frequency Distribution:** bar chart of how many times users repeat event pairs before progressing
  - **Conversion Trends:** line chart tracking conversion rates by entry date

- **Layout:**
  - Table positioned directly below or adjacent to chart
  - No "info panels" or side metrics drawer; data is hierarchical (chart primary, table secondary)
  - Columns: Step name, User count, %, Avg time, and segment-specific variants

**Source:** [Amplitude Docs - Interpret your funnel analysis](https://amplitude.com/docs/hc/en-us/articles/360053338671-Interpret-your-funnel-analysis)

---

## 5. MOBILE / RESPONSIVE

### Current Amplitude Pattern
- **Documented Responsive Behavior:** NONE FOUND in official Amplitude docs
- **Dashboard Layout (Desktop):**
  - Side-by-side: controls on left (event selection, filters, segmentation), chart on right
  - This enables "instantaneous feedback" as users adjust query
  - Multiple funnels can be added to a dashboard via templates
  
- **Mobile Assumption:**
  - Amplitude dashboards are primarily desktop/web browser focused
  - Responsive breakpoints for mobile viewing are NOT documented
  - No official mobile app funnel visualization spec
  - Dashboard templates reference web layout only

**Source:** [The Evolution of Amplitude Charts - Amplitude Blog](https://amplitude.com/blog/evolution-of-amplitude-charts); [Dashboard Preferences - Amplitude Docs](https://amplitude.com/docs/analytics/dashboard-preferences)

**Gap:** Mobile/tablet responsiveness is a product feature but NOT formally documented in help or blog content.

---

## TRANSLATION RECOMMENDATION: Neo Futurist Session Cockpit

### Design Principle
Your "session cockpit" is a **self-aware analytics parody** — candid, industrial, tongue-in-cheek. The visitor is the analyst of their own journey. Neo Futurist aesthetic (monochrome editorial-industrial, thick black framing, asymmetric modular panes, large rounded geometry, tactile grayscale/metal texture, tiny spaced uppercase labels, sparse semantic accents) should reinforce "real analyst tool" credibility while maintaining the joke.

### Pattern Adoption & Translation

#### 1. **Stage Representation → Neo Futurist Bars**
**Amplitude Pattern to Adopt:** Vertical stacked bars with solid + striped drop-off region

**Neo Futurist Translation:**
- **Solid bar color:** Deep graphite or matt black (not Amplitude's default blue)
- **Drop-off stripe:** Tactile texture overlay (crosshatch or fine metallic grain) in dark gray, creating visual separation via *texture* rather than color
- **Bar geometry:** Keep vertical alignment; increase border radius on bar tops for Neo Futurist's "large rounded geometry" (e.g., 8–12px) vs. Amplitude's sharp corners
- **Labels:** Move step names into 6–8px spaced uppercase sans-serif **below** bars (e.g., "EMAIL OPEN", "LINK CLICK"); reserve chart area for clean lines only
- **Height ratio:** Preserve Amplitude's stacked-region height ratio (solid = converted, stripe = dropped); height encodes absolute count as in Amplitude

**Why This Works:** The visitor *sees* their own funnel as an analyst would, with professional bar structure. Large rounded corners soften the industrial chassis. Monochrome + texture prevents color-coding distraction; the focus is on *shape* (bar height = users, stripe height = drop-off), not hue.

---

#### 2. **Conversion / Drop-off Labels → Minimal Semantic Accents**
**Amplitude Pattern to Adopt:** Step-over-step conversion %; drop-off visually encoded in striped region

**Neo Futurist Translation:**
- **Do NOT place percentage labels on bars.** Keep chart surface uncluttered (Neo Futurist principle: "sparse semantic accents").
- **Companion micro-table** (positioned below or right of bars): 2–3 column table with 8px uppercase labels ("STEP", "USERS", "CONVERT %"). 
  - No background shading; ultra-fine hairline borders (0.5–1px) in dark gray
  - Monospace numerals (tabular figures) for alignment
  - One semantic accent per row: tiny colored dot (e.g., a single 4px circle in muted teal or rust) to mark the step with largest drop-off
- **Hover interaction:** On bar hover, show tooltip (dark glass/frosted effect, sans-serif small caps) with absolute counts and conversion %; disappear on mouse-out.

**Why This Works:** Amplitude's table-below approach is respected, but Neo Futurist removes chart clutter and makes the table *part of* the frame, not a separate widget. The single semantic accent (drop-off dot) gives the eye a place to land without resorting to color gradients.

---

#### 3. **Comparison / Segment Overlays → Asymmetric Pane Layout**
**Amplitude Pattern to Adopt:** Two-segment comparison (A/B or property values)

**Neo Futurist Translation:**
- **Do NOT overlay bars or display side-by-side within one frame.** Instead, use asymmetric pane design:
  - **Left pane (70% width):** Visitor's actual journey (5-step funnel, e.g., "Landed on site" → "Opened article" → "Engaged 2+ min" → "Scrolled past fold" → "Returned next day")
  - **Right pane (30% width, darker background ~15% black overlay):** Benchmark cohort (same 5 steps, smaller bars, lower contrast) with label "BENCHMARK" in 6px uppercase
  - **Visual connection:** Hairline vertical divider (0.5px dark gray) between panes
  - **Metric highlight:** Conversion % difference shown as **single semantic accent** (small teal badge, e.g., "+8%" or "−3%") positioned top-right of benchmark pane

**Why This Works:** Asymmetric panes reinforce the joke (visitor is the protagonist, benchmark is supporting cast). Darker benchmark pane reads as "reference" without needing legend. No color-coding of bars; the *pane structure itself* encodes the comparison. Amplitude doesn't show this layout in docs, but it aligns with their side-by-side control/chart pattern and Neo Futurist's modular ethos.

---

#### 4. **Side Metrics → Modular Accent Cards**
**Amplitude Pattern to Adopt:** Table with step counts, conversion %, average time-to-convert

**Neo Futurist Translation:**
- **Replace dense table with 2–3 modular accent cards** positioned below the dual-pane funnels:
  - **Card 1 (dark frame, 120px × 80px):** "FUNNEL TIME" / Median time-to-convert (e.g., "2h 14m") in large mono numerals
  - **Card 2:** "STEPS TO CONVERT" / absolute count (e.g., "5") + badge "BENCHMARK: 4"
  - **Card 3 (optional):** "REPEAT RATE" / % of steps repeated before progression (e.g., "12%")
- **Card styling:** Thick black or dark gray 2–3px border, 8–12px corner radius, 1–2px inner padding; no background fill (transparent or 1% white in dark mode)
- **Label:** 6px spaced uppercase sans-serif above each number
- **Arrangement:** 3 cards in a row, even spacing (gap = card height / 2)

**Why This Works:** Modular cards break the rigidity of a table while preserving all Amplitude's key metrics. Thick black frames read as "industrial cockpit." Each card is a discrete instrument, reinforcing the parody of analytical sophistication.

---

#### 5. **Mobile / Responsive (Undocumented in Amplitude) → Full-Width Stack**
**Neo Futurist Translation (since Amplitude has no mobile spec):**
- **On screens < 768px:** Stack panes vertically (visitor above, benchmark below, both full width)
- **Accent cards:** Reflow to 2 rows of 1–2 cards per row (vs. 3 in a row on desktop)
- **Bar width:** Increase X-axis padding so step labels remain legible in spaced uppercase (no truncation)
- **Typography:** Maintain 6px label size; increase bar height scaling to maintain visual hierarchy

**Note:** This is a product recommendation, not Amplitude's documented practice. Amplitude's responsiveness is not publicly specified; your Neo Futurist design should define this explicitly.

---

## Summary: Pattern Adoption Table

| **Amplitude Pattern** | **Source** | **Neo Futurist Translation** | **Rationale** |
|---|---|---|---|
| **Vertical stacked bars** (solid + striped drop-off) | [Interpret your funnel analysis](https://amplitude.com/docs/hc/en-us/articles/360053338671-Interpret-your-funnel-analysis) | Deep graphite bars, crosshatch texture stripe, 8–12px border radius on tops | Preserve information structure; replace color with texture & geometry for monochrome aesthetic |
| **Step-over-step conversion %** | [Interpret...](https://amplitude.com/docs/hc/en-us/articles/360053338671-Interpret-your-funnel-analysis) | Micro-table below chart with hairline borders; one semantic accent (dot) on largest drop-off step | Keep chart sparse; table is part of frame, not separate widget |
| **Two-segment comparison** (A/B or property values) | [Compare group-by values...](https://amplitude.com/docs/hc/en-us/articles/19458300523291-Compare-group-by-values-in-your-Funnel-Analysis-chart-to-each-other) | Asymmetric dual-pane layout (visitor left 70%, benchmark right 30% with darker background) | Encode comparison via spatial hierarchy, not color; reinforce "visitor as protagonist" joke |
| **Accompanying time/count metrics** | [Identify conversion drivers](https://help.amplitude.com/hc/en-us/articles/360039976551-Funnels-analysis-Conversion-drivers) | Modular accent cards (thick black frame, 6px uppercase labels, large mono numerals) | Replace dense table with discrete "instruments"; reinforce industrial cockpit metaphor |
| **Mobile responsiveness** | *(Undocumented in Amplitude)* | Stack panes vertically; reflow cards to 2 rows; increase label legibility | Extend Neo Futurist asymmetry to small screens; maintain spaced uppercase readability |

---

## Top 3 Pattern Recommendations

### 1. **Adopt Stacked Bar Structure + Tactile Texture Stripe**
Use Amplitude's proven vertical stacked-bar architecture with solid + drop-off regions. Replace Amplitude's color-coded stripes with monochrome crosshatch texture. This preserves the information clarity Amplitude's design achieves while committing fully to the Neo Futurist industrial aesthetic. The texture makes drop-off *feel* tangible (metal surface, worn grain) rather than flat color.

**Implementation note:** Test texture opacity and crosshatch density in production; ensure sufficient contrast on small bars (< 40px tall).

---

### 2. **Replace Side-by-Side Segment Bars with Asymmetric Pane Layout**
Amplitude's segment comparison method is not visually documented (gap in their spec). Your Neo Futurist design should *own* this gap by introducing asymmetric dual-pane layout: visitor journey dominant (left), benchmark reference diminished (right, darker). This is more memorable and reinforces the satirical premise ("you, the analyst, vs. the crowd"). 

Avoid color-coding the bars; let pane positioning and contrast encode the relationship. One semantic teal/rust accent badge for the conversion % delta.

**Implementation note:** Benchmark pane should be visually *deferential* (lower contrast, smaller labels) but not so faded that it's unreadable; test legibility at 2:1 luminance difference.

---

### 3. **Replace Dense Metrics Table with Modular Accent Card Grid**
Amplitude groups all step metrics in a single table below the chart. Neo Futurist should break this into 2–3 discrete accent cards (e.g., "FUNNEL TIME", "STEPS TO CONVERT", "REPEAT RATE"), each with a thick black frame and large monospace numerals. 

This approach maintains Amplitude's information completeness while visually separating metrics into "instruments" of the cockpit. The thick borders and corner radius signal "industrial tool" credibility. Arrange cards in a row below the panes; stack on mobile.

**Implementation note:** Ensure card height equals at least 2× the label font size; use 1px hairline inner borders to suggest "depth" of the industrial frame.

---

## Reference URLs

- [Funnel Analysis - Amplitude Docs](https://amplitude.com/docs/analytics/charts/funnel-analysis)
- [Interpret your funnel analysis](https://amplitude.com/docs/hc/en-us/articles/360053338671-Interpret-your-funnel-analysis)
- [Build a funnel analysis](https://amplitude.com/docs/analytics/charts/funnel-analysis/funnel-analysis-build)
- [How Amplitude computes conversions](https://amplitude.com/docs/analytics/charts/funnel-analysis/funnel-analysis-how-amplitude-computes-conversions)
- [A/B testing in Funnel Analysis](https://amplitude.com/docs/analytics/charts/funnel-analysis/funnel-analysis-ab-test)
- [Compare group-by values](https://amplitude.com/docs/hc/en-us/articles/19458300523291-Compare-group-by-values-in-your-Funnel-Analysis-chart-to-each-other)
- [Identify conversion drivers](https://help.amplitude.com/hc/en-us/articles/360039976551-Funnels-analysis-Conversion-drivers)
- [The Evolution of Amplitude Charts - Blog](https://amplitude.com/blog/evolution-of-amplitude-charts)
- [What Is Funnel Analysis - Blog](https://amplitude.com/blog/funnel-analysis)
- [Funnel Analysis in 5 Industries - Blog](https://amplitude.com/blog/funnel-analysis-in-five-industries)
