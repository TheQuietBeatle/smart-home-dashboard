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

const ICONS = {
  away: Briefcase,
  moon: MoonStar,
  home: Sun,
  dinner: UtensilsCrossed,
  movie: Clapperboard,
  sleep: MoonStar,
}

export function AutomationPanel() {
  const { state, runScene } = useSmartHome()

  return (
    <Section
      icon={<Settings size={16} />}
      title="Automazioni"
      thumb={0.3}
      chips={<Chip icon={<Smartphone size={12} />}>{PHONE_BATTERY}%</Chip>}
    >
      <div className="grid grid-cols-5 gap-2">
        {state.automations.map((a) => {
          const Icon = ICONS[a.icon]
          return (
            <button
              key={a.id}
              type="button"
              aria-label={a.label}
              aria-pressed={a.active}
              onClick={() => runScene(a.id)}
              className={`press grid h-10 place-items-center rounded-xl ${
                a.active ? 'bg-teal text-fg' : 'bg-tile text-fg hover:bg-tile-hi'
              }`}
            >
              <Icon size={16} />
            </button>
          )
        })}
      </div>
    </Section>
  )
}
