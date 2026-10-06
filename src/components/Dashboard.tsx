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

      <main className="scroll-thin grid min-h-0 flex-1 grid-cols-1 gap-x-5 gap-y-4 overflow-y-auto p-4 md:grid-cols-2 lg:grid-cols-[1fr_1.15fr_1.1fr] lg:grid-rows-[minmax(min-content,1fr)]">
        <div className="flex flex-col gap-3">
          <WeatherCard className="shrink-0" />
          <StatusCards className="flex-1" />
        </div>

        <div className="flex flex-col gap-3">
          <ClimateCard className="flex-1" />
          <RobotVacuumCard />
          <AutomationPanel />
        </div>

        <div className="flex flex-col gap-3 md:col-span-2 lg:col-span-1">
          <LightingPanel className="flex-1" />
          <MediaPanel />
        </div>
      </main>
    </div>
  )
}
