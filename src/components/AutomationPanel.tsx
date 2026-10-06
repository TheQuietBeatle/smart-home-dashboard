import {
  Clapperboard,
  House,
  LogOut,
  Moon,
  Sparkles,
  Utensils,
  type LucideIcon,
} from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'
import type { Automation } from '../types'
import { Card, CardHeader } from './ui'

const ICONS: Record<Automation['icon'], LucideIcon> = {
  home: House,
  moon: Moon,
  away: LogOut,
  dinner: Utensils,
  movie: Clapperboard,
  sleep: Sparkles,
}

export function AutomationPanel() {
  const { state, runScene } = useSmartHome()

  return (
    <Card className="flex min-h-0 flex-col">
      <CardHeader
        title="Automazioni"
        action={
          <span className="text-[10px] text-ink-500">
            {state.activeScene
              ? state.automations.find((a) => a.id === state.activeScene)?.label
              : '—'}
          </span>
        }
      />
      <div className="flex min-h-0 flex-1 items-center justify-between gap-1 px-3 pb-2.5">
        {state.automations.map((auto) => {
          const Icon = ICONS[auto.icon]
          const active = auto.id === state.activeScene
          return (
            <button
              key={auto.id}
              type="button"
              onClick={() => runScene(auto.id)}
              className="press flex flex-1 flex-col items-center gap-1.5"
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-full border transition-all duration-200 ${
                  active
                    ? 'border-accent-cyan/45 bg-accent-cyan/12 text-accent-cyan glow-cyan'
                    : 'border-line bg-white/[0.03] text-ink-400 hover:border-accent-cyan/25 hover:text-ink-200'
                }`}
              >
                <Icon size={16} />
              </span>
              <span
                className={`text-[9px] font-semibold uppercase tracking-wider ${
                  active ? 'text-accent-cyan' : 'text-ink-500'
                }`}
              >
                {auto.label}
              </span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
