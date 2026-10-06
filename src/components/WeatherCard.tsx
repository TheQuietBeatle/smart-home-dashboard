import { Droplets, House, Moon, Sun, Thermometer } from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'
import { useClock } from '../hooks/useClock'
import { num } from '../lib/format'
import { Section } from './ui'
import { shows, TOUCH, type WidgetSize } from '../widgets/types'

export function WeatherCard({
  className = '',
  size = 'l',
}: {
  className?: string
  size?: WidgetSize
}) {
  const { state } = useSmartHome()
  const clock = useClock()
  const { weather, sensors } = state
  const show = (tier: WidgetSize) => shows(size, tier, 'l')
  const narrow = size === 's' || size === 'l'
  const side = size === 'w'

  const days = weather.forecast
  const weekMin = Math.min(...days.map((d) => d.min))
  const weekMax = Math.max(...days.map((d) => d.max))
  const span = Math.max(weekMax - weekMin, 1)
  const at = (t: number) => ((t - weekMin) / span) * 100

  return (
    <Section
      className={`${TOUCH.section} ${className}`}
      icon={<House size={16} />}
      title="Outdoor"
      thumb={0.62}
      chips={
        show('m') && (
          <>
            <span className={TOUCH.chip}>
              {!narrow && <Thermometer size={14} />}
              {num(sensors.outdoorTemp)}°C
            </span>
            <span className={TOUCH.chip}>
              {!narrow && <Droplets size={14} />}
              {sensors.outdoorHumidity}%
            </span>
          </>
        )
      }
    >
      <div
        className={`flex min-h-0 flex-1 gap-3 ${side ? 'flex-row' : 'flex-col'}`}
      >
        <div
          className={`flex shrink-0 flex-col items-center justify-center gap-2 ${
            side ? 'w-[40%]' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            {weather.isNight ? (
              <Moon size={40} strokeWidth={1.4} className="text-sky" />
            ) : (
              <Sun size={40} strokeWidth={1.4} className="text-amber" />
            )}
            <div className="leading-none">
              <div className="text-[32px] font-medium tabular-nums tracking-tight">
                {weather.temp}°C
              </div>
              <div className="mt-1 text-[14px] text-fg-dim">
                {weather.condition}
              </div>
            </div>
          </div>
          <div className="text-center leading-none">
            <div className="text-[30px] font-medium tabular-nums tracking-tight">
              {clock.time}
            </div>
            <div className="mt-1 text-[14px] text-fg-dim">{clock.date}</div>
          </div>
        </div>

        {show('w') && (
          <ul
            className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-1"
            aria-label="Forecast"
          >
            {days.map((d, i) => (
              <li key={d.day} className="flex items-center gap-2 text-[14px] leading-none">
                <span className="w-9 shrink-0 text-fg-dim">{d.day}</span>
                <span className="w-11 shrink-0 text-right text-fg-dim tabular-nums">
                  {d.min}°
                </span>
                <span className="relative h-2.5 min-w-0 flex-1 rounded-full bg-tile">
                  <span
                    className="absolute inset-y-0 rounded-full bg-gradient-to-r from-cold to-teal"
                    style={{
                      left: `${at(d.min)}%`,
                      width: `${at(d.max) - at(d.min)}%`,
                    }}
                  />
                  {i === 0 && show('l') && (
                    <span
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bar bg-fg"
                      style={{ left: `${at(weather.temp)}%` }}
                    />
                  )}
                </span>
                <span className="w-9 shrink-0 tabular-nums">{d.max}°</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  )
}
