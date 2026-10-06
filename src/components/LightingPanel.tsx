import {
  Bed,
  Blinds,
  BrickWall,
  ChevronDown,
  ChevronUp,
  CookingPot,
  Flame,
  Layers,
  Lamp,
  LampDesk,
  Lightbulb,
  Sofa,
  Tv,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { useSmartHome } from '../hooks/smartHomeContext'
import type { DeviceId } from '../types'
import { LIGHT_LABELS } from '../data/mockData'
import { Card, CardHeader } from './ui'

const DEVICE_ICONS: Record<DeviceId, ComponentType<{ size?: number }>> = {
  'light.table': LampDesk,
  'light.sofa': Sofa,
  'light.bed': Bed,
  'light.tvled': Tv,
  'light.lamp': Lamp,
  'light.kitchen_led': Lightbulb,
  'light.kitchen': CookingPot,
  'light.warm': Flame,
  'light.wall': BrickWall,
  'light.floor': Layers,
  'cover.blinds': Blinds,
}

const WARM_DEVICES: DeviceId[] = ['light.lamp', 'light.warm', 'light.kitchen']

const LIGHT_ORDER: DeviceId[] = [
  'light.table',
  'light.sofa',
  'light.bed',
  'light.tvled',
  'light.lamp',
  'light.kitchen_led',
  'light.kitchen',
  'light.warm',
  'light.wall',
  'light.floor',
]

export function LightingPanel() {
  const { state, toggleLight, setBlinds } = useSmartHome()
  const blindsOpen = state.lights['cover.blinds']

  return (
    <Card className="flex min-h-0 flex-col">
      <CardHeader
        title="Illuminazione"
        action={
          <span className="text-[10px] text-ink-500">
            {LIGHT_ORDER.filter((id) => state.lights[id]).length}/
            {LIGHT_ORDER.length} attive
          </span>
        }
      />

      <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-4 gap-1.5 px-3 pb-3">
        {LIGHT_ORDER.map((id) => (
          <DeviceButton
            key={id}
            id={id}
            on={state.lights[id]}
            onClick={() => toggleLight(id)}
          />
        ))}

        <div className="col-span-2 flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-3 py-2">
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${
              blindsOpen
                ? 'border-accent-cyan/35 bg-accent-cyan/12 text-accent-cyan'
                : 'border-line bg-white/[0.04] text-ink-500'
            }`}
          >
            <Blinds size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-semibold text-ink-100">
              {LIGHT_LABELS['cover.blinds']}
            </div>
            <div
              className={`text-[9px] font-medium uppercase tracking-wider ${
                blindsOpen ? 'text-accent-cyan' : 'text-ink-600'
              }`}
            >
              {blindsOpen ? 'Aperte' : 'Chiuse'}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setBlinds(true)}
              aria-label="Apri tapparelle"
              className={`press grid h-8 w-9 place-items-center rounded-lg border ${
                blindsOpen
                  ? 'border-accent-cyan/40 bg-accent-cyan/12 text-accent-cyan'
                  : 'border-line bg-white/[0.03] text-ink-400'
              }`}
            >
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => setBlinds(false)}
              aria-label="Chiudi tapparelle"
              className={`press grid h-8 w-9 place-items-center rounded-lg border ${
                !blindsOpen
                  ? 'border-accent-cyan/40 bg-accent-cyan/12 text-accent-cyan'
                  : 'border-line bg-white/[0.03] text-ink-400'
              }`}
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function DeviceButton({
  id,
  on,
  onClick,
}: {
  id: DeviceId
  on: boolean
  onClick: () => void
}) {
  const Icon = DEVICE_ICONS[id]
  const warm = WARM_DEVICES.includes(id)
  const label = LIGHT_LABELS[id]

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`press flex h-full items-center gap-2 rounded-xl border px-2.5 text-left ${
        on
          ? warm
            ? 'border-accent-amber/45 bg-accent-amber/12 glow-amber'
            : 'border-accent-cyan/35 bg-accent-cyan/10 glow-cyan'
          : 'border-line bg-white/[0.02] hover:bg-white/[0.05]'
      }`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
          on
            ? warm
              ? 'bg-accent-amber/20 text-accent-amber'
              : 'bg-accent-cyan/18 text-accent-cyan'
            : 'bg-white/[0.04] text-ink-500'
        }`}
      >
        <Icon size={15} />
      </span>
      <span className="min-w-0">
        <span
          className={`block truncate text-[11px] font-semibold leading-tight ${
            on ? 'text-ink-100' : 'text-ink-400'
          }`}
        >
          {label}
        </span>
        <span
          className={`block text-[8.5px] font-medium uppercase tracking-wider ${
            on ? (warm ? 'text-accent-amber' : 'text-accent-cyan') : 'text-ink-600'
          }`}
        >
          {on ? 'Accesa' : 'Spenta'}
        </span>
      </span>
    </button>
  )
}
