import { cn } from '../lib/cn'
import { RIGHTS_LABELS } from '../lib/labels'
import type { RightsEthics } from '../types/competition'

const TONE: Record<RightsEthics, string> = {
  'creator-retains-all': 'text-cyan-dim',
  'promotional-only': 'text-warn',
  'rights-grab-warning': 'text-magenta',
}

const DOT: Record<RightsEthics, string> = {
  'creator-retains-all': 'bg-cyan',
  'promotional-only': 'bg-warn',
  'rights-grab-warning': 'bg-magenta',
}

export function RightsBadge({
  value,
  className,
}: {
  value: RightsEthics
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-[13px] font-medium',
        TONE[value],
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', DOT[value])} />
      {RIGHTS_LABELS[value].title}
    </span>
  )
}
