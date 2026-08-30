import type {
  Category,
  Eligibility,
  RightsEthics,
  Tier,
  TrackStatus,
} from '../types/competition'
import { useAppStore } from '../store/useAppStore'

export type Lang = 'en' | 'zh'

export interface Messages {
  tagline: string
  searchPlaceholder: string
  views: { list: string; tracker: string }
  addCustom: string
  track: string
  tracked: string
  customTag: string
  closed: string
  nextCycle: string
  archivedTitle: string
  emptyCategory: string
  noResults: string
  free: string
  early: string
  regular: string
  categories: Record<'all' | Category, string>
  tiers: Record<Tier, string>
  eligibility: Record<Eligibility, string>
  rights: Record<RightsEthics, { title: string; hint: string }>
  status: Record<TrackStatus, string>
  drawer: {
    close: string
    addToTracker: string
    openInTracker: string
    statusLabel: string
    exportIcs: string
    pack: string
    official: string
    localDeadline: string
    organizerTime: string
    earlyBird: string
    fee: string
    eligibility: string
    colorSpace: string
    formats: string
    maxFile: string
    dpi: string
    statement: string
    statementUnit: string
    watermark: string
    watermarkNone: string
    watermarkCheck: string
    judging: string
    nextCycleNote: string
    notFound: string
    disclaimer: string
    editCustom: string
    deleteCustom: string
    deleteConfirm: string
  }
  tracker: {
    empty: string
    emptyCategory: string
    noResults: string
    browse: string
    dropHere: string
    remove: string
    viewSpecs: string
    export: string
    import: string
    importSuccess: string
    importError: string
  }
  custom: {
    badge: string
    title: string
    editTitle: string
    name: string
    shortName: string
    country: string
    deadline: string
    freeToEnter: string
    fee: string
    officialUrl: string
    tags: string
    save: string
    update: string
    delete: string
    saved: string
    updated: string
    copyJson: string
    copied: string
    openIssue: string
    urlRequired: string
    urlInvalid: string
  }
  header: {
    github: string
    categoryFilter: string
  }
  footer: {
    createdBy: string
  }
}

const en: Messages = {
  tagline: 'Open-call workstation for creative competition.',
  searchPlaceholder: 'Search awards — TDC, Japan, Poster, #Free…',
  views: { list: 'Open Calls', tracker: 'Tracker' },
  addCustom: 'Add award',
  track: 'Track',
  tracked: 'Tracked',
  customTag: 'Custom',
  closed: 'Closed',
  nextCycle: 'Next cycle',
  archivedTitle: 'Archived · past cycles',
  emptyCategory: 'No open calls in this category right now.',
  noResults: 'No open calls match your search.',
  free: 'Free',
  early: 'early',
  regular: 'regular',
  categories: {
    all: 'All',
    'graphic-design': 'Graphic Design',
    illustration: 'Illustration',
    photography: 'Photography',
    'motion-3d': 'Motion & 3D',
    'digital-art': 'Digital Art',
    'creative-tech': 'Creative Tech',
    'vibe-coding': 'Vibe Coding',
  },
  tiers: {
    'tier-1-annual': 'International annual',
    'specialized-pioneer': 'Specialized pioneer',
  },
  eligibility: {
    all: 'Open worldwide',
    'students-only': 'Students only',
    'professionals-only': 'Professionals',
  },
  rights: {
    'creator-retains-all': {
      title: 'Creator retains all rights',
      hint: 'Copyright stays with you; the organizer only asks for a limited license.',
    },
    'promotional-only': {
      title: 'Promotional license only',
      hint: 'You keep copyright; the organizer may exhibit and promote awarded work.',
    },
    'rights-grab-warning': {
      title: 'Rights grab warning',
      hint: 'Terms may include a broad commercial license. Read the official rules first.',
    },
  },
  status: {
    interested: 'Interested',
    preparing: 'Preparing',
    submitted: 'Submitted',
    shortlisted: 'Shortlisted',
    won: 'Won',
  },
  drawer: {
    close: 'Close',
    addToTracker: 'Add to tracker',
    openInTracker: 'Open in tracker',
    statusLabel: 'Status',
    exportIcs: 'Add to calendar',
    pack: 'Submission pack',
    official: 'Official Site',
    localDeadline: 'Local deadline',
    organizerTime: 'Organizer deadline',
    earlyBird: 'Early bird',
    fee: 'Fee',
    eligibility: 'Eligibility',
    colorSpace: 'Color space',
    formats: 'Formats',
    maxFile: 'Max file',
    dpi: 'Min DPI',
    statement: 'Statement',
    statementUnit: 'words max',
    watermark: 'Watermark',
    watermarkNone: 'None allowed',
    watermarkCheck: 'Check rules',
    judging: 'Judging',
    nextCycleNote: 'Closed — next cycle expected',
    notFound: 'Award not found.',
    disclaimer:
      'The above is an unofficial summary. Confirm deadlines, fees, and rights on the organizer’s official site before entering.',
    editCustom: 'Edit award',
    deleteCustom: 'Delete award',
    deleteConfirm: 'Delete this custom award from this browser?',
  },
  tracker: {
    empty: 'Nothing tracked yet. Add awards from the open calls list.',
    emptyCategory: 'No tracked awards in this category.',
    noResults: 'No tracked awards match your search.',
    browse: 'Browse open calls',
    dropHere: 'Drop here',
    remove: 'Remove',
    viewSpecs: 'View specs',
    export: 'Export',
    import: 'Import',
    importSuccess: 'Tracker backup imported.',
    importError: 'Could not read that backup file.',
  },
  custom: {
    badge: 'Saved in this browser only',
    title: 'Add a Custom Award',
    editTitle: 'Edit Custom Award',
    name: 'Award name',
    shortName: 'Short name',
    country: 'Country',
    deadline: 'Final deadline',
    freeToEnter: 'Free to enter',
    fee: 'Regular fee',
    officialUrl: 'Official URL',
    tags: 'Tags, comma separated (Poster, Free)',
    save: 'Save award',
    update: 'Update award',
    delete: 'Delete award',
    saved: 'Saved and added to your tracker. Optionally contribute it to the open-source list:',
    updated: 'Updated.',
    copyJson: 'Copy JSON',
    copied: 'Copied',
    openIssue: 'Open GitHub issue',
    urlRequired: 'Official URL is required.',
    urlInvalid: 'Enter a valid URL (e.g. example.com or https://…).',
  },
  header: {
    github: 'GitHub repository',
    categoryFilter: 'Category',
  },
  footer: {
    createdBy: 'Created by Xiling',
  },
}

