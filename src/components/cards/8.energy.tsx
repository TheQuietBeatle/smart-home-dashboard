import { useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import { Activity } from 'lucide-react'
import { useSmartHome } from '../../hooks/smartHomeContext'
import { num } from '../../lib/format'
import { Section } from '../ui'
import { shows, TOUCH, type WidgetSize } from '../../widgets/types'

const USAGE = [
  { h: 0, kw: 0.4 },
  { h: 1, kw: 0.3 },
  { h: 2, kw: 0.3 },
  { h: 3, kw: 0.4 },
  { h: 4, kw: 0.5 },
  { h: 5, kw: 0.7 },
  { h: 6, kw: 1.2 },
  { h: 7, kw: 1.8 },
  { h: 8, kw: 1.5 },
  { h: 9, kw: 1.1 },
  { h: 10, kw: 0.9 },
  { h: 11, kw: 1.0 },
  { h: 12, kw: 1.6 },
  { h: 13, kw: 1.3 },
  { h: 14, kw: 1.1 },
  { h: 15, kw: 1.2 },
  { h: 16, kw: 1.7 },
  { h: 17, kw: 2.4 },
  { h: 18, kw: 2.9 },
  { h: 19, kw: 2.6 },
  { h: 20, kw: 2.1 },
  { h: 21, kw: 1.9 },
  { h: 22, kw: 1.4 },
  { h: 23, kw: 0.8 },
]

export function EnergyCard({ size = 'm' }: { size?: WidgetSize }) {
  const { state } = useSmartHome()
  const [nowHour] = useState(() => new Date().getHours())
  const peak = Math.max(...USAGE.map((d) => d.kw))
  const show = (tier: WidgetSize) => shows(size, tier, 'm')
  const full = show('w')
  const narrow = size === 's' || size === 'l'

  return (
    <Section
      className={`${TOUCH.section} min-h-0 flex-1`}
      icon={<Activity size={16} />}
      title="Energy"
      thumb={0.5}
      chips={
        <span className={TOUCH.chip}>
          {!narrow && <span className="text-fg-dim">Today</span>}
          <span className="tabular-nums text-teal">34.2 kWh</span>
        </span>
      }
    >
      <div className={`flex shrink-0 gap-2 ${narrow && full ? 'flex-col' : 'items-end'}`}>
        <Metric label="Now" value={`${num(state.sensors.energy)} kW`} primary />
        {full && (
          <div className="flex min-w-0 flex-1 gap-2">
            <Metric label="Peak" value={`${num(peak)} kW`} tone="text-amber" />
            <Metric label="Forecast" value="€4.80" />
          </div>
        )}
      </div>

      {show('m') && (
        <div className="min-h-10 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={USAGE} margin={{ top: 4, right: 2, bottom: 0, left: 2 }}>
              <defs>
                <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-teal)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--color-teal)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <YAxis domain={[0, 3.2]} hide />
              <Area
                type="monotone"
                dataKey="kw"
                stroke="var(--color-sky)"
                strokeWidth={1.8}
                fill="url(#energyFill)"
                isAnimationActive
                animationDuration={700}
                dot={false}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {full && (
        <div className="flex shrink-0 items-center justify-between text-[14px] leading-none tabular-nums text-fg-dim">
          <span>00</span>
          <span>06</span>
          <span className="font-medium text-sky">{nowHour}</span>
          <span>18</span>
          <span>23</span>
        </div>
      )}
    </Section>
  )
}

function Metric({
  label,
  value,
  tone = 'text-fg',
  primary = false,
}: {
  label: string
  value: string
  tone?: string
  primary?: boolean
}) {
  return (
    <div className="min-w-0 flex-1 leading-none">
      <div className="text-[14px] text-fg-dim">{label}</div>
      <div
        className={`mt-1 truncate font-medium tabular-nums ${
          primary ? 'text-[28px] text-sky' : `text-[18px] ${tone}`
        }`}
      >
        {value}
      </div>
    </div>
  )
}
