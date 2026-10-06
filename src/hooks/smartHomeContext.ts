import { createContext, useContext } from 'react'
import type {
  ClimateMode,
  DeviceId,
  MediaState,
  SmartHomeState,
} from '../types'

export type Setter = (
  updater: (state: SmartHomeState) => SmartHomeState,
) => void

export interface SmartHomeContextValue {
  state: SmartHomeState
  set: Setter
  toggleLight: (id: DeviceId) => void
  toggleBlinds: () => void
  setBlinds: (open: boolean) => void
  setTemp: (delta: number) => void
  toggleClimatePower: () => void
  setClimateMode: (mode: ClimateMode) => void
  cycleFan: () => void
  setSource: (source: MediaState['source']) => void
  togglePlay: () => void
  toggleEcho: () => void
  toggleStatus: (id: string) => void
  next: () => void
  previous: () => void
  setVolume: (v: number) => void
  toggleTv: () => void
  cycleInput: () => void
  changeChannel: (d: number) => void
  toggleVacuum: () => void
  dockVacuum: () => void
  runScene: (id: string) => void
}

export const SmartHomeContext = createContext<SmartHomeContextValue | null>(
  null,
)

export function useSmartHome(): SmartHomeContextValue {
  const ctx = useContext(SmartHomeContext)
  if (!ctx) throw new Error('useSmartHome must be used inside SmartHomeProvider')
  return ctx
}
