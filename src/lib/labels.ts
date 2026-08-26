import type {
  Category,
  Eligibility,
  Quarter,
  RightsEthics,
  Tier,
  TrackStatus,
} from '../types/competition'

export const CATEGORY_TABS: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'graphic-design', label: 'Graphic Design' },
  { id: 'illustration', label: 'Illustration' },
  { id: 'photography', label: 'Photography' },
  { id: 'motion-3d', label: 'Motion & 3D' },
  { id: 'digital-art', label: 'Digital Art' },
  { id: 'creative-tech', label: 'Creative Tech' },
]

export const CATEGORY_LABELS: Record<Category, string> = {
  'graphic-design': 'Graphic Design',
  illustration: 'Illustration',
  photography: 'Photography',
  'motion-3d': 'Motion & 3D',
  'digital-art': 'Digital Art',
  'creative-tech': 'Creative Tech',
}

export const TIER_LABELS: Record<Tier, string> = {
  'tier-1-annual': 'International annual',
  'specialized-pioneer': 'Specialized pioneer',
}

export const ELIGIBILITY_LABELS: Record<Eligibility, string> = {
  all: 'Open worldwide',
  'students-only': 'Students only',
  'professionals-only': 'Professionals',
}

export const RIGHTS_LABELS: Record<
  RightsEthics,
  { title: string; hint: string }
> = {
  'creator-retains-all': {
    title: 'Creator retains all rights',
    hint: 'Copyright stays with you. Organizer uses work only with a limited license.',
  },
  'promotional-only': {
    title: 'Promotional license only',
    hint: 'You keep copyright. Organizer may exhibit and promote awarded work.',
  },
  'rights-grab-warning': {
    title: 'Rights grab warning',
    hint: 'Terms may include a broad commercial license. Read the official rules before entering.',
  },
}

export const STATUS_COLUMNS: { id: TrackStatus; label: string }[] = [
  { id: 'interested', label: 'Interested' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'won', label: 'Won' },
]

export const QUARTERS: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4']

export const TIMEZONES = [
  'UTC',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Amsterdam',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Australia/Sydney',
]

export const GITHUB_CONTRIBUTE_URL =
  'https://github.com/prix-app/prix/issues/new'
