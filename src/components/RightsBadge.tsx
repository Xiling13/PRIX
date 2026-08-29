import { cn } from '../lib/cn'
import { useMessages } from '../lib/i18n'
import type { RightsEthics } from '../types/competition'

const TONE: Record<RightsEthics, string> = {
  'creator-retains-all': 'text-safe',
  'promotional-only': 'text-warn',
  'rights-grab-warning': 'text-danger',
}

const DOT: Record<RightsEthics, string> = {
  'creator-retains-all': 'bg-safe',
  'promotional-only': 'bg-warn',
  'rights-grab-warning': 'bg-danger',
}

export function RightsBadge({
  value,
  className,
}: {
  value: RightsEthics
  className?: string
}) {
  const m = useMessages()
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-[13px] font-medium',
        TONE[value],
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', DOT[value])} />
      {m.rights[value].title}
    </span>
  )
}
