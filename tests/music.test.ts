import test from 'node:test';
import assert from 'node:assert/strict';
import { progressions, GENRES } from '../src/catalog';
import {
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
test('all full and simple guitar shapes in all keys use only valid chord tones', () => {
  for (const p of progressions)
    for (const key of KEYS)
      for (const r of p.roman)
        for (const simple of [false, true]) {
          const chord = chordFor(r, key, simple);
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
test('simplification retains essential diminished and suspended harmony', () => {
  assert.equal(chordFor('ii9', 'C', true).name, 'Dm');
  assert.equal(chordFor('V13', 'C', true).name, 'G');
  assert.equal(chordFor('iiø7', 'C', true).name, 'Dm7b5');
  assert.equal(chordFor('Isus4', 'C', true).name, 'Csus4');
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
