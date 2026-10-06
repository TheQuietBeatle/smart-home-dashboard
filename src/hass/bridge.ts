import type { HassConfig, HassEntity } from './client'
import { callService } from './client'
import { HA_ENTITY_MAP } from '../services/smartHomeService'
import type {
  ClimateMode,
  DeviceId,
  FanSpeed,
  SmartHomeState,
} from '../types'

function asNumber(value: unknown, fallback: number): number {
  const n = typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : NaN
  return Number.isFinite(n) ? n : fallback
}

function asNumberPercent(value: unknown, fallback: number): number {
  const n = asNumber(value, fallback)
  return Math.min(100, Math.max(0, n))
}

function findEntity(index: Map<string, HassEntity>, ids: string[]): HassEntity | null {
  for (const id of ids) {
    const hit = index.get(id)
    if (hit) return hit
  }
  return null
}

function findEntityBy(
  index: Map<string, HassEntity>,
  domain: string,
  keywords: string[],
): HassEntity | null {
  for (const entity of index.values()) {
    if (!entity.entity_id.startsWith(`${domain}.`)) continue
    const lower = entity.entity_id.toLowerCase()
    if (keywords.every((k) => lower.includes(k))) return entity
  }
  return null
}

const SCENE_IDS = [
  'home',
  'night',
  'away',
  'dinner',
  'movie',
  'sleep',
] as const

export function hydrateFromHa(
  base: SmartHomeState,
  entities: HassEntity[],
): SmartHomeState {
  const index = new Map<string, HassEntity>(entities.map((e) => [e.entity_id, e]))
  const lights = { ...base.lights }

  for (const id of Object.keys(HA_ENTITY_MAP) as DeviceId[]) {
    const entity = index.get(HA_ENTITY_MAP[id])
    if (!entity) continue
    if (id.startsWith('cover.')) {
      lights[id] = entity.state === 'open' || entity.state === 'opening'
    } else {
      lights[id] = entity.state === 'on'
    }
  }

  const climateEntity = findEntityBy(index, 'climate', [])
  const climate = { ...base.climate }
  if (climateEntity) {
    climate.power = ['auto', 'cool', 'heat', 'dry', 'fan_only'].includes(
      climateEntity.state,
    )
    climate.targetTemp = asNumber(
      climateEntity.attributes.temperature,
      climate.targetTemp,
    )
    climate.currentTemp = asNumber(
      climateEntity.attributes.current_temperature,
      climate.currentTemp,
    )
    const hvac = String(climateEntity.state)
    if (hvac !== 'off') climate.mode = toClimateMode(hvac)
    const fanMode = String(climateEntity.attributes.fan_mode ?? '')
    if (fanMode) climate.fan = toFanSpeed(fanMode)
  }

  const media = { ...base.media }
  const tvEntity = index.get('media_player.tv')
  if (tvEntity) {
    media.tvOn = tvEntity.state === 'on' || tvEntity.state === 'playing'
    media.tvInput = String(tvEntity.attributes.source ?? media.tvInput)
    media.channel = Math.round(
      asNumber(tvEntity.attributes.channel, media.channel),
    )
  }
  const audioEntity =
    findEntityBy(index, 'media_player', ['spotify']) ??
    findEntityBy(index, 'media_player_speaker', []) ??
    null
  if (audioEntity) {
    media.playing = audioEntity.state === 'playing'
    media.volume = Math.round(
      asNumberPercent(audioEntity.attributes.volume_level, media.volume / 100) * 100,
    )
  }

  const vacuum = { ...base.vacuum }
  const vacuumEntity = findEntityBy(index, 'vacuum', [])
  if (vacuumEntity) {
    vacuum.docked =
      vacuumEntity.state === 'docked' || vacuumEntity.state === 'returning'
    vacuum.battery = asNumberPercent(
      vacuumEntity.attributes.battery_level,
      vacuum.battery,
    )
    vacuum.status =
      vacuumEntity.state === 'cleaning' ? 'Cleaning' : vacuum.docked ? 'Docked' : 'Charging'
  }

  const sensors = { ...base.sensors }
  const indoorTemp = findEntityBy(index, 'sensor', ['temperature', 'living'])
  const indoorHumidity = findEntityBy(index, 'sensor', ['humidity', 'living'])
  const outdoorTemp = findEntityBy(index, 'sensor', ['temperature', 'outdoor'])
  const outdoorHumidity = findEntityBy(index, 'sensor', ['humidity', 'outdoor'])
  const energy = findEntityBy(index, 'sensor', ['power'])
  if (indoorTemp) sensors.indoorTemp = asNumber(indoorTemp.state, sensors.indoorTemp)
  if (indoorHumidity)
    sensors.indoorHumidity = asNumberPercent(indoorHumidity.state, sensors.indoorHumidity)
  if (outdoorTemp)
    sensors.outdoorTemp = asNumber(outdoorTemp.state, sensors.outdoorTemp)
  if (outdoorHumidity)
    sensors.outdoorHumidity = asNumberPercent(
      outdoorHumidity.state,
      sensors.outdoorHumidity,
    )
  if (energy) sensors.energy = asNumber(energy.state, sensors.energy)

  let activeScene: string | null = base.activeScene
  const automations = base.automations.map((a) => {
    const scene = index.get(`scene.${a.id}`)
    const on = scene ? scene.state === 'on' || scene.state === 'scenes' : false
    if (on) activeScene = a.id
    return { ...a, active: a.id === activeScene }
  })

  return {
    ...base,
    lights,
    climate,
    media,
    vacuum,
    sensors,
    automations,
    activeScene,
  }
}

