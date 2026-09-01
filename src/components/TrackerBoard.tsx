import { useMemo, useState, type DragEvent } from 'react'
import { X } from 'lucide-react'
import type { Competition, TrackStatus } from '../types/competition'
import { STATUS_COLUMNS } from '../lib/labels'
import { cn } from '../lib/cn'
import { pageX } from '../lib/layout'
import { useMessages } from '../lib/i18n'
import { searchCompetitions } from '../lib/search'
import { useAllCompetitions, useAppStore } from '../store/useAppStore'
import { Button } from './Button'

function TrackerListRow({
  competition,
  dragging,
  onSelect,
  onRemove,
  onDragStart,
  onDragEnd,
  removeLabel,
}: {
  competition: Competition
  dragging: boolean
  onSelect: () => void
  onRemove: () => void
  onDragStart: (event: DragEvent) => void
  onDragEnd: () => void
  removeLabel: string
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'group flex min-w-0 cursor-grab items-center gap-2 rounded-xl bg-surface px-4.5 py-3 shadow-sm shadow-ink/5 active:cursor-grabbing',
        dragging && 'opacity-50',
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="min-w-0 flex-1 truncate text-left text-sm font-medium text-ink"
      >
        {competition.name}
      </button>
      <button
        type="button"
        aria-label={removeLabel}
        onClick={onRemove}
        className="shrink-0 cursor-pointer rounded-md p-1 text-ink-soft transition-colors hover:bg-muted hover:text-ink"
      >
        <X className="size-3.5" aria-hidden />
      </button>
    </div>
  )
}

function TrackerCard({
  competition,
  dragging,
  lang,
  onRemove,
  onSelect,
  onDragStart,
  onDragEnd,
  removeLabel,
  viewSpecsLabel,
}: {
  competition: Competition
  dragging: boolean
  lang: string
  onRemove: () => void
  onSelect: () => void
  onDragStart: (event: DragEvent) => void
  onDragEnd: () => void
  removeLabel: string
  viewSpecsLabel: string
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'group cursor-grab rounded-xl bg-surface px-4.5 py-4 shadow-sm shadow-ink/5 active:cursor-grabbing',
        dragging && 'opacity-50',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[11px] tracking-[0.16em] text-ink-soft uppercase">
          {competition.shortName}
        </p>
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="cursor-pointer rounded-md p-0.5 text-ink-soft/0 transition-colors group-hover:text-ink-soft hover:bg-muted hover:text-ink"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      </div>
      <p className="mt-1 text-sm leading-snug font-medium">{competition.name}</p>
      <button
        type="button"
        onClick={onSelect}
        className="mt-3 inline-flex cursor-pointer items-center gap-0.5 text-sm font-medium text-primary transition-colors hover:text-primary-dim"
      >
        {lang === 'en' ? (
          <>
            <span>{viewSpecsLabel}</span>
            <span className="relative top-px" aria-hidden>
              →
            </span>
          </>
        ) : (
          <>{viewSpecsLabel} →</>
        )}
      </button>
    </div>
  )
}

function TrackerColumn({
  items,
  dragging,
  dragActive,
  lang,
  label,
  layout,
  onDrop,
  onDragOver,
  onRemove,
  onSelect,
  onDragStart,
  onDragEnd,
  removeLabel,
  viewSpecsLabel,
}: {
  items: Competition[]
  dragging: string | null
  dragActive: boolean
  lang: string
  label: string
  layout: 'mobile' | 'desktop'
  onDrop: (event: DragEvent) => void
  onDragOver: (event: DragEvent) => void
  onRemove: (id: string) => void
  onSelect: (id: string) => void
  onDragStart: (id: string, event: DragEvent) => void
  onDragEnd: () => void
  removeLabel: string
  viewSpecsLabel: string
}) {
  const isMobile = layout === 'mobile'

  return (
    <section
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(isMobile ? 'min-[480px]:hidden' : 'hidden min-[480px]:block min-w-[230px] flex-1')}
    >
      <p className="px-1 font-mono text-[11px] tracking-[0.16em] text-ink-muted uppercase">
        {label}
        <span className="ml-2">{items.length}</span>
      </p>
      <div
        className={cn(
          'mt-2 transition-colors duration-150',
          isMobile
            ? cn(
                'flex flex-col gap-3 rounded-2xl p-2',
                dragActive ? 'bg-primary/5' : 'bg-transparent',
              )
            : cn(
                'flex min-h-[66vh] max-h-[75vh] flex-col gap-3 rounded-2xl p-2',
                dragActive ? 'bg-primary/5' : 'bg-transparent',
              ),
        )}
      >
        {items.map((competition) =>
          isMobile ? (
            <TrackerListRow
              key={competition.id}
              competition={competition}
              dragging={dragging === competition.id}
              removeLabel={removeLabel}
              onSelect={() => onSelect(competition.id)}
              onRemove={() => onRemove(competition.id)}
              onDragStart={(event) => onDragStart(competition.id, event)}
              onDragEnd={onDragEnd}
            />
          ) : (
            <TrackerCard
              key={competition.id}
              competition={competition}
              dragging={dragging === competition.id}
              lang={lang}
              removeLabel={removeLabel}
              viewSpecsLabel={viewSpecsLabel}
              onRemove={() => onRemove(competition.id)}
              onSelect={() => onSelect(competition.id)}
              onDragStart={(event) => onDragStart(competition.id, event)}
              onDragEnd={onDragEnd}
            />
          ),
        )}
      </div>
    </section>
  )
}

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

  function handleDrop(event: DragEvent, status: TrackStatus) {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/plain') || dragging
    if (id) setStatus(id, status)
    setDragging(null)
  }

  function handleDragStart(id: string, event: DragEvent) {
    setDragging(id)
    event.dataTransfer.setData('text/plain', id)
  }

  const columnProps = (columnId: TrackStatus) => ({
    items: byStatus(columnId),
    dragging,
    dragActive: Boolean(dragging),
    lang,
    label: m.status[columnId],
    onDrop: (event: DragEvent) => handleDrop(event, columnId),
    onDragOver: (event: DragEvent) => event.preventDefault(),
    onRemove: removeFromBoard,
    onSelect: setSelectedId,
    onDragStart: handleDragStart,
    onDragEnd: () => setDragging(null),
    removeLabel: m.tracker.remove,
    viewSpecsLabel: m.tracker.viewSpecs,
  })

  if (tracked === 0) {
    return (
      <div className={cn(pageX, 'pb-24')}>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
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
      <div className={cn(pageX, 'pb-24')}>
        <p className="py-16 text-center text-sm text-ink-soft">
          {searchQuery.trim() ? m.tracker.noResults : m.tracker.emptyCategory}
        </p>
      </div>
    )
  }

  return (
    <div className={cn(pageX, 'pt-2 pb-24')}>
      <div className="flex flex-col gap-8 min-[480px]:hidden">
        {STATUS_COLUMNS.map((column) => (
          <TrackerColumn key={column.id} {...columnProps(column.id)} layout="mobile" />
        ))}
      </div>
      <div className="hidden gap-5 overflow-x-auto pb-2 min-[480px]:flex">
        {STATUS_COLUMNS.map((column) => (
          <TrackerColumn key={column.id} {...columnProps(column.id)} layout="desktop" />
        ))}
      </div>
    </div>
  )
}
