import {
  Bell,
  CircleUser,
  House,
  MapPin,
  Menu,
  MessageSquare,
  Pencil,
  Search,
  Settings,
} from 'lucide-react'
import { useState } from 'react'
import { useClock } from '../hooks/useClock'
import { useSmartHome } from '../hooks/smartHomeContext'
import { IconButton } from './ui'

export function TopNav() {
  const { state } = useSmartHome()
  const clock = useClock()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative z-30 flex h-11 shrink-0 items-center gap-2 border-b border-line bg-gradient-to-r from-[#0d1a30] via-[#101d33] to-[#0c1526] px-3">
      <IconButton
        size="sm"
        aria-label="Menu"
        onClick={() => setMenuOpen((v) => !v)}
        active={menuOpen}
      >
        <Menu size={14} />
      </IconButton>

      <div className="flex items-center gap-1.5">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent-cyan/12 text-accent-cyan">
          <House size={14} />
        </span>
        <IconButton size="sm" aria-label="Rooms">
          <MapPin size={13} />
        </IconButton>
        <IconButton size="sm" aria-label="Scenes">
          <Settings size={13} />
        </IconButton>
      </div>

      <div className="mx-1 h-5 w-px bg-line" />

      <div className="hidden items-center gap-3 text-[11px] text-ink-400 sm:flex">
        <span className="flex items-center gap-1">
          <span className="text-ink-300">Esterno</span>
          <b className="font-semibold text-ink-100">
            {state.sensors.outdoorTemp.toFixed(1)}°C
          </b>
        </span>
        <span className="flex items-center gap-1">
          <span>Umidità</span>
          <b className="font-semibold text-ink-300">
            {state.sensors.outdoorHumidity}%
          </b>
        </span>
        <span className="flex items-center gap-1 rounded-full border border-line bg-white/[0.03] px-2 py-0.5">
          <House size={11} className="text-accent-cyan" />
          <b className="font-semibold text-ink-200">Casa</b>
        </span>
      </div>

      <div className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center leading-none">
        <span className="text-[17px] font-semibold tracking-tight text-ink-100 tabular-nums">
          {clock.time}
        </span>
        <span className="mt-0.5 text-[9px] font-medium tracking-widest text-ink-500">
          {clock.date.toUpperCase()}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <span className="hidden items-center gap-1 rounded-lg border border-line bg-white/[0.03] px-2 py-1 text-[11px] text-ink-300 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-live" />
          Interno
          <b className="font-semibold text-ink-100 tabular-nums">
            {state.sensors.indoorTemp.toFixed(1)}°C
          </b>
        </span>

        {searchOpen && (
          <input
            autoFocus
            placeholder="Cerca dispositivi…"
            className="h-7 w-36 rounded-lg border border-accent-cyan/40 bg-[#0a1322] px-2 text-[11px] text-ink-100 outline-none placeholder:text-ink-500"
            onBlur={() => setSearchOpen(false)}
          />
        )}
        {!searchOpen && (
          <IconButton
            size="sm"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={13} />
          </IconButton>
        )}
        <IconButton size="sm" aria-label="Messages">
          <MessageSquare size={13} />
        </IconButton>
        <IconButton size="sm" aria-label="Notifications">
          <span className="relative">
            <Bell size={13} />
            <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-accent-orange" />
          </span>
        </IconButton>
        <IconButton size="sm" aria-label="Profile">
          <CircleUser size={13} />
        </IconButton>
        <IconButton size="sm" aria-label="Edit dashboard">
          <Pencil size={13} />
        </IconButton>
      </div>

      {menuOpen && (
        <div className="absolute left-3 top-12 w-52 rounded-xl border border-line bg-[#0e1626] p-2 shadow-2xl">
          {['Panoramica', 'Luci', 'Clima', 'Media', 'Automazioni', 'Impostazioni'].map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMenuOpen(false)}
                className="press flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs text-ink-300 hover:bg-white/[0.05] hover:text-ink-100"
              >
                {item}
              </button>
            ),
          )}
        </div>
      )}
    </header>
  )
}
