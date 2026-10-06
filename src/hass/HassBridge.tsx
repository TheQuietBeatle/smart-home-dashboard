import { useEffect, useRef, useState } from 'react'
import { useSmartHome } from '../hooks/smartHomeContext'
import { applyEntity, hydrateFromHa, syncDiff } from './bridge'
import {
  connect,
  getStates,
  subscribeStates,
  subscribeStatus,
  type HassEntity,
} from './client'
import { readConfig, type HassConfig } from './config'

export function HassBridge() {
  const { state, set } = useSmartHome()
  const cfgRef = useRef<HassConfig | null>(null)
  const prevRef = useRef(state)
  const inboundRef = useRef(false)
  const [status, setStatus] = useState<'off' | 'connecting' | 'live' | 'error'>(
    () => (readConfig() ? 'connecting' : 'off'),
  )

  useEffect(() => {
    const cfg = readConfig()
    if (!cfg) return

    cfgRef.current = cfg

    const offStatus = subscribeStatus((connected) => {
      setStatus(connected ? 'live' : 'connecting')
    })

    const offStates = subscribeStates((entity: HassEntity) => {
      inboundRef.current = true
      set((prev) => applyEntity(prev, entity))
    })

    void getStates(cfg)
      .then((states) => {
        setStatus('live')
        inboundRef.current = true
        set((prev) => hydrateFromHa(prev, states))
      })
      .catch(() => setStatus('error'))

    const disconnect = connect(cfg)

    return () => {
      offStatus()
      offStates()
      disconnect()
      cfgRef.current = null
      setStatus('off')
    }
  }, [set])

  useEffect(() => {
    if (prevRef.current === state) return
    const prev = prevRef.current
    prevRef.current = state

    if (inboundRef.current) {
      inboundRef.current = false
      return
    }

    const cfg = cfgRef.current
    if (cfg) syncDiff(cfg, prev, state)
  }, [state])

  if (status === 'off') return null

  return (
    <div
      role="status"
      aria-label="Home Assistant connection"
      className="ha-indicator"
      data-status={status}
    />
  )
}