import test from 'node:test';
import assert from 'node:assert/strict';
import { progressions, GENRES } from '../src/catalog';
import {
  INTERVALS,
  chordFor,
  chordIndexAt,
  KEYS,
  mod,
  ShuffleBag,
  voicingFor,
  voicingNotes,
} from '../src/music';

test('catalog has 20 complete exercises in each genre, with unique identifiers', () => {
  assert.equal(progressions.length, 100);
  assert.equal(new Set(progressions.map((p) => p.id)).size, 100);
  for (const genre of GENRES)
    assert.equal(progressions.filter((p) => p.genre === genre).length, 20);
  for (const p of progressions) {
    assert.equal(p.roman.length, p.bars.length, p.id);
    assert.ok(
      p.bars.every((b) => b > 0 && Number.isInteger(b * 4)),
      p.id,
    );
    assert.ok(p.songs.length > 0, p.id);
    assert.ok(
      p.songs.every((s) => s.section && new URL(s.url).protocol === 'https:'),
      p.id,
    );
    assert.ok(new URL(p.source).hostname, p.id);
  }
});
test('transposition spells diatonic and borrowed chords correctly', () => {
  assert.deepEqual(
    ['I', 'V', 'vi', 'IV'].map((r) => chordFor(r, 'G').name),
    ['G', 'D', 'Em', 'C'],
  );
  assert.deepEqual(
    ['i', 'bVI', 'bIII', 'bVII'].map((r) => chordFor(r, 'A').name),
    ['Am', 'F', 'C', 'G'],
  );
  assert.deepEqual(
    ['ii7', 'V7', 'Imaj7'].map((r) => chordFor(r, 'Db').name),
    ['Ebm7', 'Ab7', 'Dbmaj7'],
  );
  assert.equal(chordFor('VII', 'F#').name, 'E#');
  assert.equal(chordFor('bVII7', 'F#').name, 'E7');
  assert.equal(chordFor('IV', 'B').name, 'E');
  assert.equal(chordFor('iiø7', 'C').name, 'Dm7b5');
  assert.equal(chordFor('imaj7', 'C').name, 'CmMaj7');
  assert.equal(chordFor('#IV°7', 'C').name, 'F#dim7');
});
test('basic guitar shapes in all keys use only valid chord tones', () => {
  for (const p of progressions)
    for (const key of KEYS)
      for (const r of p.roman) {
        const chord = chordFor(r, key);
        const shape = voicingFor(chord);
        const notes = voicingNotes(chord);
        const allowed = new Set(chord.intervals.map((i) => mod(chord.root + i)));
        assert.equal(shape.frets.length, 6);
        assert.ok(notes.length >= 3, `${p.id} ${chord.name}`);
        assert.ok(
          notes.every((n) => allowed.has(mod(n))),
          `${p.id} ${chord.name}: ${notes.map((n) => mod(n))} vs ${[...allowed]}`,
        );
        assert.ok(
          notes.some((n) => mod(n) === chord.root),
          `${chord.name} root`,
        );
        const fingers = shape.frets.filter((f): f is number => f !== null && f > 0);
        assert.ok(
          Math.max(...fingers) - Math.min(...fingers) <= 3,
          `${chord.name} excessive stretch`,
        );
        assert.ok(
          shape.frets.every((f) => f === null || (f >= 0 && f <= 17)),
          `${chord.name} fret bounds`,
        );
      }
});
test('chord boundaries respect half-bars and long tonic holds', () => {
  const durations = [2, 2, 8];
  assert.equal(chordIndexAt(durations, 0), 0);
  assert.equal(chordIndexAt(durations, 1), 0);
  assert.equal(chordIndexAt(durations, 2), 1);
  assert.equal(chordIndexAt(durations, 4), 2);
  assert.equal(chordIndexAt(durations, 11), 2);
  assert.equal(
    progressions.find((p) => p.id === 'blues-12')!.bars.reduce((a, b) => a + b, 0),
    12,
  );
});
test('shuffle bag avoids immediate repeats, covers eligible pool, and resets on filter changes', () => {
  const bag = new ShuffleBag();
  const ids = ['a', 'b', 'c', 'd'];
  let current = 'a';
  const seen = [];
  for (let i = 0; i < 3; i++) {
    const next = bag.pick(ids, current, () => 0)!;
    assert.notEqual(next, current);
    seen.push(next);
    current = next;
  }
  assert.equal(new Set(seen).size, 3);
  assert.deepEqual(seen, ['b', 'c', 'd']);
  const next = bag.pick(['x', 'y'], current, () => 0)!;
  assert.ok(['x', 'y'].includes(next));
  assert.equal(bag.pick(['only'], 'only'), 'only');
  assert.equal(bag.pick([], 'none'), undefined);
});

