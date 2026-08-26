import { saveAs } from 'file-saver'
import { createEvent } from 'ics'
import type { Competition } from '../types/competition'
import { getFinalUtc } from './dates'

export function downloadDeadlineIcs(competition: Competition) {
  const utc = getFinalUtc(competition)
  const result = createEvent({
    title: `${competition.shortName} · submission deadline`,
    description: `${competition.name}\n${competition.officialUrl}`,
    start: [
      utc.getUTCFullYear(),
      utc.getUTCMonth() + 1,
      utc.getUTCDate(),
      utc.getUTCHours(),
      utc.getUTCMinutes(),
    ],
    startInputType: 'utc',
    duration: { minutes: 15 },
    url: competition.officialUrl,
    calName: 'PRIX',
  })

  if (result.error || !result.value) {
    throw result.error ?? new Error('Could not build calendar file')
  }

  const blob = new Blob([result.value], { type: 'text/calendar;charset=utf-8' })
  saveAs(blob, `PRIX-${competition.shortName.replace(/\s+/g, '-')}-deadline.ics`)
}
