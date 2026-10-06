import { AutomationPanel } from './AutomationPanel'
import { ClimateCard } from './ClimateCard'
import { LightingPanel } from './LightingPanel'
import { MediaPanel } from './MediaPanel'
import { RobotVacuumCard } from './RobotVacuumCard'
import { StatusCards } from './StatusCards'
import { TopNav } from './TopNav'
import { WeatherCard } from './WeatherCard'

export function Dashboard() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopNav />

      <main className="scroll-thin grid min-h-0 flex-1 grid-cols-1 gap-x-5 gap-y-4 overflow-y-auto p-3 md:grid-cols-2 xl:grid-cols-[1fr_1.15fr_1.1fr]">
        <div className="flex flex-col gap-3">
          <WeatherCard className="shrink-0" />
          <StatusCards />
        </div>

        <div className="flex flex-col gap-3">
          <ClimateCard />
          <RobotVacuumCard />
          <AutomationPanel />
        </div>

        <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-1">
          <LightingPanel />
          <MediaPanel />
        </div>
      </main>
    </div>
  )
}
