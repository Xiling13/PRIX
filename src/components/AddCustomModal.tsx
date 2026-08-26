import { useState, type FormEvent } from 'react'
import type {
  Category,
  Competition,
  Currency,
  Eligibility,
  RightsEthics,
} from '../types/competition'
import { CATEGORY_TABS, GITHUB_CONTRIBUTE_URL, TIMEZONES } from '../lib/labels'
import { cn } from '../lib/cn'
import { useAppStore } from '../store/useAppStore'

const CATEGORIES = CATEGORY_TABS.filter((t) => t.id !== 'all') as {
  id: Category
  label: string
}[]

const RIGHTS: { id: RightsEthics; label: string }[] = [
  { id: 'creator-retains-all', label: 'Creator retains all rights' },
  { id: 'promotional-only', label: 'Promotional license only' },
  { id: 'rights-grab-warning', label: 'Rights grab warning' },
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
  colorSpace: 'sRGB',
  formats: 'JPG',
  maxFileSizeMB: '10',
  officialUrl: '',
  rightsEthics: 'promotional-only' as RightsEthics,
  tags: '',
}

function toCompetition(form: typeof emptyForm): Competition {
  const id = `custom-${form.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
  const deadline = form.final.includes('T') ? form.final : `${form.final}T23:59:00`
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
      colorSpace: form.colorSpace === 'CMYK' ? 'CMYK' : 'sRGB',
      maxFileSizeMB: Number(form.maxFileSizeMB || 10),
      fileFormats: form.formats
        .split(',')
        .map((f) => f.trim().toUpperCase())
        .filter(Boolean),
      noWatermark: true,
    },
    rightsEthics: form.rightsEthics,
    rightsNotes: 'User-added local call. Confirm official terms before entering.',
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
  const open = useAppStore((s) => s.addOpen)
  const setOpen = useAppStore((s) => s.setAddOpen)
  const addCustom = useAppStore((s) => s.addCustom)
  const [form, setForm] = useState(emptyForm)
  const [copied, setCopied] = useState(false)
  const [lastAdded, setLastAdded] = useState<Competition | null>(null)

  const field =
    'w-full rounded-xl bg-muted px-3 py-2.5 text-sm placeholder:text-ink-soft'

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
        'fixed inset-0 z-40 transition-opacity duration-300',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
        onClick={close}
      />
      <div className="absolute inset-x-0 top-[8vh] mx-auto max-h-[84vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-surface/95 px-8 py-8 shadow-2xl shadow-ink/10 backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] text-ink-soft">
              Local only
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">
              Add a custom call
            </h2>
          </div>
          <button type="button" onClick={close} className="text-sm text-ink-soft">
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <input
            required
            className={field}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              className={field}
              placeholder="Short name"
              value={form.shortName}
              onChange={(e) => setForm({ ...form, shortName: e.target.value })}
            />
            <input
              className={field}
              placeholder="Country"
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
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
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
              <option value="all">Open worldwide</option>
              <option value="students-only">Students only</option>
              <option value="professionals-only">Professionals</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="datetime-local"
              className={field}
              value={form.final}
              onChange={(e) => setForm({ ...form, final: e.target.value })}
            />
            <select
              className={field}
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            >
              {[form.timezone, ...TIMEZONES.filter((z) => z !== form.timezone)].map(
                (tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ),
              )}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={form.isFree}
              onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
            />
            Free to enter
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
                placeholder="Regular fee"
                inputMode="decimal"
                value={form.fee}
                onChange={(e) => setForm({ ...form, fee: e.target.value })}
              />
            </div>
          )}
          <input
            className={field}
            placeholder="Official URL"
            value={form.officialUrl}
            onChange={(e) => setForm({ ...form, officialUrl: e.target.value })}
          />
          <input
            className={field}
            placeholder="Tags, comma separated (Poster, Free)"
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
            {RIGHTS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <button type="submit" className="mt-2 text-left text-cyan-dim">
            Save to this browser
          </button>
        </form>

        {lastAdded && (
          <div className="mt-8 text-sm text-ink-soft">
            <p>Saved {lastAdded.shortName}. Export a snippet for the open-source list:</p>
            <div className="mt-3 flex gap-5">
              <button type="button" onClick={() => void copyJson()}>
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
              <button type="button" onClick={openGithubIssue}>
                Open GitHub issue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
