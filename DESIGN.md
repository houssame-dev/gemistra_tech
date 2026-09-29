# DESIGN.md — Gemistra Tech website

This file is the source of truth for all UI work on this project. Read it fully before changing any component, style or copy. If a request conflicts with this file, follow the request and tell the owner which rule you broke and why.

**Product:** marketing site for Gemistra Tech, a small digital-services studio in Casablanca, Morocco (SaaS, websites, mobile apps, AI and automation, chatbots, SEO). Audience: business owners and decision makers in Morocco, Europe and North America who are deciding whether to trust a young studio with a project.
**Primary job of the site:** get the visitor to send the contact form (or WhatsApp message).
**Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, next-intl (en, fr, ar with RTL), lucide-react, embla-carousel-react.
**Feel:** bold tech, dark, precise, calm. Professional first. The one memorable element is the "facet cut" corner. Everything else stays quiet and disciplined.

---

## 1. Design tokens

Only use tokens from `tailwind.config.ts`. Never introduce a new hex value in a component. If a color is missing, ask.

### Color
| Token | Hex | Use |
|---|---|---|
| `bg` | #05060A | page background |
| `surface` | #0D0F16 | alternate section background, cards |
| `elevated` | #12141C | inputs, raised elements |
| `border` | #22242E | default borders, dividers |
| `border-hover` | #33364A | hovered neutral borders |
| `violet` | #7C5CFF | primary accent, buttons, links, active states |
| `violet-dim` | #5B41C7 | primary button hover |
| `teal` | #22E1C9 | secondary accent: status dots, success, small highlights |
| `ink` | #F5F5F7 | headings and primary text |
| `ink-secondary` | #C4C6D0 | body text |
| `ink-muted` | #8A8D9A | captions, metadata |
| gold | #D4AF37 | reserved, do not use unless the owner asks |

Rules:
- Headings and names are always `ink`. Never yellow, never a raw color.
- Violet is for actions and active states. Teal is for status and small highlights. Never use both as large fills in the same view.
- Body text is `ink-secondary` on `bg` or `surface`. Never use `ink-muted` for text that must be read (only captions and metadata).
- White text on a `violet` fill measures about 4.3:1, just under WCAG AA for small text. Button labels on violet must be 16px or larger and font-medium or heavier. Hover (`violet-dim`) passes.
- Alternate section backgrounds between `bg` and `surface` to separate sections. Do not add gradients to sections except the hero glow (`bg-facet-glow`).
- Text must never sit on a background with less than 4.5:1 contrast (3:1 for text 24px and larger).
- Colors used outside Tailwind, including the generated icon and global error page, come from `lib/tokens.ts`. `tailwind.config.ts` imports that shared source; components contain no raw hex values.

### Typography
- Headings: Space Grotesk, weights 500 and 700 only. Body and UI: Inter, weights 400, 500, 600 only. Do not add fonts or weights.
- Arabic typography exception: when `lang="ar"`, headings, body and UI all use one Arabic family, Noto Sans Arabic, at weights 400, 500, 600 and 700. It is loaded only for the Arabic locale. Arabic body text uses a 1.8 line-height and Arabic text has no letter-spacing. English and French keep Space Grotesk and Inter unchanged.
- Type scale (mobile / desktop). Use these and nothing else:

| Role | Mobile | Desktop (lg+) | Weight | Line height |
|---|---|---|---|---|
| Hero h1 | 40px | 72px | 700 | 1.1 |
| Section h2 | 30px | 44px | 700 | 1.15 |
| Card h3 | 18px | 20px | 700 | 1.3 |
| Lead paragraph | 17px | 19px | 400 | 1.6 |
| Body | 15px | 16px | 400 | 1.65 |
| Small / caption | 13px | 14px | 400–500 | 1.5 |
| Button label | 15px | 16px | 500 | 1 |

- Line length: paragraphs max 65 characters (`max-w-prose` or `max-w-xl`). Never let body text span the full container.
- Headings use `text-balance`. Sentence case everywhere. No ALL CAPS for headings or buttons.
- Small labels above a section heading (eyebrows) are optional, sentence case, `text-sm`, `teal`, and only where they add information the heading does not. An eyebrow may use `ink-muted` when an owner decision intentionally keeps accent-colored phrases out of that section, as in Why Gemistra Tech. Remove eyebrows that only restate the heading; Team, Testimonials, Work, FAQ and Contact do not use them.
- Use at most one accent-colored phrase per page, and only in the hero heading.

