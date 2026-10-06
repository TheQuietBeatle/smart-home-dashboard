import {
  Cast,
  Disc3,
  Monitor,
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  Speaker,
  Tv,
  Usb,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useSmartHome } from '../hooks/smartHomeContext'
import type { MediaSource } from '../types'
import { Chip, RoundBtn, Section } from './ui'
import { Pill } from './ui'

const SOURCES: { id: MediaSource; label: string; icon: typeof Tv }[] = [
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'pc', label: 'PC', icon: Monitor },
  { id: 'mix', label: 'Mix', icon: Shuffle },
  { id: 'usb', label: 'USB', icon: Usb },
]

export function MediaPanel() {
  const { state, setSource, togglePlay, next, previous, setVolume, toggleEcho } =
    useSmartHome()
  const { media } = state
  const muted = media.volume === 0

  return (
    <Section
      icon={<Disc3 size={16} />}
      title="Media"
      thumb={0.45}
      chips={<Chip icon={<Cast size={12} />} />}
    >
      <div className="grid grid-cols-4 gap-2">
        {SOURCES.map(({ id, label, icon: Icon }) => (
          <Pill
            key={id}
            active={media.source === id}
            icon={<Icon size={13} />}
            onClick={() => setSource(id)}
            className="pr-2"
          >
            {label}
          </Pill>
        ))}
      </div>

      <div className="flex h-11 items-center gap-1.5 rounded-full bg-tile px-1.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green text-bg">
          <Disc3 size={16} />
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
          Spotify
        </span>
        <button type="button" aria-label="Shuffle" className="press grid h-8 w-8 place-items-center rounded-full text-fg-dim hover:text-fg">
          <Shuffle size={14} />
        </button>
        <button type="button" aria-label="Previous" onClick={previous} className="press grid h-8 w-8 place-items-center rounded-full hover:bg-tile-hi">
          <SkipBack size={14} />
        </button>
        <button type="button" aria-label={media.playing ? 'Pause' : 'Play'} onClick={togglePlay} className="press grid h-8 w-8 place-items-center rounded-full hover:bg-tile-hi">
          {media.playing ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <button type="button" aria-label="Next" onClick={next} className="press grid h-8 w-8 place-items-center rounded-full hover:bg-tile-hi">
          <SkipForward size={14} />
        </button>
        <button
          type="button"
          aria-label={muted ? 'Unmute' : 'Mute'}
          onClick={() => setVolume(muted ? 42 : 0)}
          className="press grid h-8 w-8 place-items-center rounded-lg bg-amber text-bg"
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      </div>

      <div className="flex h-11 items-center gap-1.5 rounded-full bg-tile px-1.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#e5484d] to-[#a3262b] text-fg">
          <Speaker size={15} />
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
          Echo Show 5
        </span>
        <button type="button" aria-label="Cast" className="press grid h-8 w-8 place-items-center rounded-full text-fg-dim hover:text-fg">
          <Cast size={14} />
        </button>
        <RoundBtn
          aria-label={media.echoPlaying ? 'Pause Echo' : 'Play Echo'}
          active={media.echoPlaying}
          tone="amber"
          className="h-8 w-8"
          onClick={toggleEcho}
        >
          {media.echoPlaying ? <Pause size={15} /> : <Play size={15} />}
        </RoundBtn>
      </div>
    </Section>
  )
}
