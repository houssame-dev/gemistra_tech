# Gemistra Tech Website Audit — Summary & Fix Plan

## Project Structure Summary

The project is a **Next.js 14 App Router** site with TypeScript and Tailwind CSS 3. Here's how it's organized:

| Layer | Files | Purpose |
|-------|-------|---------|
| **Config** | `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.mjs` | Standard Next 14 setup; Tailwind extends with brand colors (bg/surface/elevated/border, violet, teal, ink hierarchy), custom fonts via CSS variables, a `facet-glow` gradient, and a `max-w-content` (1180px) |
| **Layout** | [`app/layout.tsx`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/app/layout.tsx) | Loads Space Grotesk + Inter from Google Fonts, sets global metadata (title template, OG, metadataBase), renders `<Header>` + `{children}` + `<Footer>` |
| **Global CSS** | [`app/globals.css`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/app/globals.css) | Tailwind directives + custom `.facet` / `.facet-sm` / `.facet-border` clip-path classes (the brand's "cut gem" shape), `.container-page`, `.text-balance`, `.focus-ring`, and `prefers-reduced-motion` support |
| **Homepage** | [`app/page.tsx`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/app/page.tsx) | Composes 7 section components in order: Hero → Services → WhyUs → Process → Team → Work → Contact |
| **Components** | `components/` (9 files) | Header (sticky nav), Hero, Services (5-card grid), WhyUs (3-point grid), Process (4-step grid), Team (4-member grid), Work (project cards from `lib/projects`), Contact (Formspree form), Footer |
| **Data** | [`lib/projects.ts`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/lib/projects.ts) | Exports a `Project` type, a `projects` array (currently 1 placeholder entry), and `getProject(slug)` |
| **Dynamic route** | [`app/projects/[slug]/page.tsx`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/app/projects/%5Bslug%5D/page.tsx) | Static-params generated from `projects` array; renders project detail with `generateMetadata`, hero section, description, services list, and a CTA |
| **Public** | `public/` | **Empty** — no favicon, no OG image, no static assets |

---

## Build & Lint Results

| Check | Result |
|-------|--------|
| `npm run build` | ✅ Compiled successfully, 5 pages generated, no errors or warnings |
| `next lint` | ✅ No ESLint warnings or errors (after adding `.eslintrc.json` + `eslint-config-next@14.2.5`) |
| TypeScript | ✅ Strict mode, no type errors |

> [!NOTE]
> npm reports Next.js 14.2.5 has a known security vulnerability. This is noted below as a production concern.

---

## Issues Found

### 🔴 Bugs / Must-Fix Before Launch

#### B1. Formspree endpoint is a placeholder
[`components/Contact.tsx` L7](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Contact.tsx#L7): `FORMSPREE_ENDPOINT = "https://formspree.io/f/your-form-id"` — the form will POST to a non-existent endpoint and always fail with a network error or 404.

**Action needed from you**: Replace `your-form-id` with your actual Formspree form ID.

---

#### B2. Contact form error message conflates validation errors with network/server errors
[`Contact.tsx` L123-126](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Contact.tsx#L123-L126): Both "fields are empty" and "Formspree returned an error" show the same message: *"Fill in every field first, then try again."* — misleading when the actual cause is a server error.

**Fix**: I'll split into separate error states (`"validation-error"` vs `"server-error"`).

---

#### B3. `WhyUs` section is missing its anchor `id`
The Header links to `/#why-us` (implied by the nav list), but the WhyUs section in [`WhyUs.tsx`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/WhyUs.tsx) doesn't have an anchor `id` at all — nor does the Header actually link to it. **The "Why Us" section is unreachable via nav.** The header skips from Services → Process, missing Why Us entirely.

**Fix**: I'll add `id="why-us"` to the WhyUs section and add a nav link for it in the Header.

---

#### B4. No mobile navigation
[`Header.tsx` L22](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Header.tsx#L22): The nav uses `hidden md:flex`, so on mobile only the logo and "Start a project" button are visible. There's **no hamburger menu or alternative mobile nav**.

**This is a judgment call** — I'll flag it but not implement it without your approval since it's a structural/design change.

---

#### B5. Footer uses `Link` import but doesn't use it
[`Footer.tsx` L1](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Footer.tsx#L1): `import Link from "next/link"` is unused (all links are plain `<a>` tags). ESLint didn't catch this because the next/core-web-vitals config doesn't enable `no-unused-vars` for imports by default, but it's dead code.

**Fix**: I'll remove the unused import.

---

### 🟡 Accessibility Issues

#### A1. Hero status badge uses a decorative `<span>` without alt/aria
[`Hero.tsx` L6](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Hero.tsx#L6): `<span className="h-1.5 w-1.5 rounded-full bg-teal" />` — this green dot is decorative but should have `aria-hidden="true"` to be properly ignored by screen readers.

---

#### A2. Form inputs lack visible focus rings
The contact form inputs use `outline-none focus:border-violet` — removing the browser outline and only changing border color is subtle for keyboard users, especially on the dark background. Should use a visible focus indicator.

**Fix**: I'll add a box-shadow focus ring matching the brand.

---

#### A3. Team member initials divs are read by screen readers without context
The initials squares (HE, A, ?) in [`Team.tsx`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Team.tsx#L47-L55) are decorative — they should have `aria-hidden="true"` since the name is already in the `<h3>`.

---

#### A4. Submit button missing `focus-ring` class
[`Contact.tsx` L110-116](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Contact.tsx#L110-L116): The submit button doesn't have the `focus-ring` class that all other interactive elements use.

---

### 🟡 Production-Readiness Gaps

#### P1. No `favicon.ico` / OG image in `public/`
[`layout.tsx` L39](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/app/layout.tsx#L39) references `/favicon.ico` but `public/` is empty — browsers will 404 on the favicon. No OG image is provided either.

**Action needed from you**: Supply favicon and OG image files.

---

#### P2. No `robots.txt` or `sitemap.xml`
Essential for SEO. Next.js 14 supports these via `app/robots.ts` and `app/sitemap.ts`.

**Fix**: I'll add both.

---

#### P3. No custom `not-found.tsx` page
The default Next.js 404 page doesn't match Gemistra Tech's brand. A branded 404 would be much more polished.

**Fix**: I'll add `app/not-found.tsx` with matching dark style.

---

#### P4. Next.js 14.2.5 has a known security vulnerability
npm warns about this on install. Consider upgrading to a patched 14.x version.

**This is a judgment call** — flagging only. Upgrading could introduce breaking changes.

---

#### P5. Project detail page: `params` should be awaited in Next.js 14
In [`app/projects/[slug]/page.tsx`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/app/projects/%5Bslug%5D/page.tsx), `params` is accessed synchronously. In Next.js 14.x this works but logs a deprecation warning in dev mode. The build passed, so this is a minor concern but worth noting.

---

#### P6. `hello@gemistratech.com` in Contact section
[`Contact.tsx` L59](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Contact.tsx#L59): Is this a real, working email? If not, it should be updated before launch. Also, it's plain text — should be a clickable `mailto:` link.

---

#### P7. Footer copyright year is dynamic but uses client-side `new Date()`
[`Footer.tsx` L32](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Footer.tsx#L32): Since this is a server component, `new Date().getFullYear()` will be evaluated at **build time** for static pages. This is fine for a year-long period, but worth knowing — it won't update automatically at midnight on Jan 1st until a rebuild.

---

## Proposed Fixes (Clear-Cut Bugs Only)

I'll proceed with these fixes without asking:

### Fix List

| # | File | Fix |
|---|------|-----|
| 1 | [`Contact.tsx`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Contact.tsx) | Split error states (validation vs server error), add `focus-ring` to submit button, make email a `mailto:` link |
| 2 | [`WhyUs.tsx`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/WhyUs.tsx) | Add `id="why-us"` to the section |
| 3 | [`Header.tsx`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Header.tsx) | Add "Why us" nav link |
| 4 | [`Footer.tsx`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Footer.tsx) | Remove unused `Link` import |
| 5 | [`Hero.tsx`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Hero.tsx) | Add `aria-hidden="true"` to decorative dot |
| 6 | [`Team.tsx`](file:///c:/Users/Ultrapc/Desktop/Projects/gemistra/components/Team.tsx) | Add `aria-hidden="true"` to initials divs |
| 7 | `app/robots.ts` | Add robots.txt generation |
| 8 | `app/sitemap.ts` | Add sitemap.xml generation |
| 9 | `app/not-found.tsx` | Add branded 404 page |
| 10 | `globals.css` | Add visible focus styles for form inputs |
| 11 | `.eslintrc.json` | Already added (was missing) |

## Open Questions (Need Your Input)

> [!IMPORTANT]
> 1. **Formspree endpoint** — What's your actual Formspree form ID? (I can't fix this without it.)
> 2. **Mobile nav** — Should I implement a hamburger menu, or is mobile nav intentionally omitted for now?
> 3. **`hello@gemistratech.com`** — Is this a real email, or a placeholder to replace?
> 4. **Favicon/OG image** — Do you have these ready, or should I generate a simple placeholder favicon?
> 5. **Next.js upgrade** — Want me to upgrade to the latest patched 14.x?

## Verification Plan

### Automated Tests
- `npm run build` — confirm zero errors after all fixes
- `npx next lint` — confirm zero warnings

### Manual Verification
- Visual check of the 404 page in the browser
- Verify `robots.txt` and `sitemap.xml` render correctly at their URLs
