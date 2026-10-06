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
import { useSmartHome } from '../../hooks/smartHomeContext'
import { LIGHT_LABELS } from '../../data/mockData'
import type { DeviceId } from '../../types'
import { Pill, Section } from '../ui'
import { shows, TOUCH, type WidgetSize } from '../../widgets/types'

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
  const { state, toggleLight, setBlinds } = useSmartHome()
  const open = state.lights['cover.blinds']
  const show = (tier: WidgetSize) => shows(size, tier, 'l')
  // The 8 pills need four 48px rows: only the 2-row (l) cell has room.
  // At m and w that tier is dropped rather than shrinking the targets.
  const pills = show('m') && size === 'l'

  return (
    <Section
      className={`${TOUCH.section} ${className}`}
      icon={<Lamp size={16} />}
      title="Indoor Lights"
      thumb={0.55}
      chips={
        <>
          <span className={`${TOUCH.chip} glass-amber text-bg`}>
            <Lightbulb size={14} />
          </span>
          <span className={TOUCH.chip}>
            <Car size={14} />
          </span>
        </>
      }
    >
      <div className="grid min-h-12 flex-1 grid-cols-2 gap-1.5">
        {BIG.map((id) => {
          const on = state.lights[id]
          const Icon = id === 'light.sofa' ? Sofa : on ? Lamp : LightbulbOff
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              onClick={() => toggleLight(id)}
              className={`press flex min-w-0 items-center justify-center gap-2 rounded-2xl px-2 text-center text-[14px] font-medium leading-tight ${
                size === 'w' ? 'flex-row' : 'flex-col'
              } ${on ? 'glass glass-teal' : 'glass'}`}
            >
              <Icon size={22} strokeWidth={1.6} className="shrink-0" />
              {LIGHT_LABELS[id]}
            </button>
          )
        })}
      </div>

      {pills && (
        <div className="grid grid-cols-2 gap-1.5">
          {ROWS.flat().map((id) => {
            const Icon = ICONS[id] ?? Lightbulb
            return (
              <Pill
                key={id}
                active={state.lights[id]}
                tone={id === 'light.lamp' ? 'amber' : 'teal'}
                icon={<Icon size={14} />}
                onClick={() => toggleLight(id)}
                className={`${TOUCH.pill} pr-2 max-[900px]:pl-3! max-[900px]:[&>span:first-child]:hidden`}
              >
                {LIGHT_LABELS[id]}
              </Pill>
            )
          })}
        </div>
      )}

      {show('w') && (
        <div
          className={`flex h-12 shrink-0 items-center gap-1 rounded-full pl-3 ${
            open ? 'glass glass-blue text-fg' : 'glass text-fg'
          }`}
        >
          <Blinds size={18} className="shrink-0" />
          <span className="min-w-0 flex-1 pl-1 text-[14px] leading-tight">
            <span className="block truncate font-medium">
              {LIGHT_LABELS['cover.blinds']}
            </span>
            <span className="block truncate opacity-80">
              {open ? 'Open' : 'Closed'}
            </span>
          </span>
          <button
            type="button"
            aria-label="Open blinds"
            onClick={() => setBlinds(true)}
            className={`${TOUCH.icon} bg-black/20 hover:bg-black/35`}
          >
            <ArrowUp size={18} />
          </button>
          <button
            type="button"
            aria-label="Close blinds"
            onClick={() => setBlinds(false)}
            className={`${TOUCH.icon} bg-black/20 hover:bg-black/35`}
          >
            <ArrowDown size={18} />
          </button>
        </div>
      )}
    </Section>
  )
}
