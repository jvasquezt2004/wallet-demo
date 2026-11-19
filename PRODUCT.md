# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Restaurant owners (primary audience of the demo).** They are shown the product to decide whether a digital stamp card is worth adopting. They judge it by how good the customer's card feels in the hand and how little work it takes behind the counter.
- **Diners / customers.** Scan a QR at the restaurant on their phone, give a name and email, and get a stamp card they can keep in Google Wallet. They are casual, on mobile, often standing at the counter, with no appetite for installing an app.
- **Restaurant staff.** Scan the customer's QR (or type the 8-character code) at the counter to add a stamp, one customer after another, often in a rush.

## Product Purpose

Sello Club is a digital stamp-card loyalty program for restaurants. The customer registers from a QR/link, gets a card with a QR, and saves it to Google Wallet. Staff scan the QR to add a stamp; rewards unlock at configured stamp counts. The owner configures branding and rewards in /admin and watches visits, new customers, frequency and lapsed customers in /dashboard. Success for the demo: an owner sees the whole loop in a minute and believes their customers would actually use it.

## Positioning

No app download and no plastic cards: the card lives in the diner's Google Wallet and is stamped by a QR scan, with a branded card the restaurant configures itself. Single-restaurant demo (one restaurant per deployment).

## Operating Context

- Spanish-language UI (`lang="es"`). Copy stays in Spanish.
- Customers and staff use phones; the scanner uses the camera via `BarcodeDetector` (Chrome Android) over HTTPS, with a manual-code fallback.
- Owners use /admin and /dashboard, likely on a laptop but possibly phone.
- Routes: `/` menu, `/admin`, `/c/<slug>` customer join + card, `/scan` staff scanner, `/scan/<customerId>` confirm when a Wallet barcode is opened, `/dashboard`.
- Google Wallet issuer is in demo mode (passes marked `[TEST ONLY]`, only Developer/test accounts can add them). Without credentials the in-app card + QR still works.

## Capabilities and Constraints

- Next.js 16 App Router, Tailwind v4, SWR, Prisma + Postgres, Google Wallet API. See AGENTS.md: this Next.js version has breaking changes; read `node_modules/next/dist/docs/` before writing code.
- This work is **frontend only**: route handlers, Prisma schema, `lib/loyalty.ts`, `lib/wallet.ts` and API request/response shapes do not change. UX flow (steps, states, copy, layout) may change as long as it uses the same API calls.
- Business rules that the UI must reflect, not alter: one stamp per customer per day (duplicate scans return `ALREADY_SCANNED`); multiple rewards per restaurant, each with its own stamp threshold; the card resets when the highest reward is completed; returning customers recover their card by using the same email.
- Restaurant branding (bg/primary/text colors, logo, template) is user-configured data; customer-facing card must render correctly with any chosen colors.

## Brand Commitments

Name: **Sello Club**. Tagline in current copy: "Lealtad que cabe en el bolsillo." Voice: warm, direct, Spanish. No other binding brand constraints.

## Evidence on Hand

No testimonials, customer logos, metrics or pricing exist; none may be invented. Real data comes only from the database (visits, customers).

## Product Principles

1. The customer's card is the product; every other screen serves it.
2. Zero-friction for diners: no app, no password, minimum fields, one obvious next action.
3. Staff screens work one-handed at a busy counter: fast, glanceable, forgiving.
4. The restaurant's own branding leads on the card; Sello Club stays out of its way.
5. Demo limitations (test-only passes, missing credentials) are stated honestly and never block the core in-app card.

## Accessibility & Inclusion

No formal standard stated. Treat WCAG AA contrast, visible focus, touch targets, and reduced motion as baseline. Restaurant-configured colors can fail contrast, so the UI should guard against that where it can.
