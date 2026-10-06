import { Droplets, House, Moon, Sun, Thermometer } from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'
import { useClock } from '../hooks/useClock'
import { num } from '../lib/format'
import { Chip, Section } from './ui'

export function WeatherCard({ className = '' }: { className?: string }) {
  const { state } = useSmartHome()
  const clock = useClock()
  const { weather, sensors } = state

  const days = weather.forecast
  const weekMin = Math.min(...days.map((d) => d.min))
  const weekMax = Math.max(...days.map((d) => d.max))
  const span = Math.max(weekMax - weekMin, 1)
  const at = (t: number) => ((t - weekMin) / span) * 100

  return (
    <Section
      className={className}
      icon={<House size={16} />}
      title="Outdoor"
      thumb={0.62}
      chips={
        <>
          <Chip icon={<Thermometer size={12} />}>
            {num(sensors.outdoorTemp)} °C
          </Chip>
          <Chip icon={<Droplets size={12} />}>{sensors.outdoorHumidity}%</Chip>
        </>
      }
    >
      <div className="flex items-center justify-center gap-5 py-2 short:py-0">
        {weather.isNight ? (
          <Moon size={52} strokeWidth={1.4} className="text-sky" />
        ) : (
          <Sun size={52} strokeWidth={1.4} className="text-amber" />
        )}
        <div className="text-center leading-tight">
          <div className="text-[11px] text-fg-dim">
            {weather.condition}, {weather.temp}°C
          </div>
          <div className="text-[44px] short:text-[34px] font-medium tabular-nums leading-none tracking-tight">
            {clock.time}
          </div>
          <div className="mt-1 text-[11px] text-fg-dim">{clock.date}</div>
        </div>
      </div>

      <ul className="flex flex-1 flex-col justify-between gap-1.5 short:gap-1" aria-label="Forecast">
        {days.map((d, i) => (
          <li key={d.day} className="flex items-center gap-2 text-[11px]">
            <span className="w-7 text-fg-dim">{d.day}</span>
            <span className="w-9 text-right text-fg-dim tabular-nums">
              {d.min}°C
            </span>
            <span className="relative h-2.5 flex-1 rounded-full bg-tile">
              <span
                className="absolute inset-y-0 rounded-full bg-gradient-to-r from-cold to-teal"
                style={{
                  left: `${at(d.min)}%`,
                  width: `${at(d.max) - at(d.min)}%`,
                }}
              />
              {i === 0 && (
                <span
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bar bg-fg"
                  style={{ left: `${at(weather.temp)}%` }}
                />
              )}
            </span>
            <span className="w-8 tabular-nums">{d.max}°C</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}
