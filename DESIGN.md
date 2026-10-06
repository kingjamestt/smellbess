---
name: Smell Bess
description: Fine fragrance in Trinidad & Tobago. Only the best, as decants and sealed bottles.
colors:
  night: "#121014"
  smoke: "#1e1b21"
  hairline: "#2e2a31"
  pearl: "#eae8e5"
  ash: "#8f8a93"
  amber: "#e3a23b"
  amber-light: "#f0b85e"
  amber-deep: "#b57a1d"
  pearl-ink-soft: "#4a4650"
  pearl-ink-quiet: "#5e5962"
  coral-alert: "#ff8f7f"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: "0.22em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "0.22em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.24em"
    fontVariation: "'wdth' 125"
  label-small:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 500
    letterSpacing: "0.14em"
    fontVariation: "'wdth' 125"
    fontFeature: "'tnum'"
  price:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    fontVariation: "'wdth' 125"
    fontFeature: "'tnum'"
rounded:
  sm: "4px"
  md: "6px"
  xl: "12px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "40px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.night}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.amber-light}"
    textColor: "{colors.night}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.pearl}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.smoke}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.pearl}"
    typography: "{typography.label-small}"
    rounded: "{rounded.md}"
    padding: "0 8px"
    height: "40px"
  chip-on:
    backgroundColor: "{colors.pearl}"
    textColor: "{colors.night}"
  field:
    backgroundColor: "{colors.smoke}"
    textColor: "{colors.pearl}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "44px"
  pearl-case:
    backgroundColor: "{colors.pearl}"
    textColor: "{colors.night}"
    rounded: "{rounded.md}"
  tester-tray:
    backgroundColor: "{colors.smoke}"
    rounded: "{rounded.xl}"
    padding: "12px"
  size-option:
    backgroundColor: "transparent"
    textColor: "{colors.amber}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "72px"
  size-option-selected:
    backgroundColor: "{colors.smoke}"
    textColor: "{colors.amber}"
  offer-panel:
    backgroundColor: "{colors.smoke}"
    textColor: "{colors.pearl}"
    rounded: "{rounded.md}"
    padding: "20px"
  free-5ml-card:
    backgroundColor: "{colors.pearl}"
    textColor: "{colors.night}"
    rounded: "{rounded.md}"
    padding: "20px"
  cart-count:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.night}"
    rounded: "{rounded.sm}"
---

# Design System: Smell Bess

## Overview

**Creative North Star: "Bottles in a Dark Room"**

The storefront is a dark shop at night with the bottles lit. A near-black Night ground carries everything; the product photographs sit in small lit Pearl cases, so the only bright objects on the page are the bottles themselves. One Amber accent marks what costs money and what to press: prices, the short rule under a title, the main button, the NOW marker. Everything else is Pearl type, Ash for quiet text, and hairlines.

Type does the luxury work, not ornament. Archivo is the only family, and its width axis is the system's main lever: Expanded Light caps tracked wide for the wordmark and display titles, Expanded Medium tracked caps for labels and prices, and normal width for anything meant to be read. The shelf is dense and practical (a list on phones, a tester tray from tablet up) because the job is to scan names and prices fast on a phone on mobile data. Calm, flat, honest about numbers.

One dark theme for the whole site. There are no gradients, no shadows, and no gold foil or cream-and-serif luxury.

**Key Characteristics:**
- Night ground, Pearl type, Ash quiet text, Amber as the only accent.
- Archivo only; width (wdth 125 vs. 100) separates display and labels from reading text.
- Product photos multiply onto Pearl cases (6px radius), so white studio backgrounds drop away.
- Flat surfaces: hairline borders and Smoke fills do the layering.
- 6px controls, 12px trays and grouped panels, 44px minimum hit targets.
- One owned interaction: the tester "Sizes" flip.

## Colors

A near-monochrome warm-violet dark palette with a single warm Amber accent.

