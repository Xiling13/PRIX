import { differenceInMilliseconds, format, getYear, subYears } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'
import type { Competition, Quarter } from '../types/competition'
import type { Lang } from './i18n'

export function deadlineToUtc(isoLocal: string, timezone: string): Date {
  return fromZonedTime(isoLocal, timezone)
}

export function getFinalUtc(competition: Competition): Date {
  return deadlineToUtc(
    competition.deadlines.final,
    competition.deadlines.timezone,
  )
}

export function isOpen(competition: Competition, now = new Date()): boolean {
  return getFinalUtc(competition) > now
}

export function isWithinRetention(
  competition: Competition,
  now = new Date(),
): boolean {
  if (isOpen(competition, now)) return true
  const final = getFinalUtc(competition)
  const cutoff = subYears(now, 1)
  return final >= cutoff || getYear(final) >= getYear(now) - 1
}

export function msRemaining(
  competition: Competition,
  now = new Date(),
): number {
  return differenceInMilliseconds(getFinalUtc(competition), now)
}

export function isUrgent(competition: Competition, now = new Date()): boolean {
  if (!isOpen(competition, now)) return false
  const week = 7 * 24 * 60 * 60 * 1000
  return msRemaining(competition, now) < week
}

export function formatCountdown(
  competition: Competition,
  now = new Date(),
  closedLabel = 'Closed',
  lang: Lang = 'en',
): string {
  const ms = msRemaining(competition, now)
  if (ms <= 0) return closedLabel
  const totalHours = Math.floor(ms / 3_600_000)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  if (days >= 1) {
    return lang === 'zh'
      ? `${days}天 ${String(hours).padStart(2, '0')}时`
      : `${days}d ${String(hours).padStart(2, '0')}h`
  }
  return lang === 'zh'
    ? `${hours}时 ${String(minutes).padStart(2, '0')}分`
    : `${hours}h ${String(minutes).padStart(2, '0')}m`
}

export function formatDisplayDate(
  isoLocal: string,
  timezone: string,
  inTimezone = true,
  lang: Lang = 'en',
): string {
  const { date, time } = formatDisplayDateStacked(
    isoLocal,
    timezone,
    inTimezone,
    lang,
  )
  return lang === 'zh' ? `${date} ${time}` : `${date} ${time}`
}

export function formatDisplayDateStacked(
  isoLocal: string,
  timezone: string,
  inTimezone = true,
  lang: Lang = 'en',
): { date: string; time: string } {
  const utc = deadlineToUtc(isoLocal, timezone)
  if (lang === 'zh') {
    const date = inTimezone
      ? formatInTimeZone(utc, timezone, 'yyyy年M月d日，', { locale: zhCN })
      : format(utc, 'yyyy年M月d日，', { locale: zhCN })
    const time = (
      inTimezone
        ? formatInTimeZone(utc, timezone, 'a hh:mm', { locale: zhCN })
        : format(utc, 'a hh:mm', { locale: zhCN })
    ).replace(/\s/g, ' ')
    return { date, time }
  }
  const day = inTimezone
    ? formatInTimeZone(utc, timezone, 'dd')
    : format(utc, 'dd')
  const month = (
    inTimezone
      ? formatInTimeZone(utc, timezone, 'MMM')
      : format(utc, 'MMM')
  ).toUpperCase()
  const year = inTimezone
    ? formatInTimeZone(utc, timezone, 'yyyy')
    : format(utc, 'yyyy')
  const time = (
    inTimezone
      ? formatInTimeZone(utc, timezone, 'hh:mm a')
      : format(utc, 'hh:mm a')
  ).replace(/\b(am|pm)\b/g, (m) => m.toUpperCase())
  return { date: `${day} ${month} ${year},`, time }
}

export function formatLocalAbsolute(
  isoLocal: string,
  timezone: string,
  lang: Lang = 'en',
): string {
  return formatDisplayDate(isoLocal, timezone, false, lang)
}

export function formatSourceDeadline(
  isoLocal: string,
  timezone: string,
  lang: Lang = 'en',
): string {
  return formatDisplayDate(isoLocal, timezone, true, lang)
}

export function quarterFromDate(date: Date): Quarter {
  const month = date.getMonth()
  if (month < 3) return 'Q1'
  if (month < 6) return 'Q2'
  if (month < 9) return 'Q3'
  return 'Q4'
}

export function inferNextCycle(competition: Competition): {
  year: number
  quarter: Quarter
} {
  if (competition.nextCycleHint) return competition.nextCycleHint
  const final = getFinalUtc(competition)
  const quarter = quarterFromDate(final)
  return { year: getYear(final) + 1, quarter }
}

export interface FeeWords {
  free: string
  early: string
  regular: string
}

const DEFAULT_FEE_WORDS: FeeWords = {
  free: 'Free',
  early: 'early',
  regular: 'regular',
}

export function formatFee(
  competition: Competition,
  words: FeeWords = DEFAULT_FEE_WORDS,
): string {
  const { fees } = competition
  if (fees.isFree) return words.free
  const amount = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: fees.currency,
    maximumFractionDigits: 0,
  })
  if (fees.singleEarly != null) {
    return `${amount.format(fees.singleEarly)} ${words.early} / ${amount.format(fees.singleRegular)} ${words.regular}`
  }
  return amount.format(fees.singleRegular)
}
