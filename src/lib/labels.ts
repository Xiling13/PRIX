import type {
  Category,
  Eligibility,
  Quarter,
  RightsEthics,
  Tier,
  TrackStatus,
} from '../types/competition'
import type { Lang } from './i18n'

export const CATEGORY_TABS: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'creative-tech', label: 'Creative Tech' },
  { id: 'digital-art', label: 'Digital Art' },
  { id: 'graphic-design', label: 'Graphic Design' },
  { id: 'illustration', label: 'Illustration' },
  { id: 'motion-3d', label: 'Motion & 3D' },
  { id: 'photography', label: 'Photography' },
  { id: 'vibe-coding', label: 'Vibe Coding' },
]

export const CATEGORY_LABELS: Record<Category, string> = {
  'graphic-design': 'Graphic Design',
  illustration: 'Illustration',
  photography: 'Photography',
  'motion-3d': 'Motion & 3D',
  'digital-art': 'Digital Art',
  'creative-tech': 'Creative Tech',
  'vibe-coding': 'Vibe Coding',
}

export const TIER_LABELS: Record<Tier, string> = {
  'tier-1-annual': 'International annual',
  'specialized-pioneer': 'Specialized pioneer',
}

export const ELIGIBILITY_LABELS: Record<Eligibility, string> = {
  all: 'Open worldwide',
  'students-only': 'Students only',
  'professionals-only': 'Professionals',
}

export const RIGHTS_LABELS: Record<
  RightsEthics,
  { title: string; hint: string }
> = {
  'creator-retains-all': {
    title: 'Creator retains all rights',
    hint: 'Copyright stays with you. Organizer uses work only with a limited license.',
  },
  'promotional-only': {
    title: 'Promotional license only',
    hint: 'You keep copyright. Organizer may exhibit and promote awarded work.',
  },
  'rights-grab-warning': {
    title: 'Rights grab warning',
    hint: 'Terms may include a broad commercial license. Read the official rules before entering.',
  },
}

export const STATUS_COLUMNS: { id: TrackStatus; label: string }[] = [
  { id: 'interested', label: 'Interested' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'won', label: 'Won' },
]

export const QUARTERS: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4']

export const CURRENCIES = ['EUR', 'GBP', 'JPY', 'USD'] as const

/** Representative cities for competition-heavy regions (IANA value → display). */
export const TIMEZONE_OPTIONS: {
  value: string
  cityEn: string
  cityZh: string
  abbrev: string
}[] = [
  { value: 'UTC', cityEn: 'UTC', cityZh: 'UTC', abbrev: '' },
  {
    value: 'Asia/Shanghai',
    cityEn: 'Beijing',
    cityZh: '北京',
    abbrev: 'CST',
  },
  {
    value: 'Europe/Berlin',
    cityEn: 'Berlin',
    cityZh: '柏林',
    abbrev: 'CET',
  },
  {
    value: 'America/Chicago',
    cityEn: 'Chicago',
    cityZh: '芝加哥',
    abbrev: 'CT',
  },
  {
    value: 'Europe/London',
    cityEn: 'London',
    cityZh: '伦敦',
    abbrev: 'GMT/BST',
  },
  {
    value: 'America/Los_Angeles',
    cityEn: 'Los Angeles',
    cityZh: '洛杉矶',
    abbrev: 'PT',
  },
  {
    value: 'America/New_York',
    cityEn: 'New York',
    cityZh: '纽约',
    abbrev: 'ET',
  },
  {
    value: 'Asia/Seoul',
    cityEn: 'Seoul',
    cityZh: '首尔',
    abbrev: 'KST',
  },
  {
    value: 'Asia/Singapore',
    cityEn: 'Singapore',
    cityZh: '新加坡',
    abbrev: 'SGT',
  },
  {
    value: 'Australia/Sydney',
    cityEn: 'Sydney',
    cityZh: '悉尼',
    abbrev: 'AEST',
  },
  {
    value: 'Asia/Tokyo',
    cityEn: 'Tokyo',
    cityZh: '东京',
    abbrev: 'JST',
  },
]

export const TIMEZONES = TIMEZONE_OPTIONS.map((z) => z.value)

const TIMEZONE_BY_VALUE = Object.fromEntries(
  TIMEZONE_OPTIONS.map((z) => [z.value, z]),
)

/** Aliases that share a listed representative city. */
const TIMEZONE_ALIASES: Record<string, string> = {
  'Etc/UTC': 'UTC',
  'Europe/Paris': 'Europe/Berlin',
  'Europe/Amsterdam': 'Europe/Berlin',
  'Europe/Rome': 'Europe/Berlin',
  'Europe/Vienna': 'Europe/Berlin',
  'Asia/Chongqing': 'Asia/Shanghai',
  'Asia/Harbin': 'Asia/Shanghai',
}

function formatCityAbbrev(city: string, abbrev: string): string {
  return abbrev ? `${city} (${abbrev})` : city
}

export function timezoneLabel(timezone: string, lang: Lang = 'en'): string {
  const canonical = TIMEZONE_ALIASES[timezone] ?? timezone
  const known = TIMEZONE_BY_VALUE[canonical]
  if (known) {
    const city = lang === 'zh' ? known.cityZh : known.cityEn
    return formatCityAbbrev(city, known.abbrev)
  }
  const city = timezone.split('/').pop()?.replace(/_/g, ' ') ?? timezone
  try {
    const parts = new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    }).formatToParts(new Date())
    const abbr = parts.find((p) => p.type === 'timeZoneName')?.value
    return abbr ? `${city} (${abbr})` : city
  } catch {
    return city
  }
}

export function sortOptionsByLabel<T extends { label: string }>(
  options: T[],
  lang: Lang,
): T[] {
  const locale = lang === 'zh' ? 'zh-CN' : 'en'
  return [...options].sort((a, b) =>
    a.label.localeCompare(b.label, locale, { sensitivity: 'base' }),
  )
}

export const GITHUB_REPO_URL = 'https://github.com/Xiling13/Prix'

export const GITHUB_CONTRIBUTE_URL = `${GITHUB_REPO_URL}/issues/new`
