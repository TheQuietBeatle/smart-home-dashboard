/* Hallmark · component: clock card · theme: studied-DNA (index.css tokens)
 * states: none (non-interactive, role="img")
 */
import { Clock } from 'lucide-react'
import { useClock } from '../../hooks/useClock'
import { Section } from '../ui'
import { TOUCH } from '../../widgets/types'

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

/** Point on the 200-unit dial, `deg` clockwise from 12 o'clock. */
function at(deg: number, r: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: 100 + r * Math.cos(rad), y: 100 + r * Math.sin(rad) }
}

export function ClockCard({ className = '' }: { className?: string }) {
  const clock = useClock()
  const s = clock.now.getSeconds()
  const m = clock.now.getMinutes() + s / 60
  const h = (clock.now.getHours() % 12) + m / 60

  return (
    <Section
      className={`${TOUCH.section} ${className}`}
      icon={<Clock size={16} />}
      title="Clock"
      thumb={0.5}
      chips={<span className={TOUCH.chip}>{clock.shortDate}</span>}
    >
      <div className="relative min-h-40 flex-1">
        <svg
          viewBox="0 0 200 200"
          role="img"
          aria-label={`Clock showing ${clock.time}`}
          className="absolute inset-0 h-full w-full"
        >
          <circle cx="100" cy="100" r="96" className="fill-tile stroke-tile-hi" strokeWidth="2" />

          {HOURS.map((n) => {
            const major = n % 3 === 0
            const a = at(n * 30, 88)
            const b = at(n * 30, major ? 79 : 83)
            const label = at(n * 30, 66)
            return (
              <g key={n}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  strokeLinecap="round"
                  strokeWidth={major ? 3 : 2}
                  className={major ? 'stroke-fg-dim' : 'stroke-fg-dim/50'}
                />
                {major && (
                  <text
                    x={label.x}
                    y={label.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-fg-dim text-[15px] font-medium tabular-nums"
                  >
                    {n}
                  </text>
                )}
              </g>
            )
          })}

          <g strokeLinecap="round">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="54"
              strokeWidth="6"
              className="stroke-fg"
              transform={`rotate(${h * 30} 100 100)`}
            />
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              strokeWidth="4"
              className="stroke-fg"
              transform={`rotate(${m * 6} 100 100)`}
            />
            {/* The second hand is the only moving part: drop it for reduced motion. */}
            <line
              x1="100"
              y1="116"
              x2="100"
              y2="22"
              strokeWidth="1.5"
              className="stroke-amber motion-reduce:hidden"
              transform={`rotate(${s * 6} 100 100)`}
            />
          </g>
          <circle cx="100" cy="100" r="6" className="fill-fg" />
          <circle cx="100" cy="100" r="2.5" className="fill-amber" />
        </svg>
      </div>
    </Section>
  )
}
