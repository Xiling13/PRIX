import Fuse from 'fuse.js'
import type { Competition } from '../types/competition'
import { CATEGORY_LABELS } from './labels'

export function searchIndex(competitions: Competition[]) {
  return new Fuse(competitions, {
    includeScore: true,
    threshold: 0.38,
    ignoreLocation: true,
    keys: [
      'name',
      'shortName',
      'country',
      'category',
      'tags',
      'eligibility',
      'summary',
      'specs.fileFormats',
      'specs.colorSpace',
    ],
  })
}

export function searchCompetitions(
  competitions: Competition[],
  query: string,
): Competition[] {
  const q = query.trim()
  if (!q) return competitions

  const tagged = competitions.filter((c) =>
    c.tags.some((tag) => `#${tag}`.toLowerCase().includes(q.toLowerCase()) || tag.toLowerCase() === q.replace(/^#/, '').toLowerCase()),
  )
  const fuseHits = searchIndex(competitions).search(q).map((r) => r.item)
  const byId = new Map<string, Competition>()
  for (const item of [...tagged, ...fuseHits]) byId.set(item.id, item)
  return [...byId.values()]
}

export function searchableValue(competition: Competition): string {
  return [
    competition.id,
    competition.name,
    competition.shortName,
    competition.country,
    CATEGORY_LABELS[competition.category],
    ...competition.tags,
  ].join(' ')
}