const zh: Messages = {
  tagline: '创意竞赛查询工具',
  searchPlaceholder: '搜索赛事 — TDC、日本、Poster、#Free…',
  views: { list: '征稿中', tracker: '我的备赛' },
  addCustom: '添加赛事',
  track: '加入备赛',
  tracked: '已加入',
  customTag: '自定义',
  closed: '已截稿',
  nextCycle: '预计下届',
  archivedTitle: '已归档 · 往届',
  emptyCategory: '该分类下暂无正在征稿的赛事。',
  noResults: '没有匹配的征稿赛事。',
  free: '免费',
  early: '早鸟',
  regular: '常规',
  categories: {
    all: '全部',
    'graphic-design': '平面设计',
    illustration: '插画',
    photography: '摄影',
    'motion-3d': '动态与3D',
    'digital-art': '数字艺术',
    'creative-tech': '创意技术',
    'vibe-coding': '氛围编程',
  },
  tiers: {
    'tier-1-annual': '国际顶级年鉴',
    'specialized-pioneer': '垂直先锋奖项',
  },
  eligibility: {
    all: '全球公开',
    'students-only': '仅限学生',
    'professionals-only': '仅限职业',
  },
  rights: {
    'creator-retains-all': {
      title: '创作者保留所有版权',
      hint: '版权完全归你，主办方仅要求有限授权。',
    },
    'promotional-only': {
      title: '仅限宣传用途',
      hint: '你保留版权，主办方可展览及宣传获奖作品。',
    },
    'rights-grab-warning': {
      title: '版权转让预警',
      hint: '条款可能包含广泛商业授权，报名前务必细读官方规则。',
    },
  },
  status: {
    interested: '感兴趣',
    preparing: '备稿中',
    submitted: '已提交',
    shortlisted: '入围',
    won: '获奖',
  },
  drawer: {
    close: '关闭',
    addToTracker: '加入备赛',
    openInTracker: '打开备赛看板',
    statusLabel: '当前状态',
    exportIcs: '加入日历',
    pack: '提报资产包',
    official: '官网',
    localDeadline: '本地截稿时间',
    organizerTime: '主办方截稿时间',
    earlyBird: '早鸟截止',
    fee: '报名费',
    eligibility: '参赛门槛',
    colorSpace: '色彩空间',
    formats: '文件格式',
    maxFile: '大小上限',
    dpi: '最低 DPI',
    statement: '阐述字数',
    statementUnit: '词以内',
    watermark: '水印',
    watermarkNone: '不允许',
    watermarkCheck: '见官方规则',
    judging: '评审',
    nextCycleNote: '已截稿 — 预计下届',
    notFound: '未找到该赛事。',
    disclaimer:
      '以上为非官方整理摘要。参赛或缴费前，请务必以主办方官网信息为准。',
    editCustom: '编辑赛事',
    deleteCustom: '删除赛事',
    deleteConfirm: '确定从本浏览器删除这条自定义赛事吗？',
  },
  tracker: {
    empty: '备赛列表还是空的，去征稿列表添加赛事吧。',
    emptyCategory: '该分类下暂无备赛赛事。',
    noResults: '没有匹配的备赛赛事。',
    browse: '浏览征稿赛事',
    dropHere: '拖到这里',
    remove: '移除',
    viewSpecs: '查看规格',
    export: '导出',
    import: '导入',
    importSuccess: '备赛备份已导入。',
    importError: '无法读取该备份文件。',
  },
  custom: {
    badge: '仅保存在此浏览器',
    title: '添加自定义赛事',
    editTitle: '编辑自定义赛事',
    name: '赛事名称',
    shortName: '缩写',
    country: '国家/地区',
    deadline: '最终截稿',
    freeToEnter: '免费参赛',
    fee: '常规报名费',
    officialUrl: '官网链接',
    tags: '标签，逗号分隔（Poster, Free）',
    save: '保存赛事',
    update: '更新赛事',
    delete: '删除赛事',
    saved: '已保存，并已加入备赛列表。可选：贡献到开源列表：',
    updated: '已更新。',
    copyJson: '复制 JSON',
    copied: '已复制',
    openIssue: '打开 GitHub Issue',
    urlRequired: '请填写官网链接。',
    urlInvalid: '请输入有效链接（如 example.com 或 https://…）。',
  },
  header: {
    github: 'GitHub 仓库',
    categoryFilter: '分类',
  },
  footer: {
    createdBy: 'Created by Xiling',
  },
}

export const messages: Record<Lang, Messages> = { en, zh }

export function useMessages(): Messages {
  const lang = useAppStore((s) => s.lang)
  return messages[lang]
}
