import type {
  ClimateMode,
  ClimateState,
  DeviceId,
  FanSpeed,
  MediaState,
  SmartHomeState,
} from '../types'
import { TRACKS } from '../data/mockData'

export const HA_ENTITY_MAP: Record<DeviceId, string> = {
  'light.table': 'light.living_room_table',
  'light.sofa': 'light.living_room_sofa',
  'light.bed': 'light.bedroom',
  'light.tvled': 'light.tv_led',
  'light.lamp': 'light.lampada',
  'light.kitchen_led': 'light.kitchen_led',
  'light.kitchen': 'light.kitchen',
  'light.warm': 'light.warm_white',
  'light.wall': 'light.wall',
  'light.floor': 'light.floor',
  'cover.blinds': 'cover.living_room_blinds',
}

export const HA_CLIMATE_ENTITY = 'climate.living_room'
export const HA_MEDIA_ENTITIES: Record<string, string> = {
  tv: 'media_player.tv',
  spotify: 'media_player.spotify',
}
export const HA_VACUUM_ENTITY = 'vacuum.roomba'

export function toggleLight(state: SmartHomeState, id: DeviceId): SmartHomeState {
  return {
    ...state,
    lights: { ...state.lights, [id]: !state.lights[id] },
  }
}

export function toggleBlind(state: SmartHomeState): SmartHomeState {
  return {
    ...state,
    lights: { ...state.lights, 'cover.blinds': !state.lights['cover.blinds'] },
  }
}

