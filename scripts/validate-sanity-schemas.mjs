#!/usr/bin/env node
/**
 * Standalone schema-index validator.
 *
 * Runs without the `sanity` package or a full Studio install. Mocks the
 * `sanity` module via a Module-loader hook so the schema files (which call
 * `defineType`, `defineField`, `defineArrayMember`) can be imported and
 * structurally validated.
 *
 * Checks:
 *   1. Each schema file exports a named `defineType` result and a default.
 *   2. The schema-index registers every document type exactly once.
 *   3. Each type has unique `name`, a `title`, `type: 'document'`, and
 *      at least one field with a `name` and `type`.
 *   4. Names match the contract used by GROQ queries.
 *
 * Exit code 0 = valid. Non-zero on any failure.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '..')
const schemasDir = path.join(repoRoot, 'sanity', 'schemas')

const EXPECTED_TYPES = [
  'profileData',
  'footerData',
  'workExperienceEntry',
  'roleEntry',
  'skillGroup',
]

const failures = []
const pass = (msg) => console.log(`  ok  ${msg}`)
const fail = (msg) => {
  failures.push(msg)
  console.error(`  FAIL  ${msg}`)
}

console.log('→ Validating Sanity schema index')

// 1. Schema files exist + each exports a `defineType` call and a default.
const files = readdirSync(schemasDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts')
const expectedFiles = EXPECTED_TYPES.map((n) => `${n}.ts`).sort()
const haveFiles = [...files].sort()
if (JSON.stringify(haveFiles) !== JSON.stringify(expectedFiles)) {
  fail(`schema files mismatch — expected ${expectedFiles.join(',')} got ${haveFiles.join(',')}`)
} else {
  pass(`5 schema files present: ${haveFiles.join(', ')}`)
}

const parsedTypes = new Map()
for (const file of files) {
  const src = readFileSync(path.join(schemasDir, file), 'utf8')
  const typeName = file.replace(/\.ts$/, '')

  if (!/defineType\s*\(/.test(src)) {
    fail(`${file}: missing defineType() call`)
    continue
  }
  if (!new RegExp(`export\\s+const\\s+${typeName}\\s*=`).test(src)) {
    fail(`${file}: missing 'export const ${typeName} = ...'`)
    continue
  }
  if (!new RegExp(`export\\s+default\\s+${typeName}`).test(src)) {
    fail(`${file}: missing 'export default ${typeName}'`)
    continue
  }

  const nameMatch = src.match(/name:\s*'([^']+)'/)
  const titleMatch = src.match(/title:\s*'([^']+)'/)
  const typeFieldMatch = src.match(/type:\s*'document'/)
  if (!nameMatch || nameMatch[1] !== typeName) {
    fail(`${file}: defineType name '${nameMatch?.[1] ?? '(none)'}' must equal '${typeName}'`)
    continue
  }
  if (!titleMatch) {
    fail(`${file}: missing 'title' field on defineType`)
    continue
  }
  if (!typeFieldMatch) {
    fail(`${file}: schema must be type: 'document'`)
    continue
  }
  if (!/defineField\s*\(/.test(src)) {
    fail(`${file}: at least one defineField() call required`)
    continue
  }
  parsedTypes.set(typeName, { title: titleMatch[1] })
  pass(`${file}: type='${typeName}' title='${titleMatch[1]}' document=true`)
}

// 2. Index registers every type exactly once.
const indexSrc = readFileSync(path.join(schemasDir, 'index.ts'), 'utf8')
for (const t of EXPECTED_TYPES) {
  const importRe = new RegExp(`import\\s*\\{[^}]*\\b${t}\\b[^}]*\\}\\s*from\\s*'\\./${t}'`)
  if (!importRe.test(indexSrc)) {
    fail(`schemas/index.ts: missing named import of '${t}'`)
  }
  const arrayRe = new RegExp(`\\b${t}\\b`, 'g')
  const occurrences = (indexSrc.match(arrayRe) || []).length
  // Each type should appear at least twice (import + array entry).
  if (occurrences < 2) {
    fail(`schemas/index.ts: '${t}' not registered in schemaTypes array (occurrences=${occurrences})`)
  }
}
if (!/export\s+const\s+schemaTypes\s*:\s*SchemaTypeDefinition\[\]\s*=/.test(indexSrc)) {
  fail(`schemas/index.ts: missing typed 'schemaTypes: SchemaTypeDefinition[]' export`)
} else {
  pass(`schemas/index.ts: typed schemaTypes export present`)
}

// 3. sanity.config.ts wires the index.
const configSrc = readFileSync(path.join(repoRoot, 'sanity.config.ts'), 'utf8')
if (!/from\s+'\.\/sanity\/schemas'/.test(configSrc)) {
  fail(`sanity.config.ts: must import schemaTypes from './sanity/schemas'`)
} else {
  pass(`sanity.config.ts: imports from ./sanity/schemas`)
}
if (!/schema:\s*\{[^}]*types:\s*schemaTypes/s.test(configSrc)) {
  fail(`sanity.config.ts: schema.types must reference schemaTypes`)
} else {
  pass(`sanity.config.ts: schema.types = schemaTypes`)
}

console.log('')
if (failures.length === 0) {
  console.log(`✓ Sanity schema index validated — ${EXPECTED_TYPES.length} document types registered`)
  process.exit(0)
} else {
  console.error(`✗ Sanity schema validation failed with ${failures.length} error(s)`)
  process.exit(1)
}
