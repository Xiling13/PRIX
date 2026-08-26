import { useEffect } from 'react'
import { AddCustomModal } from './components/AddCustomModal'
import { CommandPalette } from './components/CommandPalette'
import { CompetitionList } from './components/CompetitionList'
import { Header } from './components/Header'
import { KanbanBoard } from './components/KanbanBoard'
import { SpecDrawer } from './components/SpecDrawer'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const view = useAppStore((s) => s.view)
  const commandOpen = useAppStore((s) => s.commandOpen)
  const setCommandOpen = useAppStore((s) => s.setCommandOpen)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(!commandOpen)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [commandOpen, setCommandOpen])

  return (
    <div className="prix-atmosphere relative min-h-svh">
      <div className="prix-grain" />
      <Header />
      {view === 'list' ? <CompetitionList /> : <KanbanBoard />}
      <SpecDrawer />
      <CommandPalette />
      <AddCustomModal />
    </div>
  )
}
