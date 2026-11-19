---
name: Sello Club
description: Digital stamp cards in flat ultramarine, tomato and canary ink, with round seals, soft panels and one heavy headline face.
colors:
  lito: "#1b2a8f"
  lito-deep: "#131e6b"
  lito-soft: "#2c3ea8"
  tomate: "#d42a14"
  tomate-deep: "#a91f0d"
  canario: "#ffc72c"
  papel: "#f4ecd8"
  papel-deep: "#e6dbbf"
  tinta: "#10143a"
  tinta-soft: "#4a5080"
  mesa: "#eef1fa"
  hoja: "#137a47"
  hoja-soft: "#dff3e7"
  aviso: "#8a5a00"
  aviso-soft: "#fff1cc"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 7.5vw, 4.8rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  headline-lg:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "2.4rem"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  numeral:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "2.2rem"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title-sm:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  subtitle:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.25
  row-title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1.25
  lead:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.375
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0"
  caption:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    lineHeight: 1.25
  card-name:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  pane-title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  result-title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  lead-lg:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.375
  body-lg:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 600
    lineHeight: 1.3
  small:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.375
  micro:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
rounded:
  control: "12px"
  panel: "16px"
  card: "24px"
  pill: "9999px"
spacing:
  control-height: "48px"
  control-height-small: "40px"
  control-x: "20px"
  field-x: "14px"
  card-pad: "20px"
components:
  button-primary:
    backgroundColor: "{colors.tomate}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    height: "{spacing.control-height}"
    padding: "0 20px"
  button-primary-hover:
    backgroundColor: "{colors.tomate-deep}"
  button-canary:
    backgroundColor: "{colors.canario}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.control}"
    height: "{spacing.control-height}"
    padding: "0 20px"
  button-ink:
    backgroundColor: "{colors.tinta}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    height: "{spacing.control-height}"
    padding: "0 20px"
  button-ink-hover:
    backgroundColor: "{colors.lito-deep}"
  button-outline:
    backgroundColor: "#ffffff"
    textColor: "{colors.tinta}"
    rounded: "{rounded.control}"
    height: "{spacing.control-height}"
    padding: "0 20px"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.tinta}"
    rounded: "{rounded.control}"
    height: "{spacing.control-height}"
    padding: "0 14px"
  nav-link-active:
    backgroundColor: "{colors.canario}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.control}"
    height: "44px"
  pane-white:
    backgroundColor: "#ffffff"
    textColor: "{colors.tinta}"
    rounded: "{rounded.card}"
    padding: "28px"
  pane-canary:
    backgroundColor: "{colors.canario}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.card}"
    padding: "28px"
  pane-deep:
    backgroundColor: "{colors.lito-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.card}"
    padding: "28px"
  stamp-card:
    textColor: "{colors.tinta}"
    rounded: "{rounded.card}"
    padding: "20px"
---

# Design System: Sello Club

## Overview

**Creative North Star: "Etiqueta de Caja"**

Every restaurant's stamp card is a crate label reduced to its essentials: flat ink, one heavy headline face, and a round seal inked for every visit. The system is a few opaque inks (ultramarine, tomato, canary, near-black) on a flat ultramarine ground, with generous radii, 1px hairline borders and soft shadows that lift cards off the page. There are no rays, ribbons, paper texture or text shadows.

Two registers coexist. Presentation surfaces (the home page, the customer join and card, the scanner) sit on the flat ultramarine ground and carry white, canary or deep-blue panes. Work surfaces (admin, dashboard, forms) sit on "mesa", a cool near-white, with white hairline-bordered controls. The scalloped star seal survives only as the wordmark. Label stock cream (`papel`) is no longer a UI surface; it is the background of the "Etiqueta" restaurant template and nothing else.

The restaurant's own colors lead on the card; the interface checks their contrast and corrects ink rather than trusting them. Sello Club's palette is the frame around the card, not its content.

**Key Characteristics:**
- Flat opaque inks; depth from two soft shadows and hairlines, never glows or hard offsets.
- Bricolage Grotesque 800 with tight tracking for names, headlines and numerals; Geist for everything read.
- Large radii: 12px controls, 16px panels, 24px cards and panes.
- The round check seal is the unit of progress, backed by a progress bar in the stamp card.
- One motion idea: the seal lands off-register and settles. Everything else is a single rise-in.

