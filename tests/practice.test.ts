import test from 'node:test';
import assert from 'node:assert/strict';
import { progressions } from '../src/catalog';
import { distinctProgression, chordBeat, sortByDifficulty, DIFFICULTIES } from '../src/practice';

test('compact previews preserve first-seen chords without mutating full playback forms', () => {
  const blues = progressions.find((p) => p.id === 'blues-1')!;
  assert.equal(blues.roman.length, 12);
  assert.deepEqual(distinctProgression(blues).roman, ['I7', 'IV7', 'V7']);
  assert.equal(blues.roman.length, 12);
  for (const p of progressions) {
    const exercise = distinctProgression(p);
    assert.deepEqual(exercise.roman, [...new Set(p.roman)]);
    assert.deepEqual(
      exercise.bars,
      exercise.roman.map((r) => p.bars[p.roman.indexOf(r)]),
    );
  }
});
test('beat counter follows chord durations and resets at each change, including half beats', () => {
  assert.deepEqual(chordBeat([6, 2, 8], 0, 5), { current: 6, total: 6, dot: 5 });
  assert.deepEqual(chordBeat([6, 2, 8], 1, 6), { current: 1, total: 2, dot: 0 });
  assert.deepEqual(chordBeat([6, 2, 8], 2, 8), { current: 1, total: 8, dot: 0 });
  assert.deepEqual(chordBeat([1.5, 3], 0, 1), { current: 1.5, total: 1.5, dot: 1 });
  assert.deepEqual(chordBeat([1.5, 3], 1, 1.5), { current: 1, total: 3, dot: 0 });
});

test('library sorting groups difficulties stably without mutating the source list', () => {
  const source = [...progressions].reverse();
  const before = source.map((p) => p.id);
  const sorted = sortByDifficulty(source);
  assert.deepEqual(
    source.map((p) => p.id),
    before,
  );
  const ranks = sorted.map((p) => DIFFICULTIES.indexOf(p.difficulty));
  assert.deepEqual(
    ranks,
    [...ranks].sort((a, b) => a - b),
  );
  for (const level of DIFFICULTIES) {
    assert.deepEqual(
      sorted.filter((p) => p.difficulty === level).map((p) => p.id),
      source.filter((p) => p.difficulty === level).map((p) => p.id),
    );
  }
});
