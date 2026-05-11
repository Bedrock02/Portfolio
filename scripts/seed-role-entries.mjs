#!/usr/bin/env node
/**
 * seed-role-entries.mjs
 *
 * Sub-AC 6.3 — Migrate legacy Roles data into Sanity `roleEntry` documents.
 *
 * Source of truth at time of migration:
 *   src/components/Roles/data.js     → `toolNames`, `leaderExamples`
 *   src/components/Roles/index.jsx   (pre-redesign, git commit 9f34352)
 *     → three role cards: Software Engineer, Public Speaker, Community Leader
 *
 * The redesign in commit 63bf0c5 collapsed the three-card grid into a bio
 * paragraph. Migrating the original card content into Sanity preserves the
 * documented schema shape and lets editors restore the grid in Studio without
 * code changes.
 *
 * Pipeline mirrors `seed-skill-groups.mjs`:
 *   1. Emits ./sanity/seed/roleEntries.ndjson (idempotent, stable _id per role).
 *   2. Optionally runs `sanity dataset import` when `--import` flag is passed.
 *
 * Usage:
 *   node scripts/seed-role-entries.mjs                    # write NDJSON only
 *   node scripts/seed-role-entries.mjs --import           # write + import production
 *   node scripts/seed-role-entries.mjs --import --dataset=staging
 *
 * Schema constraint notes (sanity/schemas/roleEntry.ts):
 *   - `tools` is required (min 1, unique). The Software Engineer role maps
 *     directly from `toolNames`. Public Speaker and Community Leader had no
 *     tool stack in the legacy UI, so a single representative icon pill is
 *     used to satisfy the constraint without inventing tech claims.
 *   - `audience` is optional. Public Speaker preserves its legacy audience
 *     list. Community Leader stores the legacy `leaderExamples` titles in
 *     `audience` (lossy: hrefs are dropped — the schema has no link field).
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const OUT_PATH = resolve(REPO_ROOT, 'sanity/seed/roleEntries.ndjson')

// Inlined from src/components/Roles/data.js — kept here so this script
// remains runnable after data.js is removed in the Roles TSX rewrite AC.
const toolNames = ['html5', 'sass', 'js', 'react', 'python', 'git', 'docker', 'aws']
const leaderExamples = [
  'Mock Interviews With Pursuit',
  'Fundraising For The Future Of Tech',
  'Content Creation for The Longhairs',
]

// Mirrors the three role cards from legacy src/components/Roles/index.jsx
// (git commit 9f34352). Order = original render order.
const roleEntries = [
  {
    slug: 'software-engineer',
    title: 'Software Engineer',
    icon: 'computer',
    description:
      'My passion is creating web applications with the latest and greatest tools. My design approach is simple, clean and crisp.',
    tools: toolNames,
    audience: [],
  },
  {
    slug: 'public-speaker',
    title: 'Public Speaker',
    icon: 'microphone',
    description:
      'Our stories should be shared with the future generation. My story is unique and relatable to many.',
    tools: ['microphone'],
    audience: ['Non Profit Organizations', 'High School/College', 'Tech Communities'],
  },
  {
    slug: 'community-leader',
    title: 'Community Leader',
    icon: 'handshake outline',
    description:
      'In order to see the change we want to see, we as individuals need to invest in our communities.',
    tools: ['handshake'],
    audience: leaderExamples,
  },
]

function toSanityDoc(entry, index) {
  const doc = {
    _id: `roleEntry.${entry.slug}`,
    _type: 'roleEntry',
    title: entry.title,
    icon: entry.icon,
    description: entry.description,
    tools: entry.tools,
    order: (index + 1) * 10, // 10, 20, 30 — leaves gaps for manual reorder
  }
  if (entry.audience && entry.audience.length > 0) {
    doc.audience = entry.audience
  }
  return doc
}

function writeNdjson(docs) {
  mkdirSync(dirname(OUT_PATH), { recursive: true })
  const body = `${docs.map((doc) => JSON.stringify(doc)).join('\n')}\n`
  writeFileSync(OUT_PATH, body, 'utf8')
  return OUT_PATH
}

function runImport(dataset) {
  const args = ['sanity', 'dataset', 'import', OUT_PATH, dataset, '--replace']
  const result = spawnSync('npx', args, { stdio: 'inherit', cwd: REPO_ROOT })
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1
  }
}

function parseFlag(name) {
  const prefix = `--${name}=`
  const match = process.argv.find((a) => a.startsWith(prefix))
  return match ? match.slice(prefix.length) : null
}

function main() {
  const docs = roleEntries.map(toSanityDoc)
  const path = writeNdjson(docs)
  console.log(`wrote ${docs.length} roleEntry docs → ${path}`)

  if (process.argv.includes('--import')) {
    const dataset = parseFlag('dataset') ?? 'production'
    console.log(`importing into Sanity dataset "${dataset}"...`)
    runImport(dataset)
  }
}

main()