## Colors

Three inks and a keyline: ultramarine ground, tomato action, canary highlight, near-black text, plus leaf green and amber for status.

### Primary
- **Ultramarine Litho** (lito): the page ground on presentation surfaces, the nav bar, the theme color, focus border and ring on fields, the wordmark star.
- **Ultramarine Deep** (lito-deep) and **Ultramarine Soft** (lito-soft): deep is the ink-button hover and the dark home pane; soft is a spare lighter tone of the ground.

### Secondary
- **Tomato Ink** (tomate): the one primary action on white or mesa, the input caret and range accent. **Tomato Deep** (tomate-deep) is its hover.
- **Canary Yellow** (canario): primary action on ultramarine, the active nav tab, the Escanear pane, text selection, the focus ring, completed steps, notice banners on the card.

### Neutral
- **Keyline Ink** (tinta): all text, ink-button fill, hairline borders at 25% alpha, dialog scrim at 82-85%.
- **Soft Ink** (tinta-soft): secondary text and hints on white and mesa.
- **Mesa** (mesa): the cool near-white of work surfaces (body background) and the outline-button hover.
- **Label Stock** (papel, papel-deep): only the "Etiqueta" template color; not a UI surface.

### Status
- **Leaf Green** (hoja, hoja-soft): success only. **Amber Notice** (aviso, aviso-soft): warnings and demo limitations only.

### Named Rules
**The Green Is Success Rule.** Leaf green never decorates; it means done.
**The Corrected Ink Rule.** Restaurant colors are data. Text must reach 4.5:1 and seal ink 3:1 against the card ground, else the UI substitutes keyline ink or white (see `readableOn`).
**The Stock Rule.** Cream is a restaurant template, not chrome. Never use it as a page, panel or pane background.

## Typography

**Display Font:** Bricolage Grotesque, 700 and 800 (with system-ui fallback)
**Body Font:** Geist (with system-ui fallback)

**Character:** A characterful, tightly tracked grotesque for what shouts (names, headlines, numerals) over a neutral, legible sans for everything the user reads. Labels are sentence case and semibold; nothing is uppercase or letter-spaced.

### Hierarchy
- **Display** (800, clamp(2.6rem, 7.5vw, 4.8rem), 1.04, -0.025em): the home hook headline only.
- **Headline** (800, 2rem rising to 2.4rem at sm, 1.04): page titles (admin, dashboard, join); stat numerals use 2.2rem.
- **Title** (800, 1.3-1.6rem, 1.1): restaurant name on the card (1.4rem), pane titles (1.6rem), result headings (1.7rem), nav wordmark (1.3rem), dialog title (1.5rem).
- **Subtitle / row title** (Geist 700, 1.35rem and 1.05rem): customer name in a scan result, reward and list row titles.
- **Lead** (Geist 400, 1.15-1.25rem, 1.375): the paragraph under the home headline, max-w-xl.
- **Body** (Geist 400, 1rem, 1.5): all prose; keep to about 65ch.
- **Label** (Geist 600, 0.95rem, no tracking, sentence case): field labels, nav tabs, buttons at 1rem semibold, hints at 0.9rem.
- **Caption** (Geist 600, 0.75-0.85rem): "Premio" tag, QR dialog caption.

### Named Rules
**The Headline Face Is For Names Rule.** Bricolage Grotesque carries the restaurant name, page titles, pane titles and numerals. Never body copy, never buttons or form text.
**The Sentence Case Rule.** Labels are sentence case, semibold, untracked. No uppercase tracked small print.

## Layout

Phone-first, one column. Controls are at least 48px tall (small 40px, nav and tap targets 44px). Work pages use a centered container up to max-w-6xl with 12-20px gutters rising to 32px at sm; the customer card column is capped near 24-26rem; reading blocks cap at max-w-xl. The home page is a headline and lead above a grid of three panes (one column on phones, three from md, min-height 19rem at sm). The stamp grid uses 12px by 14px gaps and cells up to 4.4rem. The customer card page is a full-height column.

## Elevation & Depth

Soft and shallow. Panels sit on 1px hairlines; cards and hovered panes lift with a two-layer soft shadow tinted with ink. Depth never comes from glows, blurs on text or hard offsets.

