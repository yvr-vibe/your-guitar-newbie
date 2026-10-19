import test from 'node:test';
import assert from 'node:assert/strict';
import { metronomeClick, resolveClickPattern, type ClickPattern } from '../src/metronome';

const frequencies = (pattern: ClickPattern, meter = 4) =>
  Array.from(
    { length: meter },
    (_, beat) => metronomeClick(pattern, meter, 'Blues', beat)?.frequency ?? null,
  );

test('metronome patterns distinguish straight accents, backbeat accents, and backbeat-only practice', () => {
  assert.deepEqual(frequencies('even'), [800, 800, 800, 800]);
  assert.deepEqual(frequencies('first'), [1200, 800, 800, 800]);
  assert.deepEqual(frequencies('one-three'), [1200, 800, 1200, 800]);
  assert.deepEqual(frequencies('two-four'), [800, 1200, 800, 1200]);
  assert.deepEqual(frequencies('backbeat-only'), [null, 1200, null, 1200]);
  assert.deepEqual(frequencies('auto'), frequencies('two-four'));
});
test('genre defaults and triple meter remain valid without overriding a chosen pattern', () => {
  assert.equal(resolveClickPattern('auto', 4, 'Blues'), 'two-four');
  assert.equal(resolveClickPattern('auto', 4, 'Pop'), 'first');
  assert.equal(resolveClickPattern('first', 4, 'Blues'), 'first');
  assert.equal(resolveClickPattern('auto', 3, 'Blues'), 'first');
  assert.deepEqual(frequencies('backbeat-only', 3), [1200, 800, 800]);
});
test('count-in remains audible on every beat and backbeat follows the bar across chord boundaries', () => {
  assert.deepEqual(
    [-4, -3, -2, -1].map(
      (beat) => metronomeClick('backbeat-only', 4, 'Blues', beat, true)?.frequency,
    ),
    [1200, 800, 800, 800],
  );
  assert.equal(
    metronomeClick('two-four', 4, 'Blues', 6)?.frequency,
    800,
    'a six-beat chord boundary is bar beat 3',
  );
  assert.equal(
    metronomeClick('two-four', 4, 'Blues', 7)?.frequency,
    1200,
    'bar beat 4 stays accented',
  );
});
