#!/usr/bin/env node
/**
 * seed-footer-data.mjs
 *
 * Sub-AC 6.4 — Migrate legacy Footer data into a Sanity `footerData` singleton.
 *
 * Source of truth at time of migration:
 *   src/components/Footer/data.js → `linkData` ({ href, iconName, ariaLabel })
 *
 * The `footerData` schema (sanity/schemas/footerData.ts) is a singleton —
 * exactly one document is expected per dataset. This script writes a stable
 * `_id` (`footerData.singleton`) so re-imports overwrite the same record.
 *
 * Pipeline mirrors `seed-role-entries.mjs`:
 *   1. Emits ./sanity/seed/footerData.ndjson (idempotent, single document).
 *   2. Optionally runs `sanity dataset import --replace` when `--import` is set.
 *
 * Usage:
 *   node scripts/seed-footer-data.mjs                    # write NDJSON only
 *   node scripts/seed-footer-data.mjs --import           # write + import production
 *   node scripts/seed-footer-data.mjs --import --dataset=staging
 *
 * Schema constraint notes (sanity/schemas/footerData.ts):
 *   - `links[].href` must be an http(s) or mailto URI — legacy mailto entry
 *     passes the `scheme: ['http', 'https', 'mailto']` validator unchanged.
 *   - `links[].order` is required — assigned on a 10/20/30… scale matching
 *     the legacy render order so editors can reorder without re-numbering all.
 *   - `copyright` is optional — left blank here to match the legacy footer
 *     which renders no copyright text.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const OUT_PATH = resolve(REPO_ROOT, 'sanity/seed/footerData.ndjson')

// Inlined from src/components/Footer/data.js — kept here so this script
// remains runnable after data.js is removed in the Footer TSX rewrite AC.
const linkData = [
  {
    href: 'https://github.com/Bedrock02/',
    iconName: 'github',
    ariaLabel: 'GitHub profile',
  },
  {
    href: 'https://www.linkedin.com/in/steven-jimenez-7a435251/',
    iconName: 'linkedin',
    ariaLabel: 'LinkedIn profile',
  },
  {
    href: 'https://blog.wepadev.com',
    iconName: 'rss',
    ariaLabel: 'Personal blog',
  },
  {
    href: 'https://www.strava.com/athletes/6644207',
    iconName: 'strava',
    ariaLabel: 'Strava profile',
  },
  {
    href: 'mailto:jimsteve91@gmail.com',
    iconName: 'mail',
    ariaLabel: 'Send email',
  },
]

function toSanityDoc(links) {
  return {
    _id: 'footerData.singleton',
    _type: 'footerData',
    links: links.map((link, index) => ({
      _key: `link-${link.iconName}`,
      _type: 'socialLink',
      href: link.href,
      iconName: link.iconName,
      ariaLabel: link.ariaLabel,
      order: (index + 1) * 10, // 10, 20, 30, 40, 50 — gaps for manual reorder
    })),
  }
}

function writeNdjson(doc) {
  mkdirSync(dirname(OUT_PATH), { recursive: true })
  const body = `${JSON.stringify(doc)}\n`
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
  const doc = toSanityDoc(linkData)
  const path = writeNdjson(doc)
  console.log(`wrote footerData singleton (${doc.links.length} links) → ${path}`)

  if (process.argv.includes('--import')) {
    const dataset = parseFlag('dataset') ?? 'production'
    console.log(`importing into Sanity dataset "${dataset}"...`)
    runImport(dataset)
  }
}

main()