### Spacing
Use the 4px scale only: 4, 8, 12, 16, 24, 32, 48, 64, 96. In Tailwind: `1, 2, 3, 4, 6, 8, 12, 16, 24`. No arbitrary values like `mt-[37px]`.

| Where | Value |
|---|---|
| Section vertical padding | 96px desktop (`py-24`), 64px mobile (`py-16`) |
| Section heading block to content | 48px (`mt-12`) |
| Heading to its intro paragraph | 16px (`mt-4`) |
| Card padding | 24px (`p-6`), 32px (`p-8`) for large cards |
| Gap between cards in a grid | 20px (`gap-5`) or 24px (`gap-6`), one value per grid |
| Inside a card: icon to title | 16px, title to description 8px, description to list 16px, list to footer/links 24px |
| Page side padding | 24px (`container-page`) |

### Radius, borders, shadows
- **No rounded rectangles for cards and buttons.** The shape language is the facet cut (below). Fully round (`rounded-full`) only for dots, avatars and circular icon badges.
- Inputs use square corners with a 1px `border`.
- Borders are 1px. No shadows, no blurred glows on cards. Depth comes from background tone (`bg` to `surface` to `elevated`) and borders.
- The only glow allowed is the hero background (`bg-facet-glow`).

---

## 2. Signature: the facet cut

The clipped-corner shape (top-right and bottom-left corners cut) is the one memorable element. It is defined in `app/globals.css` as `.facet` (20px cut), `.facet-sm` (12px cut) and `.facet-border` (1px gradient border that turns violet-to-teal on hover).

- Cards, buttons, form containers, logo frames, map frame: `facet` + `facet-border` (large) or `facet-sm` (small elements: badges, buttons in the navbar).
- Do not invent other cut shapes, angles or ribbons. No rotated elements.
- Because `clip-path` clips everything, never place anything that must overflow (tooltips, ribbons, shadows, dropdowns) inside a facet element.
- `.facet-border` uses a pseudo-element; the element needs `position: relative`.
- The cut mirrors in RTL. Check it.

---

## 3. Layout

- Container: `.container-page`, max 1180px, centered, 24px side padding. All section content sits inside it. Only full-bleed decorative elements (marquee track, section backgrounds) may sit outside, and they must be clipped by an `overflow-hidden` parent.
- Every homepage section: `min-h-screen`, content centered vertically (`flex items-center`) and horizontally. On mobile, if content is taller than the viewport, the section grows; never clip content or force a fixed height.
- Section headers are centered: label (optional), h2, intro paragraph, all inside `max-w-2xl mx-auto text-center`.
- Grids: 1 column below 640px, 2 at `sm`, 3 at `lg`. Six services = 3 x 2. Process is 1 column on mobile, 2 at `md`, and 4 at `lg`. Items in a grid share one height (`items-stretch`, cards `h-full`).
- Orphans: when a grid has an incomplete last row, center it (`justify-center` with flex-wrap) rather than left-aligning.
- Content is centered as a block. Inside cards, text alignment is consistent per card type: icon badge, title and text centered for feature cards, or all left for text-heavy cards, but the same across all cards in a section.
- No horizontal scroll at any width. `html, body { overflow-x: hidden }` is a safety net, not the fix. Find and fix the cause.
- Breakpoints to verify: 375, 768, 1024, 1440px.

Section order: Hero, Trusted by, Services, Why Gemistra Tech, Process, Team, Testimonials, Work, FAQ, Contact, Footer.

---

## 4. Components

