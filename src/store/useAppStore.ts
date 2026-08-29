import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import seed from '../data/competitions.json'
import type { Category, Competition, TrackStatus } from '../types/competition'
import { isWithinRetention } from '../lib/dates'
import type { TrackerBackup } from '../lib/trackerBackup'

const seededCompetitions = seed as Competition[]

export type AppView = 'list' | 'tracker'
export type Lang = 'en' | 'zh'

interface AppState {
  view: AppView
  lang: Lang
  addOpen: boolean
  customEditId: string | null
  selectedId: string | null
  categoryFilter: 'all' | Category
  searchQuery: string
  progress: Record<string, TrackStatus>
  customCompetitions: Competition[]
  setView: (view: AppView) => void
  setLang: (lang: Lang) => void
  setAddOpen: (open: boolean) => void
  setCustomEditId: (id: string | null) => void
  setSelectedId: (id: string | null) => void
  setCategoryFilter: (filter: 'all' | Category) => void
  setSearchQuery: (query: string) => void
  setStatus: (id: string, status: TrackStatus) => void
  addToBoard: (id: string) => void
  removeFromBoard: (id: string) => void
  addCustom: (competition: Competition) => void
  updateCustom: (id: string, competition: Competition) => void
  removeCustom: (id: string) => void
  importTrackerBackup: (backup: TrackerBackup) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: 'list',
      lang: 'en',
      addOpen: false,
      customEditId: null,
      selectedId: null,
      categoryFilter: 'all',
      searchQuery: '',
      progress: {},
      customCompetitions: [],
      setView: (view) =>
        set(
          view === 'tracker'
            ? { view, categoryFilter: 'all' }
            : { view },
        ),
      setLang: (lang) => set({ lang }),
      setAddOpen: (addOpen) => set({ addOpen }),
      setCustomEditId: (customEditId) => set({ customEditId }),
      setSelectedId: (selectedId) => set({ selectedId }),
      setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setStatus: (id, status) =>
        set({ progress: { ...get().progress, [id]: status } }),
      addToBoard: (id) => {
        if (get().progress[id]) return
        set({ progress: { ...get().progress, [id]: 'interested' } })
      },
      removeFromBoard: (id) => {
        const next = { ...get().progress }
        delete next[id]
        set({ progress: next })
      },
      addCustom: (competition) => {
        const { customCompetitions, progress } = get()
        set({
          customCompetitions: [...customCompetitions, competition],
          progress: progress[competition.id]
            ? progress
            : { ...progress, [competition.id]: 'interested' },
        })
      },
      updateCustom: (id, competition) =>
        set({
          customCompetitions: get().customCompetitions.map((item) =>
            item.id === id ? { ...competition, id, isCustom: true } : item,
          ),
        }),
      removeCustom: (id) => {
        const nextProgress = { ...get().progress }
        delete nextProgress[id]
        set({
          customCompetitions: get().customCompetitions.filter(
            (item) => item.id !== id,
          ),
          progress: nextProgress,
          selectedId: get().selectedId === id ? null : get().selectedId,
          customEditId: get().customEditId === id ? null : get().customEditId,
        })
      },
      importTrackerBackup: (backup) => {
        const customIds = new Set(
          get().customCompetitions.map((item) => item.id),
        )
        const mergedCustom = [...get().customCompetitions]
        for (const item of backup.customCompetitions) {
          if (!customIds.has(item.id)) {
            mergedCustom.push({ ...item, isCustom: true })
            customIds.add(item.id)
          }
        }
        set({
          progress: { ...get().progress, ...backup.progress },
          customCompetitions: mergedCustom,
        })
      },
    }),
    {
      name: 'prix-storage',
      partialize: (state) => ({
        view: state.view,
        lang: state.lang,
        progress: state.progress,
        customCompetitions: state.customCompetitions,
      }),
    },
  ),
)

export function useAllCompetitions(): Competition[] {
  const custom = useAppStore((s) => s.customCompetitions)
  return [...seededCompetitions, ...custom].filter((c) => isWithinRetention(c))
}

export function useSelectedCompetition(): Competition | undefined {
  const selectedId = useAppStore((s) => s.selectedId)
  const all = useAllCompetitions()
  return all.find((c) => c.id === selectedId)
}

export function useCustomCompetition(id: string | null): Competition | undefined {
  const custom = useAppStore((s) => s.customCompetitions)
  return id ? custom.find((item) => item.id === id) : undefined
}
