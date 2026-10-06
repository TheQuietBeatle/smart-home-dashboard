import { BatteryFull, Bot, House, MapPin, Play, Square } from 'lucide-react'
import { useState } from 'react'
import { useSmartHome } from '../hooks/smartHomeContext'
import { RoundBtn, Section } from './ui'
import { shows, TOUCH, type WidgetSize } from '../widgets/types'

export function RobotVacuumCard({ size = 'm' }: { size?: WidgetSize }) {
  const { state, toggleVacuum, dockVacuum } = useSmartHome()
  const { vacuum } = state
  const cleaning = !vacuum.docked
  const show = (tier: WidgetSize) => shows(size, tier, 'm')
  const narrow = size === 's' || size === 'l'
  const btn = `${TOUCH.round} w-full! rounded-xl`

  const battery = show('m') && (
    <div className="flex shrink-0 items-center gap-1.5 leading-none">
      <BatteryFull size={20} className="text-green" />
      <span className="text-[28px] font-medium tabular-nums">{vacuum.battery}%</span>
    </div>
  )

  return (
    <Section
      className={TOUCH.section}
      icon={<Bot size={16} />}
      title="Roomba"
      thumb={0.7}
    >
      <div className="flex items-center gap-2.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tile text-fg">
          <Bot size={18} />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[15px] font-medium">Roomba Vacuum</div>
          <div className="text-[14px] text-fg-dim">{vacuum.status}</div>
        </div>
        {!narrow && battery}
      </div>
      {narrow && battery}
      {show('w') && (
        <div className={`grid gap-1.5 ${size === 'l' ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <RoundBtn aria-label="Start cleaning" active={cleaning} onClick={() => !cleaning && toggleVacuum()} className={btn}>
            <Play size={18} />
          </RoundBtn>
          <RoundBtn aria-label="Stop" onClick={dockVacuum} className={btn}>
            <Square size={16} />
          </RoundBtn>
          <RoundBtn aria-label="Locate" className={btn}>
            <MapPin size={18} />
          </RoundBtn>
          <RoundBtn aria-label="Return to dock" onClick={dockVacuum} className={btn}>
            <House size={18} />
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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] content-start gap-1.5">
      {PILLS.map((pill) => {
        const on = pill === active
        return (
          <button
            key={pill}
            type="button"
            aria-pressed={on}
            onClick={() => setActive(pill)}
            className={`press h-12 rounded-full px-2 text-[14px] font-medium leading-tight ${
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
