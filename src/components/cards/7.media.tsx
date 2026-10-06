import { Music2, Pause, Play } from 'lucide-react'
import { useState } from 'react'
import { useMediaPlayer } from '../../hooks/useMediaPlayer'
import { AlbumArt, NowPlayingPage } from '../NowPlayingPage'
import { Section } from '../ui'
import { TOUCH, type WidgetSize } from '../../widgets/types'

/** Compact Now Playing widget; tapping it opens the full-screen page. */
export function NowPlayingCard({ size = 'w' }: { size?: WidgetSize }) {
  const player = useMediaPlayer()
  const [open, setOpen] = useState(false)
  const { active, status } = player
  const tall = size === 'l'
  const progress =
    active && player.duration > 0 ? player.position / player.duration : 0

  const title =
    status === 'unavailable'
      ? 'Unavailable'
      : status === 'idle'
        ? 'Nothing playing'
        : player.title || 'Unknown title'
  const subtitle =
    status === 'unavailable'
      ? 'Player offline'
      : status === 'idle'
        ? 'Tap to open'
        : player.artist

  const artSize =
    size === 'l'
      ? 'aspect-square w-full max-h-[240px] self-center'
      : size === 'w'
        ? 'h-32 w-32'
        : size === 'm'
          ? 'h-24 w-24'
          : 'h-16 w-16'

  const art = (
    <button
      type="button"
      aria-label="Open Now Playing"
      onClick={() => setOpen(true)}
      className={`press relative shrink-0 overflow-hidden rounded-xl bg-white/5 ${artSize}`}
    >
      <AlbumArt
        src={active ? player.art : null}
        alt=""
        iconSize={tall ? 48 : 24}
        className="h-full w-full"
      />
    </button>
  )

  const text = (
    <div
      onClick={() => setOpen(true)}
      className="min-w-0 flex-1 cursor-pointer leading-tight"
    >
      <div className="line-clamp-2 break-words text-[17px] font-semibold text-fg">
        {title}
      </div>
      {subtitle && (
        <div className="mt-1 truncate text-[15px] text-fg-dim">{subtitle}</div>
      )}
    </div>
  )

  const playPause = (
    <button
      type="button"
      aria-label={player.playing ? 'Pause' : 'Play'}
      disabled={!active}
      onClick={player.playPause}
      className="press grid h-14 w-14 shrink-0 place-items-center rounded-full bg-fg text-bg disabled:opacity-35"
    >
      {player.playing ? (
        <Pause size={24} fill="currentColor" />
      ) : (
        <Play size={24} fill="currentColor" className="translate-x-0.5" />
      )}
    </button>
  )

  return (
    <>
      <Section
        className={`${TOUCH.section} flex-1`}
        icon={<Music2 size={16} />}
        title="Now Playing"
        thumb={0.45}
      >
        <div
          className={`flex min-h-0 flex-1 flex-col justify-center gap-3 ${
            status === 'unavailable' ? 'opacity-60' : ''
          }`}
        >
          {tall ? (
            <>
              {art}
              <div className="flex items-center gap-3">
                {text}
                {playPause}
              </div>
            </>
          ) : size === 's' ? (
            <>
              <div className="flex items-center gap-3">
                {art}
                {text}
              </div>
              {playPause}
            </>
          ) : (
            <div className="flex items-center gap-3">
              {art}
              {text}
              {playPause}
            </div>
          )}

          {size !== 's' && (
            <div aria-hidden className="h-1 shrink-0 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-fg"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}
        </div>
      </Section>

      {open && <NowPlayingPage player={player} onClose={() => setOpen(false)} />}
    </>
  )
}
