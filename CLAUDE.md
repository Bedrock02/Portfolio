# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
gatsby develop    # Start dev server at localhost:8000
gatsby build      # Production build to /public
prettier --write '**/*.js'   # Format all JS files
```

No tests are configured (`npm test` exits with an error).

## Architecture

This is a **Gatsby 4 static portfolio site** for Steven Jimenez. It is a single-page app with anchor-based navigation — there are only two actual routes: `/` (index) and `/404`.

### Styling approach

The project uses two styling systems side-by-side:

1. **CSS Modules** (`.module.css` files) — scoped styles per component
2. **Semantic UI Less** — globally customized via `src/semantic/`. The custom theme lives in `src/semantic/site/` (overrides defaults). Webpack resolves `../../theme.config$` to `src/semantic/theme.config` (see `gatsby-node.js`). The postinstall script (`scripts/semantic-ui-less-postinstall.js`) links the theme into Semantic UI's node_modules directory.

### Component data

Each component that renders content has a sibling `data.js` file (e.g., `src/components/WorkExperience/data.js`). Content changes go there — not in the JSX.

### Key components

- **Layout** — wraps every page; provides Header, Footer, background image, and SEO via React Helmet with a GraphQL `StaticQuery` for site title
- **WorkExperience** — employment timeline; each entry has logo, dates, title, description, and tech stack array
- **Hobbies** — uses `react-video-looper` for auto-playing looped videos

### Linting

ESLint uses the Airbnb config. Prettier config: no semis, single quotes, trailing commas in ES5 positions.
