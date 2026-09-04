import { useState, type FormEvent, type ReactNode } from 'react'
import { X } from 'lucide-react'
import type {
  Category,
  Competition,
  Currency,
  Eligibility,
  RightsEthics,
} from '../types/competition'
import {
  CATEGORY_TABS,
  CURRENCIES,
  GITHUB_CONTRIBUTE_URL,
  TIMEZONE_OPTIONS,
  sortOptionsByLabel,
  timezoneLabel,
} from '../lib/labels'
import { cn } from '../lib/cn'
import { useMessages } from '../lib/i18n'
import { useAppStore, useCustomCompetition } from '../store/useAppStore'
import { isValidOfficialUrl, normalizeUrl } from '../lib/url'
import { Button } from './Button'
import { Select } from './Select'

const CATEGORY_IDS = CATEGORY_TABS.filter((t) => t.id !== 'all').map(
  (t) => t.id,
) as Category[]

const RIGHTS_IDS: RightsEthics[] = [
  'creator-retains-all',
  'promotional-only',
  'rights-grab-warning',
]

type CustomForm = {
  name: string
  shortName: string
  country: string
  category: Category
  eligibility: Eligibility
  final: string
  timezone: string
  isFree: boolean
  currency: Currency
  fee: string
  officialUrl: string
  rightsEthics: RightsEthics
  tags: string
}

const emptyForm = (): CustomForm => ({
  name: '',
  shortName: '',
  country: '',
  category: 'graphic-design',
  eligibility: 'all',
  final: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  isFree: false,
  currency: 'USD',
  fee: '',
  officialUrl: '',
  rightsEthics: 'promotional-only',
  tags: '',
})

function toDatetimeLocal(isoLocal: string): string {
  const match = isoLocal.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/)
  if (match) return `${match[1]}T${match[2]}`
  return isoLocal.slice(0, 16)
}

function formFromCompetition(competition: Competition): CustomForm {
  return {
    name: competition.name,
    shortName: competition.shortName,
    country: competition.country === 'International' ? '' : competition.country,
    category: competition.category,
    eligibility: competition.eligibility,
    final: toDatetimeLocal(competition.deadlines.final),
    timezone: competition.deadlines.timezone,
    isFree: competition.fees.isFree,
    currency: competition.fees.currency,
    fee: competition.fees.isFree ? '' : String(competition.fees.singleRegular),
    officialUrl: competition.officialUrl,
    rightsEthics: competition.rightsEthics,
    tags: competition.tags.join(', '),
  }
}

