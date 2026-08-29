import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type {
  Category,
  Competition,
  Currency,
  Eligibility,
  RightsEthics,
} from '../types/competition'
import { CATEGORY_TABS, GITHUB_CONTRIBUTE_URL, TIMEZONES } from '../lib/labels'
import { cn } from '../lib/cn'
import { useMessages } from '../lib/i18n'
import { useAppStore } from '../store/useAppStore'
import { Button } from './Button'

const CATEGORY_IDS = CATEGORY_TABS.filter((t) => t.id !== 'all').map(
  (t) => t.id,
) as Category[]

const RIGHTS_IDS: RightsEthics[] = [
  'creator-retains-all',
  'promotional-only',
  'rights-grab-warning',
]

const emptyForm = {
  name: '',
  shortName: '',
  country: '',
  category: 'graphic-design' as Category,
  eligibility: 'all' as Eligibility,
  final: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  isFree: false,
  currency: 'USD' as Currency,
  fee: '',
  officialUrl: '',
  rightsEthics: 'promotional-only' as RightsEthics,
  tags: '',
}

function toCompetition(form: typeof emptyForm): Competition {
  const id = `custom-${form.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
  const deadline = form.final.includes('T')
    ? form.final
    : `${form.final}T23:59:00`
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
    officialUrl: form.officialUrl.trim() || 'https://',
    isCustom: true,
  }
}

function contributionJson(competition: Competition) {
  const payload = { ...competition }
  delete payload.isCustom
  return JSON.stringify(payload, null, 2)
}

export function AddCustomModal() {
  const m = useMessages()
  const open = useAppStore((s) => s.addOpen)
  const setOpen = useAppStore((s) => s.setAddOpen)
  const addCustom = useAppStore((s) => s.addCustom)
  const [form, setForm] = useState(emptyForm)
  const [copied, setCopied] = useState(false)
  const [lastAdded, setLastAdded] = useState<Competition | null>(null)

  const field =
    'w-full rounded-xl bg-muted px-3.5 py-2.5 text-sm placeholder:text-ink-soft focus:ring-2 focus:ring-primary/40'

  function close() {
    setOpen(false)
    setCopied(false)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const competition = toCompetition(form)
    addCustom(competition)
    setLastAdded(competition)
    setForm(emptyForm)
  }

  async function copyJson() {
    if (!lastAdded) return
    await navigator.clipboard.writeText(contributionJson(lastAdded))
    setCopied(true)
  }

  function openGithubIssue() {
    if (!lastAdded) return
    const json = contributionJson(lastAdded)
    const url = `${GITHUB_CONTRIBUTE_URL}?title=${encodeURIComponent(`Add competition: ${lastAdded.name}`)}&body=${encodeURIComponent(`Please add this call to \`src/data/competitions.json\`.\n\n\`\`\`json\n${json}\n\`\`\``)}`
    window.open(url, '_blank', 'noreferrer')
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-40 transition-opacity duration-150',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <button
        type="button"
        aria-label={m.drawer.close}
        className="absolute inset-0 cursor-pointer bg-ink/30"
        onClick={close}
      />
      <div className="absolute inset-x-0 top-[6vh] mx-auto max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface px-6 py-6 shadow-2xl shadow-ink/20 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.24em] text-ink-soft uppercase">
              {m.custom.badge}
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">
              {m.custom.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={m.drawer.close}
            className="cursor-pointer rounded-full bg-muted p-2 text-ink-soft transition-colors hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
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
            <select
              className={field}
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as Category })
              }
            >
              {CATEGORY_IDS.map((id) => (
                <option key={id} value={id}>
                  {m.categories[id]}
                </option>
              ))}
            </select>
            <select
              className={field}
              value={form.eligibility}
              onChange={(e) =>
                setForm({ ...form, eligibility: e.target.value as Eligibility })
              }
            >
              {(['all', 'students-only', 'professionals-only'] as const).map(
                (id) => (
                  <option key={id} value={id}>
                    {m.eligibility[id]}
                  </option>
                ),
              )}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="datetime-local"
              aria-label={m.custom.deadline}
              className={field}
              value={form.final}
              onChange={(e) => setForm({ ...form, final: e.target.value })}
            />
            <select
              className={field}
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            >
              {[
                form.timezone,
                ...TIMEZONES.filter((z) => z !== form.timezone),
              ].map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-muted px-3.5 py-2.5 text-sm">
            <input
              type="checkbox"
              checked={form.isFree}
              onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
            />
            {m.custom.freeToEnter}
          </label>
          {!form.isFree && (
            <div className="grid grid-cols-2 gap-3">
              <select
                className={field}
                value={form.currency}
                onChange={(e) =>
                  setForm({ ...form, currency: e.target.value as Currency })
                }
              >
                {['USD', 'EUR', 'GBP', 'JPY'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                className={field}
                placeholder={m.custom.fee}
                inputMode="decimal"
                value={form.fee}
                onChange={(e) => setForm({ ...form, fee: e.target.value })}
              />
            </div>
          )}
          <input
            className={field}
            placeholder={m.custom.officialUrl}
            value={form.officialUrl}
            onChange={(e) => setForm({ ...form, officialUrl: e.target.value })}
          />
          <input
            className={field}
            placeholder={m.custom.tags}
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <select
            className={field}
            value={form.rightsEthics}
            onChange={(e) =>
              setForm({ ...form, rightsEthics: e.target.value as RightsEthics })
            }
          >
            {RIGHTS_IDS.map((id) => (
              <option key={id} value={id}>
                {m.rights[id].title}
              </option>
            ))}
          </select>
          <Button type="submit" variant="primary" className="mt-2 w-full py-2.5">
            {m.custom.save}
          </Button>
        </form>

        {lastAdded && (
          <div className="mt-6 rounded-xl bg-muted px-4 py-4 text-sm">
            <p className="text-ink">
              <span className="font-semibold">{lastAdded.shortName}</span> ·{' '}
              {m.custom.saved}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => void copyJson()}>
                {copied ? m.custom.copied : m.custom.copyJson}
              </Button>
              <Button onClick={openGithubIssue}>{m.custom.openIssue}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
