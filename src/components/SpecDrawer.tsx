import { useAppStore, useSelectedCompetition } from '../store/useAppStore'
import {
  formatFee,
  formatLocalAbsolute,
  formatSourceDeadline,
  inferNextCycle,
  isOpen,
} from '../lib/dates'
import { downloadDeadlineIcs } from '../lib/ics'
import {
  CATEGORY_LABELS,
  ELIGIBILITY_LABELS,
  RIGHTS_LABELS,
  TIER_LABELS,
} from '../lib/labels'
import { downloadSubmissionPack } from '../lib/submissionPack'
import { cn } from '../lib/cn'
import { RightsBadge } from './RightsBadge'

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.18em] text-ink-soft">
        {label}
      </p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  )
}

export function SpecDrawer() {
  const competition = useSelectedCompetition()
  const selectedId = useAppStore((s) => s.selectedId)
  const setSelectedId = useAppStore((s) => s.setSelectedId)
  const progress = useAppStore((s) => s.progress)
  const addToBoard = useAppStore((s) => s.addToBoard)
  const onBoard = competition ? Boolean(progress[competition.id]) : false
  const open = Boolean(competition)
  const cycle = competition ? inferNextCycle(competition) : null
  const stillOpen = competition ? isOpen(competition) : false

  return (
    <div
      className={cn(
        'fixed inset-0 z-40 transition-opacity duration-300',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
        onClick={() => setSelectedId(null)}
      />
      <aside
        className={cn(
          'absolute top-0 right-0 flex h-full w-full max-w-xl flex-col bg-surface/95 shadow-2xl shadow-ink/10 backdrop-blur-xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {competition && (
          <div className="flex h-full flex-col overflow-y-auto px-8 py-8 sm:px-10">
            <div className="flex items-start justify-between gap-4">
              <p className="font-mono text-[11px] tracking-[0.28em] text-ink-soft">
                {competition.shortName}
              </p>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="text-sm text-ink-soft hover:text-ink"
              >
                Close
              </button>
            </div>

            <h2 className="mt-4 text-3xl font-medium tracking-tight">
              {competition.name}
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              {CATEGORY_LABELS[competition.category]} · {competition.country} ·{' '}
              {TIER_LABELS[competition.tier]}
            </p>
            {competition.summary && (
              <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
                {competition.summary}
              </p>
            )}

            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8">
              <Spec
                label="Local deadline"
                value={formatLocalAbsolute(
                  competition.deadlines.final,
                  competition.deadlines.timezone,
                )}
              />
              <Spec
                label={`Organizer (${competition.deadlines.timezone})`}
                value={formatSourceDeadline(
                  competition.deadlines.final,
                  competition.deadlines.timezone,
                )}
              />
              {competition.deadlines.earlyBird && (
                <Spec
                  label="Early bird"
                  value={formatLocalAbsolute(
                    competition.deadlines.earlyBird,
                    competition.deadlines.timezone,
                  )}
                />
              )}
              <Spec label="Fee" value={formatFee(competition)} />
              <Spec
                label="Eligibility"
                value={ELIGIBILITY_LABELS[competition.eligibility]}
              />
              <Spec
                label="Color space"
                value={competition.specs.colorSpace}
              />
              <Spec
                label="Formats"
                value={competition.specs.fileFormats.join('  ')}
              />
              <Spec
                label="Max file"
                value={`${competition.specs.maxFileSizeMB} MB`}
              />
              {competition.specs.minDPI && (
                <Spec label="DPI" value={`${competition.specs.minDPI}`} />
              )}
              {competition.specs.maxWordCount && (
                <Spec
                  label="Statement"
                  value={`${competition.specs.maxWordCount} words max`}
                />
              )}
              <Spec
                label="Watermark"
                value={competition.specs.noWatermark ? 'None' : 'Check rules'}
              />
            </div>

            {(competition.judging?.preliminary ||
              competition.judging?.final ||
              competition.judging?.notes) && (
              <div className="mt-12">
                <p className="font-mono text-[11px] tracking-[0.18em] text-ink-soft">
                  Judging
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

            <div className="mt-12">
              <RightsBadge value={competition.rightsEthics} />
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {RIGHTS_LABELS[competition.rightsEthics].hint}{' '}
                {competition.rightsNotes}
              </p>
            </div>

            {!stillOpen && cycle && (
              <p className="mt-8 font-mono text-sm text-ink-soft">
                Closed · next cycle expected {cycle.year} {cycle.quarter}
              </p>
            )}

            {competition.tags.length > 0 && (
              <p className="mt-8 text-sm text-ink-soft">
                {competition.tags.map((tag) => `#${tag}`).join('  ')}
              </p>
            )}

            <div className="mt-auto flex flex-col gap-4 pt-12 text-sm">
              <button
                type="button"
                onClick={() => addToBoard(competition.id)}
                className="text-left text-cyan-dim"
              >
                {onBoard ? 'Already on your board' : 'Add to board'}
              </button>
              <button
                type="button"
                onClick={() => downloadDeadlineIcs(competition)}
                className="text-left"
              >
                Export to calendar
              </button>
              <button
                type="button"
                onClick={() => void downloadSubmissionPack(competition)}
                className="text-left"
              >
                Generate submission pack
              </button>
              <a
                href={competition.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="text-ink-soft"
              >
                Official site
              </a>
            </div>
          </div>
        )}
        {!competition && selectedId && (
          <p className="p-10 text-sm text-ink-soft">Call not found.</p>
        )}
      </aside>
    </div>
  )
}
