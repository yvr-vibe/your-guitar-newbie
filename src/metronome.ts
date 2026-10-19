import type { Genre } from './catalog';

export const CLICK_PATTERNS = [
  'auto',
  'even',
  'first',
  'one-three',
  'two-four',
  'backbeat-only',
] as const;
export type ClickPattern = (typeof CLICK_PATTERNS)[number];
export type ResolvedClickPattern = Exclude<ClickPattern, 'auto'>;

export function requiresFourBeatMeter(pattern: ClickPattern): boolean {
  return pattern === 'one-three' || pattern === 'two-four' || pattern === 'backbeat-only';
}

export function resolveClickPattern(
  pattern: ClickPattern,
  meter: number,
  genre: Genre,
): ResolvedClickPattern {
  if (meter !== 4 && requiresFourBeatMeter(pattern)) return 'first';
  return pattern === 'auto' ? (meter === 4 && genre === 'Blues' ? 'two-four' : 'first') : pattern;
}

// beat is the zero-based beat within the complete loop, not within a chord.
// The bar position also works for negative count-in cursors.
export function metronomeClick(
  pattern: ClickPattern,
  meter: number,
  genre: Genre,
  beat: number,
  countIn = false,
): { frequency: number; level: number } | null {
  const resolved = countIn ? 'first' : resolveClickPattern(pattern, meter, genre);
  const position = ((beat % meter) + meter) % meter;
  const backbeat = position === 1 || position === 3;
  if (resolved === 'backbeat-only' && !backbeat) return null;
  const accent =
    resolved === 'first'
      ? position === 0
      : resolved === 'one-three'
        ? position === 0 || position === 2
        : resolved === 'two-four' || resolved === 'backbeat-only'
          ? backbeat
          : false;
  return { frequency: accent ? 1200 : 800, level: accent ? 0.3 : 0.18 };
}
