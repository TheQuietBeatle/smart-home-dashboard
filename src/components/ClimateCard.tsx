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
} from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'
import { APPLIANCES } from '../data/mockData'
import { num } from '../lib/format'
import type { ClimateMode } from '../types'
import { Badge, RoundBtn, Section } from './ui'
import { shows, TOUCH, type WidgetSize } from '../widgets/types'

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

export function ClimateCard({
  className = '',
  size = 'l',
}: {
  className?: string
  size?: WidgetSize
}) {
  const { state, setTemp, setClimateMode, toggleClimatePower } = useSmartHome()
  const { climate, sensors } = state
  const show = (tier: WidgetSize) => shows(size, tier, 'l')
  const ratio = (climate.targetTemp - MIN) / (MAX - MIN)
  const end = START + SWEEP * ratio
  const thumb = polar(end)
  const modeLabel = MODES.find((m) => m.id === climate.mode)?.label
  const narrow = size === 's' || size === 'l'

  const dial = (
    <div className="relative min-h-[120px] min-w-0 flex-1">
      <h3 className="absolute left-0 right-8 top-0 truncate text-center text-[14px] text-fg">
        Air Conditioner
      </h3>
      <EllipsisVertical
        size={16}
        className="absolute right-0 top-0.5 text-fg-dim"
        aria-hidden
      />
      <div className="absolute bottom-0 left-1/2 top-5 aspect-square max-w-full -translate-x-1/2">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`Target temperature ${num(climate.targetTemp)} degrees`}
        >
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
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center leading-none">
          <div className="text-[14px] text-fg-dim">
            {climate.power ? modeLabel : 'Off'}
          </div>
          <div className="my-0.5 text-[32px] font-medium tabular-nums tracking-tight">
            {num(climate.targetTemp)}
          </div>
          <div className="flex items-center justify-center gap-1 text-[14px] text-fg-dim">
            <Thermometer size={13} />
            {num(climate.currentTemp)}°
          </div>
        </div>
        <button
          type="button"
          aria-label="Lower temperature"
          onClick={() => setTemp(-0.5)}
          className={`${TOUCH.icon} glass absolute bottom-0 left-0 text-fg`}
        >
          <Minus size={18} />
        </button>
        <button
          type="button"
          aria-label="Raise temperature"
          onClick={() => setTemp(0.5)}
          className={`${TOUCH.icon} glass absolute bottom-0 right-0 text-fg`}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  )

  const modes = show('m') && (
    <div
      className={`grid shrink-0 justify-items-center gap-1.5 ${
        size === 'm' ? 'grid-cols-2' : 'grid-cols-3 self-center'
      }`}
    >
      {MODES.map(({ id, icon: Icon, label }) => (
        <RoundBtn
          key={id}
          aria-label={label}
          active={climate.power && climate.mode === id}
          onClick={() => setClimateMode(id)}
          className={TOUCH.round}
        >
          <Icon size={18} />
        </RoundBtn>
      ))}
      <RoundBtn
        aria-label="Turn off"
        aria-pressed={!climate.power}
        active={!climate.power}
        tone="steel"
        onClick={() => climate.power && toggleClimatePower()}
        className={TOUCH.round}
      >
        <Power size={18} />
      </RoundBtn>
    </div>
  )

  const appliances = show('w') && (
    <div className="grid shrink-0 grid-cols-2 gap-1.5">
      {APPLIANCES.map((a) => (
        <div
          key={a.id}
          className={`flex h-12 min-w-0 items-center gap-2 rounded-full pl-3 pr-1.5 text-[14px] ${
            a.active ? 'glass glass-steel' : 'glass'
          }`}
        >
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate font-medium">{a.label}</span>
            <span className="block truncate text-fg/75">{a.value}</span>
          </span>
          {/* No room for the badge in the 3-column cell. */}
          {!narrow && (
            <Badge className={`${TOUCH.badge} bg-black/25 text-fg`}>{a.badge}</Badge>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <Section
      className={`${TOUCH.section} ${className}`}
      icon={<House size={16} />}
      title="Home"
      thumb={0.4}
      chips={
        <span className={TOUCH.chip}>
          <Thermometer size={14} />
          {num(sensors.indoorTemp)}°C
        </span>
      }
    >
      {size === 'm' || size === 'w' ? (
        <div className="flex min-h-0 flex-1 gap-2">
          {dial}
          <div className="flex shrink-0 flex-col justify-center gap-2">
            {modes}
            {appliances}
          </div>
        </div>
      ) : (
        <>
          {dial}
          {modes}
          {appliances}
        </>
      )}
    </Section>
  )
}
