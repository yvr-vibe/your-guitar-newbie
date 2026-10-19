import { progressions } from './catalog';
import { KEYS } from './music';
import { CLICK_PATTERNS, requiresFourBeatMeter, type ClickPattern } from './metronome';

export type Settings = {
  key: string;
  bpm: number;
  clickPattern: ClickPattern;
  meter: number;
  beats: string;
  subdivision: boolean;
  swing: boolean;
  click: boolean;
  accompaniment: boolean;
  volume: number;
  countIn: boolean;
  simplified: boolean;
  showDiagrams: boolean;
  showTheoryLabels: boolean;
  loops: number;
  randomKey: boolean;
};
export const DEFAULT_SETTINGS: Settings = {
  key: 'C',
  bpm: 90,
  clickPattern: 'auto',
  meter: 4,
  beats: 'original',
  subdivision: false,
  swing: false,
  click: true,
  accompaniment: false,
  volume: 0.65,
  countIn: true,
  simplified: false,
  showDiagrams: false,
  showTheoryLabels: true,
  loops: 2,
  randomKey: false,
};
export function loadSaved(): { settings: Settings; favorites: string[]; selected: string } {
  try {
    const saved = JSON.parse(localStorage.getItem('fret-practice-v1') || '{}');
    const raw = { ...DEFAULT_SETTINGS, ...saved.settings };
    const meter = [3, 4].includes(raw.meter) ? raw.meter : DEFAULT_SETTINGS.meter;
    const clickPattern: ClickPattern = CLICK_PATTERNS.includes(raw.clickPattern)
      ? raw.clickPattern
      : DEFAULT_SETTINGS.clickPattern;
    const settings: Settings = {
      ...DEFAULT_SETTINGS,
      key: KEYS.includes(raw.key) ? raw.key : DEFAULT_SETTINGS.key,
      bpm: Number.isFinite(raw.bpm)
        ? Math.max(40, Math.min(240, Math.round(raw.bpm)))
        : DEFAULT_SETTINGS.bpm,
      clickPattern: meter !== 4 && requiresFourBeatMeter(clickPattern) ? 'first' : clickPattern,
      meter,
      beats: ['original', '1', '2', '4', '6', '8'].includes(raw.beats) ? raw.beats : 'original',
      loops: [1, 2, 4, 8].includes(raw.loops) ? raw.loops : 2,
      volume: Number.isFinite(raw.volume)
        ? Math.max(0, Math.min(1, raw.volume))
        : DEFAULT_SETTINGS.volume,
      ...Object.fromEntries(
        [
          'subdivision',
          'swing',
          'click',
          'accompaniment',
          'countIn',
          'simplified',
          'showDiagrams',
          'showTheoryLabels',
          'randomKey',
        ].map((k) => [
          k,
          typeof raw[k] === 'boolean' ? raw[k] : DEFAULT_SETTINGS[k as keyof Settings],
        ]),
      ),
    };
    return {
      settings,
      favorites: Array.isArray(saved.favorites)
        ? saved.favorites.filter(
            (id: unknown) => typeof id === 'string' && progressions.some((p) => p.id === id),
          )
        : [],
      selected: saved.selected || 'pop-1',
    };
  } catch {
    return { settings: DEFAULT_SETTINGS, favorites: [], selected: 'pop-1' };
  }
}

export type SettingsChange = <K extends keyof Settings>(
  key: K,
  value: Settings[K],
  reset?: boolean,
) => void;