**Legacy token names.** The CSS custom properties in `web/src/app/globals.css` predate the rebrand and keep their old names. Read them by role: `--hibiscus` is Amber, `--hibiscus-dark` is Amber Light (hover, lighter on a dark ground), `--paper` is Night, `--mist` is Smoke, `--line` is the Hairline, `--ink` is Pearl text, `--muted` is Ash, and `--sun` / `--sea` / `--inverse` are all Pearl fills (with `--on-*` set to Night). The names are legacy; the roles below are the system.

### Primary
- **Amber** (`--hibiscus`): the only accent. Prices, the short rule under titles and in the wordmark, the BESS half of the wordmark, the main button fill, the cart count, text links in deals, the NOW marker and its rule, the focus ring, selection and caret. Text on Amber is always Night.
- **Amber Light** (`--hibiscus-dark`): hover for Amber fills only. On a dark ground hover gets lighter, not darker.
- **Amber Deep**: Amber's stand-in on Pearl surfaces, where Amber itself washes out. Used for the S|B line and the drawn rule on the free-5ml card. Decorative lines only, never text.

### Neutral
- **Night** (`--paper`): the ground for every page, the text colour on Amber and Pearl fills, and the browser theme colour.
- **Smoke** (`--mist`): raised surfaces. The tester tray, the footer, the offer panel, the selected size option, row and nav hover fills, form fields.
- **Hairline** (`--line`): every border and divider. 1px only.
- **Pearl** (`--ink`, `--sun`, `--sea`, `--inverse`): primary text, the secondary button outline, the active chip fill, and the product case behind every photo.
- **Ash** (`--muted`): secondary text, house names, blurbs, notes, footer copy, group headings (5.5:1 on Night).
- **Pearl Ink Soft / Pearl Ink Quiet**: quiet text on Pearl surfaces (the free-5ml card body, the from-price on a tray case), where Ash would be too light.
- **Coral Alert** (`--danger`): form errors on Night only.

### Named Rules
**The One Amber Rule.** Amber is the only hue. It marks money and the next step (prices, the main button, the rule, NOW). If something is Amber and is neither a price, an action, nor a brand mark, it is wrong.

**The BESS Rule.** In the wordmark, SMELL is Pearl and BESS is Amber, always. The wordmark is live type, never an image.

**The One Theme Rule.** There is one dark theme. No light mode, no theme switch, no per-section repaint of the ground.

## Typography

**Display Font:** Archivo, Expanded (wdth 125), with ui-sans-serif, system-ui fallback
**Body Font:** Archivo, normal width (wdth 100)
**Label Font:** Archivo, Expanded Medium

**Character:** One family made to do two jobs through its width axis: wide, light and airy caps for the brand voice, then plain, compact Archivo for reading. The contrast in width replaces a second typeface.

### Hierarchy
- **Display** (300, 2.125rem rising to 3.25rem at lg, line-height 1.12, tracked 0.22em, uppercase, Expanded): page titles in the wordmark style ("Only the best.", "The sets"), always followed by a short Amber rule (2px tall, 56px wide).
- **Headline** (300, 1.25rem rising to 1.5rem, tracked 0.22em, uppercase, Expanded): section titles on the homepage, with a 40px Amber rule beneath.
- **Title** (500, 2rem rising to 2.75rem, line-height 1.05, normal width): the scent name on its own page. Set names (1.5rem, 500) and sub-section headings (1.125rem, 500) follow the same normal-width medium style. Scent names stay in mixed case.
- **Body** (400, 0.9375rem to 1rem, line-height 1.625, normal width): descriptions and explanations, in Ash when secondary. Long copy is capped around 28rem to 65ch.
- **Label** (500, 0.6875rem, tracked 0.24em, uppercase, Expanded): navigation, filter chips, size names, group headings, status lines. A smaller variant (0.625rem, tracked 0.14em, tabular figures) carries price lines in rows and cases.
- **Price** (400, Expanded, tabular figures, Amber): every money figure in the shop. Quantities, ratings and step numbers use Expanded tabular figures too.

