import { useMemo } from 'react'
import { useNow } from '../hooks/useNow'
import { getFinalUtc, isOpen } from '../lib/dates'
import { useMessages } from '../lib/i18n'
import { searchCompetitions } from '../lib/search'
import { useAllCompetitions, useAppStore } from '../store/useAppStore'
import { CompetitionRow } from './CompetitionRow'

const LIST_GRID =
  'lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,1fr)_7rem] lg:gap-x-6'

export function CompetitionList() {
  const m = useMessages()
  const now = useNow(30_000)
  const competitions = useAllCompetitions()
  const categoryFilter = useAppStore((s) => s.categoryFilter)
  const searchQuery = useAppStore((s) => s.searchQuery)

  const { open, archived } = useMemo(() => {
    const byCategory =
      categoryFilter === 'all'
        ? competitions
        : competitions.filter((c) => c.category === categoryFilter)
    const filtered = searchCompetitions(byCategory, searchQuery)

    const openItems = filtered
      .filter((c) => isOpen(c, now))
      .sort((a, b) => getFinalUtc(a).getTime() - getFinalUtc(b).getTime())
    const archivedItems = filtered
      .filter((c) => !isOpen(c, now))
      .sort((a, b) => getFinalUtc(b).getTime() - getFinalUtc(a).getTime())

    return { open: openItems, archived: archivedItems }
  }, [competitions, categoryFilter, searchQuery, now])

  return (
    <div className="px-4 pb-8 sm:px-10 lg:px-14">
      <div className={LIST_GRID}>
        {open.length === 0 && (
          <p className="py-16 text-sm text-ink-soft lg:col-span-3">
            {searchQuery.trim() ? m.noResults : m.emptyCategory}
          </p>
        )}
        {open.map((competition) => (
          <CompetitionRow
            key={competition.id}
            competition={competition}
            now={now}
          />
        ))}
      </div>

      {archived.length > 0 && (
        <section className="mt-12 lg:mt-16">
          <p className="font-mono text-[11px] tracking-[0.20em] text-ink-soft uppercase lg:pl-5">
            {m.archivedTitle}
          </p>
          <div className={`mt-4 ${LIST_GRID}`}>
            {archived.map((competition) => (
              <CompetitionRow
                key={competition.id}
                competition={competition}
                now={now}
                archived
              />
            ))}
          </div>
        </section>
      )}

      <footer className="mt-10 flex items-center justify-between border-t border-ink/10 pt-4 text-xs text-ink-soft lg:pl-5 lg:pr-5">
        <span>{m.footer.createdBy}</span>
        <span>2026</span>
      </footer>
    </div>
  )
}
