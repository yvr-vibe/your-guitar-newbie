import type { Progression } from './catalog';

// A chord-change exercise visits each Roman-numeral chord once, in first-seen order.
// Retain the first occurrence's duration rather than accumulating a song's repeated bars.
export function distinctProgression(progression: Progression): Progression {
  const seen = new Set<string>();
  const indices = progression.roman.flatMap((roman, index) => {
    if (seen.has(roman)) return [];
    seen.add(roman);
    return [index];
  });
  return {
    ...progression,
    roman: indices.map((i) => progression.roman[i]),
    bars: indices.map((i) => progression.bars[i]),
  };
}

export function chordBeat(durations: number[], chord: number, beat: number) {
  const duration = durations[chord];
  const start = durations.slice(0, chord).reduce((a, b) => a + b, 0);
  const local = Math.max(0, beat - start);
  return {
    current: Math.min(duration, Math.floor(local) + 1),
    total: duration,
    dot: Math.floor(local),
  };
}

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

// Sorting a copy preserves the catalog and the order within each difficulty.
export function sortByDifficulty(items: readonly Progression[]): Progression[] {
  return [...items].sort(
    (a, b) => DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty),
  );
}
