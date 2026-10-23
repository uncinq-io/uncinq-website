# Uncinq website

Marketing site for Uncinq. Next.js 16 (App Router) · React 19 · Tailwind v4 ·
Motion · MDX content · Resend for the contact form.

## Running locally

```bash
npm install
cp .env.example .env.local   # then fill in the Resend values
npm run dev
```

The contact form returns a 503 with a "temporarily unavailable" message until
`RESEND_API_KEY` and `CONTACT_FROM_EMAIL` are set. Everything else works
without any environment variables.

## Commands

| Command         | What it does                                        |
| --------------- | --------------------------------------------------- |
| `npm run dev`   | Dev server, includes draft case studies             |
| `npm run build` | Production build, excludes drafts                   |
| `npm run start` | Serve the production build                          |
| `npm run lint`  | ESLint                                              |

## Writing case studies

Case studies are MDX files in `src/content/work/`. Copy
`example-case-study.mdx` and edit the frontmatter:

```yaml
title: "Rebuilding a settlement pipeline"
client: "Acme Financial"
summary: "One sentence that makes someone want to read on."
year: 2025
services: ["Product engineering", "Cloud & platform"]
cover: "/work/acme.jpg" # optional, lives in public/
metrics:
  - label: "Batch runtime"
    value: "−94%"
draft: true # flip to false to publish
order: 100 # higher sorts first
```

Frontmatter is validated at build time — a typo fails the build with a message
naming the file and field, rather than shipping a broken page.

**Drafts** (`draft: true`) appear in `npm run dev` but are stripped from
production builds, excluded from the sitemap, and marked `noindex`. New case
studies should start as drafts so nothing unverified reaches the live site.

Inside the body you can use `<Metrics items={[...]} />` and `<Callout>` without
importing them — see `src/components/mdx-components.tsx`.

## Structure

```
src/
  app/              routes; api/contact is the only server-rendered one
  components/
    home/           homepage sections
    motion/reveal   the single scroll-animation primitive
    ui/             Container, Button, Section
  content/work/     case studies (MDX)
  lib/
    site.ts         company facts — edit here, not in components
    services.ts     service definitions, shared by home and /services
    content.ts      MDX loading + frontmatter validation
```

Design tokens (colours, fonts, easings) live in the `@theme` block at the top
of `src/app/globals.css`.

## Deploying to Render

The repo includes `render.yaml`. Create a Blueprint from it, or a Web Service
with:

- **Build**: `npm ci && npm run build`
- **Start**: `npm run start`

Set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL` in the
Render dashboard.

Note that Render's **free** web service tier spins down after inactivity, which
means a 30–60 second cold start for the first visitor. Use a paid instance for
production.

### Switching to a static site later

Every route except `/api/contact` already prerenders as static. To move to
Render's free Static Site tier:

1. Delete `src/app/api/contact/route.ts` and point `ContactForm`'s `fetch` at a
   client-safe form service (Web3Forms, Formspree). Resend cannot be called
   from the browser — its API key must stay server-side.
2. Add `output: "export"` and `images: { unoptimized: true }` to
   `next.config.ts`.
3. Change the Render service to a Static Site publishing `out/`.

## Before launch

- [ ] Verify `uncinq.io` as a sending domain in Resend, then set
      `CONTACT_FROM_EMAIL` to an address on it
- [ ] Add `public/og.png` (1200×630) — social cards reference it
- [ ] Add a favicon to `src/app/`
- [ ] Publish at least one real case study
- [ ] Confirm the stats in `src/components/home/stats.tsx` are accurate
- [ ] Add a privacy policy page and re-link it in the footer
- [ ] **Delete the orphaned demo pages on the current WordPress site**
      (`/about/` and `/services/` contain unedited theme placeholder content)
