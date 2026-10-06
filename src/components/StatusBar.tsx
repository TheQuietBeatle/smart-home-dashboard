import {
  Activity,
  Cloud,
  Cpu,
  Home,
  MessageSquare,
  Moon,
  Wifi,
} from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'

export function StatusBar() {
  const { state } = useSmartHome()
  const activeScene = state.automations.find((a) => a.id === state.activeScene)
  const lightsOn = Object.entries(state.lights).filter(
    ([id, on]) => id.startsWith('light.') && on,
  ).length

  return (
    <footer className="flex h-8 shrink-0 items-center gap-3 border-t border-line bg-[#0a111e] px-3 text-[9.5px] text-ink-500">
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-live" />
        <Wifi size={11} className="text-accent-teal" />
        <b className="font-semibold text-ink-300">Online</b>
      </span>

      <span className="h-3 w-px bg-line" />

      <span className="flex items-center gap-1.5">
        <Home size={11} className="text-accent-cyan" />
        Scena attiva:
        <b className="font-semibold text-ink-200">{activeScene?.label ?? '—'}</b>
      </span>

      <span className="h-3 w-px bg-line" />

      <span className="flex items-center gap-1.5">
        <LightIcon />
        <b className="font-semibold text-ink-200 tabular-nums">{lightsOn}</b>
        luci accese
      </span>

      <span className="h-3 w-px bg-line" />

      <span className="flex items-center gap-1.5">
        <Activity size={11} className="text-accent-teal" />
        Energia
        <b className="font-semibold text-ink-200 tabular-nums">
          {state.sensors.energy.toFixed(1)} kW
        </b>
      </span>

      <span className="ml-auto flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <Cloud size={11} />
          {state.sensors.outdoorHumidity}%
        </span>
        <span className="flex items-center gap-1.5">
          <Moon size={11} className="text-accent-blue" />
          {state.sensors.indoorTemp.toFixed(1)}°C interna
        </span>
        <span className="flex items-center gap-1.5">
          <Cpu size={11} />
          <b className="font-semibold text-ink-300">Casa v1.0</b>
        </span>
        <span className="grid h-5 w-5 place-items-center rounded-md border border-line bg-white/[0.03]">
          <MessageSquare size={10} />
        </span>
      </span>
    </footer>
  )
}

function LightIcon() {
  return (
    <span className="grid h-3 w-3 place-items-center rounded-[3px] bg-accent-amber/20 text-[7px] text-accent-amber">
      ●
    </span>
  )
}
