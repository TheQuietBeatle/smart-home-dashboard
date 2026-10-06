import { useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import { useSmartHome } from '../hooks/smartHomeContext'
import { Card, CardHeader } from './ui'

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

export function EnergyCard() {
  const { state } = useSmartHome()
  const [nowHour] = useState(() => new Date().getHours())
  const peak = Math.max(...USAGE.map((d) => d.kw))

  return (
    <Card className="flex min-h-0 flex-1 flex-col">
      <CardHeader
        title="Consumi energetici"
        action={
          <span className="flex items-center gap-1 text-[10px] text-ink-500">
            Oggi
            <b className="font-semibold text-accent-teal tabular-nums">
              34.2 kWh
            </b>
          </span>
        }
      />

      <div className="grid shrink-0 grid-cols-3 gap-1.5 px-3 pb-1">
        <Metric
          label="Adesso"
          value={`${state.sensors.energy.toFixed(1)} kW`}
          tone="cyan"
        />
        <Metric label="Picco" value={`${peak.toFixed(1)} kW`} tone="amber" />
        <Metric
          label="Previsto"
          value="€ 4,80"
          tone="plain"
        />
      </div>

      <div className="min-h-0 flex-1 px-1 pb-1 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={USAGE} margin={{ top: 6, right: 4, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <YAxis domain={[0, 3.2]} hide />
            <Area
              type="monotone"
              dataKey="kw"
              stroke="#22d3ee"
              strokeWidth={1.6}
              fill="url(#energyFill)"
              isAnimationActive
              animationDuration={700}
              dot={false}
              activeDot={{ r: 3, fill: '#22d3ee', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex shrink-0 items-center justify-between px-3 pb-2 text-[8.5px] tabular-nums text-ink-600">
        <span>00</span>
        <span>06</span>
        <span className="font-semibold text-accent-cyan">{nowHour}</span>
        <span>18</span>
        <span>23</span>
      </div>
    </Card>
  )
}

function Metric({
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
        : 'text-ink-200'

  return (
    <div className="rounded-lg border border-line bg-white/[0.02] px-2 py-1">
      <div className="text-[8px] font-semibold uppercase tracking-widest text-ink-600">
        {label}
      </div>
      <div className={`text-[12px] font-semibold tabular-nums ${toneClass}`}>
        {value}
      </div>
    </div>
  )
}
