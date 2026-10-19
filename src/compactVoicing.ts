import type { Chord, Voicing, VoicingMode } from './music';

const tuning = [40, 45, 50, 55, 59, 64];
const cache = new Map<string, Voicing>();

// Triads use the top three strings; shells keep the root on a bass string.
export function compactVoicing(chord: Chord, mode: Exclude<VoicingMode, 'basic'>): Voicing | null {
  const key = `${chord.root}-${chord.quality}-${mode}`;
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
  const tones = shell ? [0, third, shellTop!] : [0, third, fifth];
  const sets = shell
    ? [
        [0, 2, 3],
        [1, 2, 3],
        [1, 3, 4],
      ]
    : [[3, 4, 5]];
  let best: { frets: (number | null)[]; score: number } | null = null;
  for (const strings of sets) {
    const candidates = strings.map((s, index) =>
      Array.from({ length: 16 }, (_, f) => f).filter((f) => {
        const tone = (tuning[s] + f - chord.root + 120) % 12;
        return shell && index === 0 ? tone === 0 : tones.includes(tone);
      }),
    );
    for (const a of candidates[0])
      for (const b of candidates[1])
        for (const c of candidates[2]) {
          const frets = [a, b, c];
          if (
            shell &&
            (tuning[strings[0]] + a >= tuning[strings[1]] + b ||
              tuning[strings[0]] + a >= tuning[strings[2]] + c)
          )
            continue;
          const pitches = frets.map((f, i) => (tuning[strings[i]] + f) % 12);
          if (new Set(pitches).size !== 3) continue;
          const pressed = frets.filter((f) => f > 0);
          const span = pressed.length ? Math.max(...pressed) - Math.min(...pressed) : 0;
          if (span > 3) continue;
          const score = span * 3 + Math.max(...frets);
          if (!best || score < best.score) {
            const full: (number | null)[] = Array(6).fill(null);
            strings.forEach((s, i) => {
              full[s] = frets[i];
            });
            best = { frets: full, score };
          }
        }
  }
  if (!best) throw new Error(`No ${mode} shape for ${chord.name}`);
  const pressed = best.frets.filter((f): f is number => f !== null && f > 0);
  const omitted = intervals.some((n) => !tones.includes(n));
  const result: Voicing = {
    frets: best.frets,
    start: pressed.length ? Math.max(1, Math.min(...pressed)) : 1,
    label: shell ? 'Shell' : 'Triad',
    description: shell
      ? `Shell · root, 3rd, ${seventh === null ? '6th' : '7th'}${omitted ? ' · other tones omitted' : ''}`
      : `${mode === 'shell' ? 'Triad fallback · no 6th/7th' : 'Triad'}${omitted ? ' · 7th/extensions omitted' : ''}`,
  };
  cache.set(key, result);
  return result;
}
