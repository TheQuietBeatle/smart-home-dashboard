import { Fan, Minus, Power, Plus, Snowflake, Sun, Wind } from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'
import type { ClimateMode } from '../types'
import { Card, CardHeader, IconButton } from './ui'

const MIN_TEMP = 16
const MAX_TEMP = 30

const MODES: { id: ClimateMode; label: string; icon: typeof Snowflake }[] = [
  { id: 'cool', label: 'Freddo', icon: Snowflake },
  { id: 'heat', label: 'Caldo', icon: Sun },
  { id: 'auto', label: 'Auto', icon: Wind },
  { id: 'fan', label: 'Vento', icon: Fan },
]

const FAN_LABEL: Record<string, string> = {
  auto: 'Auto',
  low: 'Bassa',
  medium: 'Media',
  high: 'Alta',
}

export function ClimateCard() {
  const { state, setTemp, toggleClimatePower, setClimateMode, cycleFan } =
    useSmartHome()
  const { climate } = state

  return (
    <Card className="flex min-h-0 flex-1 flex-col">
      <CardHeader
        title="Climatizzatore"
        action={
          <button
            type="button"
            onClick={toggleClimatePower}
            className={`press flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
              climate.power
                ? 'border-accent-red/40 bg-accent-red/12 text-accent-red'
                : 'border-line bg-white/[0.03] text-ink-400'
            }`}
          >
            <Power size={11} />
            {climate.power ? 'Spegni' : 'Accendi'}
          </button>
        }
      />

      <div className="flex min-h-0 flex-1 items-center gap-3 px-3 pb-1">
        <TemperatureDial
          target={climate.targetTemp}
          current={climate.currentTemp}
          power={climate.power}
          mode={climate.mode}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <IconButton
              aria-label="Abbassa temperatura"
              onClick={() => setTemp(-0.5)}
              disabled={!climate.power}
            >
              <Minus size={15} />
            </IconButton>
            <div className="flex-1 rounded-xl border border-line bg-white/[0.02] px-2 py-1.5 text-center">
              <div className="text-[9px] uppercase tracking-widest text-ink-500">
                Impostata
              </div>
              <div className="text-lg font-semibold leading-tight text-ink-100 tabular-nums">
                {climate.targetTemp.toFixed(1)}
                <span className="text-xs text-ink-400">°C</span>
              </div>
            </div>
            <IconButton
              aria-label="Alza temperatura"
              onClick={() => setTemp(0.5)}
              disabled={!climate.power}
            >
              <Plus size={15} />
            </IconButton>
          </div>

          <input
            type="range"
            min={MIN_TEMP}
            max={MAX_TEMP}
            step={0.5}
            value={climate.targetTemp}
            disabled={!climate.power}
            onChange={(e) => {
              const next = Number(e.target.value)
              setTemp(next - climate.targetTemp)
            }}
            aria-label="Temperatura"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-accent-cyan disabled:opacity-40"
            style={{
              background: `linear-gradient(90deg, #22d3ee 0%, #2dd4bf ${
                ((climate.targetTemp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100
              }%, rgba(255,255,255,0.07) ${
                ((climate.targetTemp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100
              }%, rgba(255,255,255,0.07) 100%)`,
            }}
          />

          <div className="grid grid-cols-4 gap-1.5">
            {MODES.map((m) => {
              const Icon = m.icon
              const active = climate.mode === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  disabled={!climate.power}
                  onClick={() => setClimateMode(m.id)}
                  className={`press flex flex-col items-center gap-1 rounded-xl border py-1.5 text-[9px] font-medium disabled:opacity-40 ${
                    active
                      ? 'border-accent-cyan/40 bg-accent-cyan/12 text-accent-cyan'
                      : 'border-line bg-white/[0.02] text-ink-400 hover:text-ink-200'
                  }`}
                >
                  <Icon size={13} />
                  {m.label}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={cycleFan}
            disabled={!climate.power}
            className="press flex items-center justify-between rounded-xl border border-line bg-white/[0.02] px-2.5 py-1.5 text-[10px] text-ink-300 disabled:opacity-40 hover:bg-white/[0.05]"
          >
            <span className="flex items-center gap-1.5">
              <Fan size={12} className="text-accent-teal" />
              Ventilatore
            </span>
            <span className="font-semibold text-ink-100">
              {FAN_LABEL[climate.fan]}
            </span>
          </button>
        </div>
      </div>

      <div className="mx-3 h-px bg-line" />

      <div className="px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="mr-1 shrink-0 text-[9px] font-semibold uppercase tracking-widest text-ink-600">
            Preset
          </span>
          {PRESETS.map((p) => {
            const active = climate.targetTemp === p
            return (
              <button
                key={p}
                type="button"
                disabled={!climate.power}
                onClick={() => setTemp(p - climate.targetTemp)}
                className={`press flex-1 rounded-lg border py-1 text-[10px] font-semibold tabular-nums disabled:opacity-40 ${
                  active
                    ? 'border-accent-cyan/40 bg-accent-cyan/12 text-accent-cyan'
                    : 'border-line bg-white/[0.02] text-ink-400 hover:text-ink-200'
                }`}
              >
                {p}°
              </button>
            )
          })}
        </div>

        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
          <MiniStat
            label="Esterno"
            value={`${state.sensors.outdoorTemp.toFixed(1)}°`}
            tone="cyan"
          />
          <MiniStat
            label="Interno"
            value={`${state.sensors.indoorTemp.toFixed(1)}°`}
            tone="plain"
          />
          <MiniStat
            label="Umidità"
            value={`${state.sensors.indoorHumidity}%`}
            tone="amber"
          />
        </div>
      </div>
    </Card>
  )
}

const PRESETS = [16.5, 18, 20, 21.5, 24]

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'cyan' | 'amber' | 'plain'
}) {
  const toneClass =
    tone === 'cyan'
      ? 'text-accent-cyan'
      : tone === 'amber'
        ? 'text-accent-amber'
        : 'text-ink-100'

  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-white/[0.02] px-2 py-1">
      <span className="text-[8.5px] font-semibold uppercase tracking-widest text-ink-600">
        {label}
      </span>
      <span className={`text-[11px] font-semibold tabular-nums ${toneClass}`}>
        {value}
      </span>
    </div>
  )
}

