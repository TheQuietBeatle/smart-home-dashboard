import { Dashboard } from './components/Dashboard'
import { HassBridge } from './hass/HassBridge'
import { SmartHomeProvider } from './hooks/useSmartHome'

export default function App() {
  return (
    <SmartHomeProvider>
      <Dashboard />
      <HassBridge />
    </SmartHomeProvider>
  )
}