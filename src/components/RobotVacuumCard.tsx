import { Battery, Bot, Pause, Play, House } from 'lucide-react'
import { useState } from 'react'
import { useSmartHome } from '../hooks/smartHomeContext'
import { Card } from './ui'

export function RobotVacuumCard() {
  const { state, toggleVacuum, dockVacuum } = useSmartHome()
  const { vacuum } = state

  return (
    <Card className="flex min-h-0 flex-col justify-between px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[11px] font-semibold text-ink-100">
            Aspirapolvere Roomba
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                vacuum.docked ? 'bg-accent-green' : 'bg-accent-orange animate-live'
              }`}
            />
            <span className="text-[10px] text-ink-400">{vacuum.status}</span>
          </div>
        </div>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03] text-accent-teal">
          <Bot size={16} />
        </span>
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between text-[9px] text-ink-500">
          <span className="flex items-center gap-1">
            <Battery size={10} className="text-accent-green" />
            Batteria
          </span>
          <span className="font-semibold text-ink-200 tabular-nums">
            {vacuum.battery}%
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-teal to-accent-green transition-all duration-500"
            style={{ width: `${vacuum.battery}%` }}
          />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleVacuum}
          className={`press flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-1.5 text-[10px] font-semibold ${
            vacuum.docked
              ? 'border-accent-cyan/35 bg-accent-cyan/10 text-accent-cyan'
              : 'border-accent-amber/40 bg-accent-amber/12 text-accent-amber'
          }`}
        >
          {vacuum.docked ? <Play size={11} /> : <Pause size={11} />}
          {vacuum.docked ? 'Avvia pulizia' : 'Pausa'}
        </button>
        <button
          type="button"
          onClick={dockVacuum}
          disabled={vacuum.docked}
          aria-label="Torna alla base"
          className="press grid h-[26px] w-[26px] place-items-center rounded-lg border border-line bg-white/[0.03] text-ink-400 disabled:opacity-40"
        >
          <House size={12} />
        </button>
      </div>
    </Card>
  )
}

const PILLS = [
  'Musica',
  'Lavatrice',
  'Stanze',
  'Dispositivi',
  'Sensori',
  'Elettrodomestici',
]

export function QuickPills() {
  const [active, setActive] = useState('Dispositivi')

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
      {PILLS.map((pill) => {
        const on = pill === active
        return (
          <button
            key={pill}
            type="button"
            onClick={() => setActive(pill)}
            className={`press rounded-full border px-2.5 py-1 text-[9.5px] font-medium ${
              on
                ? 'border-accent-cyan/40 bg-accent-cyan/12 text-accent-cyan'
                : 'border-line bg-white/[0.02] text-ink-400 hover:text-ink-200'
            }`}
          >
            {pill}
          </button>
        )
      })}
    </div>
  )
}