### Shadow Vocabulary
- **Soft** (`--shadow-soft: 0 1px 2px rgb(16 20 58 / 0.06), 0 10px 28px -14px rgb(16 20 58 / 0.28)`): resting panels on mesa.
- **Lift** (`--shadow-lift: 0 2px 4px rgb(16 20 58 / 0.08), 0 24px 48px -20px rgb(8 12 50 / 0.55)`): stamp card, dialog, hovered home panes.
- **Card edge** (`0 0 0 1px rgb(255 255 255 / 0.3)` plus Lift): separates a restaurant card from the ground when their colors are close.
- **Focus ring** (`outline: 3px solid canario; outline-offset: 2px`): on ultramarine surfaces; inside `.on-mesa` the outline is ultramarine.

### Named Rules
**The Soft Lift Rule.** Only two shadows exist. Use them as written; never invent a third or add a hard offset.

## Shapes

Generous rounding: 12px controls (rounded-xl), 16px panels and inner panels (rounded-2xl), 24px cards, dialogs and home panes (rounded-3xl), full pills for progress bars and step markers, circles for seals and reward markers. Borders are 1px hairlines in ink at 25% (controls) or card ink at 16% (card dividers); step and reward markers use 2px rings. Seals are circles: an outline with the number when empty, a filled disc with a round-capped check when stamped, a second outer ring for reward stamps.

## Components

### Buttons
- **Shape:** 12px radius, 48px tall (small 40px), 20px horizontal padding, semibold 16px Geist, sentence case.
- **Primary:** tomato fill, white text, tomato-deep on hover.
- **On ultramarine:** canary fill with ink text (primary), or a 1px white/35 outline on white/10 (secondary).
- **Ink:** keyline-ink fill, white text, hover to ultramarine deep (Wallet, confirmations).
- **Outline:** white fill, 1px ink/25 border, border darkens and fill turns mesa on hover.
- **Press and disabled:** scale 0.98 over 150ms; disabled at 55% opacity.

### Inputs / Fields
- White fill, 1px ink/25 border, 12px radius, 48px height, 14px side padding. Hover darkens the border; focus shifts it to ultramarine with a 4px ultramarine 15% ring. Labels are 0.9rem semibold above the field; hints in soft ink below.

### Navigation
- Ultramarine bar. Wordmark is the canary scalloped seal with ultramarine star plus Bricolage text (text hidden on phones). Tabs are sentence-case semibold, 44px tall, 12px radius, with an 18px icon from sm; the active tab is canary with ink text, others white with a faint white hover.

### Home Panes
- Three 24px panes (Configurar white, Escanear canary, Dashboard deep blue), each with a flat illustration, 1.6rem title, short text and an "Abrir" arrow; they rise 4px on hover with the Lift shadow.

### Stamp Card (signature)
- Restaurant-colored 24px card with a hairline edge and Lift shadow: logo tile or initial (48px, 16px radius), name in Bricolage, visits line, a grid of round seals (rewards get a double ring and a "Premio" tag), then an inner 16px panel with the stamp count, next-reward text and an 8px progress bar, and a divided list of rewards with round markers. A new stamp lands with scale 1.55 and rotation -14 deg settling over 0.7s, with a ghost outline offset 7px/6px that fades.

### Steps
- Round 32px markers with 2px borders joined by a 2px line; done is canary with a check, current is canary-outlined, upcoming is white/40.

## Do's and Don'ts

### Do:
- **Do** put one tomato (or, on ultramarine, one canary) action per view.
- **Do** show progress as round seals filled in order, with the progress bar beneath.
- **Do** run all restaurant colors through the contrast guard before painting text or seals.
- **Do** keep motion to the stamp landing and the rise-in, and honor prefers-reduced-motion (animations off, transitions near-zero).
- **Do** use mesa and white fields on work surfaces.

### Don't:
- **Don't** use a dark-slate wallet card with gold stars; that is the refused alternative.
- **Don't** add sunburst rays, ribbon banners, paper texture, text shadows or scalloped seals to the UI; the scalloped seal is the wordmark only.
- **Don't** set body copy, buttons or form text in Bricolage Grotesque.
- **Don't** use uppercase or letter-spaced labels.
- **Don't** use leaf green or amber as decoration.
- **Don't** use label cream as a page or panel background.
