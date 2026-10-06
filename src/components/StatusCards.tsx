import { Camera, Car, DoorClosed, Lightbulb, Warehouse } from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'
import type { StatusCard } from '../types'
import { Badge, Pill } from './ui'

const ICONS = {
  gate: DoorClosed,
  led: Lightbulb,
  garage: Warehouse,
  car: Car,
}

export function StatusCards() {
  const { state, toggleStatus } = useSmartHome()
  const of = (kind: StatusCard['kind']) =>
    state.statusCards.filter((c) => c.kind === kind)

  return (
    <div className="flex shrink-0 flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {of('pill').map((c) => {
          const Icon = ICONS[c.icon]
          return (
            <Pill
              key={c.id}
              active={c.active}
              tone="teal"
              icon={<Icon size={14} />}
              badge={c.badge && <Badge>{c.badge}</Badge>}
              onClick={() => toggleStatus(c.id)}
            >
              {c.label}
            </Pill>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {of('garage').map((c) => {
          const Icon = ICONS[c.icon]
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={c.active}
              onClick={() => toggleStatus(c.id)}
              className={`press flex h-11 min-w-0 items-center gap-2 rounded-full px-2 text-left ${
                c.active ? 'bg-green text-bg' : 'bg-tile text-fg'
              }`}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-black/20">
                <Icon size={15} />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[13px] font-medium">
                  {c.label}
                </span>
                <span className="block truncate text-[10px] opacity-80">
                  {c.detail}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {['Entrance', 'Courtyard'].map((name) => (
          <div
            key={name}
            className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-br from-[#3a3f47] via-[#23272e] to-[#14171c]"
          >
            <Camera
              size={16}
              className="absolute left-2 top-2 text-fg/60"
              aria-hidden
            />
            <span className="absolute bottom-1.5 left-2 text-[10px] text-fg/70">
              {name}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {of('vehicle').map((c) => {
          const Icon = ICONS[c.icon]
          return (
            <Pill
              key={c.id}
              icon={<Icon size={14} />}
              badge={<span className="text-[11px] text-fg-dim">{c.detail}</span>}
            >
              {c.label}
            </Pill>
          )
        })}
      </div>
    </div>
  )
}
