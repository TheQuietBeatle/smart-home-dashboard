import { lazy, Suspense } from 'react'
import { useWidgetLayout } from '../widgets/useWidgetLayout'
import type { WidgetRenderers } from '../widgets/types'
import { WidgetGrid } from '../widgets/WidgetGrid'
import { AutomationPanel } from './AutomationPanel'
import { ClimateCard } from './ClimateCard'
import { LightingPanel } from './LightingPanel'
import { MediaPanel } from './MediaPanel'
import { QuickPills, RobotVacuumCard } from './RobotVacuumCard'
import { StatusBar } from './StatusBar'
import { StatusCards } from './StatusCards'
import { TopNav } from './TopNav'
import { WeatherCard } from './WeatherCard'

// recharts is heavy: keep it out of the main bundle.
const EnergyCard = lazy(() =>
  import('./EnergyCard').then((m) => ({ default: m.EnergyCard })),
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
}

export function Dashboard() {
  const { layout } = useWidgetLayout()

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TopNav />

      <main className="scroll-thin min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <WidgetGrid layout={layout} renderers={RENDERERS} />
      </main>

      <StatusBar />
    </div>
  )
}
