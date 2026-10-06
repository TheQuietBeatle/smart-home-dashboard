import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrangeContext } from './arrangeContext'

export function ArrangeProvider({ children }: { children: ReactNode }) {
  const [arrangeOn, setArrangeOn] = useState(false)
  const toggleArrangeMode = useCallback(() => setArrangeOn((v) => !v), [])

  useEffect(() => {
    if (!arrangeOn) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setArrangeOn(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [arrangeOn])

  const value = useMemo(
    () => ({ arrangeOn, toggleArrangeMode }),
    [arrangeOn, toggleArrangeMode],
  )

  return (
    <ArrangeContext.Provider value={value}>{children}</ArrangeContext.Provider>
  )
}
