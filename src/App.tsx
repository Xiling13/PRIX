import { AddCustomModal } from './components/AddCustomModal'
import { CompetitionList } from './components/CompetitionList'
import { Header } from './components/Header'
import { SpecDrawer } from './components/SpecDrawer'
import { TrackerBoard } from './components/TrackerBoard'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const view = useAppStore((s) => s.view)

  return (
    <div className="min-h-svh bg-canvas">
      <Header />
      {view === 'list' ? <CompetitionList /> : <TrackerBoard />}
      <SpecDrawer />
      <AddCustomModal />
    </div>
  )
}
