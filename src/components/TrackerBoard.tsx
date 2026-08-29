import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import type { TrackStatus } from '../types/competition'
import { STATUS_COLUMNS } from '../lib/labels'
import { cn } from '../lib/cn'
import { useMessages } from '../lib/i18n'
import { searchCompetitions } from '../lib/search'
import { useAllCompetitions, useAppStore } from '../store/useAppStore'
import { Button } from './Button'

export function TrackerBoard() {
  const m = useMessages()
  const lang = useAppStore((s) => s.lang)
  const competitions = useAllCompetitions()
  const progress = useAppStore((s) => s.progress)
  const categoryFilter = useAppStore((s) => s.categoryFilter)
  const searchQuery = useAppStore((s) => s.searchQuery)
  const setStatus = useAppStore((s) => s.setStatus)
  const setSelectedId = useAppStore((s) => s.setSelectedId)
  const removeFromBoard = useAppStore((s) => s.removeFromBoard)
  const setView = useAppStore((s) => s.setView)
  const [dragging, setDragging] = useState<string | null>(null)

  const filteredTracked = useMemo(() => {
    const tracked = competitions.filter((c) => progress[c.id])
    const byCategory =
      categoryFilter === 'all'
        ? tracked
        : tracked.filter((c) => c.category === categoryFilter)
    return searchCompetitions(byCategory, searchQuery)
  }, [competitions, progress, categoryFilter, searchQuery])

  const byStatus = (status: TrackStatus) =>
    filteredTracked.filter((c) => progress[c.id] === status)

  const tracked = Object.keys(progress).length

  if (tracked === 0) {
    return (
      <div className="px-6 pb-24 sm:px-10 lg:px-14">
        <div className="flex flex-col items-start gap-4 px-5 py-16">
          <p className="text-sm text-ink-soft">{m.tracker.empty}</p>
          <Button variant="primary" onClick={() => setView('list')}>
            {m.tracker.browse}
          </Button>
        </div>
      </div>
    )
  }

  if (filteredTracked.length === 0) {
    return (
      <div className="px-6 pb-24 sm:px-10 lg:px-14">
        <p className="px-5 py-16 text-sm text-ink-soft">
          {searchQuery.trim() ? m.tracker.noResults : m.tracker.emptyCategory}
        </p>
      </div>
    )
  }

  return (
    <div className="px-6 pt-2 pb-24 sm:px-10 lg:px-14">
      <div className="flex gap-5 overflow-x-auto pb-2">
        {STATUS_COLUMNS.map((column) => {
          const items = byStatus(column.id)
          return (
            <section
              key={column.id}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                const id = event.dataTransfer.getData('text/plain') || dragging
                if (id) setStatus(id, column.id)
                setDragging(null)
              }}
              className="min-w-[230px] flex-1"
            >
              <p className="px-1 font-mono text-[11px] tracking-[0.16em] text-ink-muted uppercase">
                {m.status[column.id]}
                <span className="ml-2">{items.length}</span>
              </p>
              <div
                className={cn(
                  'mt-2 flex min-h-[66vh] max-h-[75vh] flex-col gap-3 rounded-2xl p-2 transition-colors duration-150',
                  dragging ? 'bg-primary/5' : 'bg-transparent',
                )}
              >
                {items.map((competition) => (
                  <div
                    key={competition.id}
                    draggable
                    onDragStart={(event) => {
                      setDragging(competition.id)
                      event.dataTransfer.setData('text/plain', competition.id)
                    }}
                    onDragEnd={() => setDragging(null)}
                    className={cn(
                      'group cursor-grab rounded-xl bg-surface px-4.5 py-4 shadow-sm shadow-ink/5 active:cursor-grabbing',
                      dragging === competition.id && 'opacity-50',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mono text-[11px] tracking-[0.16em] text-ink-soft uppercase">
                        {competition.shortName}
                      </p>
                      <button
                        type="button"
                        aria-label={m.tracker.remove}
                        onClick={() => removeFromBoard(competition.id)}
                        className="cursor-pointer rounded-md p-0.5 text-ink-soft/0 transition-colors group-hover:text-ink-soft hover:bg-muted hover:text-ink"
                      >
                        <X className="size-3.5" aria-hidden />
                      </button>
                    </div>
                    <p className="mt-1 text-sm leading-snug font-medium">
                      {competition.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedId(competition.id)}
                      className="mt-3 inline-flex cursor-pointer items-center gap-0.5 text-sm font-medium text-primary transition-colors hover:text-primary-dim"
                    >
                      {lang === 'en' ? (
                        <>
                          <span>{m.tracker.viewSpecs}</span>
                          <span className="relative top-px" aria-hidden>
                            →
                          </span>
                        </>
                      ) : (
                        <>{m.tracker.viewSpecs} →</>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
