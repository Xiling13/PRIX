import { differenceInMilliseconds, format, getYear, subYears } from 'date-fns'
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'
import type { Competition, Quarter } from '../types/competition'

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
): string {
  const ms = msRemaining(competition, now)
  if (ms <= 0) return 'Closed'
  const totalHours = Math.floor(ms / 3_600_000)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  if (days >= 1) return `${days}d ${String(hours).padStart(2, '0')}h`
  return `${hours}h ${String(minutes).padStart(2, '0')}m`
}

export function formatLocalAbsolute(
  isoLocal: string,
  timezone: string,
  nowPattern = 'EEE d MMM yyyy, HH:mm',
): string {
  const utc = deadlineToUtc(isoLocal, timezone)
  return `${format(utc, nowPattern)} ${format(utc, 'zzz')}`
}

export function formatSourceDeadline(
  isoLocal: string,
  timezone: string,
): string {
  const utc = deadlineToUtc(isoLocal, timezone)
  return formatInTimeZone(utc, timezone, 'EEE d MMM yyyy, HH:mm zzz')
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

export function formatFee(competition: Competition): string {
  const { fees } = competition
  if (fees.isFree) return 'Free'
  const amount = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: fees.currency,
    maximumFractionDigits: 0,
  })
  if (fees.singleEarly != null) {
    return `${amount.format(fees.singleEarly)} early · ${amount.format(fees.singleRegular)} regular`
  }
  return amount.format(fees.singleRegular)
}
