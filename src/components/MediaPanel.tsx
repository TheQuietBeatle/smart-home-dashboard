import {
  Bluetooth,
  Disc3,
  List,
  Pause,
  Play,
  Power,
  Radio,
  SkipBack,
  SkipForward,
  Tv,
  Volume2,
} from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'
import type { MediaSource } from '../types'
import { TRACKS } from '../data/mockData'
import { Card, CardHeader, IconButton } from './ui'

const SOURCES: { id: MediaSource; label: string; icon: typeof Radio }[] = [
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'radio', label: 'Radio', icon: Radio },
  { id: 'bluetooth', label: 'Bluetooth', icon: Bluetooth },
  { id: 'spotify', label: 'Spotify', icon: Disc3 },
]

export function MediaPanel() {
  const { state, setSource, toggleTv, cycleInput, changeChannel } = useSmartHome()
  const { media } = state

  return (
    <Card className="flex min-h-0 flex-col">
      <CardHeader
        title="Media"
        action={
          <span className="text-[10px] text-ink-500">
            {media.tvOn ? `TV · ${media.tvInput}` : 'TV spenta'}
          </span>
        }
      />

      <div className="flex min-h-0 flex-1 gap-2 px-3 pb-2.5">
        <div className="flex w-[40%] min-w-0 flex-col gap-1.5">
          <div className="flex items-center gap-1.5 rounded-xl border border-line bg-white/[0.02] px-2 py-1.5">
            <span
              className={`grid h-6 w-6 place-items-center rounded-lg ${
                media.tvOn
                  ? 'bg-accent-cyan/18 text-accent-cyan'
                  : 'bg-white/[0.04] text-ink-500'
              }`}
            >
              <Tv size={13} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[10px] font-semibold text-ink-100">
                TV Salotto
              </div>
              <div className="truncate text-[9px] text-ink-500">
                {media.tvOn ? `Canale ${media.channel}` : 'In stand-by'}
              </div>
            </div>
            <IconButton
              size="sm"
              aria-label="Accendi TV"
              active={media.tvOn}
              onClick={toggleTv}
            >
              <Power size={12} />
            </IconButton>
          </div>

          <div className="flex items-center gap-1.5">
            <IconButton
              size="sm"
              aria-label="Canale precedente"
              onClick={() => changeChannel(-1)}
              className="flex-1"
            >
              <span className="text-[11px] font-bold">CH−</span>
            </IconButton>
            <IconButton
              size="sm"
              aria-label="Canale successivo"
              onClick={() => changeChannel(1)}
              className="flex-1"
            >
              <span className="text-[11px] font-bold">CH+</span>
            </IconButton>
            <button
              type="button"
              onClick={cycleInput}
              className="press flex-1 rounded-lg border border-line bg-white/[0.03] px-1 py-1 text-[9px] font-semibold text-ink-300 hover:bg-white/[0.06]"
            >
              {media.tvInput}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {SOURCES.map((src) => {
              const Icon = src.icon
              const on = media.source === src.id
              return (
                <button
                  key={src.id}
                  type="button"
                  onClick={() => setSource(src.id)}
                  className={`press flex flex-col items-center gap-0.5 rounded-lg border py-1.5 text-[8.5px] font-medium ${
                    on
                      ? 'border-accent-cyan/40 bg-accent-cyan/12 text-accent-cyan'
                      : 'border-line bg-white/[0.02] text-ink-500 hover:text-ink-300'
                  }`}
                >
                  <Icon size={12} />
                  {src.label}
                </button>
              )
            })}
          </div>
        </div>

        <SpotifyPlayer />
      </div>
    </Card>
  )
}

function SpotifyPlayer() {
  const { state, togglePlay, next, previous, setVolume } = useSmartHome()
  const { media } = state
  const track = TRACKS[media.trackIndex]

  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-line bg-white/[0.02] p-2">
      <div className="flex items-center gap-2">
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-white/80"
          style={{
            background: `linear-gradient(140deg, ${track.art} 0%, #0b1220 130%)`,
          }}
        >
          <Disc3 size={18} className={media.playing ? 'animate-spin' : ''} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[8.5px] font-bold uppercase tracking-widest text-accent-green">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            Spotify
          </div>
          <div className="truncate text-[11px] font-semibold text-ink-100">
            {track.title}
          </div>
          <div className="truncate text-[9px] text-ink-500">
            {track.artist} · {track.album}
          </div>
        </div>
      </div>

      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className={`h-full rounded-full bg-accent-green transition-all duration-700 ${
            media.playing ? 'w-[46%]' : 'w-[38%]'
          }`}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-center gap-2">
        <IconButton size="sm" aria-label="Traccia precedente" onClick={previous}>
          <SkipBack size={13} />
        </IconButton>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={media.playing ? 'Pausa' : 'Riproduci'}
          className="press grid h-8 w-8 place-items-center rounded-full bg-accent-green text-[#052e16] shadow-[0_0_16px_-4px_rgba(74,222,128,0.7)]"
        >
          {media.playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <IconButton size="sm" aria-label="Traccia successiva" onClick={next}>
          <SkipForward size={13} />
        </IconButton>
      </div>

      <div className="mt-auto flex items-center gap-1.5 pt-1.5">
        <Volume2 size={11} className="shrink-0 text-ink-500" />
        <input
          type="range"
          min={0}
          max={100}
          value={media.volume}
          aria-label="Volume"
          onChange={(e) => setVolume(Number(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none rounded-full accent-accent-green"
          style={{
            background: `linear-gradient(90deg, #4ade80 0%, #4ade80 ${media.volume}%, rgba(255,255,255,0.07) ${media.volume}%, rgba(255,255,255,0.07) 100%)`,
          }}
        />
        <span className="w-6 text-right text-[9px] tabular-nums text-ink-400">
          {media.volume}
        </span>
        <List size={11} className="shrink-0 text-ink-500" />
      </div>
    </div>
  )
}
