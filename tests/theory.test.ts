import test from 'node:test';
import assert from 'node:assert/strict';
import { progressions } from '../src/catalog';
import { THEORY_LESSONS, THEORY_CONCEPTS, theoryPosition, theoryReference } from '../src/theory';

test('every progression has its own explanation and valid arrangement-specific labels', () => {
  assert.deepEqual(Object.keys(THEORY_LESSONS).sort(), progressions.map((p) => p.id).sort());
  assert.equal(
    new Set(Object.values(THEORY_LESSONS).map((l) => l.explanation)).size,
    progressions.length,
  );
  for (const p of progressions) {
    const lesson = THEORY_LESSONS[p.id];
    assert.ok(lesson.explanation.length > 60 && lesson.listen.length > 20, p.id);
    assert.ok(lesson.focus.length > 0 && lesson.focus.length <= 4, p.id);
    for (const focus of lesson.focus) {
      assert.ok(
        Number.isInteger(focus.index) && focus.index >= 0 && focus.index < p.roman.length,
        `${p.id}: invalid card ${focus.index}`,
      );
      assert.ok(THEORY_CONCEPTS[focus.concept], p.id);
      assert.ok(focus.note.trim().length > 0, p.id);
    }
    assert.equal(
      new Set(lesson.focus.map((f) => `${f.index}-${f.concept}`)).size,
      lesson.focus.length,
      p.id,
    );
    assert.equal(new URL(theoryReference(p)).protocol, 'https:', p.id);
  }
});

test('blues labels distinguish quick changes, resolved endings, and actual turnarounds', () => {
  const quick = THEORY_LESSONS['blues-5'];
  assert.deepEqual(
    quick.focus.map((f) => [f.index, f.concept]),
    [
      [1, 'quick'],
      [10, 'resolution'],
    ],
  );
  assert.equal(progressions.find((p) => p.id === 'blues-5')!.roman[1], 'IV7');
  assert.equal(progressions.find((p) => p.id === 'blues-5')!.roman[10], 'I7');
  assert.ok(!quick.focus.some((f) => f.concept === 'turnaround'));
  assert.ok(!THEORY_LESSONS['blues-3'].focus.some((f) => f.concept === 'turnaround'));
  assert.deepEqual(THEORY_LESSONS['blues-1'].focus.at(-1), {
    index: 11,
    concept: 'turnaround',
    note: 'V7 in bar 12 points back to the opening I7.',
  });
});

test('theory positions follow half-bar cards and changed practice durations', () => {
  const p = progressions.find((p) => p.id === 'blues-12')!;
  const durations = p.bars.map((b) => b * 4);
  assert.equal(theoryPosition(durations, 4, 11), 'Bar 11, beat 3');
  assert.equal(theoryPosition(durations, 4, 13), 'Bar 12, beat 3');
  assert.equal(theoryPosition([6, 6, 6], 4, 1), 'Bar 2, beat 3');
  assert.equal(theoryPosition([8, 4], 4, 0), 'Bars 1–2');
});

test('descriptive names do not create unsupported suspension or dominant labels', () => {
  assert.ok(!THEORY_LESSONS['pop-8'].focus.some((f) => f.concept === 'suspension'));
  assert.ok(!THEORY_LESSONS['neosoul-18'].focus.some((f) => f.concept === 'suspension'));
  assert.ok(!THEORY_LESSONS['pop-9'].focus.some((f) => f.concept === 'secondary'));
  assert.ok(THEORY_LESSONS['neosoul-12'].focus.some((f) => f.concept === 'chromatic'));
});