### Named Rules
**The Width Rule.** Expanded is for brand, labels and figures; normal width is for reading. Never set a sentence in Expanded, and never set a price in normal width.

**The No Eyebrow Rule.** No small label sits above a heading to introduce it. A title stands alone with its Amber rule beneath. Label caps are for controls, prices, status and group headings that are themselves the heading.

## Layout

A single centred container (max 76rem) with 16px side padding on phones, 24px at md and 32px at lg. The homepage and shop are a two-column shelf from md up: a sticky left column (19rem at md, 22rem at lg) holding the title, filters and deals, and the tester tray on the right. On phones the same content stacks: title, deals, filters, then the list grouped by when you'd wear it (Daytime / Nighttime / Anytime), with a NOW marker on the group that matches the current time in Trinidad.

The list-to-tray switch happens at md (768px): phone rows become a three-column tray of cases. The scent page splits into a sticky photo column and a details column at md. Cart and checkout use a content column with a sticky 22rem summary.

Spacing is on a 4px base. Controls sit 8px apart; rows breathe at 12px vertical padding; panels pad 16 to 20px; title blocks stack at 20px; homepage sections are separated by 64px with a hairline and 40px of top padding. Every interactive target is at least 44px tall (filter chips 40px within a full-width grid).

## Elevation & Depth

Flat. There are no shadows anywhere in the storefront. Depth comes from three things: tone (Night ground, Smoke raised surfaces), 1px Hairline borders and dividers, and light (the Pearl cases are the brightest objects, so the products read as lit from within the dark). The sticky header is Night at 95% with a backdrop blur, the one translucent surface.

### Named Rules
**The Lit Case Rule.** Brightness is reserved for product. The Pearl case is the only large light surface; panels and trays stay dark and recede.

**The No Shadow Rule.** Nothing casts a shadow and nothing has a gradient. Use a Smoke fill or a Hairline border to separate surfaces.

## Shapes

Gently squared. Controls, cases, fields, size options and small panels use a 6px radius; grouped containers (the tester tray, the deals panel, the sets grid, the set tray) use 12px; the cart count and draft badge use 4px. No pills and no circles except the seal and spinner rings. Lines are hairlines (1px) for borders and dividers and 2px for the Amber rule. The brand marks are linear: the S|B monogram split by one Amber line, and a thin double-ring seal with the promise set around the edge.

## Components

### Buttons
Confident, wide-tracked caps; never rounded into pills.
- **Shape:** gently squared (6px), at least 44px tall, 20px side padding, label set in Expanded Medium caps tracked 0.14em at 0.875rem.
- **Primary:** Amber fill, Night text. The single main action per view (Add, Checkout, Send order on WhatsApp).
- **Hover / Focus:** hover lifts to Amber Light (colour transition only); focus shows a 3px Amber outline offset 2px; disabled drops to 50% opacity.
- **Secondary:** transparent with a 1px Pearl outline and Pearl text; hover fills Smoke. Used for second choices and WhatsApp enquiries.

### Chips (filters)
- **Style:** transparent, 1px Hairline border, 6px radius, label caps tracked 0.14em, 40px tall, laid out in full-width grids (four across for time, two for weather).
- **State:** selected chips invert to a Pearl fill with Night text (`aria-pressed`). Tapping a selected chip clears it.

### Cards / Containers
- **Corner Style:** 6px for single items, 12px for groups.
- **Background:** Night with a Hairline border (deals panel, empty cart), Smoke for raised groups (tray, offer panel, footer).
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px Hairline; lists divide with Hairlines (Smoke between phone rows).
- **Internal Padding:** 16 to 20px; list rows 12 to 14px vertical.

### Inputs / Fields
- **Style:** Smoke fill, 1px Hairline border, 6px radius, 44px tall, 16px text (no zoom on iOS), Ash placeholder.
- **Focus:** 3px Amber outline, 2px offset. Caret and native accents are Amber.
- **Error:** Coral Alert text in a `role="alert"` list beneath the form.

