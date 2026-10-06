import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return <div className={`card ${className}`}>{children}</div>
}

interface CardHeaderProps {
  title: string
  action?: ReactNode
}

export function CardHeader({ title, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
      <span className="card-title">{title}</span>
      {action}
    </div>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  accent?: 'cyan' | 'amber' | 'plain'
  size?: 'sm' | 'md'
  children: ReactNode
}

export function IconButton({
  active = false,
  accent = 'cyan',
  size = 'md',
  className = '',
  children,
  ...rest
}: IconButtonProps) {
  const sizing =
    size === 'sm'
      ? 'h-7 w-7 rounded-lg text-[11px]'
      : 'h-9 w-9 rounded-xl text-xs disabled:cursor-not-allowed disabled:opacity-40'
  const tone = active
    ? accent === 'amber'
      ? 'bg-accent-amber/15 text-accent-amber border-accent-amber/40 glow-amber'
      : 'bg-accent-cyan/12 text-accent-cyan border-accent-cyan/35 glow-cyan'
    : 'bg-white/[0.03] text-ink-400 border-line hover:text-ink-300 hover:bg-white/[0.06]'

  return (
    <button
      type="button"
      className={`press grid place-items-center border ${sizing} ${tone} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

type Tone = 'teal' | 'amber' | 'blue' | 'green' | 'steel'

const TONE_ON: Record<Tone, string> = {
  teal: 'bg-teal text-fg',
  amber: 'bg-amber text-bg',
  blue: 'bg-blue text-fg',
  green: 'bg-green text-bg',
  steel: 'bg-steel text-fg',
}

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  active?: boolean
  tone?: Tone
  badge?: ReactNode
}

export function Pill({
  icon,
  active = false,
  tone = 'teal',
  badge,
  className = '',
  children,
  ...rest
}: PillProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`press flex h-9 min-w-0 items-center gap-2 rounded-full px-1.5 pr-3 text-left text-[13px] font-medium ${
        active ? TONE_ON[tone] : 'bg-tile text-fg hover:bg-tile-hi'
      } ${className}`}
      {...rest}
    >
      {icon && (
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
            active ? 'bg-black/20' : 'bg-white/[0.06]'
          }`}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {badge}
    </button>
  )
}

export function Badge({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`shrink-0 rounded-full bg-amber px-2 py-0.5 text-[11px] font-bold text-bg ${className}`}
    >
      {children}
    </span>
  )
}

export function Chip({
  icon,
  children,
  tone = 'plain',
}: {
  icon?: ReactNode
  children?: ReactNode
  tone?: 'plain' | 'amber'
}) {
  return (
    <span
      className={`flex h-6 shrink-0 items-center gap-1 rounded-md px-1.5 text-[11px] font-medium ${
        tone === 'amber' ? 'bg-amber text-bg' : 'bg-tile text-fg'
      }`}
    >
      {icon}
      {children}
    </span>
  )
}

export function Section({
  icon,
  title,
  chips,
  thumb = 0.5,
  children,
  className = '',
}: {
  icon: ReactNode
  title: string
  chips?: ReactNode
  thumb?: number
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`flex flex-col gap-2 ${className.includes('flex-1') ? '' : 'shrink-0'} ${className}`}>
      <header className="flex h-6 items-center gap-2">
        <span className="text-fg-dim">{icon}</span>
        <h2 className="text-[13px] font-medium text-fg">{title}</h2>
        <span aria-hidden className="relative mx-1 h-[3px] flex-1 rounded-full bg-rail">
          <span
            className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-fg-dim"
            style={{ left: `${thumb * 100}%` }}
          />
        </span>
        <div className="flex items-center gap-1">{chips}</div>
      </header>
      {children}
    </section>
  )
}

export function RoundBtn({
  active = false,
  tone = 'teal',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
  tone?: Tone
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={`press grid h-9 w-9 shrink-0 place-items-center rounded-full ${
        active ? TONE_ON[tone] : 'bg-tile text-fg hover:bg-tile-hi'
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