function toCompetition(form: CustomForm, existingId?: string): Competition {
  const id =
    existingId ??
    `custom-${form.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
  const deadline = form.final.includes('T')
    ? form.final
    : `${form.final}T23:59:00`
  const officialUrl = normalizeUrl(form.officialUrl)!
  return {
    id,
    name: form.name.trim(),
    shortName: form.shortName.trim(),
    country: form.country.trim() || 'International',
    category: form.category,
    tier: 'specialized-pioneer',
    eligibility: form.eligibility,
    tags: form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    deadlines: {
      final: deadline,
      timezone: form.timezone,
    },
    fees: {
      currency: form.currency,
      singleRegular: form.isFree ? 0 : Number(form.fee || 0),
      isFree: form.isFree,
    },
    specs: {
      colorSpace: 'sRGB',
      maxFileSizeMB: 10,
      fileFormats: ['JPG'],
      noWatermark: true,
    },
    rightsEthics: form.rightsEthics,
    rightsNotes:
      'User-added local award. Confirm official terms before entering.',
    officialUrl,
    isCustom: true,
  }
}

function contributionJson(competition: Competition) {
  const payload = { ...competition }
  delete payload.isCustom
  return JSON.stringify(payload, null, 2)
}

const overlayBackdrop =
  'absolute inset-0 cursor-pointer bg-ink/20 backdrop-blur-sm transition-opacity duration-100 ease-out'

export function AddCustomModal() {
  const open = useAppStore((s) => s.addOpen)
  const customEditId = useAppStore((s) => s.customEditId)
  const editingCompetition = useCustomCompetition(customEditId)
  const isEditing = Boolean(customEditId && editingCompetition)

  const initialForm =
    isEditing && editingCompetition
      ? formFromCompetition(editingCompetition)
      : emptyForm()

  return (
    <CustomAwardModalShell open={open}>
      {open ? (
        <CustomAwardForm
          key={customEditId ?? 'new'}
          initialForm={initialForm}
          isEditing={isEditing}
          customEditId={customEditId}
        />
      ) : null}
    </CustomAwardModalShell>
  )
}

function CustomAwardModalShell({
  open,
  children,
}: {
  open: boolean
  children: ReactNode
}) {
  const m = useMessages()
  const setOpen = useAppStore((s) => s.setAddOpen)
  const setCustomEditId = useAppStore((s) => s.setCustomEditId)

  function close() {
    setOpen(false)
    setCustomEditId(null)
  }

  return (
    <div
      className={cn('fixed inset-0 z-40', open ? '' : 'pointer-events-none')}
    >
      <button
        type="button"
        aria-label={m.drawer.close}
        className={cn(overlayBackdrop, open ? 'opacity-100' : 'opacity-0')}
        onClick={close}
      />
      <div
        className={cn(
          'absolute inset-x-0 top-[6vh] mx-auto max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-surface px-6 py-6 shadow-2xl shadow-ink/20 transition-[opacity,transform] duration-150 ease-out sm:px-8',
          open
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-2 opacity-0',
        )}
      >
        {children}
      </div>
    </div>
  )
}

function CustomAwardForm({
  initialForm,
  isEditing,
  customEditId,
}: {
  initialForm: CustomForm
  isEditing: boolean
  customEditId: string | null
}) {
  const m = useMessages()
  const lang = useAppStore((s) => s.lang)
  const setOpen = useAppStore((s) => s.setAddOpen)
  const setCustomEditId = useAppStore((s) => s.setCustomEditId)
  const addCustom = useAppStore((s) => s.addCustom)
  const updateCustom = useAppStore((s) => s.updateCustom)
  const removeCustom = useAppStore((s) => s.removeCustom)

  const [form, setForm] = useState<CustomForm>(initialForm)
  const [copied, setCopied] = useState(false)
  const [lastSaved, setLastSaved] = useState<Competition | null>(null)
  const [urlError, setUrlError] = useState<string | null>(null)

  const field =
    'w-full rounded-xl bg-canvas px-3.5 py-2.5 text-sm placeholder:text-ink-soft focus:ring-2 focus:ring-primary/40'

  function close() {
    setOpen(false)
    setCustomEditId(null)
    setCopied(false)
    setUrlError(null)
  }

  function validateUrl(): boolean {
    if (!form.officialUrl.trim()) {
      setUrlError(m.custom.urlRequired)
      return false
    }
    if (!isValidOfficialUrl(form.officialUrl)) {
      setUrlError(m.custom.urlInvalid)
      return false
    }
    setUrlError(null)
    return true
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validateUrl()) return

    if (isEditing && customEditId) {
      const competition = toCompetition(form, customEditId)
      updateCustom(customEditId, competition)
      setLastSaved(competition)
      return
    }

    const competition = toCompetition(form)
    addCustom(competition)
    setLastSaved(competition)
    setForm(emptyForm())
  }

  function confirmDelete() {
    if (!customEditId) return
    if (!window.confirm(m.drawer.deleteConfirm)) return
    removeCustom(customEditId)
    close()
  }

  async function copyJson() {
    if (!lastSaved) return
    await navigator.clipboard.writeText(contributionJson(lastSaved))
    setCopied(true)
  }

  function openGithubIssue() {
    if (!lastSaved) return
    const json = contributionJson(lastSaved)
    const url = `${GITHUB_CONTRIBUTE_URL}?title=${encodeURIComponent(`Add competition: ${lastSaved.name}`)}&body=${encodeURIComponent(`Please add this call to \`src/data/competitions.json\`.\n\n\`\`\`json\n${json}\n\`\`\``)}`
    window.open(url, '_blank', 'noreferrer')
  }

  const timezoneOptions = sortOptionsByLabel(
    [
      ...TIMEZONE_OPTIONS.map((z) => ({
        value: z.value,
        label: timezoneLabel(z.value, lang),
      })),
      ...(TIMEZONE_OPTIONS.some((z) => z.value === form.timezone)
        ? []
        : [
            {
              value: form.timezone,
              label: timezoneLabel(form.timezone, lang),
            },
          ]),
    ],
    lang,
  )

  const categoryOptions = sortOptionsByLabel(
    CATEGORY_IDS.map((id) => ({
      value: id,
      label: m.categories[id],
    })),
    lang,
  )

  const eligibilityOptions = sortOptionsByLabel(
    (['all', 'students-only', 'professionals-only'] as const).map((id) => ({
      value: id,
      label: m.eligibility[id],
    })),
    lang,
  )

  const currencyOptions = CURRENCIES.map((c) => ({
    value: c,
    label: m.custom.currencies[c],
  }))

  const rightsOptions = sortOptionsByLabel(
    RIGHTS_IDS.map((id) => ({
      value: id,
      label: m.rights[id].title,
    })),
    lang,
  )

  return (
    <>
      <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-ink-soft uppercase">
              {m.custom.badge}
            </p>
            <h2 className="mt-4 text-2xl font-medium tracking-tight">
              {isEditing ? m.custom.editTitle : m.custom.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={m.drawer.close}
            className="shrink-0 cursor-pointer bg-transparent py-1 pl-1 -mr-1 text-ink-soft transition-colors hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-3">
          <input
            required
            className={field}
            placeholder={m.custom.name}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              className={field}
              placeholder={m.custom.shortName}
              value={form.shortName}
              onChange={(e) => setForm({ ...form, shortName: e.target.value })}
            />
            <input
              className={field}
              placeholder={m.custom.country}
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={form.category}
              options={categoryOptions}
              onChange={(category) =>
                setForm({ ...form, category: category as Category })
              }
            />
            <Select
              value={form.eligibility}
              options={eligibilityOptions}
              onChange={(eligibility) =>
                setForm({ ...form, eligibility: eligibility as Eligibility })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="datetime-local"
              aria-label={m.custom.deadline}
              className={cn(field, 'pr-3.5')}
              value={form.final}
              onChange={(e) => setForm({ ...form, final: e.target.value })}
            />
            <Select
              value={form.timezone}
              options={timezoneOptions}
              onChange={(timezone) => setForm({ ...form, timezone })}
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-canvas px-3.5 py-2.5 text-sm">
            <input
              type="checkbox"
              checked={form.isFree}
              onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
            />
            {m.custom.freeToEnter}
          </label>
          {!form.isFree && (
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={form.currency}
                options={currencyOptions}
                onChange={(currency) =>
                  setForm({ ...form, currency: currency as Currency })
                }
              />
              <input
                className={field}
                placeholder={m.custom.fee}
                inputMode="decimal"
                value={form.fee}
                onChange={(e) => setForm({ ...form, fee: e.target.value })}
              />
            </div>
          )}
          <div>
            <input
              required
              type="url"
              className={cn(field, urlError && 'ring-2 ring-danger/40')}
              placeholder={m.custom.officialUrl}
              value={form.officialUrl}
              onChange={(e) => {
                setForm({ ...form, officialUrl: e.target.value })
                if (urlError) setUrlError(null)
              }}
              onBlur={() => {
                if (form.officialUrl.trim() && isValidOfficialUrl(form.officialUrl)) {
                  setForm({
                    ...form,
                    officialUrl: normalizeUrl(form.officialUrl) ?? form.officialUrl,
                  })
                }
              }}
            />
            {urlError && (
              <p className="mt-1.5 text-xs text-danger">{urlError}</p>
            )}
          </div>
          <input
            className={field}
            placeholder={m.custom.tags}
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <Select
            value={form.rightsEthics}
            options={rightsOptions}
            onChange={(rightsEthics) =>
              setForm({
                ...form,
                rightsEthics: rightsEthics as RightsEthics,
              })
            }
          />
          <div className="mt-2 flex flex-col gap-2">
            <Button type="submit" variant="primary" className="w-full py-2.5">
              {isEditing ? m.custom.update : m.custom.save}
            </Button>
            {isEditing && (
              <Button
                type="button"
                className="w-full py-2.5 text-danger hover:bg-danger/10"
                onClick={confirmDelete}
              >
                {m.custom.delete}
              </Button>
            )}
          </div>
        </form>

        {lastSaved && (
          <div className="mt-6 rounded-xl bg-canvas px-4 py-4 text-sm">
            <p className="text-ink">
              <span className="font-semibold">{lastSaved.shortName}</span> ·{' '}
              {isEditing ? m.custom.updated : m.custom.saved}
            </p>
            {!isEditing && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => void copyJson()}>
                  {copied ? m.custom.copied : m.custom.copyJson}
                </Button>
                <Button onClick={openGithubIssue}>{m.custom.openIssue}</Button>
              </div>
            )}
          </div>
        )}
    </>
  )
}
