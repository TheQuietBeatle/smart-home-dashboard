import { createContext, useContext } from 'react'

export interface ArrangeModeValue {
  arrangeOn: boolean
  toggleArrangeMode: () => void
}

export const ArrangeContext = createContext<ArrangeModeValue | null>(null)

export function useArrangeMode(): ArrangeModeValue {
  const ctx = useContext(ArrangeContext)
  if (!ctx) throw new Error('useArrangeMode must be used inside ArrangeProvider')
  return ctx
}
