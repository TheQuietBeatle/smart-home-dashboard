import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import {
  callService,
  getStates,
  subscribeStates,
  subscribeStatus,
  type HassEntity,
} from '../hass/client'
import { readConfig } from '../hass/config'

/** The Home Assistant media_player shown on the Now Playing widget and page. */
export const NOW_PLAYING_ENTITY = 'media_player.spotify_george'

export type PlayerStatus = 'playing' | 'paused' | 'idle' | 'unavailable'
export type RepeatMode = 'off' | 'all' | 'one'

const REPEAT_NEXT: Record<RepeatMode, RepeatMode> = {
  off: 'all',
  all: 'one',
  one: 'off',
}
const VOLUME_INTERVAL_MS = 160 // spec: at most one call per 150ms; margin for timer jitter
const TICK_MS = 500

// One shared subscription to the entity, however many components read it.
let entity: HassEntity | null = null
let started = false
const listeners = new Set<() => void>()

function emit(next: HassEntity | null) {
  entity = next
  listeners.forEach((l) => l())
}

function start() {
  if (started) return
  started = true
  const cfg = readConfig()
  if (!cfg) return
  const load = () =>
    getStates(cfg)
      .then((all) => emit(all.find((e) => e.entity_id === NOW_PLAYING_ENTITY) ?? null))
      .catch(() => {})
  load()
  subscribeStates((e) => {
    if (e.entity_id === NOW_PLAYING_ENTITY) emit(e)
  })
  // Catch up on anything missed while the socket was down.
  subscribeStatus((connected) => {
    if (connected) load()
  })
}

function subscribe(listener: () => void) {
  start()
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function num(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function call(service: string, data: Record<string, unknown> = {}) {
  const cfg = readConfig()
  if (!cfg) return
  void callService(cfg, 'media_player', service, {
    entity_id: NOW_PLAYING_ENTITY,
    ...data,
  }).catch(() => {})
}

/** Live state of NOW_PLAYING_ENTITY plus actions that call HA services. */
export function useMediaPlayer() {
  const ent = useSyncExternalStore(subscribe, () => entity, () => null)
  // Optimistic overrides apply only until the entity's next state arrives.
  const [override, setOverride] = useState<{
    playing: boolean
    at: number
    base: HassEntity | null
  } | null>(null)
  const [draft, setDraft] = useState<{
    value: number
    live: boolean
    base: HassEntity | null
  } | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const lastSent = useRef(0)
  const pending = useRef(0)
  const timer = useRef<number | null>(null)

  const a = ent?.attributes ?? {}
  const raw = ent?.state
  const status: PlayerStatus =
    !ent || raw === 'unavailable' || raw === 'unknown'
      ? 'unavailable'
      : raw === 'playing' || raw === 'buffering'
        ? 'playing'
        : raw === 'paused'
          ? 'paused'
          : 'idle'
  const active = status === 'playing' || status === 'paused'
  const ov = override && override.base === ent ? override : null
  const playing = ov ? ov.playing : status === 'playing'

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setNow(Date.now()), TICK_MS)
    return () => window.clearInterval(id)
  }, [playing])

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    [],
  )

  const duration = num(a.media_duration)
  const basePos = num(a.media_position)
  const updatedAt = Date.parse(text(a.media_position_updated_at))
  let position = basePos
  if (Number.isFinite(updatedAt)) {
    if (playing) {
      // Optimistic resume counts from the tap; otherwise from HA's timestamp.
      const anchor = ov?.playing && status !== 'playing' ? ov.at : updatedAt
      position = basePos + Math.max(0, (now - anchor) / 1000)
    } else if (ov && status === 'playing') {
      // Optimistic pause freezes where playback had reached at the tap.
      position = basePos + Math.max(0, (ov.at - updatedAt) / 1000)
    }
  }
  if (duration > 0) position = Math.min(position, duration)

  const picture = text(a.entity_picture)
  const art = useMemo(() => {
    if (!picture) return null
    if (/^https?:\/\//i.test(picture)) return picture
    const cfg = readConfig()
    return cfg ? `${cfg.url}${picture.startsWith('/') ? '' : '/'}${picture}` : null
  }, [picture])

  const entityVolume = Math.min(1, Math.max(0, num(a.volume_level)))
  const volume =
    draft && (draft.live || draft.base === ent) ? draft.value : entityVolume

  const title = text(a.media_title)
  const artist = text(a.media_artist)
  const album = text(a.media_album_name)
  const repeat = (['off', 'all', 'one'] as const).includes(a.repeat as RepeatMode)
    ? (a.repeat as RepeatMode)
    : 'off'

  const sendVolume = (v: number) => {
    lastSent.current = Date.now()
    call('volume_set', { volume_level: Math.round(v * 100) / 100 })
  }

  return {
    status,
    /** Something is loaded (playing or paused): controls are enabled. */
    active,
    playing,
    title,
    artist,
    album,
    art,
    duration,
    position,
    volume,
    shuffle: a.shuffle === true,
    repeat,
    trackKey: `${title}\u0000${artist}\u0000${album}`,

    playPause() {
      if (!active) return
      setOverride({ playing: !playing, at: Date.now(), base: ent })
      call('media_play_pause')
    },
    next() {
      if (active) call('media_next_track')
    },
    previous() {
      if (active) call('media_previous_track')
    },
    seek(seconds: number) {
      if (!active || duration <= 0) return
      call('media_seek', {
        seek_position: Math.round(Math.min(Math.max(seconds, 0), duration)),
      })
    },
    /** Throttled to one volume_set per 150ms; the last value always goes out. */
    setVolume(value: number, done = false) {
      if (!active) return
      const v = Math.min(1, Math.max(0, value))
      setDraft({ value: v, live: !done, base: ent })
      pending.current = v
      const wait = VOLUME_INTERVAL_MS - (Date.now() - lastSent.current)
      if (wait <= 0) {
        if (timer.current !== null) {
          window.clearTimeout(timer.current)
          timer.current = null
        }
        sendVolume(v)
      } else if (timer.current === null) {
        timer.current = window.setTimeout(() => {
          timer.current = null
          sendVolume(pending.current)
        }, wait)
      }
    },
    toggleShuffle() {
      if (active) call('shuffle_set', { shuffle: a.shuffle !== true })
    },
    cycleRepeat() {
      if (active) call('repeat_set', { repeat: REPEAT_NEXT[repeat] })
    },
  }
}

export type MediaPlayer = ReturnType<typeof useMediaPlayer>

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`
}
