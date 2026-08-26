import { Command } from 'cmdk'
import { useEffect, useMemo, useState } from 'react'
import { searchCompetitions } from '../lib/search'
import { formatCountdown, isOpen, isUrgent } from '../lib/dates'
import { CATEGORY_LABELS } from '../lib/labels'
import { cn } from '../lib/cn'
import { useNow } from '../hooks/useNow'
import { useAllCompetitions, useAppStore } from '../store/useAppStore'

export function CommandPalette() {
  const now = useNow(30_000)
  const open = useAppStore((s) => s.commandOpen)
  const setOpen = useAppStore((s) => s.setCommandOpen)
  const setSelectedId = useAppStore((s) => s.setSelectedId)
  const addToBoard = useAppStore((s) => s.addToBoard)
  const competitions = useAllCompetitions()
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState('')

  const results = useMemo(
    () => searchCompetitions(competitions, query),
    [competitions, query],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        if (activeId) addToBoard(activeId)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, activeId, addToBoard])

  return (
    <Command.Dialog
      open={open}
      label="Search competitions"
      value={activeId}
      onValueChange={setActiveId}
      shouldFilter={false}
      loop
      overlayClassName="fixed inset-0 z-50 bg-ink/20 backdrop-blur-sm"
      contentClassName="fixed top-[16vh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-3xl bg-surface/95 shadow-2xl shadow-ink/10 outline-none backdrop-blur-xl"
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery('')
      }}
    >
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="TDC, Poster, #Free, Japan…"
          className="w-full bg-transparent px-6 py-5 text-lg placeholder:text-ink-soft"
        />
        <p className="px-6 pb-3 font-mono text-[11px] tracking-wide text-ink-soft">
          Enter opens specs · {/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘S' : 'Ctrl S'} adds to board
        </p>
        <Command.List className="max-h-[48vh] overflow-y-auto px-2 pb-3">
          <Command.Empty className="px-4 py-10 text-sm text-ink-soft">
            No matching calls.
          </Command.Empty>
          {results.map((competition) => {
            const openCall = isOpen(competition, now)
            return (
              <Command.Item
                key={competition.id}
                value={competition.id}
                onSelect={() => {
                  setSelectedId(competition.id)
                  setOpen(false)
                }}
                className={cn(
                  'cmdk-item flex cursor-pointer items-baseline justify-between gap-4 rounded-2xl px-4 py-3',
                  !openCall && 'opacity-50',
                )}
              >
                <span>
                  <span className="font-medium">{competition.shortName}</span>
                  <span className="ml-3 text-sm text-ink-soft">
                    {competition.name}
                  </span>
                  <span className="ml-3 text-xs text-ink-soft">
                    {CATEGORY_LABELS[competition.category]} · {competition.country}
                  </span>
                </span>
                <span
                  className={cn(
                    'shrink-0 font-mono text-xs',
                    isUrgent(competition, now) && 'text-magenta',
                  )}
                >
                  {openCall ? formatCountdown(competition, now) : 'Closed'}
                </span>
              </Command.Item>
            )
          })}
        </Command.List>
    </Command.Dialog>
  )
}
