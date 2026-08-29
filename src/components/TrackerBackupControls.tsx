import { useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { cn } from '../lib/cn'
import { useMessages } from '../lib/i18n'
import {
  buildTrackerBackup,
  downloadTrackerBackup,
  parseTrackerBackup,
} from '../lib/trackerBackup'
import { useAppStore } from '../store/useAppStore'

const backupButton =
  'inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium leading-none text-ink-soft transition-colors hover:text-primary'

export function TrackerBackupControls({ className }: { className?: string }) {
  const m = useMessages()
  const progress = useAppStore((s) => s.progress)
  const customCompetitions = useAppStore((s) => s.customCompetitions)
  const importTrackerBackup = useAppStore((s) => s.importTrackerBackup)
  const [importNotice, setImportNotice] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function exportBackup() {
    downloadTrackerBackup(buildTrackerBackup(progress, customCompetitions))
  }

  async function onImportFile(file: File) {
    try {
      const raw = JSON.parse(await file.text()) as unknown
      const backup = parseTrackerBackup(raw)
      if (!backup) {
        setImportNotice(m.tracker.importError)
        return
      }
      importTrackerBackup(backup)
      setImportNotice(m.tracker.importSuccess)
    } catch {
      setImportNotice(m.tracker.importError)
    }
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <button type="button" onClick={exportBackup} className={backupButton}>
        <Download className="size-3" aria-hidden />
        {m.tracker.export}
      </button>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className={backupButton}
      >
        <Upload className="size-3" aria-hidden />
        {m.tracker.import}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void onImportFile(file)
          event.target.value = ''
        }}
      />
      {importNotice && (
        <span className="sr-only" role="status">
          {importNotice}
        </span>
      )}
    </div>
  )
}
