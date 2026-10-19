import test from 'node:test';
import assert from 'node:assert/strict';
import { PracticeAudio, type PlaybackConfig, type Step } from '../src/audio';
import { progressions } from '../src/catalog';

test('audio transport schedules count-in, subdivisions, seamless loop changes, and pause/resume', async () => {
  let time = 0;
  let nextId = 1;
  let oscillatorStarts: number[] = [];
  let stopped = 0;
  const timers = new Map<number, () => void>();
  const frames = new Map<number, FrameRequestCallback>();
  const parameter = {
    value: 0,
    setValueAtTime() {},
    linearRampToValueAtTime() {},
    exponentialRampToValueAtTime() {},
  };
  class FakeAudioContext {
    get currentTime() {
      return time;
    }
    destination = {};
    async resume() {}
    async close() {}
    createOscillator() {
      return {
        type: 'sine',
        frequency: { ...parameter },
        connect() {},
        disconnect() {},
        start(t: number) {
          oscillatorStarts.push(t);
        },
        stop() {
          stopped++;
        },
        onended: null,
      };
    }
    createGain() {
      return { gain: { ...parameter }, connect() {}, disconnect() {} };
    }
  }
  const previous = {
    window: globalThis.window,
    AudioContext: globalThis.AudioContext,
    requestAnimationFrame: globalThis.requestAnimationFrame,
    cancelAnimationFrame: globalThis.cancelAnimationFrame,
    clearInterval: globalThis.clearInterval,
  };
  Object.assign(globalThis, {
    window: {
      setInterval: (callback: () => void) => {
        const id = nextId++;
        timers.set(id, callback);
        return id;
      },
    },
    AudioContext: FakeAudioContext,
    requestAnimationFrame: (callback: FrameRequestCallback) => {
      const id = nextId++;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame: (id: number) => frames.delete(id),
    clearInterval: (id: number) => timers.delete(id),
  });
  const advance = (seconds: number) => {
    const end = time + seconds;
    while (time < end) {
      time = Math.min(end, time + 0.01);
      for (const callback of timers.values()) callback();
      const pending = [...frames.values()];
      frames.clear();
      for (const callback of pending) callback(time * 1000);
    }
  };
  let config: PlaybackConfig = {
    progression: progressions[0],
    key: 'C',
    durations: [1, 1, 1, 1],
    bpm: 120,
    meter: 4,
    subdivision: true,
    swing: false,
    click: true,
    accompaniment: false,
    volume: 0.5,
    simplified: false,
  };
  const steps: Step[] = [];
  const second = progressions[2];
  const engine = new PracticeAudio(
    () => config,
    (s) => steps.push(s),
    (loop, c) => (loop === 0 ? { ...c, progression: second } : null),
    () => 1,
  );
  try {
    await engine.play(true);
    advance(4.15);
    assert.deepEqual(
      steps.slice(0, 4).map((s) => s.countIn),
      [1, 2, 3, 4],
    );
    assert.deepEqual(
      steps.slice(4, 8).map((s) => s.chord),
      [0, 1, 2, 3],
    );
    assert.equal(steps[8].id, second.id);
    assert.equal(steps[8].beat, 0);
    assert.equal(steps[8].loop, 1);
    for (let i = 1; i < steps.length; i++)
      assert.ok(Math.abs(steps[i].time - steps[i - 1].time - 0.5) < 1e-8, 'beat interval');
    assert.ok(
      Math.abs(oscillatorStarts[1] - oscillatorStarts[0] - 0.25) < 1e-8,
      'eighth-note subdivision',
    );
    engine.pause();
    const presented = steps.length;
    const sounds = oscillatorStarts.length;
    advance(1);
    assert.equal(steps.length, presented);
    assert.equal(oscillatorStarts.length, sounds);
    config = { ...config, progression: second, bpm: 240 };
    await engine.play(true);
    advance(1.1);
    assert.equal(steps[presented].countIn, null, 'resume must not repeat the count-in');
    assert.equal(steps[presented].beat, 1, 'resume at the next unheard beat');
    assert.ok(
      Math.abs(steps[presented + 1].time - steps[presented].time - 0.25) < 1e-8,
      'live tempo change',
    );
    assert.ok(stopped > 0, 'scheduled sounds stopped on pause');
    engine.reset();
    oscillatorStarts = [];
    config = { ...config, subdivision: true, swing: true };
    await engine.play(false);
    advance(0.2);
    assert.ok(
      Math.abs(oscillatorStarts[1] - oscillatorStarts[0] - ((60 / 240) * 2) / 3) < 1e-8,
      'swing eighth-note placement',
    );
    assert.equal(steps.at(-1)!.loop, 0, 'restart resets the loop');
    assert.equal(steps.at(-1)!.beat, 0, 'restart resets the chord cursor');
    engine.reset();
    config = { ...config, bpm: 120, meter: 3, durations: [1.5, 1.5, 1.5, 1.5] };
    const start = steps.length;
    await engine.play(false);
    advance(1.65);
    const halfBars = steps.slice(start);
    assert.equal(halfBars[3].beat, 1.5, 'half-bar boundary in 3/4');
    assert.equal(halfBars[3].chord, 1, 'chord changes exactly on the half bar');
    assert.equal(halfBars[6].beat, 3, 'next bar in 3/4');
    assert.equal(halfBars[6].chord, 2, 'second half-bar boundary');
  } finally {
    await engine.dispose();
    Object.assign(globalThis, previous);
  }
});
