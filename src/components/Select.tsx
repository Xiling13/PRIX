import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../lib/cn'

export type SelectOption = { value: string; label: string }

export function Select({
  value,
  options,
  onChange,
  className,
  'aria-label': ariaLabel,
}: {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  className?: string
  'aria-label'?: string
}) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<CSSProperties>()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const listId = useId()
  const selected = options.find((o) => o.value === value) ?? options[0]

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return
    function place() {
      const rect = buttonRef.current!.getBoundingClientRect()
      const maxHeight = 224
      const gap = 6
      const spaceBelow = window.innerHeight - rect.bottom - gap
      const spaceAbove = rect.top - gap
      const openUp =
        spaceBelow < 120 && spaceAbove > spaceBelow && spaceAbove > 120
      const height = Math.min(maxHeight, openUp ? spaceAbove : spaceBelow)
      setMenuStyle({
        position: 'fixed',
        left: rect.left,
        width: rect.width,
        top: openUp ? undefined : rect.bottom + gap,
        bottom: openUp ? window.innerHeight - rect.top + gap : undefined,
        maxHeight: height,
      })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center rounded-xl bg-canvas px-3.5 py-2.5 pr-10 text-left text-sm focus:ring-2 focus:ring-primary/40"
      >
        <span className="min-w-0 truncate">{selected?.label}</span>
        <ChevronDown
          className={cn(
            'pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-soft transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>
      {open &&
        menuStyle &&
        createPortal(
          <ul
            ref={menuRef}
            id={listId}
            role="listbox"
            style={menuStyle}
            className="z-50 overflow-y-auto rounded-xl bg-surface py-1.5 shadow-lg shadow-ink/15 ring-1 ring-ink/8"
          >
            {options.map((option) => {
              const isSelected = option.value === value
              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2 px-3.5 py-2 text-left text-sm transition-colors',
                      isSelected
                        ? 'bg-muted/70 text-ink'
                        : 'text-ink hover:bg-canvas',
                    )}
                    onClick={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'size-3.5 shrink-0',
                        isSelected ? 'opacity-100' : 'opacity-0',
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 truncate">{option.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>,
          document.body,
        )}
    </div>
  )
}
