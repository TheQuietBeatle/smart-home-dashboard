import {
  Droplets,
  EllipsisVertical,
  Fan,
  Flame,
  House,
  Minus,
  Plus,
  Power,
  Snowflake,
  Sparkles,
  Thermometer,
  WashingMachine,
} from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'
import { APPLIANCES } from '../data/mockData'
import { num } from '../lib/format'
import type { ClimateMode } from '../types'
import { Badge, Chip, RoundBtn, Section } from './ui'

const MIN = 16
const MAX = 30
const R = 74
const START = 135
const SWEEP = 270

const MODES: { id: ClimateMode; icon: typeof Fan; label: string }[] = [
  { id: 'auto', icon: Sparkles, label: 'Auto' },
  { id: 'dry', icon: Droplets, label: 'Dry' },
  { id: 'heat', icon: Flame, label: 'Heat' },
  { id: 'cool', icon: Snowflake, label: 'Cool' },
  { id: 'fan', icon: Fan, label: 'Fan' },
]

function polar(deg: number) {
  const a = (deg * Math.PI) / 180
  return { x: 100 + R * Math.cos(a), y: 100 + R * Math.sin(a) }
}

function arc(from: number, to: number) {
  const a = polar(from)
  const b = polar(to)
  const large = to - from > 180 ? 1 : 0
  return `M ${a.x} ${a.y} A ${R} ${R} 0 ${large} 1 ${b.x} ${b.y}`
}

export function ClimateCard({ className = '' }: { className?: string }) {
  const { state, setTemp, setClimateMode, toggleClimatePower } = useSmartHome()
  const { climate, sensors } = state
  const ratio = (climate.targetTemp - MIN) / (MAX - MIN)
  const end = START + SWEEP * ratio
  const thumb = polar(end)
  const modeLabel = MODES.find((m) => m.id === climate.mode)?.label

  return (
    <Section
      className={className}
      icon={<House size={16} />}
      title="Home"
      thumb={0.4}
      chips={
        <>
          <Chip icon={<Thermometer size={12} />}>
            {num(sensors.indoorTemp)} °C
          </Chip>
        </>
      }
    >
      <div className="relative min-h-[210px] flex-1 short:min-h-[120px]">
        <h3 className="absolute left-1/2 top-0 -translate-x-1/2 text-[13px] text-fg">
          Air Conditioner
        </h3>
        <EllipsisVertical
          size={16}
          className="absolute right-1 top-0 text-fg-dim"
          aria-hidden
        />
        <div className="absolute inset-y-0 top-5 left-1/2 aspect-square max-w-full -translate-x-1/2">
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" role="img" aria-label={`Target temperature ${num(climate.targetTemp)} degrees`}>
            <path d={arc(START, START + SWEEP)} fill="none" strokeWidth={9} strokeLinecap="round" className="stroke-rail" />
            <path
              d={arc(START, Math.max(end, START + 0.1))}
              fill="none"
              strokeWidth={9}
              strokeLinecap="round"
              className={climate.power ? 'stroke-teal' : 'stroke-tile-hi'}
            />
            <circle cx={thumb.x} cy={thumb.y} r={7} className="fill-fg" />
          </svg>
          <div className="absolute inset-x-0 top-[34%] text-center leading-none">
            <div className="text-[11px] text-fg-dim">
              {climate.power ? modeLabel : 'Off'}
            </div>
            <div className="mt-1 text-[44px] short:text-[32px] font-medium tabular-nums tracking-tight">
              {num(climate.targetTemp)}
            </div>
            <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-fg-dim">
              <Thermometer size={11} />
              {num(climate.currentTemp)} °C
            </div>
          </div>
          <button
            type="button"
            aria-label="Lower temperature"
            onClick={() => setTemp(-0.5)}
            className="press absolute bottom-3 left-2 grid h-7 w-7 place-items-center rounded-full bg-tile text-fg hover:bg-tile-hi"
          >
            <Minus size={14} />
          </button>
          <button
            type="button"
            aria-label="Raise temperature"
            onClick={() => setTemp(0.5)}
            className="press absolute bottom-3 right-2 grid h-7 w-7 place-items-center rounded-full bg-tile text-fg hover:bg-tile-hi"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1.5 px-1">
        {MODES.map(({ id, icon: Icon, label }) => (
          <RoundBtn
            key={id}
            aria-label={label}
            active={climate.power && climate.mode === id}
            onClick={() => setClimateMode(id)}
          >
            <Icon size={16} />
          </RoundBtn>
        ))}
        <RoundBtn
          aria-label="Turn off"
          aria-pressed={!climate.power}
          active={!climate.power}
          tone="steel"
          onClick={() => climate.power && toggleClimatePower()}
        >
          <Power size={16} />
        </RoundBtn>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {APPLIANCES.map((a) => (
          <div
            key={a.id}
            className={`flex h-10 short:h-9 min-w-0 items-center gap-2 rounded-full px-1.5 pr-3 ${
              a.active ? 'bg-steel' : 'bg-tile'
            }`}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-black/20">
              {a.id === 'heat' ? <Flame size={14} /> : <WashingMachine size={14} />}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[12px] font-medium">{a.label}</span>
              <span className="block truncate text-[10px] text-fg/70">{a.value}</span>
            </span>
            <Badge className="bg-black/25 text-fg">{a.badge}</Badge>
          </div>
        ))}
      </div>
    </Section>
  )
}
