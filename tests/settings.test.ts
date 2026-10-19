import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SETTINGS, loadSaved } from '../src/settings';

test('saved accent patterns stay compatible with the restored meter', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  let saved = '';
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: () => saved },
  });
  try {
    for (const clickPattern of ['one-three', 'two-four', 'backbeat-only']) {
      saved = JSON.stringify({ settings: { meter: 3, clickPattern } });
      assert.equal(loadSaved().settings.clickPattern, 'first');
      saved = JSON.stringify({ settings: { meter: 4, clickPattern } });
      assert.equal(loadSaved().settings.clickPattern, clickPattern);
    }
    saved = JSON.stringify({ settings: { meter: 3, clickPattern: 'auto' } });
    assert.equal(loadSaved().settings.clickPattern, 'auto');
    saved = JSON.stringify({ settings: { clickPattern: 'invalid' } });
    assert.equal(loadSaved().settings.clickPattern, DEFAULT_SETTINGS.clickPattern);
    saved = '{invalid';
    assert.deepEqual(loadSaved().settings, DEFAULT_SETTINGS);
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
