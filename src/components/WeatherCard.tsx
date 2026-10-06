import {
  Cloud,
  CloudMoon,
  CloudRain,
  CloudSun,
  Droplets,
  Moon,
  Sun,
  Wind,
} from 'lucide-react'
import type { ForecastDay } from '../types'
import { useSmartHome } from '../hooks/smartHomeContext'
import { useClock } from '../hooks/useClock'
import { Card, CardHeader } from './ui'

const ICONS = {
  sun: Sun,
  cloud: Cloud,
  moon: Moon,
  rain: CloudRain,
  partly: CloudSun,
}

export function WeatherCard({ className = '' }: { className?: string }) {
  const { state } = useSmartHome()
  const clock = useClock()
  const { weather } = state

  const days = weather.forecast
  const weekMin = Math.min(...days.map((d) => d.min))
  const weekMax = Math.max(...days.map((d) => d.max))
  const span = Math.max(weekMax - weekMin, 1)

  return (
    <Card className={`flex min-h-0 flex-col ${className}`}>
      <CardHeader
        title="Meteo"
        action={
          <span className="flex items-center gap-1 text-[10px] text-ink-500">
            <Wind size={11} /> {weather.wind} km/h
          </span>
        }
      />

      <div className="flex items-center gap-3 px-3 pb-2">
        <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#1b2b47] to-[#101b2f] text-accent-cyan shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          {weather.isNight ? <Moon size={26} /> : <Sun size={26} />}
          <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border border-line bg-[#0e1626] text-accent-teal">
            <CloudMoon size={11} />
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex items-end gap-2">
            <span className="text-[34px] font-semibold leading-none tracking-tight text-ink-100 tabular-nums">
              {Math.round(weather.temp)}°
            </span>
            <span className="mb-1 text-[11px] font-medium text-ink-400">
              {weather.condition}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-ink-400">
            <span className="flex items-center gap-1">
              <Droplets size={10} className="text-accent-blue" />
              {weather.humidity}%
            </span>
            <span className="text-ink-600">·</span>
            <span>Percepiti {weather.feels}°</span>
            <span className="text-ink-600">·</span>
            <span className="text-ink-300 tabular-nums">{clock.time}</span>
          </div>
        </div>
      </div>

      <div className="mx-3 h-px bg-line" />

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-0.5 px-3 py-2">
        {days.map((d) => (
          <ForecastRow
            key={d.day}
            day={d}
            min={weekMin}
            range={span}
          />
        ))}
      </div>
    </Card>
  )
}

function ForecastRow({
  day,
  min,
  range,
}: {
  day: ForecastDay
  min: number
  range: number
}) {
  const Icon = ICONS[day.icon]
  const left = ((day.min - min) / range) * 100
  const width = ((day.max - day.min) / range) * 100

  return (
    <div className="flex items-center gap-2 rounded-lg px-1 py-[3px] transition-colors hover:bg-white/[0.03]">
      <span className="w-8 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
        {day.day}
      </span>
      <Icon size={13} className="shrink-0 text-accent-teal" />
      <span className="w-7 text-right text-[10px] tabular-nums text-ink-500">
        {day.min}°
      </span>
      <div className="relative h-1.5 flex-1 rounded-full bg-white/[0.05]">
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            left: `${left}%`,
            width: `${Math.max(width, 8)}%`,
            background:
              'linear-gradient(90deg, #22d3ee 0%, #e2e8f0 55%, #fbbf24 100%)',
            boxShadow: '0 0 10px -2px rgba(34,211,238,0.6)',
          }}
        />
      </div>
      <span className="w-7 text-[10px] font-semibold tabular-nums text-ink-200">
        {day.max}°
      </span>
    </div>
  )
}
