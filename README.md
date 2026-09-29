# Gemistra Tech

Marketing site for Gemistra Tech — built with Next.js 14 (App Router), TypeScript,
and Tailwind CSS. No backend: the contact form posts directly to Formspree
from the browser.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `app/page.tsx` — the single scrolling homepage (Hero, Services, Why us,
  Process, Team, Work, Contact)
- `app/projects/[slug]/page.tsx` — one page per case study, generated at
  build time from `lib/projects.ts`
- `components/` — one file per homepage section
- `lib/projects.ts` — structural project entries only (slug, year, image, and
  message/status keys). To add a project, add one entry there and one matching
  translated block in each of `messages/en.json`, `messages/fr.json`, and
  `messages/ar.json`.

## Before you launch

1. **Contact form** — create a form at [formspree.io](https://formspree.io)
   and paste your endpoint URL into `FORMSPREE_ENDPOINT` in
   `components/Contact.tsx`.
2. **Real email/address** — update the placeholder contact details at the
   bottom of `components/Contact.tsx`.
3. **Favicon & OG image** — drop a `favicon.ico` into `public/`, and add an
   Open Graph image if you want rich link previews.
4. **Domain** — point your domain at Vercel once deployed (see below).
5. **Team photos** — `components/Team.tsx` currently uses initials in
   place of headshots; swap in real photos once you have them.

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — no config needed. Click Deploy.
4. Add your custom domain under Project Settings → Domains.

## Design tokens

Colors and fonts are defined in `tailwind.config.ts`:

- Background `#05060A`, surface `#0D0F16`
- Primary accent (violet) `#7C5CFF`, secondary accent (teal) `#22E1C9`
- Headings: Space Grotesk · Body: Inter (both loaded via `next/font/google`)

The signature visual motif is the "facet cut" — a clipped-corner shape
(`.facet` / `.facet-sm` / `.facet-border` in `app/globals.css`) used on
cards and buttons instead of standard rounded rectangles, echoing a cut
gem for the Gemistra Tech name.
