# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint
npm run format       # Prettier (JS/TS/JSX/TSX)
npm test             # Jest with coverage
npm run sanity:dev   # Run Sanity Studio locally
npm run sanity:deploy # Deploy Sanity Studio
```

## Architecture

This is a **Next.js 14 portfolio site** for Steven Jimenez, using the App Router (`src/app/`). Content is managed via **Sanity CMS** with an embedded Studio route.

### Stack

- **Next.js 14** — App Router, deployed on Vercel
- **Sanity v6** — headless CMS; Studio mounted at `/studio` via `src/app/studio/[[...tool]]/page.tsx`
- **Tailwind CSS** — utility-first styling via `tailwind.config.ts`
- **TypeScript** — throughout

### Project structure

- `src/app/` — Next.js App Router pages (`layout.tsx`, `page.tsx`, `not-found.tsx`, `globals.css`)
- `src/components/` — React components (About, Chat, Footer, Header, Layout, Profile, Roles, Skills, WorkExperience, AnimatedButton)
- `src/lib/sanity/` — Sanity client singletons (`sanityClient` for CDN reads, `sanityPreviewClient` for draft-aware preview)
- `src/assets/` — static images and videos
- `sanity/` — Sanity schema definitions
- `sanity.config.ts` — Sanity Studio configuration (project ID and dataset from env vars)
- `scripts/` — seed scripts for Sanity content (`seed-footer-data`, `seed-role-entries`, `seed-skill-groups`)

### Content model

Content lives in Sanity. Seed scripts in `scripts/` populate initial data. Components fetch content via GROQ queries through the Sanity client.

### Linting

ESLint extends Airbnb config. Prettier config: no semis, single quotes, trailing commas in ES5 positions.
