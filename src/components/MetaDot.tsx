import { cn } from '../lib/cn'

const TONE_CLASS = {
  muted: 'bg-ink-muted',
  soft: 'bg-ink-soft',
} as const

const COLOR_CLASS = {
  safe: 'bg-safe',
  warn: 'bg-warn',
  danger: 'bg-danger',
} as const

type MetaDotProps = {
  tone?: keyof typeof TONE_CLASS
  color?: keyof typeof COLOR_CLASS
  className?: string
}

export function MetaDot({ tone = 'muted', color, className }: MetaDotProps) {
  return (
    <span
      className={cn(
        'inline-block size-1 shrink-0 rounded-full',
        color ? COLOR_CLASS[color] : TONE_CLASS[tone],
        className,
      )}
      aria-hidden
    />
  )
}
