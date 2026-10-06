# Smart Home Dashboard

A dark, touch-first smart-home control panel for a landscape wall tablet
(English UI). The dashboard is a rearrangeable grid of widget cards; every
widget has size presets, and on tablets the grid pages into swipeable
screens. It runs standalone on mock data by default, and Home Assistant can
be connected without touching any UI code.

## Features

- **Rearrangeable widget grid** — drag or tap to move widgets, cycle their
  size (`S` / `M` / `W` / `L`), and remove or re-add them from a catalog.
- **Swipeable pages** — on landscape tablets the widgets are packed into
  pages of a 12-column × 2-row grid; swipe between pages with a snap, page
  dots, and arrow-key support. Smaller or portrait screens fall back to a
  single fluid column.
- **Density tiers** — each card reads its current size and progressively
  shows or hides detail (e.g. a small Weather card is just temperature; the
  large one adds the forecast).
- **Mock mode** — fully interactive with no backend; simulated sensors drift
  every few seconds.
- **Optional Home Assistant** — bidirectional sync (UI → HA service calls,
  HA state → UI) with echo suppression, configured via env vars or at
  runtime.
- **Touch-first** — 48 px tap targets, ≥14 px text, pointer-based dragging
  so the grab handle works with a finger as well as a mouse.
- **Kiosk-ready** — viewport zoom locked, `overflow: hidden`, `short:`
  variant that tightens spacing on short wall tablets.

## Tech stack

- Vite 8 · React 19 · TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`) with a custom `@theme` token set
- `lucide-react` icons, `recharts` charts (lazy-loaded only for the Energy
  widget so it stays out of the main bundle)
- No backend, no runtime dependencies

## Getting started

```bash
npm install
npm run dev       # dev server with HMR
npm run build     # typecheck + production build
npm run preview   # serve the production build
npm run lint      # oxlint
```

The dashboard works immediately with mock data — no configuration required.
Run `npm run build` and serve `dist/` on your LAN to put it on a tablet.

## Folder layout

```
src/
  components/       App chrome and per-widget cards
    cards/          One file per widget: 1.weather … 10.clock
    TopNav.tsx      Section tabs + search, edit, add-widgets buttons
    StatusBar.tsx   Fixed footer: scene, lights, energy, indoor sensors
    WidgetCatalog.tsx  Full-screen "Add widgets" overlay
    ui.tsx          Shared primitives (Section, Pill, Chip, RoundBtn, …)
  widgets/          Layout engine + arrange mode (not UI-specific)
    types.ts        WidgetId, sizes, spans, metadata, density helper
    useWidgetLayout.ts  Layout state with localStorage persistence
    arrangeContext.ts / ArrangeMode.tsx  Edit-mode + catalog provider
    WidgetFrame.tsx     Grid cell, arrange toolbar, touch drag handle
    WidgetGrid.tsx      12×2 paged grid, swipe + snap, arrange bar
    paginate.ts         Bin-packs widgets into pages (derived, never saved)
    useMediaQuery.ts    Page vs. single-column query hook
  hass/             Home Assistant integration (config, client, bridge)
  hooks/            State store + smart-home context, clock hook
  services/         Pure state-transition layer + HA entity map
  data/             Mock smart-home data
  lib/              Small shared helpers (formatting)
