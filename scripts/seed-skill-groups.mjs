#!/usr/bin/env node
/**
 * seed-skill-groups.mjs
 *
 * Sub-AC 8.2 — Export legacy `skillGroups` from src/components/Skills/index.jsx
 * and seed them into Sanity.
 *
 * Pipeline:
 *   1. Emits ./sanity/seed/skillGroups.ndjson (idempotent, stable _id per group).
 *   2. Optionally runs `sanity dataset import` when `--import` flag is passed.
 *
 * Usage:
 *   node scripts/seed-skill-groups.mjs                    # write NDJSON only
 *   node scripts/seed-skill-groups.mjs --import           # write + import to production
 *   node scripts/seed-skill-groups.mjs --import --dataset=staging
 *
 * Source of truth at time of migration:
 *   src/components/Skills/index.jsx → `export const skillGroups`
 * The array is inlined below so this script remains runnable after that JSX
 * file is rewritten to TSX/Tailwind in a sibling AC.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const OUT_PATH = resolve(REPO_ROOT, 'sanity/seed/skillGroups.ndjson')

// Mirrors src/components/Skills/index.jsx as of the migration commit.
// Order in this array drives the `order` field used by GROQ orderAsc sort.
const skillGroups = [
  {
    category: 'Frontend',
    skills: ['TypeScript', 'React', 'JavaScript', 'HTML / CSS', 'React Native'],
  },
  {
    category: 'Frameworks',
    skills: ['Next.js', 'Gatsby', 'Flask'],
  },
  {
    category: 'Backend',
    skills: ['Go', 'Python', 'REST APIs', 'Node.js'],
  },
  {
    category: 'AI Tools',
    skills: ['Claude', 'Cursor', 'GitHub Copilot', 'ChatGPT', 'OpenAI API'],
  },
  {
    category: 'Experimentation & Observability',
    skills: ['Optimizely', 'Datadog', 'k6', 'Split.io', 'Sentry', 'Rollbar'],
  },
  {
    category: 'Cloud & Infrastructure',
    skills: ['AWS Lambda', 'SQS', 'S3', 'DynamoDB', 'CircleCI', 'GitLab CI'],
  },
  {
    category: 'CMS & Commerce',
    skills: ['Contentful', 'CommerceTools', 'Shopify'],
  },
  {
    category: 'Testing',
    skills: ['Jest', 'Cucumber', 'Pytest', 'Selenium', 'Appium'],
  },
  {
    category: 'Product & Collaboration',
    skills: ['Figma', 'Jira', 'Confluence', 'Git'],
  },
]

/**
 * slugify("AI Tools")               -> "ai-tools"
 * slugify("Cloud & Infrastructure") -> "cloud-infrastructure"
 */
function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toSanityDoc(group, index) {
  return {
    _id: `skillGroup.${slugify(group.category)}`,
    _type: 'skillGroup',
    category: group.category,
    skills: group.skills,
    order: (index + 1) * 10, // 10, 20, 30... leaves gaps for manual reorder
  }
}

function writeNdjson(docs) {
  mkdirSync(dirname(OUT_PATH), { recursive: true })
  const body = `${docs.map((doc) => JSON.stringify(doc)).join('\n')}\n`
  writeFileSync(OUT_PATH, body, 'utf8')
  return OUT_PATH
}

function runImport(dataset) {
  // `sanity dataset import <file> <dataset> --replace` is idempotent on
  // stable _ids; --replace keeps editors' future edits but resets on re-run.
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
  const docs = skillGroups.map(toSanityDoc)
  const path = writeNdjson(docs)
  console.log(`wrote ${docs.length} skillGroup docs → ${path}`)

  if (process.argv.includes('--import')) {
    const dataset = parseFlag('dataset') ?? 'production'
    console.log(`importing into Sanity dataset "${dataset}"...`)
    runImport(dataset)
  }
}

main()
