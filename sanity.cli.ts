import { defineCliConfig } from 'sanity/cli'

/**
 * Sanity CLI configuration.
 *
 * Drives `sanity dev`, `sanity build`, `sanity deploy`, and the schema
 * validation step run from `npm run sanity:validate`. Project id and
 * dataset are pulled from the same env vars as the Studio config so
 * local + Vercel deploys stay aligned.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
})
