import { useMemo } from 'react'
import { useNow } from '../hooks/useNow'
import { getFinalUtc, isOpen } from '../lib/dates'
import { useAllCompetitions, useAppStore } from '../store/useAppStore'
import { CompetitionRow } from './CompetitionRow'

export function CompetitionList() {
  const now = useNow(30_000)
  const competitions = useAllCompetitions()
  const categoryFilter = useAppStore((s) => s.categoryFilter)
  const setSelectedId = useAppStore((s) => s.setSelectedId)

  const { open, archived } = useMemo(() => {
    const filtered =
      categoryFilter === 'all'
        ? competitions
        : competitions.filter((c) => c.category === categoryFilter)

    const openItems = filtered
      .filter((c) => isOpen(c, now))
      .sort((a, b) => getFinalUtc(a).getTime() - getFinalUtc(b).getTime())
    const archivedItems = filtered
      .filter((c) => !isOpen(c, now))
      .sort((a, b) => getFinalUtc(b).getTime() - getFinalUtc(a).getTime())

    return { open: openItems, archived: archivedItems }
  }, [competitions, categoryFilter, now])

  return (
    <div className="px-6 pb-24 sm:px-10 lg:px-16">
      <div className="flex flex-col">
        {open.length === 0 && (
          <p className="px-5 py-16 text-sm text-ink-soft">
            No open calls in this category right now.
          </p>
        )}
        {open.map((competition) => (
          <CompetitionRow
            key={competition.id}
            competition={competition}
            now={now}
            onOpen={() => setSelectedId(competition.id)}
          />
        ))}
      </div>

      {archived.length > 0 && (
        <section className="mt-16">
          <p className="px-5 font-mono text-[11px] tracking-[0.28em] text-ink-soft">
            Archived / Past cycles
          </p>
          <div className="mt-4 flex flex-col">
            {archived.map((competition) => (
              <CompetitionRow
                key={competition.id}
                competition={competition}
                now={now}
                archived
                onOpen={() => setSelectedId(competition.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