```

## The widget system

### Widgets and size presets

Ten widgets are available (`cards/1.weather.tsx` … `cards/10.clock.tsx`):

| id             | card          | default size |
|----------------|---------------|--------------|
| `weather`      | temperature, clock, forecast | `l` |
| `status`       | gate, garages, cameras, cars | `l` |
| `climate`      | air-conditioning setpoint/modes | `l` |
| `lighting`     | lights on/off, blinds | `l` |
| `media`        | sources, Spotify, Echo playback | `w` |
| `automations`  | one-tap scenes (Night, Dinner, …) | `w` |
| `roomba`       | vacuum status, battery, controls | `m` |
| `energy`       | power now, peak, daily usage chart | `m` |
| `pills`        | quick-filter chips per device group | `s` |
| `clock`        | analog clock with a second hand | `l` |

Sizes map to spans on the 12-column grid (`SIZE_SPAN` in `widgets/types.ts`):

| size  | span    | notes |
|-------|---------|-------|
| `s`   | 3 × 1   | quarter-width tile |
| `m`   | 4 × 1   | third-width tile |
| `w`   | 6 × 1   | half-width tile |
| `l`   | 3 × 2   | square hero tile, ~⅛ of the screen |

Cards receive their current `size` as a prop and render density tiers via
the `shows(size, tier, default)` helper, which guarantees that whatever a
card shows at its default size never disappears when it shrinks.

### Paging

On landscape screens at least `40rem` wide the grid is split into pages of
**12 columns × 2 rows** (`PAGE_COLS`/`PAGE_ROWS` in `widgets/paginate.ts`).
Widgets are packed in layout order into the first free slot; anything that
does not fit flows onto the next page, and a widget never splits across
pages. Pages are derived at render time and never stored.

The page scroller uses `snap-mandatory` horizontal snapping with hidden
scrollbars, page-dot navigation (48 px tap targets), and Left/Right arrow
key support. With `prefers-reduced-motion: reduce` paging jumps instead of
scrolling smoothly.

### Arrange mode

Tap the **pencil** in the top nav to enter arrange mode. Each widget then
shows an overlay toolbar and a drag handle:

- **Drag handle** — pointer-based drag to reorder (works with touch);
  the dragged widget highlights amber as it swaps.
- **◀ ▶** — move the widget to the nearest visible neighbour.
- **Size button** — cycles `S → M → W → L` (and back).
- **✕** — remove the widget from the dashboard (its order/size are kept).

A floating bar offers **Reset layout** (restore defaults) and **Done**. The
**＋ (Add widgets)** button opens the `WidgetCatalog`, a full-screen overlay
to add previously removed widgets back. Arrow keys and Escape are handled:
Escape closes the catalog first, then exits arrange mode.

### Persistence

The ordered layout (order + size + hidden flag per widget) is saved to
`localStorage` under **`casa-layout-v1`**. On load it is merged with the
default layout: saved entries win, unknown ids are dropped, and new widgets
from newer versions are appended. A removed widget stays removed across
reloads until you re-add it.

## Mock mode and the state store

Everything is driven by `SmartHomeProvider` (`hooks/useSmartHome.tsx`):

- The store starts from `data/mockData.ts` and persists to `localStorage`
  under **`casa-dashboard-state-v3`** (debounced 250 ms).
- Simulated sensors (temperature, humidity, energy, motion) drift by a small
  random amount every few seconds so the dashboard feels "live".
- All state transitions go through pure functions in
  `services/smartHomeService.ts`, which keeps the UI logic testable and is
  the same layer the Home Assistant bridge writes to.

## Connecting Home Assistant

The UI never calls HA directly — the integration lives in `src/hass/` and
mounts through `<HassBridge />` in `App.tsx`:

| File | Purpose |
| --- | --- |
| `config.ts` | Reads `VITE_HA_URL` / `VITE_HA_TOKEN` or a runtime-stored config (`localStorage` key `hass-config-v1`), validates and normalizes the URL |
| `client.ts` | REST (`/api/states`, `/api/services/…`) + WebSocket client with auth, reconnect + backoff, and event subscription |
| `bridge.ts` | Bidirectional sync: HA states → local store, local device changes → HA service calls |
| `HassBridge.tsx` | Mounts the bridge; a no-op when unconfigured, renders a small status dot |

### Enabling it

1. In Home Assistant, go to your profile → **Security → Long-lived access
   tokens** and create a token.
2. Either copy `.env.example` to `.env` and set the values, **or** set them
   at runtime (stored in the browser):

```js
localStorage.setItem('hass-config-v1', JSON.stringify({
  url: 'http://192.168.1.10:8123',
  token: 'your-long-lived-token',
}))
```

3. Entity mapping lives in `services/smartHomeService.ts` and `hass/bridge.ts`:

```
light.* / cover.blinds   → light.living_room_table, … cover.living_room_blinds  (HA_ENTITY_MAP)
climate                  → climate.living_room
vacuum                   → vacuum.roomba
media                    → media_player.tv / media_player.spotify
automations              → scene.<automation id>  (scene.home, scene.night, …)
sensors                  → looked up by sensor entity ids in bridge.ts
```

### Sync behaviour

- **Outbound:** one HA service call per changed device; activating a scene
  locally sends a single `scene.turn_on` and lets HA apply the device
  changes (no per-device call storm).
- **Inbound:** HA state events update the local store; echo from the
  dashboard's own calls is suppressed so values don't loop.

Adjust the ids in `HA_ENTITY_MAP` and the climate / vacuum / scene / sensor
lookups in `bridge.ts` to match your setup.

## Running it as a wall-tablet kiosk

1. Build and serve on your LAN, e.g. `npm run build` then
   `npx serve dist -l 3000` (any static host works).
2. On the tablet, install a kiosk browser (**Fully Kiosk Browser** or
   WallPanel) and set the start URL to `http://<server-ip>:3000`.
3. Configure the kiosk browser:
   - Immersive fullscreen / kiosk mode;
   - screensaver, motion detection and screen standby **off** while
     charging;
   - **keep screen on** if the tablet is on a charging mount.
4. The layout is sized for a short landscape tablet; on taller or portrait
   screens the grid stays proportional and pages or scrolls instead.