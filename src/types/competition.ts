export type Category =
  | 'graphic-design'
  | 'illustration'
  | 'photography'
  | 'motion-3d'
  | 'digital-art'
  | 'creative-tech'
  | 'vibe-coding'

export type Tier = 'tier-1-annual' | 'specialized-pioneer'

export type Eligibility = 'all' | 'students-only' | 'professionals-only'

export type RightsEthics =
  | 'creator-retains-all'
  | 'promotional-only'
  | 'rights-grab-warning'

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY'

export type ColorSpace = 'sRGB' | 'Adobe RGB' | 'CMYK' | 'Any'

export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'

export type TrackStatus =
  | 'interested'
  | 'preparing'
  | 'submitted'
  | 'shortlisted'
  | 'won'

export interface Competition {
  id: string
  name: string
  shortName: string
  country: string
  category: Category
  tier: Tier
  eligibility: Eligibility
  tags: string[]
  deadlines: {
    earlyBird?: string
    regular?: string
    final: string
    timezone: string
  }
  fees: {
    currency: Currency
    singleEarly?: number
    singleRegular: number
    seriesRegular?: number
    isFree: boolean
  }
  specs: {
    colorSpace: ColorSpace
    minDPI?: number
    maxFileSizeMB: number
    fileFormats: string[]
    maxWordCount?: number
    noWatermark: boolean
  }
  judging?: {
    preliminary?: string
    final?: string
    notes?: string
    judges?: string[]
  }
  rightsEthics: RightsEthics
  rightsNotes: string
  officialUrl: string
  archiveUrl?: string
  nextCycleHint?: {
    year: number
    quarter: Quarter
  }
  isCustom?: boolean
  summary?: string
}