export function setBlindOpen(
  state: SmartHomeState,
  open: boolean,
): SmartHomeState {
  return { ...state, lights: { ...state.lights, 'cover.blinds': open } }
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function setClimateTemperature(
  state: SmartHomeState,
  delta: number,
): SmartHomeState {
  return withClimate(state, (c) => ({
    ...c,
    targetTemp: Math.round(clamp(c.targetTemp + delta, 16, 30) * 2) / 2,
  }))
}

export function setClimatePower(state: SmartHomeState): SmartHomeState {
  return withClimate(state, (c) => ({ ...c, power: !c.power }))
}

export function setClimateMode(
  state: SmartHomeState,
  mode: ClimateMode,
): SmartHomeState {
  return withClimate(state, (c) => ({ ...c, mode, power: true }))
}

export function cycleFanSpeed(state: SmartHomeState): SmartHomeState {
  const order: FanSpeed[] = ['auto', 'low', 'medium', 'high']
  return withClimate(state, (c) => ({
    ...c,
    fan: order[(order.indexOf(c.fan) + 1) % order.length],
  }))
}

function withClimate(
  state: SmartHomeState,
  fn: (c: ClimateState) => ClimateState,
): SmartHomeState {
  return { ...state, climate: fn(state.climate) }
}

export function setMediaSource(
  state: SmartHomeState,
  source: MediaState['source'],
): SmartHomeState {
  return {
    ...state,
    media: { ...state.media, source, tvOn: source === 'tv' },
  }
}

export function playMedia(state: SmartHomeState): SmartHomeState {
  return { ...state, media: { ...state.media, playing: true } }
}

export function pauseMedia(state: SmartHomeState): SmartHomeState {
  return { ...state, media: { ...state.media, playing: false } }
}

export function toggleEcho(state: SmartHomeState): SmartHomeState {
  return {
    ...state,
    media: { ...state.media, echoPlaying: !state.media.echoPlaying },
  }
}

export function toggleStatusCard(
  state: SmartHomeState,
  id: string,
): SmartHomeState {
  return {
    ...state,
    statusCards: state.statusCards.map((c) =>
      c.id === id ? { ...c, active: !c.active } : c,
    ),
  }
}

export function togglePlay(state: SmartHomeState): SmartHomeState {
  return { ...state, media: { ...state.media, playing: !state.media.playing } }
}

export function nextTrack(state: SmartHomeState): SmartHomeState {
  return {
    ...state,
    media: {
      ...state.media,
      trackIndex: (state.media.trackIndex + 1) % TRACKS.length,
      playing: true,
    },
  }
}

export function previousTrack(state: SmartHomeState): SmartHomeState {
  return {
    ...state,
    media: {
      ...state.media,
      trackIndex:
        (state.media.trackIndex - 1 + TRACKS.length) % TRACKS.length,
      playing: true,
    },
  }
}

export function setVolume(state: SmartHomeState, volume: number): SmartHomeState {
  return {
    ...state,
    media: { ...state.media, volume: clamp(Math.round(volume), 0, 100) },
  }
}

export function toggleTv(state: SmartHomeState): SmartHomeState {
  return { ...state, media: { ...state.media, tvOn: !state.media.tvOn } }
}

export function cycleTvInput(state: SmartHomeState): SmartHomeState {
  const inputs = ['HDMI 1', 'HDMI 2', 'Antenna', 'Netflix']
  const i = inputs.indexOf(state.media.tvInput)
  return {
    ...state,
    media: { ...state.media, tvInput: inputs[(i + 1) % inputs.length] },
  }
}

export function changeChannel(
  state: SmartHomeState,
  delta: number,
): SmartHomeState {
  return {
    ...state,
    media: {
      ...state.media,
      channel: clamp(state.media.channel + delta, 1, 99),
      tvOn: true,
    },
  }
}

export function toggleVacuum(state: SmartHomeState): SmartHomeState {
  const cleaning = !state.vacuum.docked
  return {
    ...state,
    vacuum: cleaning
      ? { docked: false, battery: state.vacuum.battery, status: 'Cleaning' }
      : { docked: true, battery: state.vacuum.battery, status: 'Docked' },
  }
}

export function returnVacuumToBase(state: SmartHomeState): SmartHomeState {
  return {
    ...state,
    vacuum: { ...state.vacuum, docked: true, status: 'Docked' },
  }
}

type Scene = 'home' | 'night' | 'away' | 'dinner' | 'movie' | 'sleep'

const SCENE_EFFECTS: Record<
  Scene,
  (state: SmartHomeState) => SmartHomeState
> = {
  home: (s) => ({
    ...s,
    lights: {
      ...s.lights,
      'light.table': true,
      'light.sofa': true,
      'light.lamp': true,
      'light.tvled': true,
      'light.kitchen': false,
      'light.bed': false,
      'light.warm': false,
      'light.wall': false,
      'light.floor': false,
      'cover.blinds': true,
    },
    climate: { ...s.climate, power: true, targetTemp: 20.5, mode: 'auto' },
    media: { ...s.media, tvOn: false, playing: false },
  }),
  night: (s) => ({
    ...s,
    lights: {
      ...s.lights,
      'light.table': false,
      'light.sofa': false,
      'light.lamp': false,
      'light.tvled': false,
      'light.kitchen': false,
      'light.kitchen_led': false,
      'light.wall': true,
      'light.warm': true,
      'light.bed': false,
      'cover.blinds': false,
    },
    climate: { ...s.climate, power: true, targetTemp: 18, mode: 'heat' },
    media: { ...s.media, tvOn: false, playing: false, source: 'pc' },
  }),
  away: (s) => ({
    ...s,
    lights: Object.fromEntries(
      Object.keys(s.lights).map((k) => [k, false]),
    ) as SmartHomeState['lights'],
    climate: { ...s.climate, power: false },
    media: { ...s.media, tvOn: false, playing: false },
    vacuum: { ...s.vacuum, docked: false, status: 'Cleaning' },
  }),
  dinner: (s) => ({
    ...s,
    lights: {
      ...s.lights,
      'light.kitchen': true,
      'light.kitchen_led': true,
      'light.table': true,
      'light.warm': true,
      'light.sofa': false,
      'light.tvled': false,
      'light.bed': false,
      'light.wall': false,
      'light.floor': false,
      'cover.blinds': true,
    },
    climate: { ...s.climate, power: true, targetTemp: 21 },
    media: { ...s.media, tvOn: false, playing: true, source: 'pc' },
  }),
  movie: (s) => ({
    ...s,
    lights: {
      ...s.lights,
      'light.table': false,
      'light.sofa': false,
      'light.lamp': false,
      'light.kitchen': false,
      'light.kitchen_led': false,
      'light.warm': false,
      'light.wall': false,
      'light.floor': false,
      'light.bed': false,
      'light.tvled': true,
      'cover.blinds': false,
    },
    climate: { ...s.climate, power: true, targetTemp: 20, mode: 'cool' },
    media: {
      ...s.media,
      tvOn: true,
      playing: true,
      source: 'tv',
      volume: 30,
    },
  }),
  sleep: (s) => ({
    ...s,
    lights: Object.fromEntries(
      Object.keys(s.lights).map((k) => [k, false]),
    ) as SmartHomeState['lights'],
    climate: { ...s.climate, power: true, targetTemp: 17, mode: 'auto', fan: 'low' },
    media: { ...s.media, tvOn: false, playing: false },
    vacuum: { ...s.vacuum, docked: true, status: 'Docked' },
  }),
}

export function activateAutomation(
  state: SmartHomeState,
  id: string,
): SmartHomeState {
  const effect = SCENE_EFFECTS[id as Scene]
  const next = effect ? effect(state) : state
  return {
    ...next,
    activeScene: id,
    automations: next.automations.map((a) => ({
      ...a,
      active: a.id === id,
    })),
  }
}
