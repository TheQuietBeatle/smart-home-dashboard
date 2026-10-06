import { Dashboard } from './components/Dashboard'
import { SmartHomeProvider } from './hooks/useSmartHome'

export default function App() {
  return (
    <SmartHomeProvider>
      <Dashboard />
    </SmartHomeProvider>
  )
}
