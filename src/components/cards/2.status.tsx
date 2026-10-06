import { Camera, Car, DoorClosed, Lightbulb, Warehouse } from 'lucide-react'
import { useSmartHome } from '../../hooks/smartHomeContext'
import type { StatusCard } from '../../types'
import { Badge, Pill } from '../ui'
import { shows, TOUCH, type WidgetSize } from '../../widgets/types'

const ICONS = {
  gate: DoorClosed,
  led: Lightbulb,
  garage: Warehouse,
  car: Car,
}

export function StatusCards({
  className = '',
  size = 'l',
}: {
  className?: string
  size?: WidgetSize
}) {
  const { state, toggleStatus } = useSmartHome()
  const show = (tier: WidgetSize) => shows(size, tier, 'l')
  const of = (kind: StatusCard['kind']) =>
    state.statusCards.filter((c) => c.kind === kind)
  // s and l are 3 columns wide: stack. m: one-line garage rows. w: 2 columns.
  const narrow = size === 's' || size === 'l'
  const cols = narrow ? 'grid-cols-1' : 'grid-cols-2'

  return (
    <div className={`flex min-h-0 flex-col gap-2 short:gap-1.5 ${className}`}>
      <div className={`grid gap-1.5 ${cols}`}>
        {of('pill').map((c) => {
          const Icon = ICONS[c.icon]
          return (
            <Pill
              key={c.id}
              active={c.active}
              tone="teal"
              icon={<Icon size={16} />}
              badge={c.badge && <Badge className={TOUCH.badge}>{c.badge}</Badge>}
              onClick={() => toggleStatus(c.id)}
              className={TOUCH.pill}
            >
              {c.label}
            </Pill>
          )
        })}
      </div>

      {show('m') && (
        <div className={`grid gap-1.5 ${size === 'w' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {of('garage').map((c) => {
            const Icon = ICONS[c.icon]
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={c.active}
                onClick={() => toggleStatus(c.id)}
                className={`press flex h-12 min-w-0 items-center gap-2 rounded-full px-3 text-left text-[14px] ${
                  c.active ? 'glass glass-green text-bg' : 'glass text-fg'
                }`}
              >
                {size === 'w' && <Icon size={16} className="shrink-0" />}
                {size === 'm' ? (
                  <>
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {c.label}
                    </span>
                    <span className="shrink-0 opacity-80">{c.detail}</span>
                  </>
                ) : (
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate font-medium">{c.label}</span>
                    <span className="block truncate opacity-80">{c.detail}</span>
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {show('w') && (
        <div className="grid min-h-14 flex-1 grid-cols-2 gap-1.5">
          {['Entrance', 'Courtyard'].map((name) => (
            <div
              key={name}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#3a3f47] via-[#23272e] to-[#14171c]"
            >
              <Camera
                size={16}
                className="absolute left-2 top-2 text-fg/60"
                aria-hidden
              />
              <span className="absolute bottom-1.5 left-2 text-[14px] text-fg/80">
                {name}
              </span>
            </div>
          ))}
        </div>
      )}

      {show('l') && (
        <div className={`grid gap-1.5 ${cols}`}>
          {of('vehicle').map((c) => {
            const Icon = ICONS[c.icon]
            return (
              <Pill
                key={c.id}
                icon={<Icon size={16} />}
                badge={
                  <span className="shrink-0 text-[14px] text-fg-dim">{c.detail}</span>
                }
                className={TOUCH.pill}
              >
                {c.label}
              </Pill>
            )
          })}
        </div>
      )}
    </div>
  )
}
