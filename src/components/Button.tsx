import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type Variant = 'primary' | 'soft' | 'ghost' | 'outline'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dim disabled:bg-primary/50',
  soft: 'bg-surface text-ink shadow-sm shadow-ink/8 hover:bg-muted disabled:opacity-60',
  ghost: 'text-ink-soft hover:bg-muted hover:text-ink',
  outline:
    'border border-primary bg-transparent text-primary hover:bg-primary hover:text-white disabled:opacity-50',
}

export function Button({
  variant = 'soft',
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
