import { compactVoicing } from './compactVoicing';

export const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const NATURAL = [0, 2, 4, 5, 7, 9, 11];
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const ROMANS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
export const mod = (n: number, m = 12) => ((n % m) + m) % m;
export function pitch(note: string): number {
  const index = LETTERS.indexOf(note[0]);
  if (index < 0) throw new Error(`Invalid note: ${note}`);
  return mod(
    NATURAL[index] +
      [...note.slice(1)].reduce((n, a) => n + (a === '#' ? 1 : a === 'b' ? -1 : 0), 0),
  );
}
export type Chord = {
  name: string;
  root: number;
  quality: string;
  intervals: number[];
  roman: string;
};
export const INTERVALS: Record<string, number[]> = {
  '': [0, 4, 7],
  m: [0, 3, 7],
  '5': [0, 7],
  '7': [0, 4, 7, 10],
  m7: [0, 3, 7, 10],
  maj7: [0, 4, 7, 11],
  '9': [0, 4, 7, 10, 14],
  m9: [0, 3, 7, 10, 14],
  maj9: [0, 4, 7, 11, 14],
  '13': [0, 4, 7, 10, 14, 21],
  m11: [0, 3, 7, 10, 14, 17],
  '6': [0, 4, 7, 9],
  m6: [0, 3, 7, 9],
  dim7: [0, 3, 6, 9],
  m7b5: [0, 3, 6, 10],
  '7b9': [0, 4, 7, 10, 13],
  '7#9': [0, 4, 7, 10, 15],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  mMaj7: [0, 3, 7, 11],
};
export function chordFor(roman: string, key: string): Chord {
  const match = /^([b#]?)(VII|III|VI|IV|II|V|I|vii|iii|vi|iv|ii|v|i)(.*)$/.exec(roman);
  if (!match) throw new Error(`Invalid roman numeral: ${roman}`);
  const [, accidental, numeral, suffix] = match;
  const degree = ROMANS.indexOf(numeral.toUpperCase());
  const root = mod(
    pitch(key) + MAJOR[degree] + (accidental === 'b' ? -1 : accidental === '#' ? 1 : 0),
  );
  const letterIndex = mod(LETTERS.indexOf(key[0]) + degree, 7);
  let delta = mod(root - NATURAL[letterIndex]);
  if (delta > 6) delta -= 12;
  const rootName = LETTERS[letterIndex] + (delta < 0 ? 'b'.repeat(-delta) : '#'.repeat(delta));
  const minor = numeral === numeral.toLowerCase();
  const quality =
    suffix === 'ø7'
      ? 'm7b5'
      : suffix === '°7'
        ? 'dim7'
        : minor && suffix === 'maj7'
          ? 'mMaj7'
          : minor
            ? `m${suffix}`
            : suffix;
  if (!INTERVALS[quality]) throw new Error(`Unsupported quality: ${quality}`);
  return { name: rootName + quality, root, quality, intervals: INTERVALS[quality], roman };
}
export const VOICING_MODES = ['basic', 'triad', 'shell'] as const;
export type VoicingMode = (typeof VOICING_MODES)[number];
export type Voicing = {
  frets: (number | null)[];
  start: number;
  label: string;
  description?: string;
};
const OPEN: Record<string, (number | null)[]> = {
  C: [null, 3, 2, 0, 1, 0],
  D: [null, null, 0, 2, 3, 2],
  E: [0, 2, 2, 1, 0, 0],
  G: [3, 2, 0, 0, 0, 3],
  A: [null, 0, 2, 2, 2, 0],
  Am: [null, 0, 2, 2, 1, 0],
  Dm: [null, null, 0, 2, 3, 1],
  Em: [0, 2, 2, 0, 0, 0],
  Cmaj7: [null, 3, 2, 0, 0, 0],
  Dmaj7: [null, null, 0, 2, 2, 2],
  Emaj7: [0, 2, 1, 1, 0, 0],
  Amaj7: [null, 0, 2, 1, 2, 0],
  C7: [null, 3, 2, 3, 1, 0],
  D7: [null, null, 0, 2, 1, 2],
  E7: [0, 2, 0, 1, 0, 0],
  G7: [3, 2, 0, 0, 0, 1],
  A7: [null, 0, 2, 0, 2, 0],
  B7: [null, 2, 1, 2, 0, 2],
  Am7: [null, 0, 2, 0, 1, 0],
  Dm7: [null, null, 0, 2, 1, 1],
  Em7: [0, 2, 0, 0, 0, 0],
  Asus2: [null, 0, 2, 2, 0, 0],
  Dsus2: [null, null, 0, 2, 3, 0],
  Esus4: [0, 2, 2, 2, 0, 0],
  Asus4: [null, 0, 2, 2, 3, 0],
  Dsus4: [null, null, 0, 2, 3, 3],
};
const TUNING = [40, 45, 50, 55, 59, 64];
export function voicingFor(
  chord: Chord,
  mode: VoicingMode = 'basic',
  includeExtensions = false,
): Voicing {
  if (mode !== 'basic') {
    const compact = compactVoicing(chord, mode, includeExtensions);
    if (compact) return compact;
    return { ...voicingFor(chord), description: 'Basic fallback · suspended/power chord' };
  }
  const open = OPEN[chord.name];
  let frets: (number | null)[];
  if (open) frets = open;
  else {
    let a = mod(chord.root - 9);
    if (a < 2) a += 12;
    const e = mod(chord.root - 4);
    const eShapes: Record<string, (number | null)[]> = {
      '': [e, e + 2, e + 2, e + 1, e, e],
      m: [e, e + 2, e + 2, e, e, e],
      '5': [e, e + 2, e + 2, null, null, null],
      '7': [e, e + 2, e, e + 1, e, e],
      m7: [e, e + 2, e, e, e, e],
      maj7: [e, null, e + 1, e + 1, e, null],
      sus2: [null, a, a + 2, a + 2, a, a],
      sus4: [e, e + 2, e + 2, e + 2, e, e],
      '13': [e, null, e, e + 1, e + 2, null],
      '6': [e, null, e + 2, e + 1, e + 2, null],
      m6: [e, null, e + 2, e, e + 2, null],
    };
    const aShapes: Record<string, (number | null)[]> = {
      '9': [null, a, a - 1, a, a, null],
      m9: [null, a, a - 2, a, a, null],
      maj9: [null, a, a - 1, a + 1, a, null],
      m11: [null, a, a, a, a + 1, null],
      m7b5: [null, a, a + 1, a, a + 1, null],
      dim7: [null, a, a + 1, a - 1, a + 1, null],
      '7b9': [null, a, a - 1, a, a - 1, null],
      '7#9': [null, a, a - 1, a, a + 1, null],
      mMaj7: [null, a, a + 2, a + 1, a + 1, a],
    };
    frets = aShapes[chord.quality] || eShapes[chord.quality];
    if (!frets) throw new Error(`No voicing for ${chord.name}`);
  }
  const positive = frets.filter((f): f is number => f !== null && f > 0);
  return {
    frets,
    start: open ? 1 : Math.max(1, Math.min(...positive)),
    label: open ? 'Open position' : 'Movable shape',
  };
}
export function voicingNotes(
  chord: Chord,
  mode: VoicingMode = 'basic',
  includeExtensions = false,
): number[] {
  return voicingFor(chord, mode, includeExtensions).frets.flatMap((f, i) =>
    f === null ? [] : [TUNING[i] + f],
  );
}
export function chordIndexAt(durations: number[], beat: number): number {
  let cursor = 0;
  for (let i = 0; i < durations.length; i++) {
    cursor += durations[i];
    if (beat < cursor) return i;
  }
  return durations.length - 1;
}
export class ShuffleBag {
  private remaining: string[] = [];
  private signature = '';
  pick(ids: string[], current: string, random = Math.random): string | undefined {
    const signature = [...ids].sort().join('|');
    if (signature !== this.signature) {
      this.remaining = [];
      this.signature = signature;
    }
    if (!this.remaining.length) this.remaining = ids.filter((id) => id !== current);
    let options = this.remaining.filter((id) => id !== current);
    if (!options.length) {
      // Consume the active item, then refill rather than repeating it when alternatives exist.
      this.remaining = ids.filter((id) => id !== current);
      options = this.remaining;
    }
    if (!options.length) return ids[0];
    const selected = options[Math.min(options.length - 1, Math.floor(random() * options.length))];
    this.remaining = this.remaining.filter((id) => id !== selected);
    return selected;
  }
}