function TemperatureDial({
  target,
  current,
  power,
  mode,
}: {
  target: number
  current: number
  power: boolean
  mode: ClimateMode
}) {
  const r = 58
  const c = 2 * Math.PI * r
  const progress = (target - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)
  const dash = c * 0.75
  const modeIcon = MODES.find((m) => m.id === mode)?.icon ?? Snowflake
  const ModeIcon = modeIcon

  return (
    <div className="relative grid shrink-0 place-items-center">
      <svg width="146" height="146" viewBox="0 0 146 146" className="-rotate-[135deg]">
        <defs>
          <linearGradient id="dialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="55%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <circle
          cx="73"
          cy="73"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
        <circle
          cx="73"
          cy="73"
          r={r}
          fill="none"
          stroke={power ? 'url(#dialGrad)' : '#334155'}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${dash * progress} ${c}`}
          style={{
            transition: 'stroke-dasharray 420ms cubic-bezier(.4,0,.2,1)',
            filter: power ? 'drop-shadow(0 0 6px rgba(34,211,238,0.5))' : 'none',
          }}
        />
        <circle
          cx="73"
          cy="73"
          r={r - 16}
          fill="rgba(10,17,30,0.55)"
          stroke="rgba(255,255,255,0.04)"
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <ModeIcon
          size={14}
          className={power ? 'text-accent-cyan' : 'text-ink-600'}
        />
        <span className="mt-0.5 text-[30px] font-semibold leading-none tracking-tight text-ink-100 tabular-nums">
          {target.toFixed(1)}
        </span>
        <span className="text-[10px] font-medium text-ink-400">°C</span>
        <span
          className={`mt-1 rounded-full border px-2 py-[1px] text-[8px] font-semibold uppercase tracking-widest ${
            power
              ? 'border-accent-cyan/35 bg-accent-cyan/10 text-accent-cyan'
              : 'border-line bg-white/[0.03] text-ink-500'
          }`}
        >
          {power ? 'Acceso' : 'Spento'}
        </span>
        <span className="mt-1 text-[9px] tabular-nums text-ink-500">
          {current.toFixed(1)}° attuale
        </span>
      </div>
    </div>
  )
}
