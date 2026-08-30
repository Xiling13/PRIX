import { cn } from '../lib/cn'
import { useMessages } from '../lib/i18n'
import type { RightsEthics } from '../types/competition'
import { MetaDot } from './MetaDot'

const TONE: Record<RightsEthics, string> = {
  'creator-retains-all': 'text-safe',
  'promotional-only': 'text-warn',
  'rights-grab-warning': 'text-danger',
}

const DOT_COLOR: Record<
  RightsEthics,
  'safe' | 'warn' | 'danger'
> = {
  'creator-retains-all': 'safe',
  'promotional-only': 'warn',
  'rights-grab-warning': 'danger',
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
      <MetaDot color={DOT_COLOR[value]} />
      {m.rights[value].title}
    </span>
  )
}
