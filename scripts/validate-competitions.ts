import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fromZonedTime } from 'date-fns-tz'
import type { Competition } from '../src/types/competition.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = resolve(root, 'src/data/competitions.json')

const CATEGORIES = new Set([
  'graphic-design',
  'illustration',
  'photography',
  'motion-3d',
  'digital-art',
  'creative-tech',
])
const TIERS = new Set(['tier-1-annual', 'specialized-pioneer'])
const ELIGIBILITY = new Set(['all', 'students-only', 'professionals-only'])
const RIGHTS = new Set([
  'creator-retains-all',
  'promotional-only',
  'rights-grab-warning',
])
const CURRENCIES = new Set(['USD', 'EUR', 'GBP', 'JPY'])

const timezones = new Set(Intl.supportedValuesOf('timeZone'))
const competitions = JSON.parse(readFileSync(dataPath, 'utf8')) as Competition[]

const errors: string[] = []
const warnings: string[] = []
const ids = new Set<string>()
const now = new Date()
const retentionYear = now.getFullYear() - 1

function checkDate(label: string, value: string, timezone: string) {
  try {
    const date = fromZonedTime(value, timezone)
    if (Number.isNaN(date.getTime())) errors.push(`${label} is invalid`)
  } catch (error) {
    errors.push(`${label}: ${(error as Error).message}`)
  }
}

for (const item of competitions) {
  const prefix = item.id || item.shortName || 'unknown'

  if (!item.id) errors.push('Competition is missing id')
  else if (ids.has(item.id)) errors.push(`Duplicate id: ${item.id}`)
  else ids.add(item.id)

  if (!item.name || !item.shortName) errors.push(`${prefix}: name/shortName required`)
  if (!CATEGORIES.has(item.category)) errors.push(`${prefix}: bad category`)
  if (!TIERS.has(item.tier)) errors.push(`${prefix}: bad tier`)
  if (!ELIGIBILITY.has(item.eligibility)) errors.push(`${prefix}: bad eligibility`)
  if (!RIGHTS.has(item.rightsEthics)) errors.push(`${prefix}: bad rightsEthics`)
  if (!CURRENCIES.has(item.fees.currency)) errors.push(`${prefix}: bad currency`)
  if (!Array.isArray(item.tags)) errors.push(`${prefix}: tags must be an array`)
  if (!item.officialUrl) errors.push(`${prefix}: officialUrl required`)
  if (!item.deadlines?.final) errors.push(`${prefix}: final deadline required`)
  if (!item.deadlines?.timezone) errors.push(`${prefix}: timezone required`)
  else if (!timezones.has(item.deadlines.timezone)) {
    errors.push(`${prefix}: unknown timezone ${item.deadlines.timezone}`)
  }

  if (item.deadlines?.timezone) {
    checkDate(`${prefix} final`, item.deadlines.final, item.deadlines.timezone)
    if (item.deadlines.earlyBird) {
      checkDate(`${prefix} earlyBird`, item.deadlines.earlyBird, item.deadlines.timezone)
    }
    if (item.deadlines.regular) {
      checkDate(`${prefix} regular`, item.deadlines.regular, item.deadlines.timezone)
    }
  }

  if (item.deadlines?.final && item.deadlines.timezone) {
    const final = fromZonedTime(item.deadlines.final, item.deadlines.timezone)
    if (final < now && final.getFullYear() < retentionYear) {
      warnings.push(
        `${prefix}: final ${final.getFullYear()} is older than the current+past-1-year window`,
      )
    }
    if (final < now && !item.nextCycleHint) {
      warnings.push(`${prefix}: closed without nextCycleHint — run npm run refresh:hints`)
    }
  }
}

for (const warning of warnings) console.warn(`warn  ${warning}`)
for (const error of errors) console.error(`error ${error}`)

console.log(`Checked ${competitions.length} competitions, ${errors.length} errors`)
if (errors.length > 0) process.exit(1)
