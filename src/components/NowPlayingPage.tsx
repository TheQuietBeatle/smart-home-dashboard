import {
  ChevronDown,
  Music2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useDominantColor } from '../hooks/useDominantColor'
import { formatTime, type MediaPlayer } from '../hooks/useMediaPlayer'

const FADE_MS = 400
const SWIPE_PX = 60

/**
 * Keeps the outgoing value for one crossfade: the new layer fades in (CSS
 * @starting-style), the old one fades out, then the old one is dropped.
 */
function useCrossfade<T>(key: string, item: T) {
  const [state, setState] = useState<{
    key: string
    item: T
    prev: { key: string; item: T } | null
  }>({ key, item, prev: null })

  // Adjust state during render when the key changes (React's documented
  // pattern for deriving from a changed prop).
  if (state.key !== key) {
    setState({ key, item, prev: { key: state.key, item: state.item } })
  }

  useEffect(() => {
    if (!state.prev) return
    const id = window.setTimeout(
      () => setState((s) => ({ ...s, prev: null })),
      FADE_MS,
    )
    return () => window.clearTimeout(id)
  }, [state.prev])

  const layers: { key: string; item: T; leaving: boolean }[] = []
  if (state.prev) layers.push({ ...state.prev, leaving: true })
  layers.push({ key, item, leaving: false })
  return layers
}

const FADE =
  'transition-opacity duration-400 ease-out starting:opacity-0 motion-reduce:transition-none'

function Layer({
  leaving,
  className = '',
  children,
}: {
  leaving: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div
      aria-hidden={leaving || undefined}
      className={`${FADE} ${leaving ? 'pointer-events-none opacity-0' : 'opacity-100'} ${className}`}
    >
      {children}
    </div>
  )
}

function background(color: string | null): string {
  return color
    ? `linear-gradient(135deg, ${color} 0%, color-mix(in srgb, ${color} 35%, var(--color-bg)) 45%, var(--color-bg) 100%)`
    : 'linear-gradient(135deg, var(--color-tile) 0%, var(--color-bg) 70%)'
}

