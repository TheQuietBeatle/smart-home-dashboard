import {
  Building,
  Building2,
  Car,
  House,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Pencil,
  Search,
  Server,
  Tv,
  Users,
  Warehouse,
} from 'lucide-react'
import { useState } from 'react'
import { useArrangeMode } from '../widgets/arrangeContext'

const TABS = [
  { icon: House, label: 'Home' },
  { icon: Building, label: 'Ground floor' },
  { icon: Building2, label: 'First floor' },
  { icon: House, label: 'Garden' },
  { icon: Warehouse, label: 'Garage' },
  { icon: Server, label: 'System' },
  { icon: Tv, label: 'Media' },
  { icon: Users, label: 'People' },
  { icon: Car, label: 'Auto' },
  { icon: LayoutDashboard, label: 'Overview' },
]

export function TopNav() {
  const [tab, setTab] = useState(TABS.length - 1)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { arrangeOn, toggleArrangeMode } = useArrangeMode()

  return (
    <header className="glass glass-bar relative z-30 flex h-12 shrink-0 items-center gap-0.5 px-1">
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setMenuOpen((v) => !v)}
        className="press grid h-12 w-12 shrink-0 place-items-center rounded-lg text-fg hover:bg-white/10"
      >
        <Menu size={22} />
      </button>

      <nav
        aria-label="Views"
        className="scroll-thin flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1"
      >
        {TABS.map(({ icon: Icon, label }, i) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-current={tab === i}
            onClick={() => setTab(i)}
            className={`press grid h-12 w-12 shrink-0 place-items-center rounded-lg ${
              tab === i
                ? 'glass rounded-lg text-fg'
                : 'text-fg-dim hover:bg-white/10 hover:text-fg'
            }`}
          >
            <Icon size={20} />
          </button>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-0.5">
        {searchOpen && (
          <input
            autoFocus
            placeholder="Search devices…"
            className="glass h-10 w-44 rounded-lg px-3 text-[15px] text-fg outline-none placeholder:text-fg-dim"
            onBlur={() => setSearchOpen(false)}
          />
        )}
        {[
          { icon: Search, label: 'Search', onClick: () => setSearchOpen(true) },
          { icon: MessageSquare, label: 'Assistant' },
          {
            icon: Pencil,
            label: 'Edit dashboard',
            onClick: toggleArrangeMode,
            pressed: arrangeOn,
          },
        ].map(({ icon: Icon, label, onClick, pressed }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-pressed={pressed}
            onClick={onClick}
            className={`press grid h-12 w-12 place-items-center rounded-lg text-fg hover:bg-white/10 ${
              pressed ? 'bg-tile-hi text-fg' : ''
            }`}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>

      {menuOpen && (
        <div className="absolute left-3 top-12 w-56 glass rounded-xl p-2 shadow-2xl">
          {['Overview', 'Lights', 'Climate', 'Media', 'Automations', 'Settings'].map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMenuOpen(false)}
                className="press flex h-12 w-full items-center rounded-lg px-3 text-left text-[15px] text-fg hover:bg-white/10"
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