### Buttons
Two styles only, both `facet` shaped, height 48px (44px minimum tap target), horizontal padding 24px.
- **Primary:** `violet` fill, white label, hover `violet-dim`.
- **Secondary:** transparent, 1px `border-hover` border, `ink` label, hover border and label `teal`.
- Navbar CTA is the primary style at `facet-sm`, height 40px.
- Never use an arrow character in the label. Label says what happens: "Start a project", "Send message", "View project".
- Disabled: 60% opacity, no hover change.
- Cookie-banner buttons are 44px high; this is the tap-target-only exception to the standard 48px button height.
- Exception: the floating WhatsApp button is 56px, facet-shaped, with a `teal` fill and dark `ink` icon. It has no shadow or glow, stays fixed in the bottom corner, and must not overlap the cookie banner or scroll-to-top button.

### Icon badges
- Same treatment everywhere (Services, Why us, Process, Contact): 48px (`h-12 w-12`) square or circle, `violet-soft` background, `violet` icon, lucide icon at 24px with stroke 1.75.
- Process step numbers use a larger 56px badge with the number in Space Grotesk 700 (this is the one place numbering is correct, because the content is a sequence).
- Icons are decorative: `aria-hidden="true"`.

### Cards
- A card uses the opposite tone of its section: `bg-surface` on sections with `bg` background, `bg-bg` on sections with `surface` background.
- Feature card (Services, Why us, Process): `facet facet-border p-6`, with its background set by the opposite-tone rule above; structure icon badge, h3, description, optional bullet list, optional link.
- Bullets use a 6px `violet` square marker, `ink-secondary` 14px text, 8px between items.
- Hover: border gradient only (via `.facet-border:hover`). No lift, no scale, no shadow.
- Project card: 16:9 image area on top (placeholder is a `surface`/`elevated` gradient with a lucide icon), then category and status on one row, h3, summary (2 lines max, clamp), service tags, link.
- Team card: `w-team-card` (280px) wide, with equal height supplied by stretched carousel slides so filled and open-position cards match without a fixed pixel height. Photo area 4:5 on top (placeholder: `elevated` with a user icon), then name (h3, `ink`), role (violet, 14px), bio (14px, 3 lines max), social icons. Open-position cards use a dashed `border-hover` border and a "We're hiring" tag.
- Tags and badges: `facet-sm`, 1px border, 12px text, 8px x 4px padding.

### Navbar
- Sticky, height 64px (80px on desktop if the logo needs it). Transparent with no border at scroll position under 10px. After that: `bg-bg/80 backdrop-blur` and bottom `border`. Short linear color transition only.
- Layout: logo lockup left, links centered, language switcher and primary CTA right. Active section link is `violet`.
- Mobile: hamburger opens a full-screen menu (100vh, `bg-bg`), with links at 24px, language switcher, email and social icons. Body scroll is locked while open and released on every exit path. Focus is trapped in the menu and returns to the toggle on close.

### Logo
- Transparent PNG at `public/logos/gemistra-logo.png` with the "Gemistra Tech" wordmark beside it. No container, no background. Header height 32 to 40px, footer 32px. Always via `next/image` with explicit width and height.

### Forms
- Label above every field (never placeholder-only), 14px `ink-secondary`, 8px gap to the input.
- Inputs: `elevated` background, 1px `border`, 12px x 16px padding, 16px text (prevents iOS zoom), 48px height, textarea min 120px. Focus: `violet` border plus a 2px violet outline offset 2px. Error: red-400 border and message under the field with `role="alert"`.
- 16px between fields. The submit button is full width inside the card.
- Success state replaces the form with a confirmation panel. Validation errors and server errors use different messages.

### Carousel (Team)
- embla-carousel, `direction` set from locale. One card per snap. Arrows are two identical 48px `facet-sm` buttons: beside the cards on desktop, centered in a row below on mobile. Disabled state at the ends. Edge fades use the background color of the section they sit in. `aria-label`s translated.

### Marquee (Trusted by)
- Pure CSS, seamless (set duplicated), slow (40 to 60s per loop), pauses on hover, disabled under `prefers-reduced-motion`. Logo cards are `facet-border` frames with 24px padding, logo at least 64px tall, grayscale at 60% opacity by default and full color on hover. Left and right edges fade with gradients matching the background color of the section they sit in. The wrapper is `overflow-hidden`.

### Footer
- Multi-column: brand and tagline, quick links, services, contact and social, with the language switcher inside the footer columns. The bottom row contains only the copyright and legal links, separated by a `border-t`. Text `ink-secondary` for links, `ink-muted` for copyright.

