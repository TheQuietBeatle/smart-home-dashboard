import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { INITIAL_STATE } from '../data/mockData'
import * as service from '../services/smartHomeService'
import type { SmartHomeState } from '../types'
import {
  SmartHomeContext,
  type Setter,
  type SmartHomeContextValue,
} from './smartHomeContext'

const STORAGE_KEY = 'casa-dashboard-state-v2'

function loadInitial(): SmartHomeState {
  if (typeof window === 'undefined') return INITIAL_STATE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_STATE
    const saved = JSON.parse(raw) as Partial<SmartHomeState>
    return {
      ...INITIAL_STATE,
      ...saved,
      weather: INITIAL_STATE.weather,
      statusCards: saved.statusCards ?? INITIAL_STATE.statusCards,
      lights: { ...INITIAL_STATE.lights, ...saved.lights },
      climate: { ...INITIAL_STATE.climate, ...saved.climate },
      media: { ...INITIAL_STATE.media, ...saved.media },
      vacuum: { ...INITIAL_STATE.vacuum, ...saved.vacuum },
      sensors: { ...INITIAL_STATE.sensors, ...saved.sensors },
      automations: saved.automations ?? INITIAL_STATE.automations,
    }
  } catch {
    return INITIAL_STATE
  }
}

function clampInt(n: number, digits: number, min: number, max: number): number {
  const f = 10 ** digits
  return Math.min(max, Math.max(min, Math.round(n * f) / f))
}

export function SmartHomeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SmartHomeState>(loadInitial)

  const set = useCallback<Setter>((updater) => {
    setState((prev) => updater(prev))
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch {
        return
      }
    }, 250)
    return () => window.clearTimeout(id)
  }, [state])

  useEffect(() => {
    const id = window.setInterval(() => {
      setState((prev) => {
        const jitter = (n: number, amp: number) =>
          Math.round((n + (Math.random() - 0.5) * amp) * 10) / 10
        return {
          ...prev,
          sensors: {
            ...prev.sensors,
            indoorTemp: jitter(prev.sensors.indoorTemp, 0.2),
            indoorHumidity: clampInt(prev.sensors.indoorHumidity, 0, 40, 60),
            energy: jitter(prev.sensors.energy, 0.3),
          },
          climate: {
            ...prev.climate,
            currentTemp: jitter(prev.climate.currentTemp, 0.15),
          },
        }
      })
    }, 6000)
    return () => window.clearInterval(id)
  }, [])

  const value = useMemo<SmartHomeContextValue>(
    () => ({
      state,
      set,
      toggleLight: (id) => set((s) => service.toggleLight(s, id)),
      toggleBlinds: () => set((s) => service.toggleBlind(s)),
      setBlinds: (open) => set((s) => service.setBlindOpen(s, open)),
      setTemp: (d) => set((s) => service.setClimateTemperature(s, d)),
      toggleClimatePower: () => set((s) => service.setClimatePower(s)),
      setClimateMode: (m) => set((s) => service.setClimateMode(s, m)),
      cycleFan: () => set((s) => service.cycleFanSpeed(s)),
      setSource: (src) => set((s) => service.setMediaSource(s, src)),
      togglePlay: () => set((s) => service.togglePlay(s)),
      toggleEcho: () => set((s) => service.toggleEcho(s)),
      toggleStatus: (id) => set((s) => service.toggleStatusCard(s, id)),
      next: () => set((s) => service.nextTrack(s)),
      previous: () => set((s) => service.previousTrack(s)),
      setVolume: (v) => set((s) => service.setVolume(s, v)),
      toggleTv: () => set((s) => service.toggleTv(s)),
      cycleInput: () => set((s) => service.cycleTvInput(s)),
      changeChannel: (d) => set((s) => service.changeChannel(s, d)),
      toggleVacuum: () => set((s) => service.toggleVacuum(s)),
      dockVacuum: () => set((s) => service.returnVacuumToBase(s)),
      runScene: (id) => set((s) => service.activateAutomation(s, id)),
    }),
    [state, set],
  )

  return (
    <SmartHomeContext.Provider value={value}>
      {children}
    </SmartHomeContext.Provider>
  )
}
