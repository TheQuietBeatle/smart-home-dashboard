import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ArrangeContext } from './arrangeContext'
import type { WidgetId } from './types'

export function ArrangeProvider({ children }: { children: ReactNode }) {
  const [arrangeOn, setArrangeOn] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const followRef = useRef<WidgetId | null>(null)
  const toggleArrangeMode = useCallback(() => setArrangeOn((v) => !v), [])
  const openCatalog = useCallback(() => setCatalogOpen(true), [])
  const closeCatalog = useCallback(() => setCatalogOpen(false), [])

  // Escape closes the catalog first; otherwise it leaves arrange mode.
  useEffect(() => {
    if (!arrangeOn && !catalogOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (catalogOpen) setCatalogOpen(false)
      else setArrangeOn(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [arrangeOn, catalogOpen])

  const value = useMemo(
    () => ({
      arrangeOn,
      toggleArrangeMode,
      catalogOpen,
      openCatalog,
      closeCatalog,
      followRef,
    }),
    [arrangeOn, toggleArrangeMode, catalogOpen, openCatalog, closeCatalog],
  )

  return (
    <ArrangeContext.Provider value={value}>{children}</ArrangeContext.Provider>
  )
}
