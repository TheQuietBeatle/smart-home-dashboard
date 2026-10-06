import { BatteryFull, Bot, House, MapPin, Play, Square } from 'lucide-react'
import { useState } from 'react'
import { useSmartHome } from '../hooks/smartHomeContext'
import { Chip, RoundBtn, Section } from './ui'
import { shows, type WidgetSize } from '../widgets/types'

export function RobotVacuumCard({ size = 'm' }: { size?: WidgetSize }) {
  const { state, toggleVacuum, dockVacuum } = useSmartHome()
  const show = (tier: WidgetSize) => shows(size, tier, 'm')
  const { vacuum } = state
  const cleaning = !vacuum.docked

  return (
    <Section
      icon={<Bot size={16} />}
      title="Roomba"
      thumb={0.7}
      chips={
        show('m') && (
          <Chip icon={<BatteryFull size={12} />}>{vacuum.battery}%</Chip>
        )
      }
    >
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 short:h-8 short:w-8 shrink-0 place-items-center rounded-full bg-tile text-fg">
          <Bot size={16} />
        </span>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[13px] font-medium">Roomba Vacuum</div>
          <div className="text-[11px] text-fg-dim">{vacuum.status}</div>
        </div>
      </div>
      {show('w') && (
      <div className="grid grid-cols-4 gap-2">
        <RoundBtn aria-label="Start cleaning" active={cleaning} onClick={() => !cleaning && toggleVacuum()} className="w-full rounded-xl short:w-full">
          <Play size={15} />
        </RoundBtn>
        <RoundBtn aria-label="Stop" onClick={dockVacuum} className="w-full rounded-xl short:w-full">
          <Square size={14} />
        </RoundBtn>
        <RoundBtn aria-label="Locate" className="w-full rounded-xl short:w-full">
          <MapPin size={15} />
        </RoundBtn>
        <RoundBtn aria-label="Return to dock" onClick={dockVacuum} className="w-full rounded-xl short:w-full">
          <House size={15} />
        </RoundBtn>
      </div>
      )}
    </Section>
  )
}

const PILLS = ['Music', 'Washer', 'Rooms', 'Devices', 'Sensors', 'Appliances']

export function QuickPills() {
  const [active, setActive] = useState('Devices')

  return (
    <div className="flex flex-wrap content-start items-center gap-1.5">
      {PILLS.map((pill) => {
        const on = pill === active
        return (
          <button
            key={pill}
            type="button"
            aria-pressed={on}
            onClick={() => setActive(pill)}
            className={`press rounded-full px-2.5 py-1 text-[11px] font-medium ${
              on ? 'glass glass-teal text-fg' : 'glass text-fg-dim hover:text-fg'
            }`}
          >
            {pill}
          </button>
        )
      })}
    </div>
  )
}
