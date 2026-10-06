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
import { Section } from './ui'
import { shows, TOUCH, type WidgetSize } from '../widgets/types'

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
  const labels = shows(size, 'w', 'w')
  const scenes = all ? state.automations : state.automations.slice(-3)
  // l is 3 columns wide but 2 rows tall: a labelled list.
  const list = size === 'l'

  return (
    <Section
      className={TOUCH.section}
      icon={<Settings size={16} />}
      title="Automations"
      thumb={0.3}
      chips={
        <span className={TOUCH.chip}>
          <Smartphone size={14} />
          {PHONE_BATTERY}%
        </span>
      }
    >
      <div
        className={`grid gap-1.5 ${
          list ? 'grid-cols-1' : all ? 'grid-cols-5' : 'grid-cols-3'
        }`}
      >
        {scenes.map((a) => {
          const Icon = ICONS[a.icon]
          return (
            <button
              key={a.id}
              type="button"
              aria-label={a.label}
              aria-pressed={a.active}
              onClick={() => runScene(a.id)}
              className={`press flex min-w-0 items-center rounded-xl text-[14px] font-medium ${
                list
                  ? 'h-12 gap-3 px-4'
                  : labels
                    ? 'h-16 flex-col justify-center gap-1'
                    : 'h-12 justify-center'
              } ${a.active ? 'glass glass-teal text-fg' : 'glass text-fg'}`}
            >
              <Icon size={18} className="shrink-0" />
              {labels && <span className="truncate">{a.label}</span>}
            </button>
          )
        })}
      </div>
    </Section>
  )
}
