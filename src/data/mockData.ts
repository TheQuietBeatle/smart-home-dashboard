import type {
  Automation,
  DeviceId,
  ForecastDay,
  SmartHomeState,
  StatusCard,
  Track,
} from '../types'

export const LIGHT_LABELS: Record<DeviceId, string> = {
  'light.table': 'Table Light',
  'light.sofa': 'Sofa Light',
  'light.bed': 'Bed',
  'light.tvled': 'LED TV',
  'light.lamp': 'Lamp',
  'light.kitchen_led': 'Kitchen LED',
  'light.kitchen': 'Kitchen Light',
  'light.warm': 'Bookcase',
  'light.wall': 'Wall',
  'light.floor': 'Floor',
  'cover.blinds': 'Blinds',
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
  { day: 'Mon', icon: 'moon', min: -2, max: 3 },
  { day: 'Tue', icon: 'sun', min: -3, max: 7 },
  { day: 'Wed', icon: 'sun', min: -3, max: 7 },
  { day: 'Thu', icon: 'partly', min: -4, max: 9 },
  { day: 'Fri', icon: 'cloud', min: -1, max: 11 },
  { day: 'Sat', icon: 'sun', min: -2, max: 11 },
]

export const STATUS_CARDS: StatusCard[] = [
  { id: 'portone', kind: 'pill', label: 'Gate', detail: '', icon: 'gate', badge: '10%', active: true },
  { id: 'cassetto', kind: 'pill', label: 'Drawer LED', detail: '', icon: 'led', active: false },
  { id: 'garage-c', kind: 'garage', label: "Clarissa's Garage", detail: '50 minutes ago', icon: 'garage', active: true },
  { id: 'garage-d', kind: 'garage', label: "Davide's Garage", detail: '50 minutes ago', icon: 'garage', active: true },
  { id: 'taigo', kind: 'vehicle', label: 'Taigo', detail: '95 km', icon: 'car', active: false },
  { id: 'q3', kind: 'vehicle', label: 'Q3', detail: '140 km', icon: 'car', active: false },
]

export const APPLIANCES = [
  { id: 'heat', label: 'Heat', value: '60.0 °C', badge: '1', active: true },
  { id: 'wash', label: 'Wash', value: '0 W', badge: 'Stop', active: false },
] as const

export const PHONE_BATTERY = 35

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
  { id: 'away', label: 'Away', icon: 'away', active: false },
  { id: 'night', label: 'Night', icon: 'moon', active: false },
  { id: 'home', label: 'Day', icon: 'home', active: true },
  { id: 'dinner', label: 'Dinner', icon: 'dinner', active: false },
  { id: 'movie', label: 'Movie', icon: 'movie', active: false },
]

export const INITIAL_STATE: SmartHomeState = {
  lights: {
    'light.table': false,
    'light.sofa': false,
    'light.bed': false,
    'light.tvled': false,
    'light.lamp': true,
    'light.kitchen_led': true,
    'light.kitchen': true,
    'light.warm': false,
    'light.wall': false,
    'light.floor': true,
    'cover.blinds': true,
  },
  climate: {
    power: false,
    targetTemp: 18.5,
    currentTemp: 30,
    mode: 'cool',
    fan: 'auto',
  },
  weather: {
    temp: 3,
    feels: 1,
    humidity: 61,
    wind: 8,
    condition: 'Clear',
    isNight: true,
    forecast: FORECAST,
  },
  statusCards: STATUS_CARDS,
  media: {
    source: 'pc',
    playing: true,
    echoPlaying: true,
    trackIndex: 0,
    volume: 42,
    tvOn: false,
    tvInput: 'HDMI 1',
    channel: 4,
  },
  vacuum: {
    docked: true,
    battery: 100,
    status: 'Docked',
  },
  automations: AUTOMATIONS,
  sensors: {
    indoorTemp: 21.4,
    indoorHumidity: 48,
    outdoorTemp: 3,
    outdoorHumidity: 61,
    energy: 1.4,
  },
  activeScene: 'home',
}
