import { Check, Minus, Plus } from 'lucide-react'
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
import { useMessages } from '../lib/i18n'
import { localizeCompetition } from '../lib/competitionLocale'
import { toTitleCase } from '../lib/titleCase'
import { RightsBadge } from './RightsBadge'
import { useAppStore } from '../store/useAppStore'

function MetaDot({ tone = 'muted' }: { tone?: 'muted' | 'soft' }) {
  return (
    <span
      className={cn(
        'mx-2 inline-block size-1 shrink-0 rounded-full',
        tone === 'soft' ? 'bg-ink-soft' : 'bg-ink-muted',
      )}
      aria-hidden
    />
  )
}

export function CompetitionRow({
  competition,
  now,
  archived = false,
}: {
  competition: Competition
  now: Date
  archived?: boolean
}) {
  const m = useMessages()
  const lang = useAppStore((s) => s.lang)
  const urgent = isUrgent(competition, now)
  const open = isOpen(competition, now)
  const next = inferNextCycle(competition)
  const setSelectedId = useAppStore((s) => s.setSelectedId)
  const addToBoard = useAppStore((s) => s.addToBoard)
  const removeFromBoard = useAppStore((s) => s.removeFromBoard)
  const tracked = Boolean(useAppStore((s) => s.progress[competition.id]))
  const localized = localizeCompetition(competition, lang)
  const meta = (text: string) => (lang === 'en' ? toTitleCase(text) : text)

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => setSelectedId(competition.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setSelectedId(competition.id)
        }
      }}
      className={cn(
        'group col-span-full grid cursor-pointer grid-cols-1 gap-3 rounded-md py-5 text-left transition-colors',
        'lg:col-span-3 lg:row-span-3 lg:grid-cols-subgrid lg:grid-rows-[auto_auto_auto] lg:gap-y-1 lg:gap-x-6 lg:px-0 lg:py-5',
        'hover:bg-surface hover:shadow-sm hover:shadow-ink/5',
        archived && 'opacity-50 grayscale',
      )}
    >
      <p className="font-mono text-[11px] tracking-[0.16em] text-ink-soft uppercase lg:col-start-1 lg:row-start-1 lg:self-start lg:pl-5">
        {competition.shortName}
        {competition.isCustom ? ` · ${m.customTag}` : ''}
      </p>

      <h2 className="text-lg font-medium leading-snug tracking-tight transition-colors group-hover:text-primary lg:col-start-1 lg:row-start-2 lg:self-start lg:pl-5 lg:truncate">
        {competition.name}
      </h2>

      <p className="flex flex-wrap items-center text-sm text-ink-soft lg:col-start-1 lg:row-start-3 lg:self-end lg:pl-5">
        {meta(m.categories[competition.category])}
        <MetaDot tone="soft" />
        {meta(localized.country)}
        <MetaDot tone="soft" />
        {meta(m.tiers[competition.tier])}
      </p>

      <p className="text-sm text-ink-muted lg:col-start-2 lg:row-start-1 lg:-mt-px lg:self-start lg:whitespace-nowrap lg:tabular-nums">
        {open
          ? formatLocalAbsolute(
              competition.deadlines.final,
              competition.deadlines.timezone,
              lang,
            )
          : `${m.nextCycle} ${next.year} ${next.quarter}`}
      </p>

      <p className="flex flex-wrap items-center text-sm leading-snug text-ink-muted lg:col-start-2 lg:row-start-2 lg:-translate-y-[1.5px] lg:self-end">
        {meta(formatFee(competition, m))}
        <MetaDot />
        {meta(m.eligibility[competition.eligibility])}
      </p>

      <RightsBadge
        value={competition.rightsEthics}
        className="lg:col-start-2 lg:row-start-3 lg:self-end"
      />

      <div className="flex items-center justify-between gap-3 lg:col-start-3 lg:row-start-1 lg:row-span-3 lg:self-center lg:justify-end lg:pr-5">
        <p
          className={cn(
            'min-w-[7.5ch] shrink-0 text-right text-[1.35rem] font-medium whitespace-nowrap tabular-nums',
            urgent && 'text-danger',
            !open && 'text-ink-soft',
          )}
        >
          {open ? formatCountdown(competition, now, m.closed, lang) : m.closed}
        </p>
        <button
          type="button"
          aria-label={tracked ? m.tracker.remove : m.track}
          onClick={(e) => {
            e.stopPropagation()
            if (tracked) removeFromBoard(competition.id)
            else addToBoard(competition.id)
          }}
          className={cn(
            'group/track inline-flex h-9 shrink-0 cursor-pointer items-center justify-end pl-4 transition-colors lg:h-7 lg:pl-3',
            tracked
              ? 'text-safe hover:text-ink-soft'
              : 'text-ink-soft hover:text-primary',
          )}
        >
          {tracked ? (
            <>
              <Check
                className="size-4 max-lg:hidden lg:block lg:group-hover/track:hidden"
                aria-hidden
              />
              <Minus
                className="size-4 lg:hidden lg:group-hover/track:block"
                aria-hidden
              />
            </>
          ) : (
            <Plus className="size-4" aria-hidden />
          )}
        </button>
      </div>
    </article>
  )
}
