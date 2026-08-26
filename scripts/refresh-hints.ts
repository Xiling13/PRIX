import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fromZonedTime } from 'date-fns-tz'
import type { Competition, Quarter } from '../src/types/competition.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = resolve(root, 'src/data/competitions.json')
const competitions = JSON.parse(readFileSync(dataPath, 'utf8')) as Competition[]

function quarterFromMonth(month: number): Quarter {
  if (month < 3) return 'Q1'
  if (month < 6) return 'Q2'
  if (month < 9) return 'Q3'
  return 'Q4'
}

const now = new Date()
let updated = 0

for (const item of competitions) {
  const final = fromZonedTime(item.deadlines.final, item.deadlines.timezone)
  if (final >= now || item.nextCycleHint) continue
  item.nextCycleHint = {
    year: final.getFullYear() + 1,
    quarter: quarterFromMonth(final.getMonth()),
  }
  updated += 1
  console.log(
    `${item.shortName}: next ${item.nextCycleHint.year} ${item.nextCycleHint.quarter}`,
  )
}

if (updated === 0) {
  console.log('No missing nextCycleHint fields')
} else {
  writeFileSync(dataPath, `${JSON.stringify(competitions, null, 2)}\n`)
  console.log(`Wrote ${updated} nextCycleHint updates to ${dataPath}`)
}
