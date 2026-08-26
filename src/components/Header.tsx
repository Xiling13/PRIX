import { format } from 'date-fns'
import { CATEGORY_TABS } from '../lib/labels'
import { cn } from '../lib/cn'
import { useNow } from '../hooks/useNow'
import { useAppStore } from '../store/useAppStore'

function isMac() {
  return /Mac|iPhone|iPad/.test(navigator.userAgent)
}

export function Header() {
  const now = useNow(1000)
  const view = useAppStore((s) => s.view)
  const categoryFilter = useAppStore((s) => s.categoryFilter)
  const setView = useAppStore((s) => s.setView)
  const setCategoryFilter = useAppStore((s) => s.setCategoryFilter)
  const setCommandOpen = useAppStore((s) => s.setCommandOpen)
  const setAddOpen = useAppStore((s) => s.setAddOpen)
  const shortcut = isMac() ? '⌘K' : 'Ctrl K'

  return (
    <header className="px-6 pt-8 pb-6 sm:px-10 lg:px-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] tracking-[0.42em] text-ink-soft">
            P R I X
            <span className="tracking-[0.28em]"> // 26</span>
          </p>
          <p className="mt-3 max-w-md text-sm text-ink-soft">
            Open-call workstation for design, photography, and illustration.
          </p>
        </div>
        <p className="hidden font-mono text-sm text-ink-soft sm:block">
          {format(now, 'HH:mm:ss')}
          <span className="ml-2">{format(now, 'zzz')}</span>
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <nav className="flex gap-5 overflow-x-auto pb-1 text-sm text-ink-soft">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id)}
              className={cn(
                'shrink-0 transition-colors',
                categoryFilter === tab.id && 'text-ink',
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-5 text-sm">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="text-ink-soft transition-colors hover:text-ink"
          >
            Search
            <span className="ml-2 font-mono text-[11px] tracking-wide">
              {shortcut}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            className={cn(
              'transition-colors',
              view === 'list' ? 'text-ink' : 'text-ink-soft',
            )}
          >
            List
          </button>
          <button
            type="button"
            onClick={() => setView('kanban')}
            className={cn(
              'transition-colors',
              view === 'kanban' ? 'text-ink' : 'text-ink-soft',
            )}
          >
            Board
          </button>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="text-cyan-dim"
          >
            Add custom
          </button>
        </div>
      </div>
    </header>
  )
}
