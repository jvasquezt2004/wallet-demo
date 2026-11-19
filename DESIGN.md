---
name: Sello Club
description: Digital stamp cards printed like prize produce-crate labels, each stamp a scalloped grade seal.
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
    fontFamily: "Bowlby One, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 9vw, 4.6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Bowlby One, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.005em"
  title:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Barlow Condensed, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    letterSpacing: "0.09em"
rounded:
  card: "10px"
  control: "8px"
  pill: "9999px"
spacing:
  control-height: "48px"
  control-height-small: "40px"
  control-x: "20px"
  field-x: "14px"
  card-x: "20px"
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
    backgroundColor: "transparent"
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
  stamp-card:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.card}"
    padding: "28px 20px 0"
---

# Design System: Sello Club

## Overview

**Creative North Star: "Etiqueta de Caja"**

Every restaurant's stamp card is printed like a prize produce-crate label, and each stamp is a grade seal inked onto it. The system is flat litho ink on a drenched ultramarine ground: no gradients of light, no soft shadows, only a few opaque inks and a near-black keyline. The world is recognisable with the copy removed: scalloped seals, a ribbon banner with notched tails, sunburst rays behind the label, 2px keylines.

Two registers coexist. Presentation surfaces (the home pitch, the customer join and card, the scanner viewfinder) sit on the ultramarine ground with rays and carry the label objects. Work surfaces (admin, dashboard, forms) sit on "mesa", a cool near-white, with ink-outlined controls; they borrow type, palette and one seal or banner move, nothing more. Label stock (`papel`) exists only inside label objects, never as a page background.

The restaurant's own colors lead on the card; the interface checks their contrast and corrects ink rather than trusting them. Sello Club's palette is the frame around the card, not the card's content.

**Key Characteristics:**
- Opaque litho inks, no blur shadows, no translucency except dialog scrim and hover tints.
- Heavy lettering face reserved for names, banners and numerals; everything read is Barlow.
- Scalloped grade seal is the unit of progress; the star appears only inside an inked seal and the wordmark.
- One motion idea: the seal lands off-register and settles. Everything else is a single rise-in.

## Colors

Four inks plus a keyline and a leaf green: ultramarine ground, tomato action, canary highlight, cream label stock.

### Primary
- **Ultramarine Litho** (lito): the ground of presentation surfaces, the nav bar, the theme color, hover and focus border on fields, and the wordmark star.
- **Ultramarine Deep** (lito-deep) and **Ultramarine Soft** (lito-soft): the darker ink for ink-button hover; the lighter stripe of the sunburst rays against the ground.

### Secondary
- **Tomato Ink** (tomate): the one primary action on paper or mesa, large numerals in the route steps, the input caret and range accent. **Tomato Deep** (tomate-deep) is its hover.
- **Canary Yellow** (canario): primary action on ultramarine, the active nav tab, text selection, the focus ring, notice banners on the card.

### Neutral
- **Label Stock** (papel, papel-deep): the cream of label objects; also the 3px margin around the stamp card. Carries a 5px dot-grain texture (tinta at 9%).
- **Keyline Ink** (tinta): all text, 2px borders, outline buttons, ink button fill, dialog scrim at 82%.
- **Soft Ink** (tinta-soft): secondary text and hints on mesa and paper.
- **Mesa** (mesa): the cool near-white of work surfaces (body background).

### Status
- **Leaf Green** (hoja, hoja-soft): success only. **Amber Notice** (aviso, aviso-soft): warnings and demo limitations only.

### Named Rules
**The Stock Rule.** Label stock cream appears only on label objects. A page, a form or a dashboard panel on cream is wrong; use mesa.
**The Green Is Success Rule.** Leaf green never decorates; it means done.
**The Corrected Ink Rule.** Restaurant colors are data. Text must reach 4.5:1 and seal ink 3:1 against the card ground, else the UI substitutes keyline ink or white (see `readableOn`).

## Typography

**Display Font:** Bowlby One (with system-ui fallback)
**Body Font:** Barlow (with system-ui fallback)
**Label Font:** Barlow Condensed (with system-ui fallback)

**Character:** A fat, signboard lettering face for what a crate label shouts, paired with a sturdy grotesque for everything the user must read. Condensed caps do the small print.

### Hierarchy
- **Display** (400, clamp(2.4rem, 9vw, 4.6rem), 1.02): the home hook headline, with a second-ink offset.
- **Headline** (400, 1.7-2rem, 1): section headings, card total, route step numerals (2.6rem in tomato).
- **Title** (700, 1.2rem, 1.2): step and row titles in Barlow.
- **Body** (400, 1rem, 1.5): all prose; lead paragraphs step up to 1.15-1.25rem; keep prose to about 65ch (max-w-xl).
- **Label** (600, 0.72-0.95rem, 0.09em, uppercase, Barlow Condensed): field labels, nav tabs, stat labels, "Premio", step names.