export function applyEntity(
  base: SmartHomeState,
  entity: HassEntity,
): SmartHomeState {
  const hydrated = hydrateFromHa(base, [entity])
  const changed =
    JSON.stringify(hydrated.lights) !== JSON.stringify(base.lights) ||
    JSON.stringify(hydrated.climate) !== JSON.stringify(base.climate) ||
    JSON.stringify(hydrated.media) !== JSON.stringify(base.media) ||
    JSON.stringify(hydrated.vacuum) !== JSON.stringify(base.vacuum) ||
    JSON.stringify(hydrated.sensors) !== JSON.stringify(base.sensors)

  if (!changed) return base
  return hydrated
}

function toClimateMode(raw: string): ClimateMode {
  switch (raw) {
    case 'cool':
      return 'cool'
    case 'heat':
      return 'heat'
    case 'heat_cool':
    case 'auto':
      return 'auto'
    case 'dry':
      return 'dry'
    case 'fan_only':
      return 'fan'
    default:
      return 'auto'
  }
}

function toFanSpeed(raw: string): FanSpeed {
  const lower = raw.toLowerCase()
  if (lower.includes('quiet') || lower.includes('low')) return 'low'
  if (lower.includes('medium')) return 'medium'
  if (lower.includes('high') || lower.includes('power')) return 'high'
  return 'auto'
}

function entityDomain(entityId: string): string {
  return entityId.split('.')[0] ?? ''
}

export function syncDiff(
  cfg: HassConfig,
  prev: SmartHomeState,
  next: SmartHomeState,
): void {
  if (next.activeScene !== prev.activeScene && next.activeScene) {
    void callService(cfg, 'scene', 'turn_on', {
      entity_id: `scene.${next.activeScene}`,
    }).catch(noop)
    return
  }

  for (const id of Object.keys(HA_ENTITY_MAP) as DeviceId[]) {
    if (prev.lights[id] === next.lights[id]) continue
    const entityId = HA_ENTITY_MAP[id]
    const domain = entityDomain(entityId)
    if (domain === 'cover') {
      void callService(cfg, 'cover', next.lights[id] ? 'open_cover' : 'close_cover', {
        entity_id: entityId,
      }).catch(noop)
    } else {
      void callService(cfg, domain, next.lights[id] ? 'turn_on' : 'turn_off', {
        entity_id: entityId,
      }).catch(noop)
    }
  }

  const pc = prev.climate
  const nc = next.climate
  if (nc.targetTemp !== pc.targetTemp) {
    void callService(cfg, 'climate', 'set_temperature', {
      entity_id: 'climate.living_room',
      temperature: nc.targetTemp,
    }).catch(noop)
  }
  if (nc.power !== pc.power) {
    void callService(cfg, 'climate', nc.power ? 'turn_on' : 'turn_off', {
      entity_id: 'climate.living_room',
    }).catch(noop)
  }
  if (nc.mode !== pc.mode) {
    void callService(cfg, 'climate', 'set_hvac_mode', {
      entity_id: 'climate.living_room',
      hvac_mode: toHaMode(nc.mode),
    }).catch(noop)
  }
  if (nc.fan !== pc.fan) {
    void callService(cfg, 'climate', 'set_fan_mode', {
      entity_id: 'climate.living_room',
      fan_mode: nc.fan,
    }).catch(noop)
  }

  const pm = prev.media
  const nm = next.media
  if (nm.tvOn !== pm.tvOn) {
    void callService(cfg, 'media_player', nm.tvOn ? 'turn_on' : 'turn_off', {
      entity_id: 'media_player.tv',
    }).catch(noop)
  }
  if (nm.volume !== pm.volume) {
    void callService(cfg, 'media_player', 'volume_set', {
      entity_id: mediaSpeakerId(nm.source),
      volume_level: nm.volume / 100,
    }).catch(noop)
  }
  if (nm.playing !== pm.playing && nm.source !== 'tv') {
    void callService(cfg, 'media_player', nm.playing ? 'media_play' : 'media_pause', {
      entity_id: mediaSpeakerId(nm.source),
    }).catch(noop)
  }

  if (next.vacuum.docked !== prev.vacuum.docked) {
    const entityId = findVacuumEntity(cfg)
    if (entityId) {
      void callService(cfg, 'vacuum', next.vacuum.docked ? 'return_to_base' : 'start', {
        entity_id: entityId,
      }).catch(noop)
    }
  }
}

function findVacuumEntity(cfg: HassConfig): string {
  return 'vacuum.roomba'
}

function mediaSpeakerId(source: string): string {
  switch (source) {
    case 'pc':
      return 'media_player.pc'
    case 'tv':
      return 'media_player.tv'
    case 'usb':
      return 'media_player.usb'
    case 'mix':
      return 'media_player.mix'
    default:
      return 'media_player.spotify'
  }
}

function toHaMode(mode: ClimateMode): string {
  switch (mode) {
    case 'cool':
      return 'cool'
    case 'heat':
      return 'heat'
    case 'auto':
      return 'auto'
    case 'dry':
      return 'dry'
    case 'fan':
      return 'fan_only'
  }
}

function noop(): void {}

void toIds