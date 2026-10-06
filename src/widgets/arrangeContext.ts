import { createContext, useContext, type RefObject } from 'react'
import type { WidgetId } from './types'

export interface ArrangeModeValue {
  arrangeOn: boolean
  toggleArrangeMode: () => void
  /** The full-screen "Add widgets" catalog. */
  catalogOpen: boolean
  openCatalog: () => void
  closeCatalog: () => void
  /**
   * Set before a layout change (move, resize, add) to have the carousel
   * scroll to that widget's page once the new layout renders.
   */
  followRef: RefObject<WidgetId | null>
}

export const ArrangeContext = createContext<ArrangeModeValue | null>(null)

export function useArrangeMode(): ArrangeModeValue {
  const ctx = useContext(ArrangeContext)
  if (!ctx) throw new Error('useArrangeMode must be used inside ArrangeProvider')
  return ctx
}
