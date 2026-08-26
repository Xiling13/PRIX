import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import seed from '../data/competitions.json'
import type { Category, Competition, TrackStatus } from '../types/competition'
import { isWithinRetention } from '../lib/dates'

const seededCompetitions = seed as Competition[]

export type AppView = 'list' | 'kanban'

interface AppState {
  view: AppView
  commandOpen: boolean
  addOpen: boolean
  selectedId: string | null
  categoryFilter: 'all' | Category
  progress: Record<string, TrackStatus>
  customCompetitions: Competition[]
  setView: (view: AppView) => void
  setCommandOpen: (open: boolean) => void
  setAddOpen: (open: boolean) => void
  setSelectedId: (id: string | null) => void
  setCategoryFilter: (filter: 'all' | Category) => void
  setStatus: (id: string, status: TrackStatus) => void
  addToBoard: (id: string) => void
  removeFromBoard: (id: string) => void
  addCustom: (competition: Competition) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: 'list',
      commandOpen: false,
      addOpen: false,
      selectedId: null,
      categoryFilter: 'all',
      progress: {},
      customCompetitions: [],
      setView: (view) => set({ view }),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
      setAddOpen: (addOpen) => set({ addOpen }),
      setSelectedId: (selectedId) => set({ selectedId }),
      setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
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
      addCustom: (competition) =>
        set({
          customCompetitions: [...get().customCompetitions, competition],
        }),
    }),
    {
      name: 'prix-storage',
      partialize: (state) => ({
        view: state.view,
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
