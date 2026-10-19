import { useEffect, useMemo, useRef, useState } from 'react';
import { version as appVersion } from '../package.json';
import {
  ArrowUpRight,
  AudioLines,
  Check,
  Heart,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
} from 'lucide-react';
import { progressions, type Genre, type Progression } from './catalog';
import { chordFor, KEYS, ShuffleBag } from './music';
import { distinctProgression, chordBeat, sortByDifficulty } from './practice';
import { PracticeAudio, type PlaybackConfig, type Step } from './audio';

import { THEORY_LESSONS, THEORY_CONCEPTS } from './theory';
import RelatedTheory from './components/RelatedTheory';
import { loadSaved, type Settings } from './settings';
import PracticeControls from './components/PracticeControls';
import Fretboard from './components/Fretboard';
import ProgressionLibrary from './components/ProgressionLibrary';
import PracticeOptions from './components/PracticeOptions';
import AboutDialog from './components/AboutDialog';

function hashId() {
  return window.location.hash.replace(/^#practice\//, '');
}
const initial = loadSaved();
const initialProgression =
  progressions.find((p) => p.id === hashId()) ||
  progressions.find((p) => p.id === initial.selected) ||
  progressions[0];
function makeDurations(p: Progression, s: Settings) {
  return p.bars.map((b) => (s.beats === 'original' ? b * s.meter : Number(s.beats)));
}
export default function App() {
  const [selectedId, setSelectedId] = useState(initialProgression.id);
  const selected = progressions.find((p) => p.id === selectedId)!;
  const [settings, setSettings] = useState(initial.settings);
  const [bpmDraft, setBpmDraft] = useState(String(initial.settings.bpm));
  const [genre, setGenre] = useState<Genre | 'Favorites'>(initialProgression.genre);
  const [difficulty, setDifficulty] = useState('All levels');
  const [favorites, setFavorites] = useState<string[]>(initial.favorites);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState<Step | null>(null);
  const [challenge, setChallenge] = useState(false);
  const [upcoming, setUpcoming] = useState<{ id: string; key: string } | null>(null);
  const [advanced, setAdvanced] = useState(false);
  const [about, setAbout] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [practiceSeconds, setPracticeSeconds] = useState(0);
  const bag = useRef(new ShuffleBag());
  const audio = useRef<PracticeAudio | null>(null);
  const taps = useRef<number[]>([]);
  const pool = useMemo(
    () =>
      sortByDifficulty(
        progressions.filter((p) =>
          genre === 'Favorites' ? favorites.includes(p.id) : p.genre === genre,
        ),
      ).map(distinctProgression),
    [genre, favorites],
  );
  const filtered = useMemo(
    () => pool.filter((p) => difficulty === 'All levels' || p.difficulty === difficulty),
    [pool, difficulty],
  );
  const theory = THEORY_LESSONS[selected.id];
  const durations = makeDurations(selected, settings);
  const chords = selected.roman.map((r) => chordFor(r, settings.key, settings.simplified));
  const total = durations.reduce((a, b) => a + b, 0);
  const active = step?.id === selected.id ? step.chord : 0;
  const beat = step?.id === selected.id ? step.beat : 0;
  const barCount = Number((total / settings.meter).toFixed(1));
  const countIn = step?.countIn;
  const next = upcoming
    ? distinctProgression(progressions.find((p) => p.id === upcoming.id)!)
    : undefined;
  const position = chordBeat(durations, active, beat);
  const counter = countIn
    ? { current: countIn, total: settings.meter, dot: countIn - 1 }
    : position;
  const live = useRef({ selected, settings, filtered, challenge });
  live.current = { selected, settings, filtered, challenge };
  const getConfig = (): PlaybackConfig => {
    const { selected: p, settings: s } = live.current;
    return { progression: p, ...s, durations: makeDurations(p, s) };
  };
  useEffect(() => {
    audio.current = new PracticeAudio(
      getConfig,
      (event) => {
        setStep(event);
        if (event.id !== live.current.selected.id) {
          setSelectedId(event.id);
          setSettings((s) => ({ ...s, key: event.key }));
          setUpcoming(null);
        }
      },
      (loop, config) => {
        const state = live.current;
        if (
          !state.challenge ||
          (loop + 1) % state.settings.loops !== 0 ||
          state.filtered.length < 2
        )
          return null;
        const id = bag.current.pick(
          state.filtered.map((p) => p.id),
          config.progression.id,
        );
        const p = progressions.find((p) => p.id === id)!;
        const key = state.settings.randomKey
          ? KEYS[Math.floor(Math.random() * KEYS.length)]
          : config.key;
        setUpcoming({ id: p.id, key });
        return { ...config, progression: p, key, durations: makeDurations(p, state.settings) };
      },
      () => 1,
    );
    return () => {
      void audio.current?.dispose();
    };
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(
        'fret-practice-v1',
        JSON.stringify({ settings, favorites, selected: selectedId }),
      );
    } catch {
      /* Storage can be disabled. */
    }
    history.replaceState(null, '', `#practice/${selectedId}`);
  }, [settings, favorites, selectedId]);
  useEffect(() => setBpmDraft(String(settings.bpm)), [settings.bpm]);
  useEffect(() => {
    const handle = () => {
      const p = progressions.find((p) => p.id === hashId());
      if (p) {
        audio.current?.reset();
        setPlaying(false);
        setStep(null);
        setUpcoming(null);
        setSelectedId(p.id);
        setGenre(p.genre);
      }
    };
    window.addEventListener('hashchange', handle);
    return () => window.removeEventListener('hashchange', handle);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setPracticeSeconds((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    // The random pool changed; discard the old preview before another loop can begin.
    audio.current?.cancelPrepared();
    setUpcoming(null);
  }, [genre, difficulty, favorites, challenge, settings.loops, settings.randomKey]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (
        event.code !== 'Space' ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLSelectElement ||
        event.target instanceof HTMLButtonElement ||
        about
      )
        return;
      event.preventDefault();
      void togglePlay();
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  });
  useEffect(() => {
    const visibility = () => {
      if (document.hidden && playing) {
        audio.current?.pause();
        setPlaying(false);
        setToast('Practice paused while this tab is in the background.');
      }
    };
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, [playing]);
  function stop() {
    audio.current?.reset();
    setPlaying(false);
    setStep(null);
    setUpcoming(null);
  }
  function update<K extends keyof Settings>(key: K, value: Settings[K], reset = false) {
    if (reset) stop();
    setSettings((s) => ({ ...s, [key]: value }));
  }
  function choose(p: Progression, keep = false) {
    stop();
    setSelectedId(p.id);
    if (!keep)
      setSettings((s) => ({
        ...s,
        key: p.key,
        bpm: p.bpm,
        swing: p.feel === 'Swing',
        beats: 'original',
      }));
  }
  async function togglePlay() {
    if (playing) {
      audio.current?.pause();
      setPlaying(false);
      return;
    }
    try {
      setError('');
      const started = await audio.current?.play(settings.countIn);
      if (started) setPlaying(true);
    } catch {
      setError(
        'Audio could not start. Try pressing Play again in a browser that supports Web Audio.',
      );
    }
  }
  function randomPick() {
    const id = bag.current.pick(
      filtered.map((p) => p.id),
      selectedId,
    );
    const p = progressions.find((p) => p.id === id);
    if (!p) return;
    choose(p, true);
    if (settings.randomKey) update('key', KEYS[Math.floor(Math.random() * KEYS.length)]);
  }
  function tapTempo() {
    const now = performance.now();
    if (taps.current.length && now - taps.current.at(-1)! > 2000) taps.current = [];
    taps.current = [...taps.current.slice(-4), now];
    if (taps.current.length > 1)
      update(
        'bpm',
        Math.max(
          40,
          Math.min(240, Math.round(60000 / ((now - taps.current[0]) / (taps.current.length - 1)))),
        ),
      );
  }
  function favorite(id: string) {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }
  const challengeReady = filtered.length >= 2;
  return (
    <>
      <header className="site-header">
        <div className="brand-group">
          <a className="brand" href="#practice/pop-1" aria-label="Fret home">
            <span className="brand-mark">
              <AudioLines size={22} />
            </span>
            fret<span className="brand-dot">.</span>
          </a>
          <span className="version-tag" aria-label={`Version ${appVersion}`}>
            v{appVersion}
          </span>
        </div>
        <nav aria-label="Main navigation">
          <a
            href="#practice"
            className="nav-active"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Practice
          </a>
          <a
            href="#library"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Progression library
          </a>
          <button onClick={() => setAbout(true)}>
            About <ArrowUpRight size={13} />
          </button>
        </nav>
        <a
          className="header-support"
          href="https://www.paypal.com/ncp/payment/JP6G8C7VKQZTG"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Support this website via PayPal (opens in a new tab)"
        >
          <span aria-hidden="true">☕</span> Support this website
        </a>
      </header>
      <main>
        <div className="workspace" id="practice">
          <ProgressionLibrary
            genre={genre}
            onGenreChange={setGenre}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            items={filtered}
            total={pool.length}
            selectedId={selectedId}
            favorites={favorites}
            onChoose={choose}
            onFavorite={favorite}
          />
          <div className="practice-column">
            <section className="player panel" aria-label="Practice player">
              <div className="player-heading">
                <div className="player-tags">
                  <span className="genre-badge">{selected.genre}</span>
                  <span className="level-tag">
                    <span className={`level-dot ${selected.difficulty.toLowerCase()}`} />
                    {selected.difficulty}
                  </span>
                  {selected.variation && <span className="variation-label">Variation</span>}
                  <button
                    className={`favorite-button ${favorites.includes(selectedId) ? 'saved' : ''}`}
                    aria-label={`${favorites.includes(selectedId) ? 'Unsave' : 'Save'} current progression`}
                    onClick={() => favorite(selectedId)}
                  >
                    <Heart
                      size={19}
                      fill={favorites.includes(selectedId) ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
                <div className="player-title-row">
                  <h2>{selected.title}</h2>
                  <button
                    className="surprise-button"
                    aria-label="Surprise me"
                    title="Pick another progression"
                    onClick={randomPick}
                    disabled={!filtered.length}
                  >
                    <Shuffle size={19} />
                  </button>
                </div>
                <div className="progression-subtitle-row">
                  <p>
                    {distinctProgression(selected)
                      .roman.join(' – ')
                      .replaceAll('b', '♭')
                      .replaceAll('#', '♯')}
                  </p>
                  <div className="transport-actions">
                    <button
                      className="restart-button"
                      aria-label="Restart progression"
                      title="Restart progression"
                      onClick={stop}
                    >
                      <RotateCcw size={19} />
                    </button>
                    <button
                      className="play-button icon-play"
                      aria-label={
                        playing ? 'Pause practice' : step ? 'Resume practice' : 'Start practice'
                      }
                      title={
                        playing ? 'Pause practice' : step ? 'Resume practice' : 'Start practice'
                      }
                      onClick={() => void togglePlay()}
                    >
                      {playing ? (
                        <Pause size={20} fill="currentColor" />
                      ) : (
                        <Play size={20} fill="currentColor" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="player-toolbar">
                <div className="toolbar-select">
                  <Music2 size={15} />
                  <span>Key</span>
                  <select
                    aria-label="Practice key"
                    value={settings.key}
                    onChange={(e) => update('key', e.target.value, true)}
                  >
                    {KEYS.map((k) => (
                      <option key={k} value={k}>
                        {k.replace('b', '♭').replace('#', '♯')}
                        {selected.minor ? ' minor' : ' major'}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="loop-length">
                  {barCount} {barCount === 1 ? 'bar' : 'bars'} · {total} beats
                </span>
              </div>
              <div className={`chord-stage ${settings.showDiagrams ? 'with-diagrams' : ''}`}>
                <div className="beat-row">
                  <div className="beat-counter">
                    <span className="tiny-label">{countIn ? 'COUNT IN' : 'BEAT'}</span>
                    <strong>
                      {counter.current}
                      <small> / {counter.total}</small>
                    </strong>
                  </div>
                  <div
                    className="beat-dots"
                    aria-label={`Beat ${counter.current} of ${counter.total}`}
                  >
                    {Array.from({ length: Math.ceil(counter.total) }, (_, i) => (
                      <span className={counter.dot === i ? 'active' : ''} key={i} />
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(4, chords.length)}, minmax(0, 1fr))`,
                  }}
                  className="chord-grid"
                >
                  {chords.map((chord, index) => (
                    <div
                      key={`${selectedId}-${index}`}
                      className={`chord-card ${index === active ? 'current' : ''}`}
                    >
                      <h3 className={chord.name.length > 4 ? 'extended-name' : undefined}>
                        {chord.name.replaceAll('b', '♭').replaceAll('#', '♯')}
                      </h3>
                      <span className="chord-roman">
                        {chord.roman.replaceAll('b', '♭').replaceAll('#', '♯')}
                      </span>
                      {settings.showDiagrams && <Fretboard chord={chord} />}
                      {settings.showTheoryLabels && (
                        <div className="theory-tags">
                          {theory.focus
                            .filter((focus) => focus.index === index)
                            .map((focus) => (
                              <span
                                key={focus.concept}
                                className={`theory-tag ${focus.concept}`}
                                title={THEORY_CONCEPTS[focus.concept][1]}
                                aria-describedby={`theory-${selected.id}-${focus.index}-${focus.concept}`}
                              >
                                {THEORY_CONCEPTS[focus.concept][0]}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {challenge && (
                  <div className="next-challenge" role="status">
                    <Shuffle size={15} />
                    {!challengeReady ? (
                      'Choose a library tab and level with at least two progressions to start challenges.'
                    ) : next ? (
                      <>
                        Coming next: <strong>{next.title}</strong>
                        <span>
                          {next.roman
                            .map((r) => chordFor(r, upcoming!.key, settings.simplified).name)
                            .join(' → ')}
                        </span>
                      </>
                    ) : (
                      <>
                        Random challenge · new progression every {settings.loops}{' '}
                        {settings.loops === 1 ? 'loop' : 'loops'}
                      </>
                    )}
                  </div>
                )}
              </div>
              <PracticeOptions
                settings={settings}
                challenge={challenge}
                onChallengeChange={() => setChallenge((c) => !c)}
                onSettingChange={(key, value) => update(key, value, key === 'simplified')}
              />

              <RelatedTheory
                progression={selected}
                lesson={theory}
                durations={durations}
                meter={settings.meter}
                simplified={settings.simplified}
                rhythmChanged={settings.beats !== 'original'}
              />
              {error && (
                <div className="error-message" role="alert">
                  {error}
                </div>
              )}
            </section>
            <PracticeControls
              genre={selected.genre}
              settings={settings}
              onSettingChange={update}
              bpmDraft={bpmDraft}
              onBpmDraftChange={setBpmDraft}
              onTapTempo={tapTempo}
              advanced={advanced}
              onAdvancedChange={setAdvanced}
              challenge={challenge}
            />
          </div>
        </div>
        <footer>
          <span className="footer-brand">fret.</span>
          <span>Less scrolling. More strumming.</span>
          <span>
            <span className="footer-dot" />
            {Math.floor(practiceSeconds / 60)} min practiced this session
          </span>
        </footer>
      </main>
      {toast && (
        <div className="toast" role="status">
          <Check size={16} />
          {toast}
        </div>
      )}
      {about && <AboutDialog onClose={() => setAbout(false)} />}
    </>
  );
}
