import type {
  Automation,
  DeviceId,
  ForecastDay,
  SmartHomeState,
  StatusCard,
  Track,
} from '../types'

export const LIGHT_LABELS: Record<DeviceId, string> = {
  'light.table': 'Luce Tavolo',
  'light.sofa': 'Luce Divano',
  'light.bed': 'Letto',
  'light.tvled': 'LDTV',
  'light.lamp': 'Lampada',
  'light.kitchen_led': 'LED Cucina',
  'light.kitchen': 'Luce Cucina',
  'light.warm': 'Luce Calda',
  'light.wall': 'Muro',
  'light.floor': 'Piano',
  'cover.blinds': 'Tapparelle',
}

export const LIGHT_ICONS: Record<DeviceId, string> = {
  'light.table': 'lamp-desk',
  'light.sofa': 'sofa',
  'light.bed': 'bed',
  'light.tvled': 'tv',
  'light.lamp': 'lamp',
  'light.kitchen_led': 'led',
  'light.kitchen': 'cooking',
  'light.warm': 'warm',
  'light.wall': 'wall',
  'light.floor': 'floor',
  'cover.blinds': 'blinds',
}

export const FORECAST: ForecastDay[] = [
  { day: 'Mon', icon: 'sun', min: 9, max: 18 },
  { day: 'Tue', icon: 'partly', min: 10, max: 19 },
  { day: 'Wed', icon: 'cloud', min: 8, max: 15 },
  { day: 'Thu', icon: 'rain', min: 7, max: 13 },
  { day: 'Fri', icon: 'partly', min: 9, max: 17 },
  { day: 'Sat', icon: 'sun', min: 11, max: 21 },
]

export const STATUS_CARDS: StatusCard[] = [
  {
    id: 'garage',
    label: 'Garage',
    value: 'Chiuso',
    detail: 'Portone principale',
    icon: 'garage',
    active: false,
  },
  {
    id: 'gate',
    label: 'Cancello',
    value: 'Chiuso',
    detail: 'Ingresso casa',
    icon: 'gate',
    active: false,
  },
  {
    id: 'car',
    label: 'Auto',
    value: 'In garage',
    detail: '2.4 km · 78%',
    icon: 'car',
    active: true,
  },
  {
    id: 'sensor',
    label: 'Esterno',
    value: '18.2°C',
    detail: 'Umidità 64%',
    icon: 'sensor',
    active: true,
  },
]

export const TRACKS: Track[] = [
  {
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We’re Dreaming',
    art: '#1e3a8a',
  },
  {
    title: 'Instant Crush',
    artist: 'Daft Punk',
    album: 'Random Access Memories',
    art: '#334155',
  },
  {
    title: 'Weightless',
    artist: 'Marconi Union',
    album: 'Ambient Experiment',
    art: '#0f766e',
  },
  {
    title: 'Nightcall',
    artist: 'Kavinsky',
    album: 'OutRun',
    art: '#7c2d12',
  },
]

export const AUTOMATIONS: Automation[] = [
  { id: 'home', label: 'Casa', icon: 'home', active: true },
  { id: 'night', label: 'Notte', icon: 'moon', active: false },
  { id: 'away', label: 'Via', icon: 'away', active: false },
  { id: 'dinner', label: 'Cena', icon: 'dinner', active: false },
  { id: 'movie', label: 'Film', icon: 'movie', active: false },
  { id: 'sleep', label: 'Sonno', icon: 'sleep', active: false },
]

export const INITIAL_STATE: SmartHomeState = {
  lights: {
    'light.table': false,
    'light.sofa': false,
    'light.bed': false,
    'light.tvled': true,
    'light.lamp': true,
    'light.kitchen_led': false,
    'light.kitchen': false,
    'light.warm': false,
    'light.wall': false,
    'light.floor': false,
    'cover.blinds': true,
  },
  climate: {
    power: true,
    targetTemp: 18.5,
    currentTemp: 20.2,
    mode: 'cool',
    fan: 'auto',
  },
  weather: {
    temp: 18,
    feels: 17,
    humidity: 64,
    wind: 8,
    condition: 'Sereno',
    isNight: true,
    forecast: FORECAST,
  },
  statusCards: STATUS_CARDS,
  media: {
    source: 'spotify',
    playing: true,
    trackIndex: 0,
    volume: 42,
    tvOn: false,
    tvInput: 'HDMI 1',
    channel: 4,
  },
  vacuum: {
    docked: true,
    battery: 100,
    status: 'Alla base',
  },
  automations: AUTOMATIONS,
  sensors: {
    indoorTemp: 21.4,
    indoorHumidity: 48,
    outdoorTemp: 18.2,
    outdoorHumidity: 64,
    energy: 1.4,
  },
  activeScene: 'home',
}
