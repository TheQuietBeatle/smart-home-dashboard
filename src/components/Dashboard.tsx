import { LayoutGrid, Plus } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { useArrangeMode } from '../widgets/arrangeContext'
import { useWidgetLayout } from '../widgets/useWidgetLayout'
import type { WidgetRenderers } from '../widgets/types'
import { WidgetGrid } from '../widgets/WidgetGrid'
import { ClockCard } from './cards/10.clock'
import { AutomationPanel } from './cards/5.automations'
import { ClimateCard } from './cards/3.climate'
import { LightingPanel } from './cards/6.lighting'
import { MediaPanel } from './cards/7.media'
import { QuickPills } from './cards/9.pills'
import { RobotVacuumCard } from './cards/4.roomba'
import { StatusBar } from './StatusBar'
import { StatusCards } from './cards/2.status'
import { TopNav } from './TopNav'
import { WidgetCatalog } from './WidgetCatalog'
import { WeatherCard } from './cards/1.weather'

// recharts is heavy: keep it out of the main bundle.
const EnergyCard = lazy(() =>
  import('./cards/8.energy').then((m) => ({ default: m.EnergyCard })),
)

const RENDERERS: WidgetRenderers = {
  weather: { render: (size) => <WeatherCard size={size} className="flex-1" /> },
  status: { render: (size) => <StatusCards size={size} className="flex-1" /> },
  climate: { render: (size) => <ClimateCard size={size} className="flex-1" /> },
  roomba: { render: (size) => <RobotVacuumCard size={size} /> },
  automations: { render: (size) => <AutomationPanel size={size} /> },
  lighting: { render: (size) => <LightingPanel size={size} className="flex-1" /> },
  media: { render: (size) => <MediaPanel size={size} /> },
  energy: {
    render: (size) => (
      <Suspense fallback={null}>
        <EnergyCard size={size} />
      </Suspense>
    ),
    fixedHeight: true,
  },
  pills: { render: () => <QuickPills /> },
  clock: { render: () => <ClockCard className="flex-1" /> },
}

export function Dashboard() {
  const { layout } = useWidgetLayout()
  const { catalogOpen, openCatalog } = useArrangeMode()
  const empty = layout.every((w) => w.hidden)

  return (
    <>
      {/* inert while the catalog is open: no swipe, scroll or focus behind it. */}
      <div className="flex h-dvh flex-col overflow-hidden" inert={catalogOpen}>
        <TopNav />

        <main className="scroll-thin min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          {empty ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <LayoutGrid size={40} className="text-fg-dim" />
              <p className="text-[18px] text-fg">No widgets on your dashboard</p>
              <button
                type="button"
                onClick={openCatalog}
                className="press glass glass-teal flex h-12 items-center gap-2 rounded-full px-5 text-[15px] font-medium text-fg"
              >
                <Plus size={18} />
                Add widgets
              </button>
            </div>
          ) : (
            <WidgetGrid layout={layout} renderers={RENDERERS} />
          )}
        </main>

        <StatusBar />
      </div>

      <WidgetCatalog />
    </>
  )
}
