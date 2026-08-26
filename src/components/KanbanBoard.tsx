import { useState } from 'react'
import type { TrackStatus } from '../types/competition'
import { STATUS_COLUMNS } from '../lib/labels'
import { cn } from '../lib/cn'
import { useAllCompetitions, useAppStore } from '../store/useAppStore'

export function KanbanBoard() {
  const competitions = useAllCompetitions()
  const progress = useAppStore((s) => s.progress)
  const setStatus = useAppStore((s) => s.setStatus)
  const setSelectedId = useAppStore((s) => s.setSelectedId)
  const [dragging, setDragging] = useState<string | null>(null)

  const byStatus = (status: TrackStatus) =>
    competitions.filter((c) => progress[c.id] === status)
  const tracked = Object.keys(progress).length

  return (
    <div className="px-6 pb-24 sm:px-10 lg:px-16">
      {tracked === 0 && (
        <p className="mb-10 max-w-md text-sm text-ink-soft">
          Add a call from the list or search palette. Status stays in this
          browser.
        </p>
      )}
      <div className="flex gap-6 overflow-x-auto">
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
              className="min-w-[220px] flex-1"
            >
              <p className="font-mono text-[11px] tracking-[0.22em] text-ink-soft">
                {column.label}
                <span className="ml-2">{items.length}</span>
              </p>
              <div className="mt-4 flex min-h-[40vh] flex-col gap-3 rounded-3xl bg-muted/60 p-3">
                {items.length === 0 && (
                  <p className="px-2 py-8 text-sm text-ink-soft">Empty</p>
                )}
                {items.map((competition) => (
                  <button
                    key={competition.id}
                    type="button"
                    draggable
                    onDragStart={(event) => {
                      setDragging(competition.id)
                      event.dataTransfer.setData('text/plain', competition.id)
                    }}
                    onClick={() => setSelectedId(competition.id)}
                    className={cn(
                      'rounded-2xl bg-surface px-4 py-4 text-left shadow-sm shadow-ink/5',
                      dragging === competition.id && 'opacity-60',
                    )}
                  >
                    <p className="font-mono text-[11px] tracking-[0.18em] text-ink-soft">
                      {competition.shortName}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-snug">
                      {competition.name}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
