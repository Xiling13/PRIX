import {
  ArrowUpRight,
  CalendarPlus,
  Check,
  Package,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { useAppStore, useSelectedCompetition } from '../store/useAppStore'
import {
  formatFee,
  formatLocalAbsolute,
  formatSourceDeadline,
  inferNextCycle,
  isOpen,
} from '../lib/dates'
import {
  formatJudgingPhase,
  localizeCompetition,
} from '../lib/competitionLocale'
import { downloadDeadlineIcs } from '../lib/ics'
import { useMessages } from '../lib/i18n'
import { STATUS_COLUMNS } from '../lib/labels'
import { downloadSubmissionPack } from '../lib/submissionPack'
import { normalizeUrl } from '../lib/url'
import { cn } from '../lib/cn'
import { toTitleCase } from '../lib/titleCase'
import { RightsBadge } from './RightsBadge'
import { Select } from './Select'
import type { TrackStatus } from '../types/competition'

type SpecItem = { label?: string; value: string }

function SpecCell({
  label,
  value,
  className,
}: SpecItem & { className?: string }) {
  return (
    <td className={cn('border-ink/20 px-4 py-3 align-top', className)}>
      {label ? (
        <>
          <p className="font-mono text-[11px] tracking-[0.14em] text-ink-soft uppercase">
            {label}
          </p>
          <p className="mt-1 text-sm text-ink">{value}</p>
        </>
      ) : (
        <p className="text-sm text-ink">{value}</p>
      )}
    </td>
  )
}

function chunkPairs(items: SpecItem[]): SpecItem[][] {
  const rows: SpecItem[][] = []
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2))
  }
  return rows
}

const outlineButton =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary bg-transparent px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white'

const overlayBackdrop =
  'absolute inset-0 cursor-pointer bg-ink/20 backdrop-blur-sm transition-opacity duration-100 ease-out'

