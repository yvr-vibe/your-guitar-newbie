import { chordFor, chordIndexAt, voicingNotes } from './music';
import type { Progression } from './catalog';
import { metronomeClick, resolveClickPattern, type ClickPattern } from './metronome';
export type PlaybackConfig = {
  progression: Progression;
  key: string;
  durations: number[];
  bpm: number;
  clickPattern: ClickPattern;
  meter: number;
  subdivision: boolean;
  swing: boolean;
  click: boolean;
  accompaniment: boolean;
  volume: number;
  simplified: boolean;
};
export type Step = {
  id: string;
  key: string;
  beat: number;
  chord: number;
  loop: number;
  countIn: number | null;
  time: number;
};
type Cursor = { config: PlaybackConfig; beat: number; loop: number; count: number | null };
type Queued = { step: Step; cursor: Cursor };
export class PracticeAudio {
  private ctx: AudioContext | null = null;
  private timer: number | null = null;
  private animation: number | null = null;
  private nextTime = 0;
  private cursor: Cursor | null = null;
  private queue: Queued[] = [];
  private nodes = new Set<OscillatorNode>();
  private prepared: PlaybackConfig | null = null;
  private preparingLoop = -1;
  private runToken = 0;
  constructor(
    private getConfig: () => PlaybackConfig,
    private onStep: (step: Step) => void,
    private prepare: (loop: number, config: PlaybackConfig) => PlaybackConfig | null,
    private previewBars: () => number,
  ) {}
  async play(countIn: boolean) {
    const token = ++this.runToken;
    this.ctx ??= new AudioContext();
    await this.ctx.resume();
    if (token !== this.runToken) return false;
    if (this.timer !== null) return true;
    if (!this.cursor) {
      const config = this.getConfig();
      this.cursor = { config, beat: 0, loop: 0, count: countIn ? -config.meter : null };
    }
    this.nextTime = this.ctx.currentTime + 0.08;
    this.timer = window.setInterval(() => this.schedule(), 25);
    this.schedule();
    const draw = () => {
      if (!this.ctx || this.timer === null) return;
      while (this.queue.length && this.queue[0].step.time <= this.ctx.currentTime) {
        const event = this.queue.shift()!;
        this.onStep(event.step);
      }
      this.animation = requestAnimationFrame(draw);
    };
    draw();
    return true;
  }
  pause() {
    ++this.runToken;
    if (this.timer !== null) clearInterval(this.timer);
    if (this.animation !== null) cancelAnimationFrame(this.animation);
    this.timer = null;
    this.animation = null;
    // Resume at the first unheard beat, not at a beat scheduled ahead of the listener.
    if (this.queue[0]) this.cursor = { ...this.queue[0].cursor };
    for (const node of this.nodes) {
      try {
        node.stop();
      } catch {
        /* Already ended. */
      }
    }
    this.nodes.clear();
    this.queue = [];
  }
  reset() {
    this.pause();
    this.cursor = null;
    this.prepared = null;
    this.preparingLoop = -1;
  }
  cancelPrepared() {
    this.prepared = null;
    this.preparingLoop = -1;
  }
  private schedule() {
    const ctx = this.ctx;
    if (!ctx || !this.cursor) return;
    // If the browser was suspended, continue from the unheard cursor rather than emitting a burst of clicks.
    if (this.nextTime < ctx.currentTime - 0.2) {
      if (this.queue[0]) this.cursor = { ...this.queue[0].cursor };
      this.queue = [];
      this.nextTime = ctx.currentTime + 0.08;
    }
    while (this.nextTime < ctx.currentTime + 0.1) {
      const cursor = this.cursor;
      const live = this.getConfig();
      // Timing controls are live; the progression, key, and rhythm are owned by this loop.
      const config = {
        ...cursor.config,
        bpm: live.bpm,
        clickPattern: live.clickPattern,
        click: live.click,
        accompaniment: live.accompaniment,
        volume: live.volume,
        subdivision: live.subdivision,
        swing: live.swing,
        simplified: live.simplified,
      };
      cursor.config = config;
      const total = config.durations.reduce((a, b) => a + b, 0);
      if (cursor.count === null && cursor.beat >= total) {
        cursor.beat = 0;
        cursor.loop++;
        if (this.prepared) {
          cursor.config = this.prepared;
          this.prepared = null;
        }
        // Read again at the next iteration with the newly selected progression.
        continue;
      }
      const seconds = 60 / config.bpm;
      const chord = cursor.count !== null ? 0 : chordIndexAt(config.durations, cursor.beat);
      const beat = cursor.count ?? cursor.beat;
      const step: Step = {
        id: config.progression.id,
        key: config.key,
        beat: cursor.beat,
        chord,
        loop: cursor.loop,
        countIn: cursor.count === null ? null : config.meter + cursor.count + 1,
        time: this.nextTime,
      };
      this.queue.push({ step, cursor: { ...cursor } });
      const wholeBeat = Number.isInteger(beat);
      const unit =
        cursor.count !== null ? 1 : config.durations.some((d) => !Number.isInteger(d)) ? 0.5 : 1;
      const pattern = resolveClickPattern(
        config.clickPattern,
        config.meter,
        config.progression.genre,
      );
      const pulse = metronomeClick(
        config.clickPattern,
        config.meter,
        config.progression.genre,
        beat,
        cursor.count !== null,
      );
      if ((config.click || cursor.count !== null) && wholeBeat && pulse) {
        this.tone(pulse.frequency, this.nextTime, 0.035, config.volume * pulse.level, 'sine');
      }
      if (
        config.click &&
        config.subdivision &&
        wholeBeat &&
        (cursor.count !== null || pattern !== 'backbeat-only')
      ) {
        this.tone(
          580,
          this.nextTime + seconds * (config.swing ? 2 / 3 : 1 / 2),
          0.025,
          config.volume * 0.1,
          'sine',
        );
      }
      if (config.accompaniment && cursor.count === null) {
        const previous =
          cursor.beat === 0 ? -1 : chordIndexAt(config.durations, cursor.beat - unit);
        if (previous !== chord) {
          const played = chordFor(config.progression.roman[chord], config.key, config.simplified);
          const duration = Math.min(config.durations[chord] * seconds * 0.9, 4);
          voicingNotes(played).forEach((midi, index) =>
            this.tone(
              440 * 2 ** ((midi - 69) / 12),
              this.nextTime + index * 0.009,
              duration,
              config.volume * 0.045,
              'triangle',
            ),
          );
        }
      }
      const preview = Math.max(1, this.previewBars()) * config.meter;
      if (
        cursor.count === null &&
        cursor.beat >= Math.max(0, total - preview) &&
        this.preparingLoop !== cursor.loop
      ) {
        this.preparingLoop = cursor.loop;
        this.prepared = this.prepare(cursor.loop, config);
      }
      if (cursor.count !== null) {
        cursor.count++;
        if (cursor.count >= 0) cursor.count = null;
      } else cursor.beat += unit;
      this.nextTime += seconds * unit;
    }
  }
  private tone(
    frequency: number,
    time: number,
    duration: number,
    volume: number,
    type: OscillatorType,
  ) {
    if (!this.ctx || volume <= 0) return;
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(gain);
    gain.connect(this.ctx.destination);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.01);
    this.nodes.add(oscillator);
    oscillator.onended = () => {
      this.nodes.delete(oscillator);
      oscillator.disconnect();
      gain.disconnect();
    };
  }
  async dispose() {
    this.reset();
    await this.ctx?.close();
    this.ctx = null;
  }
}
