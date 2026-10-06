import { Car, Fence, Thermometer, Warehouse } from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'
import type { StatusCard as StatusCardData } from '../types'

const ICONS = {
  garage: Warehouse,
  gate: Fence,
  car: Car,
  sensor: Thermometer,
}

export function StatusCards() {
  const { state } = useSmartHome()

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2">
      {state.statusCards.map((card) => (
        <StatusTile key={card.id} card={card} />
      ))}
    </div>
  )
}

function StatusTile({ card }: { card: StatusCardData }) {
  const Icon = ICONS[card.icon]

  return (
    <div className="card press flex items-center gap-2 px-2.5 py-2 hover:border-accent-cyan/30">
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${
          card.active
            ? 'border-accent-cyan/35 bg-accent-cyan/12 text-accent-cyan'
            : 'border-line bg-white/[0.03] text-ink-500'
        }`}
      >
        <Icon size={14} />
      </span>
      <div className="min-w-0">
        <div className="truncate text-[9px] font-semibold uppercase tracking-widest text-ink-500">
          {card.label}
        </div>
        <div className="truncate text-[11px] font-semibold text-ink-100">
          {card.value}
        </div>
        <div className="truncate text-[9px] text-ink-500">{card.detail}</div>
      </div>
    </div>
  )
}