export function SpecDrawer() {
  const m = useMessages()
  const lang = useAppStore((s) => s.lang)
  const competition = useSelectedCompetition()
  const selectedId = useAppStore((s) => s.selectedId)
  const setSelectedId = useAppStore((s) => s.setSelectedId)
  const progress = useAppStore((s) => s.progress)
  const addToBoard = useAppStore((s) => s.addToBoard)
  const setStatus = useAppStore((s) => s.setStatus)
  const removeCustom = useAppStore((s) => s.removeCustom)
  const setAddOpen = useAppStore((s) => s.setAddOpen)
  const setCustomEditId = useAppStore((s) => s.setCustomEditId)
  const status = competition ? progress[competition.id] : undefined
  const open = Boolean(competition)
  const cycle = competition ? inferNextCycle(competition) : null
  const stillOpen = competition ? isOpen(competition) : false
  const localized = competition
    ? localizeCompetition(competition, lang)
    : null
  const meta = (text: string) => (lang === 'en' ? toTitleCase(text) : text)
  const officialUrl = competition
    ? normalizeUrl(competition.officialUrl)
    : null

  const specItems: SpecItem[] = competition
    ? [
        {
          label: m.drawer.localDeadline,
          value: formatLocalAbsolute(
            competition.deadlines.final,
            competition.deadlines.timezone,
            lang,
          ),
        },
        {
          label: m.drawer.organizerTime,
          value: formatSourceDeadline(
            competition.deadlines.final,
            competition.deadlines.timezone,
            lang,
          ),
        },
        ...(competition.deadlines.earlyBird
          ? [
              {
                label: m.drawer.earlyBird,
                value: formatLocalAbsolute(
                  competition.deadlines.earlyBird,
                  competition.deadlines.timezone,
                  lang,
                ),
              },
            ]
          : []),
        { label: m.drawer.fee, value: meta(formatFee(competition, m)) },
        {
          label: m.drawer.eligibility,
          value: meta(m.eligibility[competition.eligibility]),
        },
        {
          label: m.drawer.colorSpace,
          value: localized?.colorSpace ?? competition.specs.colorSpace,
        },
        {
          label: m.drawer.formats,
          value: competition.specs.fileFormats.join(', '),
        },
        {
          label: m.drawer.maxFile,
          value: `${competition.specs.maxFileSizeMB} MB`,
        },
        ...(competition.specs.minDPI
          ? [
              {
                label: m.drawer.dpi,
                value: `${competition.specs.minDPI}`,
              },
            ]
          : []),
        ...(competition.specs.maxWordCount
          ? [
              {
                label: m.drawer.statement,
                value: meta(
                  `${competition.specs.maxWordCount} ${m.drawer.statementUnit}`,
                ),
              },
            ]
          : []),
        {
          label: m.drawer.watermark,
          value: meta(
            competition.specs.noWatermark
              ? m.drawer.watermarkNone
              : m.drawer.watermarkCheck,
          ),
        },
      ]
    : []

  const specRows = chunkPairs(specItems)

  function startEditCustom() {
    if (!competition?.isCustom) return
    setCustomEditId(competition.id)
    setAddOpen(true)
  }

  function confirmDeleteCustom() {
    if (!competition?.isCustom) return
    if (!window.confirm(m.drawer.deleteConfirm)) return
    removeCustom(competition.id)
  }

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
        {competition && localized && (
          <div className="flex h-full flex-col overflow-y-auto px-7 py-7 sm:px-9">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] tracking-[0.20em] text-ink-soft uppercase">
                {competition.shortName}
              </p>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label={m.drawer.close}
                className="shrink-0 cursor-pointer bg-transparent py-1 pl-1 -mr-1 text-ink-soft transition-colors hover:text-ink"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="mt-4 flex items-end justify-between gap-4">
              <h2 className="min-w-0 text-3xl font-medium tracking-tight">
                {competition.name}
              </h2>
              {officialUrl && (
                <a
                  href={officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mb-1 inline-flex shrink-0 items-center gap-1 text-sm font-medium text-ink-soft transition-colors hover:text-primary"
                >
                  {meta(m.drawer.official)}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              )}
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              {meta(m.categories[competition.category])} ·{' '}
              {meta(localized.country)} ·{' '}
              {meta(m.tiers[competition.tier])}
            </p>

            <div className="mt-6 flex flex-col gap-6">
              {!status ? (
                <button
                  type="button"
                  onClick={() => addToBoard(competition.id)}
                  className={cn(outlineButton, 'w-full')}
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
                  <Select
                    className="ml-auto w-auto min-w-[10.5rem]"
                    aria-label={m.drawer.statusLabel}
                    value={status}
                    options={STATUS_COLUMNS.map((column) => ({
                      value: column.id,
                      label: m.status[column.id],
                    }))}
                    onChange={(next) =>
                      setStatus(competition.id, next as TrackStatus)
                    }
                    triggerClassName="rounded-lg bg-surface px-3 py-1.5 pr-9 shadow-sm shadow-ink/10 focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              )}

              {competition.isCustom && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startEditCustom}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-muted hover:text-ink"
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    {m.drawer.editCustom}
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteCustom}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-danger transition-colors hover:bg-danger/10"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    {m.drawer.deleteCustom}
                  </button>
                </div>
              )}

              {localized.summary && (
                <p className="text-[15px] leading-relaxed text-ink-muted">
                  {localized.summary}
                </p>
              )}

              <div className="shrink-0 overflow-hidden rounded-xl border border-ink/20">
                <table className="w-full table-fixed border-collapse">
                  <tbody>
                    {specRows.map((row, rowIndex) => {
                      const lastRow = rowIndex === specRows.length - 1
                      const cells =
                        row.length === 1
                          ? [...row, { value: '' } as SpecItem]
                          : row
                      return (
                        <tr key={rowIndex}>
                          {cells.map((cell, cellIndex) => {
                            const lastCol = cellIndex === cells.length - 1
                            const edge = cn(
                              !lastRow && 'border-b',
                              !lastCol && 'border-r',
                            )
                            if (!cell.value && !cell.label) {
                              return (
                                <td
                                  key={cellIndex}
                                  className={cn('border-ink/20', edge)}
                                  aria-hidden
                                />
                              )
                            }
                            return (
                              <SpecCell
                                key={cellIndex}
                                label={cell.label}
                                value={cell.value}
                                className={edge}
                              />
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {(localized.judging?.preliminary ||
                localized.judging?.final ||
                localized.judging?.notes) && (
                <div>
                  <p className="font-mono text-[11px] tracking-[0.14em] text-ink-soft uppercase">
                    {m.drawer.judging}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {[
                      localized.judging.preliminary &&
                        formatJudgingPhase(
                          'preliminary',
                          localized.judging.preliminary,
                          lang,
                        ),
                      localized.judging.final &&
                        formatJudgingPhase(
                          'final',
                          localized.judging.final,
                          lang,
                        ),
                      localized.judging.notes && meta(localized.judging.notes),
                    ]
                      .filter(Boolean)
                      .join(lang === 'zh' ? '。' : '. ')}
                  </p>
                  {localized.judging.judges && (
                    <p className="mt-2 text-sm text-ink-muted">
                      {localized.judging.judges.map((judge) => meta(judge)).join(' · ')}
                    </p>
                  )}
                </div>
              )}

              <div className="border-t border-ink/15 pt-6">
                <RightsBadge value={competition.rightsEthics} />
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {lang === 'zh'
                    ? competition.isCustom &&
                      localized.rightsNotes.startsWith('User-added')
                      ? '用户本地添加的赛事，参赛前请自行核对官方条款。'
                      : localized.rightsNotes
                    : `${m.rights[competition.rightsEthics].hint} ${localized.rightsNotes}`}
                </p>
                {!stillOpen && cycle && (
                  <p className="mt-2 font-mono text-sm text-ink-muted">
                    {m.drawer.nextCycleNote} {cycle.year} {cycle.quarter}
                  </p>
                )}
              </div>

              <div className="border-t border-ink/15 pt-8">
                <p className="rounded-xl bg-primary/5 px-4 py-3 text-sm leading-relaxed text-ink-muted">
                  {m.drawer.disclaimer}
                </p>
                {localized.tags.length > 0 && (
                  <p className="mt-6 text-sm text-ink-muted">
                    {localized.tags.map((tag) => `#${tag}`).join('  ')}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 pt-10">
              <button
                type="button"
                onClick={() => downloadDeadlineIcs(competition)}
                className={outlineButton}
              >
                <CalendarPlus className="size-4" aria-hidden />
                {m.drawer.exportIcs}
              </button>
              <button
                type="button"
                onClick={() => void downloadSubmissionPack(competition)}
                className={outlineButton}
              >
                <Package className="size-4" aria-hidden />
                {m.drawer.pack}
              </button>
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
