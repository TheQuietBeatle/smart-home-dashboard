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
import { Pill, RoundBtn, Section } from './ui'
import { shows, TOUCH, type WidgetSize } from '../widgets/types'

const SOURCES: { id: MediaSource; label: string; icon: typeof Tv }[] = [
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'pc', label: 'PC', icon: Monitor },
  { id: 'mix', label: 'Mix', icon: Shuffle },
  { id: 'usb', label: 'USB', icon: Usb },
]

export function MediaPanel({ size = 'w' }: { size?: WidgetSize }) {
  const { state, setSource, togglePlay, next, previous, setVolume, toggleEcho } =
    useSmartHome()
  const { media } = state
  const muted = media.volume === 0
  const show = (tier: WidgetSize) => shows(size, tier, 'w')
  // Only the 6-column cell is wide enough for the strip on one line.
  const oneRow = size === 'w'
  const narrow = size === 's' || size === 'l'

  const label = (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green text-bg">
      <Disc3 size={18} />
    </span>
  )
  const shuffle = show('l') && (
    <button type="button" aria-label="Shuffle" className={`${TOUCH.icon} text-fg-dim hover:text-fg`}>
      <Shuffle size={18} />
    </button>
  )
  const transport = (
    <>
      <button type="button" aria-label="Previous" onClick={previous} className={`${TOUCH.icon} hover:bg-white/10`}>
        <SkipBack size={18} />
      </button>
      <button type="button" aria-label={media.playing ? 'Pause' : 'Play'} onClick={togglePlay} className={`${TOUCH.icon} hover:bg-white/10`}>
        {media.playing ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <button type="button" aria-label="Next" onClick={next} className={`${TOUCH.icon} hover:bg-white/10`}>
        <SkipForward size={18} />
      </button>
    </>
  )
  const volume = (
    <button
      type="button"
      aria-label={muted ? 'Unmute' : 'Mute'}
      onClick={() => setVolume(muted ? 42 : 0)}
      className={`${TOUCH.icon} rounded-xl bg-amber text-bg`}
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  )

  return (
    <Section
      className={TOUCH.section}
      icon={<Disc3 size={16} />}
      title="Media"
      thumb={0.45}
      chips={
        <span className={TOUCH.chip}>
          <Cast size={14} />
        </span>
      }
    >
      {show('m') && (
        <div className={`grid gap-1.5 ${narrow ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {SOURCES.map(({ id, label: name }) => (
            <Pill
              key={id}
              active={media.source === id}
              onClick={() => setSource(id)}
              className={`${TOUCH.pill} justify-center px-2! [&>span]:flex-none`}
            >
              {name}
            </Pill>
          ))}
        </div>
      )}

      {oneRow ? (
        <div className="glass flex h-12 shrink-0 items-center gap-1 rounded-full pl-2">
          {label}
          <span className="min-w-0 flex-1 truncate pl-1 text-[15px] font-medium">
            Spotify
          </span>
          {shuffle}
          {transport}
          {volume}
        </div>
      ) : (
        <div className="glass shrink-0 rounded-[24px]">
          <div className="flex h-12 items-center gap-1 pl-2">
            {label}
            <span className="min-w-0 flex-1 truncate pl-1 text-[15px] font-medium">
              Spotify
            </span>
            {shuffle}
            {volume}
          </div>
          <div className="flex h-12 items-center justify-center gap-1">
            {transport}
          </div>
        </div>
      )}

      {show('w') && (
        <div className="glass flex h-12 shrink-0 items-center gap-1 rounded-full pl-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#e5484d] to-[#a3262b] text-fg">
            <Speaker size={16} />
          </span>
          <span className="min-w-0 flex-1 truncate pl-1 text-[15px] font-medium">
            Echo Show 5
          </span>
          {!narrow && (
            <button type="button" aria-label="Cast" className={`${TOUCH.icon} text-fg-dim hover:text-fg`}>
              <Cast size={18} />
            </button>
          )}
          <RoundBtn
            aria-label={media.echoPlaying ? 'Pause Echo' : 'Play Echo'}
            active={media.echoPlaying}
            tone="amber"
            className={TOUCH.round}
            onClick={toggleEcho}
          >
            {media.echoPlaying ? <Pause size={18} /> : <Play size={18} />}
          </RoundBtn>
        </div>
      )}
    </Section>
  )
}
