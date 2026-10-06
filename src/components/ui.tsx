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
