import {
  Briefcase,
  Clapperboard,
  MoonStar,
  Settings,
  Smartphone,
  Sun,
  UtensilsCrossed,
} from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'
import { PHONE_BATTERY } from '../data/mockData'
import { Chip, Section } from './ui'
import { shows, type WidgetSize } from '../widgets/types'

const ICONS = {
  away: Briefcase,
  moon: MoonStar,
  home: Sun,
  dinner: UtensilsCrossed,
  movie: Clapperboard,
  sleep: MoonStar,
}

export function AutomationPanel({ size = 'w' }: { size?: WidgetSize }) {
  const { state, runScene } = useSmartHome()
  const all = shows(size, 'm', 'w')
  // Labels only at l: adding them at the default w would change today's look.
  const labels = size === 'l'
  const scenes = all ? state.automations : state.automations.slice(-3)

  return (
    <Section
      icon={<Settings size={16} />}
      title="Automations"
      thumb={0.3}
      chips={<Chip icon={<Smartphone size={12} />}>{PHONE_BATTERY}%</Chip>}
    >
      <div className={`grid gap-2 ${all ? 'grid-cols-5' : 'grid-cols-3'}`}>
        {scenes.map((a) => {
          const Icon = ICONS[a.icon]
          return (
            <button
              key={a.id}
              type="button"
              aria-label={a.label}
              aria-pressed={a.active}
              onClick={() => runScene(a.id)}
              className={`press grid place-items-center rounded-xl ${
                labels ? 'h-14 content-center gap-0.5 short:h-12' : 'h-10 short:h-9'
              } ${
                a.active ? 'glass glass-teal text-fg' : 'glass text-fg'
              }`}
            >
              <Icon size={16} />
              {labels && (
                <span className="text-[10px] font-medium">{a.label}</span>
              )}
            </button>
          )
        })}
      </div>
    </Section>
  )
}
