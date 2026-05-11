import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { schemaTypes } from './sanity/schemas'

/**
 * Sanity Studio configuration.
 *
 * Studio is mounted at `/studio` via the Next.js App Router route group
 * (see `src/app/studio/[[...tool]]/page.tsx`). Project + dataset come from
 * env vars so the same config powers `sanity dev` / `sanity build` locally
 * as well as the embedded Studio route in Vercel.
 */
export default defineConfig({
  name: 'portfolio',
  title: 'Portfolio CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