/** Cover image; falls back to a placeholder when missing or it fails to load. */
export function AlbumArt({
  src,
  alt,
  iconSize,
  className = '',
}: {
  src: string | null
  alt: string
  iconSize: number
  className?: string
}) {
  const [failed, setFailed] = useState<string | null>(null)
  if (!src || failed === src) {
    return (
      <div className={`grid place-items-center bg-white/5 text-fg-dim ${className}`}>
        <Music2 size={iconSize} strokeWidth={1.3} />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      onError={() => setFailed(src)}
      className={`object-cover ${className}`}
    />
  )
}

const CONTROL =
  'press grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full text-fg hover:bg-white/10 disabled:opacity-35 disabled:hover:bg-transparent'

export function NowPlayingPage({
  player,
  onClose,
}: {
  player: MediaPlayer
  onClose: () => void
}) {
  const color = useDominantColor(player.art)
  const bgLayers = useCrossfade(color ?? 'none', color)
  const track = {
    art: player.art,
    title: player.title,
    artist: player.artist,
    album: player.album,
  }
  const trackLayers = useCrossfade(player.trackKey, track)
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const volumeTrack = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const { active, status } = player
  const pct = Math.round(player.volume * 100)
  const progress = player.duration > 0 ? player.position / player.duration : 0

  // Keys stay inside the page (no paging the carousel behind it).
  const onKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === 'Escape') onClose()
  }

  const onArtUp = (e: PointerEvent) => {
    const start = swipe.current
    swipe.current = null
    if (!start || !active) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) player.next()
    else player.previous()
  }

  const volumeAt = (clientY: number) => {
    const r = volumeTrack.current?.getBoundingClientRect()
    if (!r || !r.height) return player.volume
    return 1 - (clientY - r.top) / r.height
  }

  const VolumeIcon = player.volume === 0 ? VolumeX : player.volume < 0.5 ? Volume1 : Volume2
  const heading =
    status === 'unavailable'
      ? 'Player unavailable'
      : status === 'idle'
        ? 'Nothing playing'
        : null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Now Playing"
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-50 overflow-hidden bg-bg text-fg select-none"
    >
      {bgLayers.map((l) => (
        <Layer key={l.key} leaving={l.leaving} className="absolute inset-0">
          <div className="h-full w-full" style={{ background: background(l.item) }} />
        </Layer>
      ))}
      <div aria-hidden className="absolute inset-0 bg-black/25" />

      <button
        type="button"
        autoFocus
        aria-label="Close Now Playing"
        onClick={onClose}
        className={`${CONTROL} absolute left-3 top-3 z-10`}
      >
        <ChevronDown size={32} />
      </button>

      <div
        className={`relative flex h-full items-center gap-8 pl-6 pr-[96px] ${
          status === 'unavailable' ? 'opacity-60' : ''
        }`}
      >
        {/* Art: swipe left for next, right for previous. */}
        <div
          className="relative aspect-square shrink-0 touch-none"
          style={{ width: 'min(440px, calc(100dvh - 150px), calc(100vw - 552px))' }}
          onPointerDown={(e) => {
            swipe.current = { x: e.clientX, y: e.clientY }
          }}
          onPointerUp={onArtUp}
          onPointerCancel={() => {
            swipe.current = null
          }}
        >
          {trackLayers.map((l) => (
            <Layer key={l.key} leaving={l.leaving} className="absolute inset-0">
              <AlbumArt
                src={active ? l.item.art : null}
                alt={l.item.album ? `${l.item.album} cover` : 'Album cover'}
                iconSize={96}
                className="h-full w-full rounded-3xl shadow-[0_24px_60px_-12px_rgb(0_0_0/0.7)]"
              />
            </Layer>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="relative min-h-[150px]">
            {trackLayers.map((l) => (
              <Layer
                key={l.key}
                leaving={l.leaving}
                className={l.leaving ? 'absolute inset-x-0 top-0' : 'relative'}
              >
                {heading ? (
                  <>
                    <h1 className="text-[40px] font-bold leading-[1.1]">{heading}</h1>
                    <p className="mt-3 text-[18px] text-fg-dim">
                      {status === 'unavailable'
                        ? 'Check the Home Assistant connection.'
                        : 'Start something on the player to see it here.'}
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="line-clamp-2 text-[40px] font-bold leading-[1.1] break-words">
                      {l.item.title || 'Unknown title'}
                    </h1>
                    <p className="mt-2 truncate text-[24px] text-fg/85">{l.item.artist}</p>
                    <p className="mt-1 truncate text-[18px] text-fg-dim">{l.item.album}</p>
                  </>
                )}
              </Layer>
            ))}
          </div>

          <div>
            <div
              role="slider"
              aria-label="Seek"
              aria-disabled={!active}
              aria-valuemin={0}
              aria-valuemax={Math.round(player.duration)}
              aria-valuenow={Math.round(player.position)}
              aria-valuetext={`${formatTime(player.position)} of ${formatTime(player.duration)}`}
              tabIndex={active ? 0 : -1}
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                player.seek(((e.clientX - r.left) / r.width) * player.duration)
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') player.seek(player.position + 10)
                if (e.key === 'ArrowLeft') player.seek(player.position - 10)
              }}
              className={`relative h-12 ${active ? 'cursor-pointer' : ''}`}
            >
              <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-fg"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              {active && (
                <div
                  className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg shadow"
                  style={{ left: `${progress * 100}%` }}
                />
              )}
            </div>
            <div className="flex justify-between text-[16px] tabular-nums text-fg-dim">
              <span>{active ? formatTime(player.position) : '–:––'}</span>
              <span>{active ? formatTime(player.duration) : '–:––'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Shuffle"
              aria-pressed={player.shuffle}
              disabled={!active}
              onClick={player.toggleShuffle}
              className={`${CONTROL} ${player.shuffle ? 'text-sky' : ''}`}
            >
              <Shuffle size={28} />
            </button>
            <button type="button" aria-label="Previous track" disabled={!active} onClick={player.previous} className={CONTROL}>
              <SkipBack size={34} fill="currentColor" />
            </button>
            <button
              type="button"
              aria-label={player.playing ? 'Pause' : 'Play'}
              disabled={!active}
              onClick={player.playPause}
              className="press grid h-24 w-24 shrink-0 place-items-center rounded-full bg-fg text-bg shadow-lg disabled:opacity-35"
            >
              {player.playing ? (
                <Pause size={40} fill="currentColor" />
              ) : (
                <Play size={40} fill="currentColor" className="translate-x-0.5" />
              )}
            </button>
            <button type="button" aria-label="Next track" disabled={!active} onClick={player.next} className={CONTROL}>
              <SkipForward size={34} fill="currentColor" />
            </button>
            <button
              type="button"
              aria-label={`Repeat: ${player.repeat}`}
              aria-pressed={player.repeat !== 'off'}
              disabled={!active}
              onClick={player.cycleRepeat}
              className={`${CONTROL} ${player.repeat !== 'off' ? 'text-sky' : ''}`}
            >
              {player.repeat === 'one' ? <Repeat1 size={28} /> : <Repeat size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Volume: drag vertically anywhere on the right-edge strip. */}
      <div
        role="slider"
        aria-label="Volume"
        aria-orientation="vertical"
        aria-disabled={!active}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        tabIndex={active ? 0 : -1}
        onPointerDown={(e) => {
          if (!active) return
          e.currentTarget.setPointerCapture(e.pointerId)
          dragging.current = true
          player.setVolume(volumeAt(e.clientY))
        }}
        onPointerMove={(e) => {
          if (dragging.current) player.setVolume(volumeAt(e.clientY))
        }}
        onPointerUp={(e) => {
          if (!dragging.current) return
          dragging.current = false
          player.setVolume(volumeAt(e.clientY), true)
        }}
        onPointerCancel={() => {
          dragging.current = false
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') player.setVolume(player.volume + 0.05, true)
          if (e.key === 'ArrowDown') player.setVolume(player.volume - 0.05, true)
        }}
        className={`absolute inset-y-0 right-0 flex w-[72px] touch-none flex-col items-center gap-3 py-6 ${
          active ? 'cursor-ns-resize' : 'opacity-35'
        }`}
      >
        <VolumeIcon size={24} className="shrink-0" />
        <div ref={volumeTrack} className="relative w-2 flex-1 overflow-hidden rounded-full bg-white/20">
          <div
            className="absolute inset-x-0 bottom-0 rounded-full bg-fg"
            style={{ height: `${pct}%` }}
          />
        </div>
        <span className="shrink-0 text-[16px] tabular-nums">{pct}%</span>
      </div>
    </div>,
    document.body,
  )
}
