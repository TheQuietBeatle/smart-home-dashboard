# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

---

## Smart Home Dashboard

A dark, dense smart-home control panel designed for a landscape wall-mounted tablet (1280×800, no scrolling). UI labels follow the original reference (Italian). Runs on mock data by default; Home Assistant can be wired in without touching the UI.

### Run

```bash
npm install
npm run dev       # dev server with HMR
npm run build     # typecheck + production build
npm run preview   # serve the production build
npm run lint      # oxlint
```

### Folder layout

```
src/
  components/   UI components (nav, status bar, shared ui) — owned by the frontend workstream
    cards/      dashboard widget cards and panels
  hass/         Home Assistant integration (config, client, bridge) — mock-safe
  hooks/        context provider + state store with localStorage persistence
  data/         mock smart-home data
  services/     pure state-transition layer + HA entity map (entity IDs to HA names)
  lib/          shared helpers
```

### Mock mode

Everything works without Home Assistant. The store in `hooks/useSmartHome.tsx` starts from `data/mockData.ts`, persists to `localStorage` (key `casa-dashboard-state-v1`), and simulates small sensor drift every few seconds.

### Connecting Home Assistant

The UI never calls HA directly. The integration lives in `src/hass/`:

| File | Purpose |
| --- | --- |
| `config.ts` | Reads `VITE_HA_URL`/`VITE_HA_TOKEN` or a runtime-stored config (`localStorage` key `hass-config-v1`), validates/normalizes the URL |
| `client.ts` | REST (`/api/states`, `/api/services/...`) + WebSocket client with auth, reconnect + backoff, event subscription |
| `bridge.ts` | Bidirectional sync: HA states → local store, local device changes → HA service calls |
| `HassBridge.tsx` | React component that mounts the bridge (no-op when unconfigured; renders a small status dot) |

To enable it:

1. Create a long-lived access token in Home Assistant → your profile → **Security → Long-lived access tokens**.
2. Either copy `.env.example` → `.env` and set the values, **or** set them at runtime (stored in the browser):

```js
localStorage.setItem('hass-config-v1', JSON.stringify({
  url: 'http://192.168.1.10:8123',
  token: 'your-token'
}))
```

3. Entity mapping used by the bridge (`services/smartHomeService.ts` → `HA_ENTITY_MAP`):

```
light.table        → light.living_room_table
light.sofa         → light.living_room_sofa
light.bed          → light.bedroom
light.tvled        → light.tv_led
light.lamp         → light.lampada
light.kitchen_led  → light.kitchen_led
light.kitchen      → light.kitchen
light.warm         → light.warm_white
light.wall         → light.wall
light.floor        → light.floor
cover.blinds       → cover.living_room_blinds
climate            → climate.living_room
vacuum             → vacuum.roomba
media player       → media_player.tv / media_player.spotify (or pc/mix/usb)
scenes             → scene.home, scene.night, scene.away, scene.dinner, scene.movie, scene.sleep
```

The outbound sync sends one Home Assistant service call per changed device, and suppresses echo from inbound WebSocket state events so values don't loop. If an automation scene is activated locally, the dashboard sends `scene.turn_on` and lets HA apply the device changes (no per-device call storm).

Adjust the entity ids under `HA_ENTITY_MAP` (and the `climate.*`, `vacuum.*`, `scene.*`, sensor lookups in `hass/bridge.ts`) to match your setup.

### Running it on the Lenovo A3500 tablet

1. Get the tablet back to factory state (button recovery: Power + Volume Up → wipe) and set it up with Wi-Fi.
2. Serve this app on your LAN: `npm run build` then `npx serve dist -l 3000` (or any static host/Nginx).
3. On the tablet, install **Fully Kiosk Browser** (or WallPanel).
4. In Fully Kiosk:
   - Set the start URL to `http://<server-ip>:3000`
   - Settings → Start screen → select **Kiosk mode** / immersive fullscreen
   - Advanced → **Screensaver** and **Motion detection** off, **Screen standby** off while charging
   - Pair with a charging mount and enable **Keep screen on**
5. Block updates and factory-reset via recovery if the tablet starts misbehaving.
