import { ChevronDown, Headphones, Music2, Settings2, Volume2, VolumeX } from 'lucide-react';
import type { Genre } from '../catalog';
import { requiresFourBeatMeter, resolveClickPattern, type ClickPattern } from '../metronome';
import type { Settings, SettingsChange } from '../settings';
import Toggle from './Toggle';

type Props = {
  settings: Settings;
  genre: Genre;
  onSettingChange: SettingsChange;
  bpmDraft: string;
  onBpmDraftChange: (draft: string) => void;
  onTapTempo: () => void;
  advanced: boolean;
  onAdvancedChange: (open: boolean) => void;
  challenge: boolean;
};

export default function PracticeControls({
  settings,
  genre,
  onSettingChange,
  bpmDraft,
  onBpmDraftChange,
  onTapTempo,
  advanced,
  onAdvancedChange,
  challenge,
}: Props) {
  return (
    <section className="controls panel" aria-label="Practice settings">
      <div className="controls-main">
        <div className="tempo-control">
          <div className="control-title">
            <span>TEMPO</span>
            <button onClick={onTapTempo}>Tap tempo</button>
          </div>
          <div className="tempo-value">
            <button
              aria-label="Decrease tempo"
              onClick={() => onSettingChange('bpm', Math.max(40, settings.bpm - 1))}
            >
              −
            </button>
            <label>
              <input
                aria-label="BPM"
                type="number"
                min="40"
                max="240"
                value={bpmDraft}
                onChange={(e) => {
                  onBpmDraftChange(e.target.value);
                  const n = Number(e.target.value);
                  if (n >= 40 && n <= 240) onSettingChange('bpm', Math.round(n));
                }}
                onBlur={() => {
                  const n = Number(bpmDraft);
                  const value =
                    bpmDraft && Number.isFinite(n)
                      ? Math.max(40, Math.min(240, Math.round(n)))
                      : settings.bpm;
                  onSettingChange('bpm', value);
                  onBpmDraftChange(String(value));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur();
                }}
              />
              <span>BPM</span>
            </label>
            <button
              aria-label="Increase tempo"
              onClick={() => onSettingChange('bpm', Math.min(240, settings.bpm + 1))}
            >
              +
            </button>
          </div>
          <input
            className="tempo-slider"
            aria-label="Tempo slider"
            type="range"
            min="40"
            max="240"
            value={settings.bpm}
            onChange={(e) => onSettingChange('bpm', Number(e.target.value))}
          />
          <div className="range-labels">
            <span>40</span>
            <span>240</span>
          </div>
          <label className="metronome-pattern">
            Beat emphasis
            <select
              aria-label="Metronome beat emphasis"
              value={settings.clickPattern}
              onChange={(event) =>
                onSettingChange('clickPattern', event.target.value as ClickPattern)
              }
            >
              <option value="auto">
                Genre default (
                {resolveClickPattern('auto', settings.meter, genre) === 'two-four'
                  ? '2 & 4'
                  : 'beat 1'}
                )
              </option>
              <option value="even">All beats evenly</option>
              <option value="first">Accent beat 1</option>
              <option value="one-three" disabled={settings.meter !== 4}>
                Accent 1 & 3{settings.meter !== 4 ? ' · 4/4 only' : ''}
              </option>
              <option value="two-four" disabled={settings.meter !== 4}>
                Accent 2 & 4{settings.meter !== 4 ? ' · 4/4 only' : ''}
              </option>
              <option value="backbeat-only" disabled={settings.meter !== 4}>
                Only 2 & 4{settings.meter !== 4 ? ' · 4/4 only' : ''}
              </option>
            </select>
          </label>
          <p className="metronome-hint">
            {settings.clickPattern === 'backbeat-only'
              ? 'Only beats 2 and 4 click; count-in still clicks every beat.'
              : resolveClickPattern(settings.clickPattern, settings.meter, genre) === 'two-four'
                ? 'Stronger clicks on 2 and 4; all four beats still count.'
                : 'Emphasis follows the bar, independently of chord duration.'}
          </p>
        </div>
        <div className="rhythm-control">
          <div className="control-title">
            <span>RHYTHM</span>
            <Music2 size={13} />
          </div>
          <div className="paired-fields">
            <label>
              Time signature
              <select
                aria-label="Time signature"
                value={settings.meter}
                onChange={(e) => {
                  const meter = Number(e.target.value);
                  if (meter !== 4 && requiresFourBeatMeter(settings.clickPattern))
                    onSettingChange('clickPattern', 'first');
                  onSettingChange('meter', meter, true);
                }}
              >
                <option value="4">4 / 4</option>
                <option value="3">3 / 4</option>
              </select>
            </label>
            <label>
              Beats per chord
              <select
                aria-label="Default beats per chord"
                value={settings.beats}
                onChange={(e) => {
                  onSettingChange('beats', e.target.value, true);
                }}
              >
                <option value="original">Default duration</option>
                {[1, 2, 4, 6, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'beat' : 'beats'}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="feel-buttons">
            <button
              className={!settings.swing ? 'active' : ''}
              onClick={() => onSettingChange('swing', false)}
            >
              Straight
            </button>
            <button
              className={settings.swing ? 'active' : ''}
              onClick={() => onSettingChange('swing', true)}
            >
              Swing
            </button>
          </div>
        </div>
        <div className="sound-control">
          <div className="control-title">
            <span>SOUND</span>
            <Headphones size={14} />
          </div>
          <Toggle
            checked={settings.click}
            onChange={() => onSettingChange('click', !settings.click)}
          >
            Metronome
          </Toggle>
          <Toggle
            checked={settings.accompaniment}
            onChange={() => onSettingChange('accompaniment', !settings.accompaniment)}
          >
            Chord accompaniment
          </Toggle>
          <label className="volume-control">
            {settings.volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <input
              aria-label="Volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.volume}
              onChange={(e) => onSettingChange('volume', Number(e.target.value))}
            />
          </label>
        </div>
      </div>
      <button
        className="advanced-trigger"
        aria-expanded={advanced}
        onClick={() => onAdvancedChange(!advanced)}
      >
        <Settings2 size={14} />
        {challenge ? 'Challenge & advanced settings' : 'Advanced settings'}
        <ChevronDown size={15} className={advanced ? 'rotated' : ''} />
      </button>
      {advanced && (
        <div className="advanced-settings">
          <div>
            <Toggle
              checked={settings.subdivision}
              onChange={() => onSettingChange('subdivision', !settings.subdivision)}
            >
              Eighth-note clicks
            </Toggle>
            <p>Swing is heard on eighth-note subdivisions.</p>
          </div>
          <div>
            <label>
              Switch after
              <select
                aria-label="Challenge loops"
                value={settings.loops}
                onChange={(e) => onSettingChange('loops', Number(e.target.value))}
              >
                {[1, 2, 4, 8].map((n) => (
                  <option value={n} key={n}>
                    {n} {n === 1 ? 'loop' : 'loops'}
                  </option>
                ))}
              </select>
            </label>
            <Toggle
              checked={settings.randomKey}
              onChange={() => onSettingChange('randomKey', !settings.randomKey)}
            >
              Randomize key too
            </Toggle>
          </div>
        </div>
      )}
    </section>
  );
}
