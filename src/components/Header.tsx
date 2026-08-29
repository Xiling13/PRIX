import { useEffect, useMemo, useRef } from 'react'
import { format } from 'date-fns'
import { Plus, Search } from 'lucide-react'
import { CATEGORY_TABS } from '../lib/labels'
import { cn } from '../lib/cn'
import { useMessages } from '../lib/i18n'
import { useNow } from '../hooks/useNow'
import { useAppStore } from '../store/useAppStore'
import { Button } from './Button'

function isMac() {
  return (
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad/.test(navigator.userAgent)
  )
}

export function Header() {
  const m = useMessages()
  const now = useNow(1000)
  const view = useAppStore((s) => s.view)
  const lang = useAppStore((s) => s.lang)
  const categoryFilter = useAppStore((s) => s.categoryFilter)
  const searchQuery = useAppStore((s) => s.searchQuery)
  const setView = useAppStore((s) => s.setView)
  const setLang = useAppStore((s) => s.setLang)
  const setCategoryFilter = useAppStore((s) => s.setCategoryFilter)
  const setSearchQuery = useAppStore((s) => s.setSearchQuery)
  const setAddOpen = useAppStore((s) => s.setAddOpen)
  const inputRef = useRef<HTMLInputElement>(null)

  const categoryTabs = useMemo(() => {
    const locale = lang === 'zh' ? 'zh-CN' : 'en'
    const rest = CATEGORY_TABS.filter((tab) => tab.id !== 'all').sort((a, b) =>
      m.categories[a.id].localeCompare(m.categories[b.id], locale, {
        sensitivity: 'base',
      }),
    )
    return [CATEGORY_TABS[0], ...rest]
  }, [lang, m.categories])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="px-4 pt-6 pb-0 sm:px-10 sm:pt-7 lg:px-14">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <p className="font-mono text-base font-semibold tracking-[0.14em]">
            PRIX
          </p>
          <p className="hidden text-sm text-ink-soft md:block">{m.tagline}</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="hidden font-mono text-sm text-ink-soft sm:block">
            {format(now, 'HH:mm:ss zzz')}
          </p>
          <div className="flex rounded-full bg-muted p-0.5 text-xs font-medium">
            {(['en', 'zh'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={cn(
                  'cursor-pointer rounded-full px-2.5 py-0.5 leading-none transition-colors',
                  lang === l
                    ? 'bg-surface text-ink shadow-sm shadow-ink/10'
                    : 'text-ink-soft hover:text-ink',
                )}
              >
                {l === 'en' ? 'EN' : '汉'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:mt-6 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative flex w-full max-w-md items-center lg:max-w-lg">
          <Search
            className="pointer-events-none absolute left-3.5 size-3.5 text-ink-soft/60"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={m.searchPlaceholder}
            className="w-full rounded-full bg-surface py-2 pr-14 pl-9 text-sm shadow-sm shadow-ink/8 transition-shadow placeholder:text-ink-soft/60 focus:shadow-md focus:shadow-primary/15 focus:ring-2 focus:ring-primary/40"
          />
          <kbd className="pointer-events-none absolute right-3 hidden rounded-md bg-muted px-1 py-0.5 font-mono text-[10px] text-ink-soft/60 sm:block">
            {isMac() ? '⌘K' : 'Ctrl K'}
          </kbd>
        </label>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex rounded-full bg-muted p-0.5">
            {(
              [
                ['list', m.views.list],
                ['tracker', m.views.tracker],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                className={cn(
                  'cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  view === id
                    ? 'bg-surface text-ink shadow-sm shadow-ink/10'
                    : 'text-ink-soft hover:text-ink',
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <Button variant="primary" className="px-3 py-1.5 text-xs" onClick={() => setAddOpen(true)}>
            <Plus className="size-3.5" aria-hidden />
            {m.addCustom}
          </Button>
        </div>
      </div>

      <nav className="mt-6 mb-6 flex gap-0.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categoryTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategoryFilter(tab.id)}
            className={cn(
              'shrink-0 cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              categoryFilter === tab.id
                ? 'bg-muted text-primary'
                : 'text-ink-soft hover:bg-muted/60 hover:text-ink',
            )}
          >
            {m.categories[tab.id]}
          </button>
        ))}
      </nav>
    </header>
  )
}
