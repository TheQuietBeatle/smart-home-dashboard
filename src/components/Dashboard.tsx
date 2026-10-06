import { lazy, Suspense } from 'react'
import { AutomationPanel } from './AutomationPanel'
import { ClimateCard } from './ClimateCard'
import { LightingPanel } from './LightingPanel'
import { MediaPanel } from './MediaPanel'
import { QuickPills, RobotVacuumCard } from './RobotVacuumCard'
import { StatusCards } from './StatusCards'
import { StatusBar } from './StatusBar'
import { TopNav } from './TopNav'
import { WeatherCard } from './WeatherCard'

const EnergyCard = lazy(() =>
  import('./EnergyCard').then((m) => ({ default: m.EnergyCard })),
)

export function Dashboard() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopNav />

      <main className="scroll-thin grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-y-auto p-2 md:grid-cols-2 xl:grid-cols-[2.7fr_3.6fr_4.1fr] xl:overflow-hidden">
        <section className="flex min-h-0 flex-col gap-2">
          <WeatherCard className="shrink-0" />
          <StatusCards />
          <Suspense fallback={<div className="card min-h-0 flex-1" />}>
            <EnergyCard />
          </Suspense>
        </section>

        <section className="grid min-h-0 grid-rows-[1.1fr_auto_1fr] gap-2">
          <ClimateCard />
          <QuickPills />
          <div className="grid min-h-0 grid-cols-2 gap-2">
            <RobotVacuumCard />
            <AutomationPanel />
          </div>
        </section>

        <section className="flex min-h-0 flex-col gap-2 md:col-span-2 xl:col-span-1">
          <div className="flex min-h-0 flex-[1.55] flex-col">
            <LightingPanel />
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <MediaPanel />
          </div>
        </section>
      </main>

      <StatusBar />
    </div>
  )
}
