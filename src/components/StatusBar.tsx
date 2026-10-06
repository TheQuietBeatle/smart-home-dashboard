import {
  Activity,
  Droplets,
  House,
  Lightbulb,
  Thermometer,
  Wifi,
} from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'
import { num } from '../lib/format'

export function StatusBar() {
  const { state } = useSmartHome()
  const activeScene = state.automations.find((a) => a.id === state.activeScene)
  const lightsOn = Object.entries(state.lights).filter(
    ([id, on]) => id.startsWith('light.') && on,
  ).length

  return (
    <footer className="glass glass-bar flex h-8 shrink-0 items-center gap-3 px-3 text-[11px] text-fg-dim">
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-green animate-live" />
        <Wifi size={12} className="text-teal" />
        <b className="font-medium text-fg">Online</b>
      </span>

      <Divider />

      <span className="flex items-center gap-1.5">
        <House size={12} />
        Scene
        <b className="font-medium text-fg">{activeScene?.label ?? '—'}</b>
      </span>

      <Divider />

      <span className="flex items-center gap-1.5">
        <Lightbulb size={12} className="text-amber" />
        <b className="font-medium tabular-nums text-fg">{lightsOn}</b>
        {lightsOn === 1 ? 'light on' : 'lights on'}
      </span>

      <Divider />

      <span className="flex items-center gap-1.5">
        <Activity size={12} className="text-teal" />
        Energy
        <b className="font-medium tabular-nums text-fg">
          {num(state.sensors.energy)} kW
        </b>
      </span>

      <span className="ml-auto flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <Thermometer size={12} />
          Indoor
          <b className="font-medium tabular-nums text-fg">
            {num(state.sensors.indoorTemp)} °C
          </b>
        </span>
        <span className="flex items-center gap-1.5">
          <Droplets size={12} />
          <b className="font-medium tabular-nums text-fg">
            {state.sensors.indoorHumidity}%
          </b>
        </span>
      </span>
    </footer>
  )
}

function Divider() {
  return <span aria-hidden className="h-3 w-px bg-white/15" />
}
