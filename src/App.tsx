import { Dashboard } from './components/Dashboard'
import { HassBridge } from './hass/HassBridge'
import { SmartHomeProvider } from './hooks/useSmartHome'
import { ArrangeProvider } from './widgets/ArrangeMode'

export default function App() {
  return (
    <SmartHomeProvider>
      <ArrangeProvider>
        <Dashboard />
      </ArrangeProvider>
      <HassBridge />
    </SmartHomeProvider>
  )
}