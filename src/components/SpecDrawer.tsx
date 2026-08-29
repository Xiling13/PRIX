import { CalendarPlus, Check, ExternalLink, Package, Plus, X } from 'lucide-react'
import { useAppStore, useSelectedCompetition } from '../store/useAppStore'
import {
  formatFee,
  formatLocalAbsolute,
  formatSourceDeadline,
  inferNextCycle,
  isOpen,
} from '../lib/dates'
import { downloadDeadlineIcs } from '../lib/ics'
import { useMessages } from '../lib/i18n'
import { STATUS_COLUMNS } from '../lib/labels'
import { downloadSubmissionPack } from '../lib/submissionPack'
import { cn } from '../lib/cn'
import { RightsBadge } from './RightsBadge'
import type { TrackStatus } from '../types/competition'

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.18em] text-ink-soft uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  )
}

const actionButton =
  'inline-flex w-full cursor-pointer items-center gap-2.5 rounded-xl bg-muted px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-muted/70'

const overlayBackdrop =
  'absolute inset-0 cursor-pointer bg-ink/20 backdrop-blur-sm transition-opacity duration-100 ease-out'

export function SpecDrawer() {
  const m = useMessages()
  const competition = useSelectedCompetition()
  const selectedId = useAppStore((s) => s.selectedId)
  const setSelectedId = useAppStore((s) => s.setSelectedId)
  const progress = useAppStore((s) => s.progress)
  const addToBoard = useAppStore((s) => s.addToBoard)
  const setStatus = useAppStore((s) => s.setStatus)
  const status = competition ? progress[competition.id] : undefined
  const open = Boolean(competition)
  const cycle = competition ? inferNextCycle(competition) : null
  const stillOpen = competition ? isOpen(competition) : false

  return (
    <div
      className={cn('fixed inset-0 z-40', open ? '' : 'pointer-events-none')}
    >
      <button
        type="button"
        aria-label={m.drawer.close}
        className={cn(overlayBackdrop, open ? 'opacity-100' : 'opacity-0')}
        onClick={() => setSelectedId(null)}
      />
      <aside
        className={cn(
          'absolute top-0 right-0 flex h-full w-full max-w-xl flex-col bg-surface shadow-2xl shadow-ink/20 transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {competition && (
          <div className="flex h-full flex-col overflow-y-auto px-7 py-7 sm:px-9">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] tracking-[0.28em] text-ink-soft uppercase">
                {competition.shortName}
              </p>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label={m.drawer.close}
                className="cursor-pointer p-1 text-ink-soft transition-colors hover:text-ink"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <h2 className="mt-4 text-3xl font-medium tracking-tight">
              {competition.name}
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              {m.categories[competition.category]} · {competition.country} ·{' '}
              {m.tiers[competition.tier]}
            </p>

            <div className="mt-6">
              {!status ? (
                <button
                  type="button"
                  onClick={() => addToBoard(competition.id)}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dim"
                >
                  <Plus className="size-4" aria-hidden />
                  {m.drawer.addToTracker}
                </button>
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-safe/10 px-4 py-3">
                  <Check className="size-4 shrink-0 text-safe" aria-hidden />
                  <span className="text-sm font-medium text-safe">
                    {m.drawer.onTracker}
                  </span>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(competition.id, e.target.value as TrackStatus)
                    }
                    className="ml-auto cursor-pointer rounded-lg bg-surface px-2.5 py-1.5 text-sm font-medium shadow-sm shadow-ink/10"
                    aria-label={m.drawer.statusLabel}
                  >
                    {STATUS_COLUMNS.map((column) => (
                      <option key={column.id} value={column.id}>
                        {m.status[column.id]}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {competition.summary && (
              <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
                {competition.summary}
              </p>
            )}

            <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-7">
              <Spec
                label={m.drawer.localDeadline}
                value={formatLocalAbsolute(
                  competition.deadlines.final,
                  competition.deadlines.timezone,
                )}
              />
              <Spec
                label={`${m.drawer.organizerTime} · ${competition.deadlines.timezone}`}
                value={formatSourceDeadline(
                  competition.deadlines.final,
                  competition.deadlines.timezone,
                )}
              />
              {competition.deadlines.earlyBird && (
                <Spec
                  label={m.drawer.earlyBird}
                  value={formatLocalAbsolute(
                    competition.deadlines.earlyBird,
                    competition.deadlines.timezone,
                  )}
                />
              )}
              <Spec label={m.drawer.fee} value={formatFee(competition, m)} />
              <Spec
                label={m.drawer.eligibility}
                value={m.eligibility[competition.eligibility]}
              />
              <Spec
                label={m.drawer.colorSpace}
                value={competition.specs.colorSpace}
              />
              <Spec
                label={m.drawer.formats}
                value={competition.specs.fileFormats.join(', ')}
              />
              <Spec
                label={m.drawer.maxFile}
                value={`${competition.specs.maxFileSizeMB} MB`}
              />
              {competition.specs.minDPI && (
                <Spec
                  label={m.drawer.dpi}
                  value={`${competition.specs.minDPI}`}
                />
              )}
              {competition.specs.maxWordCount && (
                <Spec
                  label={m.drawer.statement}
                  value={`${competition.specs.maxWordCount} ${m.drawer.statementUnit}`}
                />
              )}
              <Spec
                label={m.drawer.watermark}
                value={
                  competition.specs.noWatermark
                    ? m.drawer.watermarkNone
                    : m.drawer.watermarkCheck
                }
              />
            </div>

            {(competition.judging?.preliminary ||
              competition.judging?.final ||
              competition.judging?.notes) && (
              <div className="mt-10">
                <p className="font-mono text-[11px] tracking-[0.18em] text-ink-soft uppercase">
                  {m.drawer.judging}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {[
                    competition.judging.preliminary &&
                      `Preliminary ${competition.judging.preliminary}`,
                    competition.judging.final &&
                      `Final ${competition.judging.final}`,
                    competition.judging.notes,
                  ]
                    .filter(Boolean)
                    .join('. ')}
                </p>
                {competition.judging.judges && (
                  <p className="mt-2 text-sm text-ink-soft">
                    {competition.judging.judges.join(' · ')}
                  </p>
                )}
              </div>
            )}

            <div className="mt-10">
              <RightsBadge value={competition.rightsEthics} />
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {m.rights[competition.rightsEthics].hint}{' '}
                {competition.rightsNotes}
              </p>
            </div>

            {!stillOpen && cycle && (
              <p className="mt-7 font-mono text-sm text-ink-soft">
                {m.drawer.nextCycleNote} {cycle.year} {cycle.quarter}
              </p>
            )}

            {competition.tags.length > 0 && (
              <p className="mt-7 text-sm text-ink-soft">
                {competition.tags.map((tag) => `#${tag}`).join('  ')}
              </p>
            )}

            <div className="mt-auto grid gap-2 pt-10">
              <button
                type="button"
                onClick={() => downloadDeadlineIcs(competition)}
                className={actionButton}
              >
                <CalendarPlus className="size-4 text-ink-soft" aria-hidden />
                {m.drawer.exportIcs}
              </button>
              <button
                type="button"
                onClick={() => void downloadSubmissionPack(competition)}
                className={actionButton}
              >
                <Package className="size-4 text-ink-soft" aria-hidden />
                {m.drawer.pack}
              </button>
              <a
                href={competition.officialUrl}
                target="_blank"
                rel="noreferrer"
                className={actionButton}
              >
                <ExternalLink className="size-4 text-ink-soft" aria-hidden />
                {m.drawer.official}
              </a>
            </div>
          </div>
        )}
        {!competition && selectedId && (
          <p className="p-10 text-sm text-ink-soft">{m.drawer.notFound}</p>
        )}
      </aside>
    </div>
  )
}