---

## 5. Motion

- Interaction transitions: none, or `linear` and 75ms maximum. No easing curves on hover.
- One entrance animation: sections fade and slide up 16px once on entering the viewport, 400ms, not on the hero, not on repeat scroll. Removed entirely under `prefers-reduced-motion`.
- The marquee is the only continuous motion. No parallax, no floating elements, no looping decoration.
- Anything that moves in response to a click (menu opening, accordion expanding, form success) may animate briefly to show what changed.
- Status dots and skeleton loaders are static. Do not use ping or pulse animations.

---

## 6. Accessibility

- Visible keyboard focus on every interactive element (`focus-ring` class: 2px violet outline, 2px offset). Never `outline-none` without a replacement.
- One `h1` per page (the hero). Headings descend in order.
- Landmarks: `header`, `nav` (with `aria-label`), `main#main-content`, `footer`. Skip link is the first focusable element.
- Buttons, icon buttons and form fields have tap targets of at least 44px. Inline text links inside paragraphs or link lists are exempt, but need at least 8px between them. Contrast per the color rules above.
- Images have meaningful `alt`. Decorative icons and shapes have `aria-hidden="true"`.
- The accordion uses `button` elements with `aria-expanded` and `aria-controls`. The mobile menu toggle uses `aria-expanded`.
- Everything works with keyboard only and with `prefers-reduced-motion`.

---

## 7. Internationalization and RTL

- All visible text lives in `messages/en.json`, `fr.json`, `ar.json`. No hardcoded strings in components. Add keys to all three files together.
- All project text—name, category, summary, description, status labels and service tags—lives in the message files. `lib/projects.ts` holds only structure: slug, year, image and translation keys.
- Arabic sets `dir="rtl"` on `<html>`. Use logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`, `start-`, `end-`) instead of `ml-`, `mr-`, `left-`, `right-`, `text-left`, `text-right`.
- Icons that imply direction (chevrons, arrows) flip in RTL. Logo, phone numbers, email addresses and code stay left-to-right (`dir="ltr"`).
- French text runs about 20% longer than English: no fixed widths on buttons and labels, and test the navbar at 1024px in French.
- Arabic needs a font with Arabic glyphs. Use a fallback such as Noto Sans Arabic or Cairo for `lang="ar"` so it doesn't render in a random system font.

---

## 8. Copy

- Sentence case. Plain verbs. Short sentences. Speak to the client's outcome, not the studio's process.
- Buttons say what happens ("Send message"), and the same action keeps the same name through the flow.
- Errors say what went wrong and how to fix it. Empty states say what to do next.
- No invented numbers, clients or testimonials in production copy. Placeholders are allowed only when visibly marked in code with a `PLACEHOLDER` comment. Current placeholders: WhatsApp number, social URLs, the 30-day support period, legal pages, FAQ answers, the example project.

---

## 9. Never do

- Add a color, font, font weight, shadow, gradient or radius not defined above.
- Use arbitrary Tailwind values (`w-[317px]`, `mt-[13px]`, `text-[17px]`) unless the value comes from the tables above.
- Rotate elements, add ribbons, add hover lift or scale, add easing.
- Put text directly on an unpredictable background without checking contrast.
- Left-align a section that is meant to be centered, or mix alignments inside one grid.
- Create a component that duplicates an existing one. Extend the existing component instead.
- Hardcode text, or use `left/right` where a logical property exists.
- Use `outline-none` without a visible replacement.
- Report a UI change as done without checking the result in a browser.

---

## 10. Definition of done for any UI change

1. Uses only tokens, scale values and components from this file.
2. Checked at 375, 768, 1024 and 1440px, with no horizontal overflow and nothing clipped or overlapping.
3. Checked in English, French and Arabic (RTL).
4. Keyboard: tab through the change, focus is visible, Escape closes overlays.
5. `npm run build` and `npx next lint` pass.
6. Screenshots of the changed area at 375px and 1440px reviewed against this file (use Playwright if available).
7. The final report lists what changed, files touched, anything not verified, and any rule deliberately broken.