### Navigation
Sticky 56px header: the small wordmark left, label-caps links right (Scents, then Sets from sm, Delivery from md) with Smoke hover fills, and a bordered cart button carrying an Amber count. The footer is Smoke with the wordmark (with rule and FINE FRAGRANCE descriptor), the seal, the legal line and label-caps links.

### Pearl Case (product photo)
Every product image sits in a Pearl box with a 6px radius and generous inset (6 to 12%). The photo uses multiply blend, so its white studio backdrop vanishes into the Pearl and only the bottle remains. Without a photo, a drawn bottle placeholder stands in at the same radius.

### Shelf Row (phones)
A 76px Pearl case beside the name (1.0625rem, 500), the house in Ash, a two-line blurb, then two label-caps lines: "5 · 10 · 15ml" with the decant prices in Amber, and the bottle line (Pearl when a sealed bottle is for sale, Ash otherwise). Groups are headed by a label-caps time name with a Hairline running to the edge; the current group shows NOW in Amber and its line turns Amber.

### Tester Tray and the Sizes Flip (signature)
From md up, products sit in a Smoke tray (12px radius) as a three-column grid of Pearl cases, each with the photo, the name, a quiet from-price and a "Sizes" button. Pressing Sizes turns the tester over like reading the base of a bottle: a CSS 3D rotation (perspective 1400px, 640ms, ease-out `cubic-bezier(0.16, 1, 0.3, 1)`, hidden backfaces). The back is Night with a 1px Amber border: name and house, a close control, a 2×2 grid of size options (label caps size, Amber Expanded price, plus the sealed bottle or a dashed "Decants only" slot) and a live status line. Under reduced motion the turn is instant. The hidden face is `inert`.

### Size Options (scent page)
A grid of 72px tiles (two across, four from sm): label-caps size above an Amber Expanded price. Selected tiles take a Pearl border and Smoke fill; unavailable ones read "Sold out" at 40% opacity. Below sits one full-width primary button stating the size and price.

### Offer Panel and Free 5ml Card
The applied offer is a Smoke panel (6px, 20px padding) in plain words, with nudges toward a better offer in Amber. When the free 5ml applies, a Pearl card appears above it with Night text: the S|B monogram in Amber Deep, two lines of copy, and an Amber Deep rule. It rises in once (10px, 520ms) and its rule then draws across left to right (900ms, 380ms delay). Under reduced motion it appears settled.

### Spinner
Drawn from the seal: a faint Pearl ring with an Amber arc that sweeps (1.6s linear) while its length breathes; the large size holds the S|B monogram with its Amber line pulsing. Under reduced motion the arc rests as a quarter ring.

## Do's and Don'ts

### Do:
- **Do** use Amber only for prices, the main action, the rule, NOW and the BESS half of the wordmark.
- **Do** put every product photo in a Pearl case with multiply blend and a 6px radius.
- **Do** set display titles in Archivo Expanded Light caps tracked 0.22em with a short 2px Amber rule beneath.
- **Do** set prices and figures in Expanded with tabular numbers.
- **Do** separate surfaces with Smoke fills and 1px Hairlines.
- **Do** keep every tap target at least 44px tall and every motion instant under reduced motion.
- **Do** say a size is available or sold out, and nothing in between.

### Don't:
- **Don't** show stock counts, millilitres left or any "only N left" scarcity on the public site.
- **Don't** put an eyebrow label above a heading.
- **Don't** add a light theme or a theme switch.
- **Don't** use shadows or gradients.
- **Don't** introduce a second accent hue or a second typeface.
- **Don't** set Amber text on Pearl; use Amber Deep for lines there, and never for text.
- **Don't** render the wordmark as an image, or with BESS in any colour but Amber.
- **Don't** reach for gold foil, cream-and-serif luxury or a generic luxury template.
