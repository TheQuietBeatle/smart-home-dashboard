import type { HassConfig } from './config'

export interface HassEntity {
  entity_id: string
  state: string
  attributes: Record<string, unknown>
}

interface SocketMessage {
  id?: number
  type: string
  result?: unknown
  success?: boolean
  error?: { message: string }
  event?: { data?: { entity_id?: string; new_state?: HassEntity | null } }
}

type StateListener = (entity: HassEntity) => void
type StatusListener = (connected: boolean) => void

let socket: WebSocket | null = null
let nextId = 1
let closedByUser = false
let attempt = 0
let activeConfig: HassConfig | null = null
let reconnectTimer: number | null = null

const pending = new Map<
  number,
  { resolve: (v: unknown) => void; reject: (e: Error) => void }
>()
const stateListeners = new Set<StateListener>()
const statusListeners = new Set<StatusListener>()

function restBase(config: HassConfig): string {
  return `${config.url}/api`
}

async function restRequest<T>(
  config: HassConfig,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${restBase(config)}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!res.ok) {
    throw new Error(`Home Assistant ${res.status}: ${res.statusText}`)
  }

  return (await res.json()) as T
}

export async function getStates(config: HassConfig): Promise<HassEntity[]> {
  return restRequest<HassEntity[]>(config, '/states')
}

export async function callService(
  config: HassConfig,
  domain: string,
  service: string,
  data: Record<string, unknown> = {},
): Promise<void> {
  await restRequest(config, `/services/${domain}/${service}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

function wsUrl(config: HassConfig): string {
  const http = config.url.replace(/^http/i, 'ws')
  return `${http}/api/websocket`
}

function notifyStatus(connected: boolean): void {
  for (const fn of statusListeners) fn(connected)
}

function handleMessage(raw: string): void {
  let msg: SocketMessage
  try {
    msg = JSON.parse(raw) as SocketMessage
  } catch {
    return
  }

  if (msg.type === 'auth_ok') {
    attempt = 0
    notifyStatus(true)
    send({ type: 'subscribe_events', event_type: 'state_changed' })
    return
  }

  if (msg.type === 'auth_invalid') {
    closedByUser = true
    socket?.close()
    notifyStatus(false)
    return
  }

  if (msg.type === 'result' && typeof msg.id === 'number') {
    const waiter = pending.get(msg.id)
    if (waiter) {
      pending.delete(msg.id)
      if (msg.success) waiter.resolve(msg.result)
      else waiter.reject(new Error(msg.error?.message ?? 'HA command failed'))
    }
    return
  }

  if (msg.type === 'event') {
    const id = msg.event?.data?.entity_id
    const next = msg.event?.data?.new_state
    if (id && next) {
      for (const fn of stateListeners) fn(next)
    }
  }
}

function send(payload: Record<string, unknown>): number {
  const id = nextId++
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return id
  }
  socket.send(JSON.stringify({ id, ...payload }))
  return id
}

function sendAsync(
  payload: Record<string, unknown>,
  timeoutMs = 8000,
): Promise<unknown> {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return Promise.reject(new Error('Not connected to Home Assistant'))
  }
  const id = nextId++
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      pending.delete(id)
      reject(new Error('Home Assistant command timed out'))
    }, timeoutMs)
    pending.set(id, {
      resolve: (v) => {
        window.clearTimeout(timer)
        resolve(v)
      },
      reject: (e) => {
        window.clearTimeout(timer)
        reject(e)
      },
    })
    socket?.send(JSON.stringify({ id, ...payload }))
  })
}

export function subscribeStates(fn: StateListener): () => void {
  stateListeners.add(fn)
  return () => stateListeners.delete(fn)
}

export function subscribeStatus(fn: StatusListener): () => void {
  statusListeners.add(fn)
  return () => statusListeners.delete(fn)
}

export function connect(config: HassConfig): () => void {
  activeConfig = config
  closedByUser = false
  openSocket()

  return () => {
    closedByUser = true
    if (reconnectTimer !== null) {
      window.clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    pending.forEach((w) => w.reject(new Error('Disconnected')))
    pending.clear()
    socket?.close()
    socket = null
    activeConfig = null
    notifyStatus(false)
  }
}

function openSocket(): void {
  if (!activeConfig) return
  if (socket && socket.readyState <= WebSocket.OPEN) return

  try {
    socket = new WebSocket(wsUrl(activeConfig))
  } catch {
    scheduleReconnect()
    return
  }

  socket.onopen = () => {
    socket?.send(JSON.stringify({ type: 'auth', access_token: activeConfig?.token }))
  }

  socket.onmessage = (event: MessageEvent<string>) => {
    handleMessage(event.data)
  }

  socket.onerror = () => {
    notifyStatus(false)
  }

  socket.onclose = () => {
    socket = null
    notifyStatus(false)
    if (!closedByUser) scheduleReconnect()
  }
}

function scheduleReconnect(): void {
  if (!activeConfig || reconnectTimer !== null) return
  attempt += 1
  const delay = Math.min(1000 * 2 ** (attempt - 1), 30000)
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null
    openSocket()
  }, delay)
}

export function isConnected(): boolean {
  return socket !== null && socket.readyState === WebSocket.OPEN
}

export { sendAsync as sendSocketCommand }
