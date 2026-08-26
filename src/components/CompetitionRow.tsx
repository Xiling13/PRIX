import type { Competition } from '../types/competition'
import { cn } from '../lib/cn'
import {
  formatCountdown,
  formatFee,
  formatLocalAbsolute,
  inferNextCycle,
  isOpen,
  isUrgent,
} from '../lib/dates'
import { CATEGORY_LABELS, ELIGIBILITY_LABELS, TIER_LABELS } from '../lib/labels'
import { RightsBadge } from './RightsBadge'

export function CompetitionRow({
  competition,
  now,
  archived = false,
  onOpen,
}: {
  competition: Competition
  now: Date
  archived?: boolean
  onOpen: () => void
}) {
  const urgent = isUrgent(competition, now)
  const open = isOpen(competition, now)
  const next = inferNextCycle(competition)

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'grid w-full grid-cols-1 gap-3 rounded-2xl px-4 py-5 text-left transition-colors sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-end sm:gap-8 sm:px-5',
        'hover:bg-surface',
        archived && 'opacity-50 grayscale',
      )}
    >
      <div className="min-w-0">
        <p className="font-mono text-[11px] tracking-[0.22em] text-ink-soft">
          {competition.shortName}
          {competition.isCustom ? ' · CUSTOM' : ''}
        </p>
        <h2 className="mt-1 truncate text-lg font-medium tracking-tight">
          {competition.name}
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          {CATEGORY_LABELS[competition.category]}
          <span className="mx-2 text-ink-soft/40">·</span>
          {competition.country}
          <span className="mx-2 text-ink-soft/40">·</span>
          {TIER_LABELS[competition.tier]}
        </p>
      </div>

      <div className="text-sm text-ink-soft">
        <p>
          {open
            ? formatLocalAbsolute(
                competition.deadlines.final,
                competition.deadlines.timezone,
              )
            : 'Closed'}
        </p>
        <p className="mt-1">
          {formatFee(competition)}
          <span className="mx-2 text-ink-soft/40">·</span>
          {ELIGIBILITY_LABELS[competition.eligibility]}
        </p>
        <div className="mt-2">
          <RightsBadge value={competition.rightsEthics} />
        </div>
      </div>

      <div className="sm:text-right">
        <p
          className={cn(
            'font-mono text-xl tracking-tight',
            urgent && 'text-magenta',
            !open && 'text-ink-soft',
          )}
        >
          {open ? formatCountdown(competition, now) : 'Closed'}
        </p>
        {!open && (
          <p className="mt-1 font-mono text-[11px] text-ink-soft">
            Next {next.year} {next.quarter}
          </p>
        )}
      </div>
    </button>
  )
}
