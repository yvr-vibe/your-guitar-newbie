import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, AudioLines, Check, ChevronDown, CircleHelp, Disc3, Guitar, Heart, Headphones, Music2, Pause, Play, RotateCcw, Search, Settings2, Shuffle, SlidersHorizontal, Volume2, VolumeX, X } from 'lucide-react';
import { GENRES, progressions, type Difficulty, type Genre, type Progression } from './catalog';
import { chordFor, KEYS, ShuffleBag, voicingFor, type Chord } from './music';
import { PracticeAudio, type PlaybackConfig, type Step } from './audio';

type Settings = { key: string; bpm: number; meter: number; beats: string; subdivision: boolean; swing: boolean; click: boolean; accompaniment: boolean; volume: number; countIn: boolean; simplified: boolean; showDiagrams: boolean; loops: number; preview: number; randomKey: boolean };
const DEFAULT: Settings = { key: 'C', bpm: 90, meter: 4, beats: 'original', subdivision: false, swing: false, click: true, accompaniment: false, volume: 0.65, countIn: true, simplified: false, showDiagrams: false, loops: 2, preview: 1, randomKey: false };
function loadSaved(): { settings: Settings; favorites: string[]; selected: string } {
  try {
    const saved = JSON.parse(localStorage.getItem('fret-practice-v1') || '{}');
    const raw = { ...DEFAULT, ...saved.settings };
    const settings: Settings = {
      ...DEFAULT, key: KEYS.includes(raw.key) ? raw.key : DEFAULT.key,
      bpm: Number.isFinite(raw.bpm) ? Math.max(40, Math.min(240, Math.round(raw.bpm))) : DEFAULT.bpm,
      meter: [3,4].includes(raw.meter) ? raw.meter : 4, beats: ['original','1','2','4','8'].includes(raw.beats) ? raw.beats : 'original',
      loops: [1,2,4,8].includes(raw.loops) ? raw.loops : 2, preview: [0,1,2].includes(raw.preview) ? raw.preview : 1,
      volume: Number.isFinite(raw.volume) ? Math.max(0, Math.min(1,raw.volume)) : DEFAULT.volume,
      ...Object.fromEntries(['subdivision','swing','click','accompaniment','countIn','simplified','showDiagrams','randomKey'].map(k => [k,typeof raw[k] === 'boolean' ? raw[k] : DEFAULT[k as keyof Settings]])),
    };
    return { settings, favorites: Array.isArray(saved.favorites) ? saved.favorites.filter((id: unknown) => typeof id === 'string' && progressions.some(p=>p.id===id)) : [], selected: saved.selected || 'pop-1' };
  } catch { return { settings: DEFAULT, favorites: [], selected: 'pop-1' }; }
}
function hashId() { return window.location.hash.replace(/^#practice\//, ''); }
const initial = loadSaved();
const initialProgression = progressions.find(p => p.id === hashId()) || progressions.find(p=>p.id===initial.selected) || progressions[0];
function makeDurations(p: Progression, s: Settings, custom: number[] | null = null) {
  return custom?.length === p.roman.length ? custom : p.bars.map(b => s.beats === 'original' ? b*s.meter : Number(s.beats));
}
function Fretboard({ chord, small = false }: { chord: Chord; small?: boolean }) {
  const shape = voicingFor(chord);
  const height = small ? 116 : 132;
  return <svg className="fretboard" viewBox={`0 0 120 ${height}`} role="img" aria-label={`${chord.name} guitar chord: frets ${shape.frets.map(f=>f===null?'muted':f).join(', ')}, from low E to high E`}>
    {[0,1,2,3,4].map(f => <line key={`f${f}`} x1="22" x2="102" y1={28+f*18} y2={28+f*18} className={f===0 && shape.start===1 ? 'nut' : 'fret'}/>)}
    {[0,1,2,3,4,5].map(s => <line key={`s${s}`} x1={22+s*16} x2={22+s*16} y1="28" y2="100" className="string"/>)}
    {shape.start>1 && <text x="7" y="42" className="fret-label">{shape.start}</text>}
    {shape.frets.map((f,s) => f===null ? <text key={s} x={22+s*16} y="18" textAnchor="middle" className="open-string">×</text> : f===0 ? <circle key={s} cx={22+s*16} cy="14" r="3.5" className="open-dot"/> : <circle key={s} cx={22+s*16} cy={28+(f-shape.start+0.5)*18} r="5.5" className="finger-dot"/>)}
    {!small && <text x="62" y="121" textAnchor="middle" className="shape-label">{shape.label}</text>}
  </svg>;
}
function Toggle({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return <button type="button" className="toggle-label" role="switch" aria-checked={checked} onClick={onChange}><span className={`switch ${checked?'on':''}`}><span/></span>{children}</button>;
}
export default function App() {
  const [selectedId,setSelectedId] = useState(initialProgression.id);
  const selected = progressions.find(p=>p.id===selectedId)!;
  const [settings,setSettings] = useState(initial.settings);
  const [bpmDraft,setBpmDraft] = useState(String(initial.settings.bpm));
  const [genre,setGenre] = useState<Genre>(initialProgression.genre);
  const [difficulty,setDifficulty] = useState('All levels');
  const [search,setSearch] = useState('');
  const [favorites,setFavorites] = useState<string[]>(initial.favorites);
  const [onlyFavorites,setOnlyFavorites] = useState(false);
  const [custom,setCustom] = useState<number[] | null>(null);
  const [playing,setPlaying] = useState(false);
  const [step,setStep] = useState<Step | null>(null);
  const [challenge,setChallenge] = useState(false);
  const [upcoming,setUpcoming] = useState<{ id:string; key:string } | null>(null);
  const [advanced,setAdvanced] = useState(false);
  const [about,setAbout] = useState(false);
  const [error,setError] = useState('');
  const [toast,setToast] = useState('');
  const [practiceSeconds,setPracticeSeconds] = useState(0);
  const bag = useRef(new ShuffleBag());
  const audio = useRef<PracticeAudio | null>(null);
  const taps = useRef<number[]>([]);
  const chordStrip = useRef<HTMLDivElement>(null);
  const filtered = useMemo(()=>progressions.filter(p=>p.genre===genre && (difficulty==='All levels' || p.difficulty===difficulty) && (!onlyFavorites || favorites.includes(p.id)) && `${p.title} ${p.roman.join(' ')} ${p.songs.map(s=>`${s.title} ${s.artist}`).join(' ')} ${p.roman.map(r=>chordFor(r,settings.key).name).join(' ')}`.replaceAll('♭','b').replaceAll('♯','#').toLowerCase().includes(search.replaceAll('♭','b').replaceAll('♯','#').toLowerCase())),[genre,difficulty,onlyFavorites,favorites,search,settings.key]);
  const durations = makeDurations(selected,settings,custom);
  const chords = selected.roman.map(r=>chordFor(r,settings.key,settings.simplified));
  const total = durations.reduce((a,b)=>a+b,0);
  const active = step?.id===selected.id ? step.chord : 0;
  const beat = step?.id===selected.id ? step.beat : 0;
  const barCount = Number((total/settings.meter).toFixed(1));
  const countIn = step?.countIn;
  const next = progressions.find(p=>p.id===upcoming?.id);
  const live = useRef({selected,settings,custom,filtered,challenge});
  live.current = {selected,settings,custom,filtered,challenge};
  const getConfig = (): PlaybackConfig => {
    const {selected:p,settings:s,custom:c} = live.current;
    return { progression:p, ...s, durations:makeDurations(p,s,c) };
  };
  useEffect(()=>{
    audio.current = new PracticeAudio(getConfig, event=>{
      setStep(event);
      if (event.id!==live.current.selected.id) {
        setSelectedId(event.id); setSettings(s=>({...s,key:event.key})); setCustom(null); setUpcoming(null);
      }
    },(loop,config)=>{
      const state = live.current;
      if (!state.challenge || (loop+1)%state.settings.loops!==0 || state.filtered.length<2) return null;
      const id = bag.current.pick(state.filtered.map(p=>p.id),config.progression.id);
      const p = progressions.find(p=>p.id===id)!;
      const key = state.settings.randomKey ? KEYS[Math.floor(Math.random()*KEYS.length)] : config.key;
      setUpcoming({id:p.id,key});
      return { ...config, progression:p, key, durations:makeDurations(p,state.settings) };
    },()=>live.current.settings.preview);
    return ()=>{ void audio.current?.dispose(); };
  },[]);
  useEffect(()=>{
    try { localStorage.setItem('fret-practice-v1',JSON.stringify({settings,favorites,selected:selectedId})); } catch { /* Storage can be disabled. */ }
    history.replaceState(null,'',`#practice/${selectedId}`);
  },[settings,favorites,selectedId]);
  useEffect(()=>setBpmDraft(String(settings.bpm)),[settings.bpm]);
  useEffect(()=>{
    const strip=chordStrip.current;const card=strip?.children[active] as HTMLElement | undefined;
    if(strip && card && (card.offsetLeft<strip.scrollLeft || card.offsetLeft+card.offsetWidth>strip.scrollLeft+strip.clientWidth)){
      strip.scrollTo({left:Math.max(0,card.offsetLeft-(strip.clientWidth-card.offsetWidth)/2),behavior:'auto'});
    }
  },[active,selectedId]);
  useEffect(()=>{
    const handle = ()=>{ const p = progressions.find(p=>p.id===hashId()); if(p){ audio.current?.reset(); setPlaying(false); setStep(null); setUpcoming(null); setCustom(null); setSelectedId(p.id); setGenre(p.genre); } };
    window.addEventListener('hashchange',handle); return ()=>window.removeEventListener('hashchange',handle);
  },[]);
  useEffect(()=>{ if(!playing) return; const timer = setInterval(()=>setPracticeSeconds(t=>t+1),1000); return ()=>clearInterval(timer); },[playing]);
  useEffect(()=>{ if(!toast) return; const timer = setTimeout(()=>setToast(''),3000); return ()=>clearTimeout(timer); },[toast]);
  useEffect(()=>{
    // The random pool changed; discard the old preview before another loop can begin.
    audio.current?.cancelPrepared(); setUpcoming(null);
  },[genre,difficulty,search,onlyFavorites,favorites,challenge,settings.loops,settings.preview,settings.randomKey]);
  useEffect(()=>{
    const keydown = (event: KeyboardEvent)=>{
      if(event.code!=='Space' || event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLButtonElement || about) return;
      event.preventDefault(); void togglePlay();
    };
    window.addEventListener('keydown',keydown); return ()=>window.removeEventListener('keydown',keydown);
  });
  useEffect(()=>{
    const visibility = ()=>{ if(document.hidden && playing){ audio.current?.pause(); setPlaying(false); setToast('Practice paused while this tab is in the background.'); } };
    document.addEventListener('visibilitychange',visibility); return ()=>document.removeEventListener('visibilitychange',visibility);
  },[playing]);
  function stop() { audio.current?.reset(); setPlaying(false); setStep(null); setUpcoming(null); }
  function update<K extends keyof Settings>(key: K,value:Settings[K],reset=false) { if(reset) stop(); setSettings(s=>({...s,[key]:value})); }
  function choose(p:Progression,keep=false) {
    stop(); setSelectedId(p.id); setCustom(null);
    if(!keep) setSettings(s=>({...s,key:p.key,bpm:p.bpm,swing:p.feel==='Swing',beats:'original'}));
  }
  async function togglePlay() {
    if(playing){ audio.current?.pause(); setPlaying(false); return; }
    try { setError(''); const started=await audio.current?.play(settings.countIn); if(started)setPlaying(true); } catch { setError('Audio could not start. Try pressing Play again in a browser that supports Web Audio.'); }
  }
  function randomPick() {
    const id = bag.current.pick(filtered.map(p=>p.id),selectedId);
    if(!id) return;
    const p = progressions.find(p=>p.id===id)!;
    choose(p,true);
    if(settings.randomKey) update('key',KEYS[Math.floor(Math.random()*KEYS.length)]);
    setToast(`Ready for something new: ${p.title}`);
  }
  function tapTempo() {
    const now = performance.now();
    if(taps.current.length && now-taps.current.at(-1)!>2000) taps.current=[];
    taps.current=[...taps.current.slice(-4),now];
    if(taps.current.length>1) update('bpm',Math.max(40,Math.min(240,Math.round(60000/((now-taps.current[0])/(taps.current.length-1))))));
  }
  function favorite(id:string){ setFavorites(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]); }
  const visiblePreview = next && settings.preview>0;
  const challengeReady = filtered.length>=2;
  return <>
    <header className="site-header"><a className="brand" href="#practice/pop-1" aria-label="Fret home"><span className="brand-mark"><AudioLines size={22}/></span>fret<span className="brand-dot">.</span></a><nav aria-label="Main navigation"><a href="#practice" className="nav-active" onClick={e=>{e.preventDefault();document.getElementById('practice')?.scrollIntoView({behavior:'smooth'});}}>Practice</a><a href="#library" onClick={e=>{e.preventDefault();document.getElementById('library')?.scrollIntoView({behavior:'smooth'});}}>Progression library</a><button onClick={()=>setAbout(true)}>About <ArrowUpRight size={13}/></button></nav><span className="header-note"><span/> A little practice, every day.</span></header>
    <main>
      <div className="workspace" id="practice">
        <aside className="library panel" id="library"><div className="section-heading"><h2>Pick your progression</h2><button className="challenge-button" aria-pressed={challenge} onClick={()=>{setChallenge(c=>!c);}}><Shuffle size={16}/>Random challenge{challenge&&<Check size={15}/>}</button></div>
          <div className="genre-tabs" aria-label="Genre">{GENRES.map(g=><button key={g} aria-pressed={genre===g} className={genre===g?'active':''} onClick={()=>setGenre(g)}>{g}</button>)}</div>
          <label className="search-box"><Search size={15}/><input placeholder="Search chords or songs…" aria-label="Search progressions" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button aria-label="Clear search" onClick={()=>setSearch('')}><X size={14}/></button>}</label>
          <div className="library-filters"><label><SlidersHorizontal size={14}/><select aria-label="Difficulty filter" value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option>All levels</option>{(['Beginner','Intermediate','Advanced'] as Difficulty[]).map(d=><option key={d}>{d}</option>)}</select></label><button className={onlyFavorites?'favorites-active':''} aria-label="Show favorites only" aria-pressed={onlyFavorites} onClick={()=>setOnlyFavorites(x=>!x)}><Heart size={16} fill={onlyFavorites?'currentColor':'none'}/></button></div>
          <div className="list-caption"><span>{genre} essentials</span><span>{filtered.length} / 20</span></div>
          <div className="progression-list">{filtered.map((p)=><div className={`progression-row ${selectedId===p.id?'selected':''}`} key={p.id}><button className="progression-choice" onClick={()=>choose(p)}><span className="row-number">{String(progressions.filter(x=>x.genre===genre).findIndex(x=>x.id===p.id)+1).padStart(2,'0')}</span><span><strong>{p.title}</strong><span className="roman-preview">{p.roman.slice(0,5).join(' – ')}{p.roman.length>5?' …':''}</span><span className="row-level"><span className={`level-dot ${p.difficulty.toLowerCase()}`}/>{p.difficulty}{p.variation&&<span className="variation-label">Variation</span>}</span></span>{selectedId===p.id&&<span className="selection-dot"/>}</button><button className={`row-heart ${favorites.includes(p.id)?'saved':''}`} aria-label={`${favorites.includes(p.id)?'Unsave':'Save'} ${p.title}`} onClick={()=>favorite(p.id)}><Heart size={13} fill={favorites.includes(p.id)?'currentColor':'none'}/></button></div>)}{!filtered.length&&<div className="empty-state"><Search size={24}/><strong>No progressions found</strong><p>Try another search or level.</p><button onClick={()=>{setSearch('');setDifficulty('All levels');setOnlyFavorites(false);}}>Clear filters</button></div>}</div>
          <div className="library-bottom"><button className="random-button" onClick={randomPick} disabled={filtered.length===0}><Shuffle size={17}/> Surprise me <span>{filtered.length>1?'↗':'→'}</span></button><p>Common patterns & practice variations.<br/>Curated for learning, not a popularity ranking.</p></div>
        </aside>
        <div className="practice-column">
          <section className="player panel" aria-label="Practice player"><div className="player-heading"><div><div className="player-tags"><span className="genre-badge">{selected.genre}</span><span className="level-tag"><span className={`level-dot ${selected.difficulty.toLowerCase()}`}/>{selected.difficulty}</span>{selected.variation&&<span className="variation-label">Practice variation</span>}</div><h2>{selected.title}</h2><p>{selected.roman.join(' – ').replaceAll('b','♭').replaceAll('#','♯')}</p></div><button className={`favorite-button ${favorites.includes(selectedId)?'saved':''}`} aria-label={`${favorites.includes(selectedId)?'Unsave':'Save'} current progression`} onClick={()=>favorite(selectedId)}><Heart size={19} fill={favorites.includes(selectedId)?'currentColor':'none'}/></button></div>
            <div className="player-toolbar"><div className="toolbar-select"><Music2 size={15}/><span>Key</span><select aria-label="Practice key" value={settings.key} onChange={e=>update('key',e.target.value,true)}>{KEYS.map(k=><option key={k} value={k}>{k.replace('b','♭').replace('#','♯')}{selected.minor?' minor':' major'}</option>)}</select></div><Toggle checked={settings.showDiagrams} onChange={()=>update('showDiagrams',!settings.showDiagrams)}>Show chord diagrams</Toggle><span className="toolbar-divider"/><span className="loop-length"><RotateCcw size={14}/>{barCount} {barCount===1?'bar':'bars'} · {total} beats</span><button className="shapes-button" aria-pressed={settings.simplified} onClick={()=>update('simplified',!settings.simplified,true)}><Guitar size={15}/>{settings.simplified?'Simple shapes':'Full voicings'}<ChevronDown size={12}/></button></div>
            <div className={`chord-stage ${settings.showDiagrams?'with-diagrams':''}`}><div className="stage-caption"><span><span className={`status-dot ${playing?'live':''}`}/>{playing ? countIn ? `Count in · ${countIn} of ${settings.meter}` : 'Playing · keep the pulse' : step ? 'Paused · pick up where you left off' : 'Ready when you are'}</span>{settings.showDiagrams&&<span>STANDARD TUNING · E A D G B E</span>}</div>
              <div ref={chordStrip} className={`chord-strip ${chords.length>5?'long':''}`}>{chords.map((chord,index)=><div key={`${selectedId}-${index}`} className={`chord-card ${index===active?'current':''}`}><h3>{chord.name.replaceAll('b','♭').replaceAll('#','♯')}</h3><span className="chord-roman">{chord.roman.replaceAll('b','♭').replaceAll('#','♯')}</span>{settings.showDiagrams&&<Fretboard chord={chord}/>}<label className="chord-beats"><select aria-label={`Beats for chord ${index+1}`} value={durations[index]} onChange={e=>{stop();const values=[...durations];values[index]=Number(e.target.value);setCustom(values);}}>{[...new Set([1,2,3,4,6,8,12,16,durations[index]])].sort((a,b)=>a-b).map(n=><option value={n} key={n}>{n} {n===1?'beat':'beats'}</option>)}</select><ChevronDown size={11}/></label></div>)}</div>
              <div className="beat-row"><div className="beat-counter"><span className="tiny-label">{countIn?'COUNT IN':'BEAT'}</span><strong>{countIn || (Math.floor(beat)%settings.meter)+1}<small> / {settings.meter}</small></strong></div><div className="beat-dots" aria-label={`Beat ${countIn || Math.floor(beat)%settings.meter+1} of ${settings.meter}`}>{Array.from({length:settings.meter},(_,i)=><span className={(countIn ? countIn-1 : Math.floor(beat)%settings.meter)===i?'active':''} key={i}/>)}</div><span className="next-chord">Next <strong>{chords[(active+1)%chords.length].name.replaceAll('b','♭').replaceAll('#','♯')}</strong><ArrowRight size={14}/></span></div>
              {challenge&&<div className="next-challenge" role="status"><Shuffle size={15}/>{!challengeReady?'Choose filters with at least two progressions to start challenges.':visiblePreview?<>Coming next: <strong>{next.title}</strong><span>{next.roman.map(r=>chordFor(r,upcoming!.key,settings.simplified).name).join(' → ')}</span></>:<>Random challenge · new progression every {settings.loops} {settings.loops===1?'loop':'loops'}{settings.preview===0?' · no preview':''}</>}</div>}
            </div>
            <div className="transport"><div className="transport-actions"><button className="play-button" onClick={()=>void togglePlay()}>{playing?<Pause size={18} fill="currentColor"/>:<Play size={18} fill="currentColor"/>}{playing?'Pause':step?'Resume practice':'Start practice'}</button><button className="restart-button" aria-label="Restart progression" onClick={stop}><RotateCcw size={18}/></button><span className="space-hint"><kbd>space</kbd> to {playing?'pause':'play'}</span></div><Toggle checked={settings.countIn} onChange={()=>update('countIn',!settings.countIn)}>Count-in</Toggle><span className="loop-status"><RotateCcw size={13}/>{step&&step.countIn===null?`Loop ${step.loop+1}`:'Loop on'}</span></div>
            {error&&<div className="error-message" role="alert">{error}</div>}
          </section>
          <section className="controls panel" aria-label="Practice settings"><div className="controls-main"><div className="tempo-control"><div className="control-title"><span>TEMPO</span><button onClick={tapTempo}>Tap tempo</button></div><div className="tempo-value"><button aria-label="Decrease tempo" onClick={()=>update('bpm',Math.max(40,settings.bpm-1))}>−</button><label><input aria-label="BPM" type="number" min="40" max="240" value={bpmDraft} onChange={e=>{setBpmDraft(e.target.value);const n=Number(e.target.value);if(n>=40 && n<=240)update('bpm',Math.round(n));}} onBlur={()=>{const n=Number(bpmDraft);const value=bpmDraft && Number.isFinite(n)?Math.max(40,Math.min(240,Math.round(n))):settings.bpm;update('bpm',value);setBpmDraft(String(value));}} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();}}/><span>BPM</span></label><button aria-label="Increase tempo" onClick={()=>update('bpm',Math.min(240,settings.bpm+1))}>+</button></div><input className="tempo-slider" aria-label="Tempo slider" type="range" min="40" max="240" value={settings.bpm} onChange={e=>update('bpm',Number(e.target.value))}/><div className="range-labels"><span>40</span><span>240</span></div></div>
            <div className="rhythm-control"><div className="control-title"><span>RHYTHM</span><Music2 size={13}/></div><div className="paired-fields"><label>Time signature<select aria-label="Time signature" value={settings.meter} onChange={e=>{setCustom(null);update('meter',Number(e.target.value),true);}}><option value="4">4 / 4</option><option value="3">3 / 4</option></select></label><label>Beats per chord<select aria-label="Default beats per chord" value={custom?'custom':settings.beats} onChange={e=>{setCustom(null);update('beats',e.target.value,true);}}>{custom&&<option value="custom">Custom</option>}<option value="original">Original rhythm</option>{[1,2,4,8].map(n=><option key={n} value={n}>{n} {n===1?'beat':'beats'}</option>)}</select></label></div><div className="feel-buttons"><button className={!settings.swing?'active':''} onClick={()=>update('swing',false)}>Straight</button><button className={settings.swing?'active':''} onClick={()=>update('swing',true)}>Swing</button></div></div>
            <div className="sound-control"><div className="control-title"><span>SOUND</span><Headphones size={14}/></div><Toggle checked={settings.click} onChange={()=>update('click',!settings.click)}>Metronome</Toggle><Toggle checked={settings.accompaniment} onChange={()=>update('accompaniment',!settings.accompaniment)}>Chord accompaniment</Toggle><label className="volume-control">{settings.volume===0?<VolumeX size={16}/>:<Volume2 size={16}/>}<input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={settings.volume} onChange={e=>update('volume',Number(e.target.value))}/></label></div></div>
            <button className="advanced-trigger" aria-expanded={advanced} onClick={()=>setAdvanced(x=>!x)}><Settings2 size={14}/>{challenge?'Challenge & advanced settings':'Advanced settings'}<ChevronDown size={15} className={advanced?'rotated':''}/></button>
            {advanced&&<div className="advanced-settings"><div><Toggle checked={settings.subdivision} onChange={()=>update('subdivision',!settings.subdivision)}>Eighth-note clicks</Toggle><p>Swing is heard on eighth-note subdivisions.</p><Toggle checked={challenge} onChange={()=>setChallenge(x=>!x)}>Random challenge mode</Toggle><p>Uses the genre, level, and search filters in the library.</p></div><div><label>Switch after<select aria-label="Challenge loops" value={settings.loops} onChange={e=>update('loops',Number(e.target.value))}>{[1,2,4,8].map(n=><option value={n} key={n}>{n} {n===1?'loop':'loops'}</option>)}</select></label><label>Preview next progression<select aria-label="Challenge preview" value={settings.preview} onChange={e=>update('preview',Number(e.target.value))}><option value="0">No preview</option><option value="1">1 bar ahead</option><option value="2">2 bars ahead</option></select></label><Toggle checked={settings.randomKey} onChange={()=>update('randomKey',!settings.randomKey)}>Randomize key too</Toggle></div></div>}
          </section>
          <section className="song-section"><div className="song-heading"><div><span className="eyebrow muted">CONNECT THE CHORDS TO THE MUSIC</span><h2>Hear it in the wild<span>↗</span></h2></div><a href={selected.source} target="_blank" rel="noreferrer">Progression reference <ArrowUpRight size={13}/></a></div>{selected.variation&&<p className="song-context">This is a practice variation. These songs demonstrate the underlying chord family; their exact changes can differ.</p>}<div className="song-cards">{selected.songs.map((song,index)=><a className="song-card" key={song.title} href={song.url} target="_blank" rel="noreferrer"><span className={`record-icon record-${index}`}><Disc3 size={25}/></span><div><strong>{song.title}</strong><span>{song.artist}</span><p>{song.section}</p></div><ArrowUpRight size={16}/></a>)}</div></section>
          <div className="practice-tip"><span><Guitar size={18}/></span><div><strong>Small steps, better changes.</strong><p>{selected.tip}</p></div></div>
        </div>
      </div>
      <footer><span className="footer-brand">fret.</span><span>Less scrolling. More strumming.</span><span><span className="footer-dot"/>{Math.floor(practiceSeconds/60)} min practiced this session</span></footer>
    </main>
    {toast&&<div className="toast" role="status"><Check size={16}/>{toast}</div>}
    {about&&<About onClose={()=>setAbout(false)}/>}
  </>;
}
function About({onClose}:{onClose:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{ ref.current?.showModal(); },[]);
  return <dialog className="about-dialog" ref={ref} onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose();}}><button className="dialog-close" aria-label="Close about" onClick={onClose}><X size={20}/></button><span className="eyebrow">A LITTLE PRACTICE, EVERY DAY</span><h2>Your next good habit.</h2><p>Fret is a free guitar practice companion. Explore 100 chord progression exercises, slow things down, and train yourself to adapt to new changes.</p><h3>Using the player</h3><p>Pick a progression, choose your key, and press Start practice. Enable Show chord diagrams to view guitar shapes. Read diagrams from low E on the left to high E on the right. Open circles mean open strings; × means mute. A fret number marks a movable shape. Use a barre where neighboring strings share a fret.</p><h3>The progression collection</h3><p>Each genre includes 20 core patterns and useful variations, ordered for learning rather than ranked by popularity. Song references describe specific sections or related harmonic families. Exercises simplify arrangements and are not full song transcriptions. Roman numerals use major-scale degrees, so minor patterns explicitly show ♭III, ♭VI, and ♭VII.</p><p>Simple shapes removes most extensions; full voicings preserves the chord colors. Chord accompaniment uses a soft synthesized tone. Your settings and favorites are saved in this browser.</p><div className="about-links"><a href="https://www.hooktheory.com/theorytab/popular-chord-progressions" target="_blank" rel="noreferrer">Hooktheory · Popular progressions <ArrowUpRight size={14}/></a><a href="https://www.jazzguitar.be/blog/jazz-chord-progressions/" target="_blank" rel="noreferrer">Jazz Guitar Online · Harmony <ArrowUpRight size={14}/></a><a href="https://www.jazzstandards.com/theory/blues.htm" target="_blank" rel="noreferrer">Jazz Standards · Blues forms <ArrowUpRight size={14}/></a><a href="https://www.pickupmusic.com/blog/10-essential-neo-soul-chord-progressions-for-guitarists" target="_blank" rel="noreferrer">Pickup Music · Neo-soul <ArrowUpRight size={14}/></a></div><button className="play-button" onClick={onClose}>Back to practice <ArrowRight size={15}/></button></dialog>;
}
