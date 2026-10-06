export type DeviceId =
  | 'light.table'
  | 'light.sofa'
  | 'light.bed'
  | 'light.tvled'
  | 'light.lamp'
  | 'light.kitchen_led'
  | 'light.kitchen'
  | 'light.warm'
  | 'light.wall'
  | 'light.floor'
  | 'cover.blinds'

export type LightState = Record<DeviceId, boolean>

export type ClimateMode = 'cool' | 'heat' | 'auto' | 'fan' | 'dry'
export type FanSpeed = 'low' | 'medium' | 'high' | 'auto'

export interface ClimateState {
  power: boolean
  targetTemp: number
  currentTemp: number
  mode: ClimateMode
  fan: FanSpeed
}

export interface ForecastDay {
  day: string
  icon: 'sun' | 'cloud' | 'moon' | 'rain' | 'partly'
  min: number
  max: number
}

export interface WeatherState {
  temp: number
  feels: number
  humidity: number
  wind: number
  condition: string
  isNight: boolean
  forecast: ForecastDay[]
}

export interface StatusCard {
  id: string
  kind: 'pill' | 'garage' | 'vehicle'
  label: string
  detail: string
  icon: 'gate' | 'led' | 'garage' | 'car'
  badge?: string
  active: boolean
}

export type MediaSource = 'tv' | 'pc' | 'mix' | 'usb'

export interface Track {
  title: string
  artist: string
  album: string
  art: string
}

export interface MediaState {
  source: MediaSource
  playing: boolean
  echoPlaying: boolean
  trackIndex: number
  volume: number
  tvOn: boolean
  tvInput: string
  channel: number
}

export interface VacuumState {
  docked: boolean
  battery: number
  status: 'Alla base' | 'In pulizia' | 'In carica'
}

export interface Automation {
  id: string
  label: string
  icon: 'home' | 'moon' | 'away' | 'dinner' | 'movie' | 'sleep'
  active: boolean
}

export interface SensorsState {
  indoorTemp: number
  indoorHumidity: number
  outdoorTemp: number
  outdoorHumidity: number
  energy: number
}

export interface SmartHomeState {
  lights: LightState
  climate: ClimateState
  weather: WeatherState
  statusCards: StatusCard[]
  media: MediaState
  vacuum: VacuumState
  automations: Automation[]
  sensors: SensorsState
  activeScene: string | null
}