### Named Rules
**The Lettering Is For Names Rule.** Bowlby One carries the restaurant name, banners, headlines and numerals. Never body copy, never buttons.
**The Second Ink Rule.** Large lettering may carry a hard 0.055em offset text-shadow in a second ink (tomato on ultramarine, ribbon shade on a banner): it reads as misregistered print. It is a text treatment only; boxes never get hard offset shadows.

## Layout

Phone-first, one column. Controls are at least 48px tall (small 40px, nav 44px) for one-handed counter use. Work pages use a centered container up to max-w-6xl with 12px gutters rising to 32px at sm; the customer card column is capped near 24-26rem; reading blocks cap at max-w-xl. On desktop the home composition stays centered with the four-step route laid out beneath the label. Vertical rhythm uses Tailwind steps (space-y-3 / 5, 24px section padding); the card's seal grid uses 10px by 12px gaps and cells up to 4.4rem. The customer card page is a full-height (100dvh) column.

## Elevation & Depth

Flat. Depth comes from keylines, overlap and ink contrast, not shadows. The only box-shadows are the focus halo and the 3px cream margin ring on the card. Overlap (the label card crossing the fold of the ultramarine ground) is the one depth gesture.

### Shadow Vocabulary
- **Focus ring** (`outline: 3px solid canario; outline-offset: 2px; box-shadow: 0 0 0 5px tinta`): on ultramarine and ink surfaces. Inside work surfaces the ring is ultramarine with a white halo.
- **Label margin** (`box-shadow: 0 0 0 3px papel`): the stock margin around the stamp card; zero blur.

### Named Rules
**The Flat Ink Rule.** No blurred shadows. If something must lift, overlap it or outline it.

## Shapes

Mostly rectangular with modest rounding: 8px controls, 10px label card, full pills for chips and step markers, circles for the logo medallion. The signature silhouettes are the scalloped seal (a 12-lobed circle, inner dashed or solid ring, star when inked) and the ribbon banner with notched, darker tails clipped by polygon. Borders are 2px keyline on controls and 3px on the medallion; the label carries an inner 1.5px frame inset 7px.

## Components

### Buttons
- **Shape:** 8px radius, 48px tall (small 40px), 20px horizontal padding, bold 16px Barlow.
- **Primary:** tomato fill, white text, deepens to tomato-deep on hover.
- **On ultramarine:** canary fill with ink text (primary), or 2px white/80 outline (secondary).
- **Ink:** keyline-ink fill, white text, hover to ultramarine deep (Wallet, confirmations).
- **Outline:** 2px keyline border, transparent, faint ink tint on hover.
- **Press and disabled:** 1px downward press, 150ms; disabled at 55% opacity.

### Inputs / Fields
- White fill, 2px keyline border, 8px radius, 48px height, 14px side padding. Hover and focus shift the border to ultramarine; focus adds a 4px ultramarine 20% ring. Labels are condensed caps above the field; hints in soft ink below.

### Navigation
- Ultramarine bar. Wordmark is the canary seal with ultramarine star plus Bowlby text (text hidden on phones). Tabs are condensed caps, 44px tall, 8px radius; the active tab is canary with ink text, others white with a faint white hover.

### Stamp Card (signature)
- Restaurant-colored ground inside a cream margin, sunburst tint behind, inset frame, logo medallion, ribbon banner carrying the name in lettering with second ink, "Para name" and visit count in condensed caps, a grid of seals (rewards get a double ring and a "Premio" tag), and a footer with next-reward progress in lettering. A new stamp lands with scale 1.55 and rotation -14 deg settling over 0.7s, with a ghost outline offset 7px/6px that fades.

### Steps
- Pill step markers (32px circles with 2px border) in condensed caps, current step inked.

## Do's and Don'ts

### Do:
- **Do** put one tomato (or, on ultramarine, one canary) action per view.
- **Do** keep stamps as scalloped seals and progress as seals filled in order.
- **Do** run all restaurant colors through the contrast guard before painting text or seals.
- **Do** keep motion to the stamp landing and the rise-in, and honor prefers-reduced-motion (animations off, transitions near-zero).
- **Do** use mesa and white fields on work surfaces and cream only on label objects.

### Don't:
- **Don't** use a dark-slate wallet card with gold stars, or a kraft-paper punch card; these are the refused alternatives.
- **Don't** use blurred drop shadows or glows; depth is overlap and keyline.
- **Don't** set body copy, buttons or form text in Bowlby One.
- **Don't** use leaf green or amber as decoration.
- **Don't** use label cream as a page or panel background.
