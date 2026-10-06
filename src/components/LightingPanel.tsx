import {
  ArrowDown,
  ArrowUp,
  Bed,
  BookOpen,
  CookingPot,
  Lamp,
  LampFloor,
  Lightbulb,
  LightbulbOff,
  PanelTop,
  Sofa,
  Tv,
  Blinds,
  Car,
} from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'
import { LIGHT_LABELS } from '../data/mockData'
import type { DeviceId } from '../types'
import { Chip, Pill, Section } from './ui'
import { shows, type WidgetSize } from '../widgets/types'

const BIG: DeviceId[] = ['light.table', 'light.sofa']
const ROWS: [DeviceId, DeviceId][] = [
  ['light.bed', 'light.warm'],
  ['light.tvled', 'light.lamp'],
  ['light.kitchen_led', 'light.kitchen'],
  ['light.wall', 'light.floor'],
]

const ICONS: Partial<Record<DeviceId, typeof Bed>> = {
  'light.bed': Bed,
  'light.warm': BookOpen,
  'light.tvled': Tv,
  'light.lamp': Lightbulb,
  'light.kitchen_led': CookingPot,
  'light.kitchen': Lamp,
  'light.wall': PanelTop,
  'light.floor': LampFloor,
}

export function LightingPanel({
  className = '',
  size = 'l',
}: {
  className?: string
  size?: WidgetSize
}) {
  const show = (tier: WidgetSize) => shows(size, tier, 'l')
  const { state, toggleLight, setBlinds } = useSmartHome()
  const open = state.lights['cover.blinds']

  return (
    <Section
      className={className}
      icon={<Lamp size={16} />}
      title="Indoor Lights"
      thumb={0.55}
      chips={
        <>
          <Chip tone="amber" icon={<Lightbulb size={12} />} />
          <Chip icon={<Car size={12} />} />
        </>
      }
    >
      <div className="grid min-h-[84px] short:min-h-[52px] flex-1 grid-cols-2 gap-2">
        {BIG.map((id) => {
          const on = state.lights[id]
          const Icon = id === 'light.sofa' ? Sofa : on ? Lamp : LightbulbOff
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              onClick={() => toggleLight(id)}
              className={`press flex flex-col items-center justify-center gap-2 rounded-2xl text-[13px] font-medium ${
                on ? 'glass glass-teal' : 'glass'
              }`}
            >
              <Icon size={22} strokeWidth={1.6} />
              {LIGHT_LABELS[id]}
            </button>
          )
        })}
      </div>

      {show('m') && (
      <div className="grid grid-cols-2 gap-2 [&>button]:h-full [&>button]:min-h-9" style={{ flexGrow: 0.3 }}>
        {ROWS.flat().map((id) => {
          const Icon = ICONS[id] ?? Lightbulb
          return (
            <Pill
              key={id}
              active={state.lights[id]}
              tone={id === 'light.lamp' ? 'amber' : 'teal'}
              icon={<Icon size={13} />}
              onClick={() => toggleLight(id)}
            >
              {LIGHT_LABELS[id]}
            </Pill>
          )
        })}
      </div>
      )}

      {show('w') && (
      <div
        className={`flex h-11 short:h-10 items-center gap-2 rounded-full px-2 ${
          open ? 'glass glass-blue text-fg' : 'glass text-fg'
        }`}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-black/20">
          <Blinds size={15} />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[13px] font-medium">
            {LIGHT_LABELS['cover.blinds']}
          </span>
          <span className="block truncate text-[10px] opacity-80">
            {open ? 'Open' : 'Closed'}
          </span>
        </span>
        <button
          type="button"
          aria-label="Open blinds"
          onClick={() => setBlinds(true)}
          className="press grid h-8 w-8 place-items-center rounded-full bg-black/25 hover:bg-black/35"
        >
          <ArrowUp size={15} />
        </button>
        <button
          type="button"
          aria-label="Close blinds"
          onClick={() => setBlinds(false)}
          className="press grid h-8 w-8 place-items-center rounded-full bg-black/25 hover:bg-black/35"
        >
          <ArrowDown size={15} />
        </button>
      </div>
      )}
    </Section>
  )
}
