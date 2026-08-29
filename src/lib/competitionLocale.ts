import type { ColorSpace, Competition } from '../types/competition'
import type { Lang } from './i18n'
import zhOverrides from '../data/competitions.zh.json'

type ZhOverride = {
  country?: string
  summary?: string
  rightsNotes?: string
  judging?: {
    notes?: string
    judges?: string[]
  }
}

const zhById = zhOverrides as Record<string, ZhOverride>

const COUNTRY_ZH: Record<string, string> = {
  Japan: '日本',
  'United States': '美国',
  Italy: '意大利',
  China: '中国',
  Germany: '德国',
  'United Kingdom': '英国',
  Netherlands: '荷兰',
  'United Arab Emirates': '阿联酋',
  Austria: '奥地利',
  France: '法国',
  Indonesia: '印度尼西亚',
  Singapore: '新加坡',
  International: '国际',
}

const COLOR_SPACE_ZH: Record<ColorSpace, string> = {
  sRGB: 'sRGB',
  'Adobe RGB': 'Adobe RGB',
  CMYK: 'CMYK',
  Any: '不限',
}

const TAG_ZH: Record<string, string> = {
  Typography: '字体排印',
  Poster: '海报',
  Editorial: '编辑类',
  '300DPI': '300DPI',
  Yearbook: '年鉴',
  Annual: '年鉴',
  Book: '书籍',
  Advertising: '广告',
  NoAI: '禁 AI',
  'Editorial Design': '编辑设计',
  Packaging: '包装',
  Identity: '品牌识别',
  Free: '免费',
  Documentary: '纪实',
  Nature: '自然',
  Photojournalism: '新闻摄影',
  Animation: '动画',
  '3D': '3D',
  Hackathon: '黑客松',
  OpenSource: '开源',
  Agent: '智能体',
  API: 'API',
}

export interface LocalizedCompetitionView {
  country: string
  summary?: string
  rightsNotes: string
  judging?: Competition['judging']
  tags: string[]
  colorSpace: string
}

export function localizeCountry(country: string, lang: Lang): string {
  if (lang === 'en') return country
  return COUNTRY_ZH[country] ?? country
}

export function localizeColorSpace(colorSpace: ColorSpace, lang: Lang): string {
  if (lang === 'en') return colorSpace
  return COLOR_SPACE_ZH[colorSpace] ?? colorSpace
}

export function localizeTag(tag: string, lang: Lang): string {
  if (lang === 'en') return tag
  return TAG_ZH[tag] ?? tag
}

export function localizeCompetition(
  competition: Competition,
  lang: Lang,
): LocalizedCompetitionView {
  if (lang === 'en') {
    return {
      country: competition.country,
      summary: competition.summary,
      rightsNotes: competition.rightsNotes,
      judging: competition.judging,
      tags: competition.tags,
      colorSpace: competition.specs.colorSpace,
    }
  }

  const zh = zhById[competition.id]
  return {
    country: zh?.country ?? COUNTRY_ZH[competition.country] ?? competition.country,
    summary: zh?.summary ?? competition.summary,
    rightsNotes: zh?.rightsNotes ?? competition.rightsNotes,
    judging: competition.judging
      ? {
          preliminary: competition.judging.preliminary,
          final: competition.judging.final,
          notes: zh?.judging?.notes ?? competition.judging.notes,
          judges: zh?.judging?.judges ?? competition.judging.judges,
        }
      : undefined,
    tags: competition.tags.map((tag) => localizeTag(tag, lang)),
    colorSpace: localizeColorSpace(competition.specs.colorSpace, lang),
  }
}

export function formatJudgingPhase(
  phase: 'preliminary' | 'final',
  value: string,
  lang: Lang,
): string {
  const label = lang === 'zh' ? (phase === 'preliminary' ? '初审' : '终审') : phase === 'preliminary' ? 'Preliminary' : 'Final'
  return `${label} ${value}`
}
