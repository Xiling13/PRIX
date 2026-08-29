import { saveAs } from 'file-saver'
import type { Competition, TrackStatus } from '../types/competition'

export const TRACKER_BACKUP_VERSION = 1 as const

export interface TrackerBackup {
  version: typeof TRACKER_BACKUP_VERSION
  exportedAt: string
  progress: Record<string, TrackStatus>
  customCompetitions: Competition[]
}

export function buildTrackerBackup(
  progress: Record<string, TrackStatus>,
  customCompetitions: Competition[],
): TrackerBackup {
  return {
    version: TRACKER_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    progress,
    customCompetitions,
  }
}

export function downloadTrackerBackup(backup: TrackerBackup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  })
  saveAs(blob, `prix-tracker-${backup.exportedAt.slice(0, 10)}.json`)
}

const VALID_STATUSES = new Set<TrackStatus>([
  'interested',
  'preparing',
  'submitted',
  'shortlisted',
  'won',
])

export function parseTrackerBackup(raw: unknown): TrackerBackup | null {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Partial<TrackerBackup>
  if (data.version !== TRACKER_BACKUP_VERSION) return null
  if (!data.progress || typeof data.progress !== 'object') return null
  if (!Array.isArray(data.customCompetitions)) return null

  const progress: Record<string, TrackStatus> = {}
  for (const [id, status] of Object.entries(data.progress)) {
    if (typeof id === 'string' && VALID_STATUSES.has(status as TrackStatus)) {
      progress[id] = status as TrackStatus
    }
  }

  return {
    version: TRACKER_BACKUP_VERSION,
    exportedAt:
      typeof data.exportedAt === 'string'
        ? data.exportedAt
        : new Date().toISOString(),
    progress,
    customCompetitions: data.customCompetitions.filter(
      (item): item is Competition =>
        Boolean(item && typeof item === 'object' && 'id' in item && 'name' in item),
    ),
  }
}