test('compact voicings cover every chord quality and key with playable, accurate tones', () => {
  const tuning = [40, 45, 50, 55, 59, 64];
  for (const [quality, intervals] of Object.entries(INTERVALS))
    for (let root = 0; root < 12; root++)
      for (const mode of ['triad', 'shell'] as const) {
        const chord = { name: `${root}${quality}`, root, quality, intervals, roman: 'I' };
        const shape = voicingFor(chord, mode);
        const notes = voicingNotes(chord, mode);
        const context = `${chord.name} ${mode}`;
        assert.ok(
          notes.every((n) => intervals.some((i) => mod(root + i) === mod(n))),
          context,
        );
        const pressed = shape.frets.filter((f): f is number => f !== null && f > 0);
        assert.ok(Math.max(...pressed) - Math.min(...pressed) <= 3, context);
        assert.ok(
          shape.frets.every((f) => f === null || (f >= 0 && f <= 17)),
          context,
        );
        assert.ok(
          pressed.every((f) => f >= shape.start && f < shape.start + 4),
          context,
        );
        if (['sus2', 'sus4', '5'].includes(quality)) {
          assert.match(shape.description!, /Basic fallback/, context);
          continue;
        }
        assert.equal(notes.length, 3, context);
        assert.equal(new Set(notes.map((n) => mod(n))).size, 3, context);
        const third = intervals.includes(3) ? 3 : 4;
        const seventh = intervals.includes(10)
          ? 10
          : intervals.includes(11)
            ? 11
            : quality === 'dim7'
              ? 9
              : null;
        const top = seventh ?? (intervals.includes(9) ? 9 : null);
        const shell = mode === 'shell' && top !== null;
        const expected = [0, third, shell ? top : intervals.includes(6) ? 6 : 7]
          .map((i) => mod(root + i!))
          .sort((a, b) => a - b);
        assert.deepEqual(
          notes.map((n) => mod(n)).sort((a, b) => a - b),
          expected,
          context,
        );
        if (shell) assert.equal(mod(Math.min(...notes)), root, context);
        else assert.deepEqual(shape.frets.slice(0, 3), [null, null, null], context);
        assert.deepEqual(
          notes,
          shape.frets.flatMap((f, i) => (f === null ? [] : [tuning[i] + f])),
        );
      }
});

test('compact voicings retain chord symbols and explain reductions and special fallbacks', () => {
  const chord = chordFor('Imaj9', 'C');
  assert.match(voicingFor(chord, 'triad').description!, /7th\/extensions omitted/);
  assert.equal(chord.name, 'Cmaj9');
  assert.match(voicingFor(chordFor('I', 'C'), 'shell').description!, /Triad fallback/);
  assert.match(voicingFor(chordFor('Isus4', 'C'), 'triad').description!, /Basic fallback/);
  assert.deepEqual(
    voicingNotes(chordFor('V7#9', 'C'), 'shell')
      .map((n) => mod(n))
      .sort((a, b) => a - b),
    [5, 7, 11],
  );
});
