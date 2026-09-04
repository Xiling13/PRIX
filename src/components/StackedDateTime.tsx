import { cn } from '../lib/cn'
import {
  formatDisplayDate,
  formatDisplayDateStacked,
} from '../lib/dates'
import type { Lang } from '../lib/i18n'

export function StackedDateTime({
  isoLocal,
  timezone,
  inTimezone = false,
  lang,
  className,
  stackOnNarrow = true,
}: {
  isoLocal: string
  timezone: string
  inTimezone?: boolean
  lang: Lang
  className?: string
  /** When true (default), stack date/time below 480px. When false, always one line. */
  stackOnNarrow?: boolean
}) {
  const stacked = formatDisplayDateStacked(
    isoLocal,
    timezone,
    inTimezone,
    lang,
  )
  const full = formatDisplayDate(isoLocal, timezone, inTimezone, lang)

  if (!stackOnNarrow) {
    return <span className={className}>{full}</span>
  }

  return (
    <>
      <span className={cn('min-[480px]:hidden', className)}>
        <span className="block">{stacked.date}</span>
        <span className="block">{stacked.time}</span>
      </span>
      <span className={cn('hidden min-[480px]:inline', className)}>{full}</span>
    </>
  )
}
