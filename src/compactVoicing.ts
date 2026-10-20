import type { Chord, Voicing, VoicingMode } from './music';

const tuning = [40, 45, 50, 55, 59, 64];
const cache = new Map<string, Voicing>();

// Triads use the top three strings; shells keep the root on a bass string.
export function compactVoicing(
  chord: Chord,
  mode: Exclude<VoicingMode, 'basic'>,
  includeExtensions = false,
): Voicing | null {
  const key = `${chord.root}-${chord.quality}-${mode}-${includeExtensions}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const intervals = chord.intervals.map((n) => n % 12);
  const third = chord.intervals.includes(3) ? 3 : chord.intervals.includes(4) ? 4 : null;
  const fifth = intervals.includes(6) ? 6 : intervals.includes(7) ? 7 : null;
  const seventh = intervals.includes(10)
    ? 10
    : intervals.includes(11)
      ? 11
      : chord.quality === 'dim7'
        ? 9
        : null;
  if (third === null || fifth === null) return null;
  const shellTop = seventh ?? (intervals.includes(9) ? 9 : null);
  const shell = mode === 'shell' && shellTop !== null;
  const core = shell ? [0, third, shellTop!] : [0, third, fifth];
  // Keep the shell intact and add the highest explicitly named extension.
  // Lower extensions and the fifth may still be omitted from a four-note shape.
  const extension =
    shell && includeExtensions ? Math.max(0, ...chord.intervals.filter((n) => n >= 12)) : 0;
  const tones = extension ? [...core, extension % 12] : core;
  const shellSets = [
    [0, 2, 3],
    [1, 2, 3],
    [1, 3, 4],
  ];
  const extendedSets = [
    [0, 2, 3, 4],
    [0, 2, 3, 5],
    [0, 2, 4, 5],
    [0, 3, 4, 5],
    [1, 2, 3, 4],
    [1, 2, 3, 5],
    [1, 2, 4, 5],
    [1, 3, 4, 5],
  ];
  let best = findShape(
    chord.root,
    tones,
    extension ? extendedSets : shell ? shellSets : [[3, 4, 5]],
    shell,
  );
  // A usable shell is preferable to an unplayable stretch. Expose this in the
  // accessible description while retaining the concise Shell card caption.
  const extensionOmitted = extension > 0 && !best;
  if (!best && extension) best = findShape(chord.root, core, shellSets, true);
  if (!best) throw new Error(`No ${mode} shape for ${chord.name}`);
  const pressed = best.frets.filter((f): f is number => f !== null && f > 0);
  const playedTones = extensionOmitted ? core : tones;
  const omitted = intervals.some((n) => !playedTones.includes(n));
  const result: Voicing = {
    frets: best.frets,
    start: pressed.length ? Math.max(1, Math.min(...pressed)) : 1,
    label: shell ? 'Shell' : 'Triad',
    description: shell
      ? `Shell · root, 3rd, ${seventh === null ? '6th' : '7th'}${extension && !extensionOmitted ? `, ${extension === 13 ? '♭9' : extension === 15 ? '♯9' : extension === 17 ? '11' : extension === 21 ? '13' : '9'}` : ''}${extensionOmitted ? ' · extension omitted: no compact fingering' : ''}${omitted ? ' · other tones omitted' : ''}`
      : `${mode === 'shell' ? 'Triad fallback · no 6th/7th' : 'Triad'}${omitted ? ' · 7th/extensions omitted' : ''}`,
  };
  cache.set(key, result);
  return result;
}

type ShapeCandidate = { frets: (number | null)[]; score: number };
function findShape(
  root: number,
  tones: number[],
  sets: number[][],
  bassRoot: boolean,
): ShapeCandidate | null {
  let best: ShapeCandidate | null = null;
  for (const strings of sets) {
    const candidates = strings.map((s, index) =>
      Array.from({ length: 18 }, (_, f) => f).filter((f) => {
        const tone = (tuning[s] + f - root + 120) % 12;
        return bassRoot && index === 0 ? tone === 0 : tones.includes(tone);
      }),
    );
    const visit = (frets: number[], pitches: number[]) => {
      const index = frets.length;
      if (index === strings.length) {
        const score = stretch(frets) * 3 + Math.max(...frets);
        if (!best || score < best.score) {
          const full: (number | null)[] = Array(6).fill(null);
          strings.forEach((s, i) => {
            full[s] = frets[i];
          });
          best = { frets: full, score };
        }
        return;
      }
      for (const fret of candidates[index]) {
        const midi = tuning[strings[index]] + fret;
        if (pitches.some((n) => n % 12 === midi % 12)) continue;
        if (bassRoot && index > 0 && midi <= pitches[0]) continue;
        const next = [...frets, fret];
        if (stretch(next) <= 3) visit(next, [...pitches, midi]);
      }
    };
    visit([], []);
  }
  return best;
}

function stretch(frets: number[]): number {
  const pressed = frets.filter((f) => f > 0);
  return pressed.length ? Math.max(...pressed) - Math.min(...pressed) : 0;
}
