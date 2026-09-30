export const GENRES = ['Pop', 'Rock', 'Blues', 'Jazz', 'Neo-soul'] as const;
export type Genre = typeof GENRES[number];
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Song = { title: string; artist: string; url: string; section: string };
export type Progression = {
  id: string; genre: Genre; title: string; roman: string[]; bars: number[]; difficulty: Difficulty;
  bpm: number; key: string; minor: boolean; feel: 'Straight' | 'Swing'; tip: string;
  songs: Song[]; source: string; variation: boolean;
};
const hook = 'https://www.hooktheory.com/theorytab/';
const jazz = 'https://www.jazzguitar.be/blog/jazz-chord-progressions/';
const blues = 'https://www.jazzstandards.com/theory/blues.htm';
const neo = 'https://www.pickupmusic.com/blog/10-essential-neo-soul-chord-progressions-for-guitarists';
const song = (title: string, artist: string, url: string, section: string): Song => ({ title, artist, url, section });
const refs: Record<string, Song[]> = {
  axis: [song('With or Without You', 'U2', hook+'artist/u2', 'Repeating I–V–vi–IV foundation.'), song('Someone Like You', 'Adele', hook+'artist/adele', 'Chorus foundation; the verse uses inversions.')],
  minorAxis: [song('Zombie', 'The Cranberries', 'https://www.justinguitar.com/artists/the-cranberries', 'Em–C–G–D foundation: vi–IV–I–V relative to G, or i–♭VI–♭III–♭VII relative to E. The recording adds a bass pedal.')],
  doowop: [song('Stand by Me', 'Ben E. King', 'https://www.communityguitar.com/students/T_and_E_Answers/Files/StandByMe_T%26E.pdf', 'I–vi–IV–V foundation; the original holds some chords longer.'), song('Baby', 'Justin Bieber', hook+'popular-chord-progressions', 'Doo-wop chord family.')],
  primary: [song('Wild Thing', 'The Troggs', 'https://www.justinguitar.com/songs/the-troggs-wild-thing-chords-tabs-guitar-lesson-bs-210', 'Main I–IV–V–IV chord family; this exercise may simplify repeats and durations.'),song('La Bamba','Ritchie Valens','https://www.justinguitar.com/songs/ritchie-valens-la-bamba-chords-tabs-guitar-lesson-rf-004','I–IV–V foundation; listen for the faster harmonic rhythm.')],
  borrowed: [song('Creep', 'Radiohead', hook+'view/radiohead/creep', 'G–B–C–Cm: I–III–IV–iv.'), song('Blackbird', 'The Beatles', jazz, 'Related borrowed minor-iv harmony, with additional movement.')],
  plagal: [song('Dreams', 'Fleetwood Mac', hook+'index', 'Related two-chord listening reference; the song alternates F and G, not I and IV.')],
  dreams: [song('Dreams','Fleetwood Mac','https://www.justinguitar.com/songs/fleetwood-mac-dreams-chords-tabs-guitar-lesson-sb-215','F–G two-chord foundation, shown as IV–V relative to C. The recording colors the voicings.')],
  viva: [song('Viva la Vida','Coldplay','https://www.theguitarlesson.com/wp-content/uploads/lessons/viva-la-vida-tabs.pdf','IV–V–I–vi repeating foundation; transposed for practice.')],
  canon: [song('Go West', 'Pet Shop Boys', hook+'popular-chord-progressions', 'Canon progression family; voicings and durations differ.')],
  dorian: [song('Mad World', 'Gary Jules', hook+'artist/gary-jules', 'Verse foundation: i–♭III–♭VII–IV in Dorian.')],
  andalusian: [song('Hit the Road Jack', 'Ray Charles', jazz, 'Descending minor cadence; the original uses plain chords.'), song('Stray Cat Strut', 'Stray Cats', jazz, 'Descending minor cadence family.')],
  alabama: [song('Sweet Home Alabama', 'Lynyrd Skynyrd', 'https://chordify.net/pages/songs-explained/chords-tabs-sweet-home-alabama/', 'D–C–G loop, labeled I–♭VII–IV with D as the reference tonic.')],
  blues12: [song('Sweet Home Chicago', 'Robert Johnson', 'https://www.justinguitar.com/songs/robert-johnson-sweet-home-chicago-chords-tabs-guitar-lesson-sg-228', '12-bar blues reference; turnarounds vary by performance.'), song('Now’s the Time', 'Charlie Parker', blues, 'Related 12-bar form; jazz performances add substitutions.')],
  jazzBlues: [song('Tenor Madness', 'Sonny Rollins', blues, 'Jazz blues form; this exercise selects a particular set of changes.'), song('One O’Clock Jump', 'Count Basie', blues, 'Riff-blues form; arranged changes can differ.')],
  iiV: [song('Autumn Leaves', 'Joseph Kosma', jazz, 'Major ii–V–I passages; transposed here.'), song('Tune Up', 'Miles Davis', jazz, 'Major ii–V–I passages through several keys.')],
  rhythm: [song('I Got Rhythm', 'George Gershwin', 'https://www.jazzstandards.com/theory/rhythm-changes.htm', 'A-section turnaround family; this is a short extract.'), song('Oleo', 'Sonny Rollins', jazz, 'Rhythm-changes family; substitutions vary.')],
  passing: [song('Have You Met Miss Jones?', 'Richard Rodgers', jazz, 'Passing diminished-chord family.'), song('Ain’t Misbehavin’', 'Fats Waller', jazz, 'Related diminished passing harmony.')],
  train: [song('Take the “A” Train', 'Billy Strayhorn', jazz, 'Opening I–II7–ii–V–I harmonic family.'), song('The Girl from Ipanema', 'Antônio Carlos Jobim', jazz, 'Related A-section harmony; chord colors differ.')],
  circle: [song('Fly Me to the Moon', 'Bart Howard', jazz, 'Opening circle-of-fifths movement.'), song('Autumn Leaves', 'Joseph Kosma', jazz, 'Related circle-of-fifths movement, starting elsewhere in the cycle.')],
  backdoor: [song('Misty', 'Erroll Garner', jazz, 'Minor iv–♭VII7–I cadence around bar 4.'), song('There Will Never Be Another You', 'Harry Warren', jazz, 'Backdoor cadence family.')],
  minorII: [song('Blue Bossa', 'Kenny Dorham', jazz, 'Minor iiø–V–i passages.'), song('Softly, as in a Morning Sunrise', 'Sigmund Romberg', jazz, 'Minor ii–V–i family; tonic voicings vary.')],
  line: [song('My Funny Valentine', 'Richard Rodgers', jazz, 'Minor line-cliché family; this is a practice extract.')],
  descending: [song('How High the Moon', 'Morgan Lewis', jazz, 'Descending key-center movement; this loop is an extract.'), song('Solar', 'Miles Davis', jazz, 'Related descending ii–V–I movement.')],
  two: [song('Just the Two of Us', 'Grover Washington Jr. feat. Bill Withers', 'https://www.guitarmusictheory.com/just-the-two-of-us-chords/', 'IVmaj7–III7–vi foundation; the arrangement adds passing chords and turnarounds.')],
  lucky: [song('Get Lucky', 'Daft Punk feat. Pharrell Williams', hook+'view/daft-punk/get-lucky', 'Bm7–D–F♯m7–E; extended versions here are practice reharmonizations.')],
};
// Explicit hand-curated exercises. Roman numerals always use the major-scale degree grid:
// minor tonics use i, with bIII/bVI/bVII for natural-minor degrees.
type Row = [string, string, keyof typeof refs, number?, boolean?, number[]?];
const rows: Record<Genre, Row[]> = {
  Pop: [
    ['The four-chord classic','I V vi IV','axis',0],
    ['The minor-first loop','vi IV I V','minorAxis',0],
    ['The doo-wop turnaround','I vi IV V','doowop',0],
    ['Three chords, all heart','I IV V IV','primary',0,true],
    ['Start on the four','IV I V vi','axis',0,true],
    ['The three-chord return','I V IV','primary',0,true],
    ['The two-chord dream','IV V','dreams',0],
    ['The suspended arrival','ii IV I V','axis',1,true],
    ['The borrowed minor four','I III IV iv','borrowed',1],
    ['The gentle cadence','I IV ii V','iiV',1,true],
    ['The circle home','vi ii V I','circle',1],
    ['The canon sequence','I V vi iii IV I IV V','canon',1],
    ['The rising second','I ii IV I','axis',0,true],
    ['A softer turnaround','I vi ii V','rhythm',1],
    ['The bittersweet descent','IV V iii vi','two',1,true],
    ['The minor four-chord classic','i bVI bIII bVII','minorAxis',0,true],
    ['The Dorian lift','i bIII bVII IV','dorian',1],
    ['The descending minor cadence','i bVII bVI V','andalusian',1],
    ['Three chords in minor','i bVI bVII','minorAxis',0,true],
    ['The delayed resolution','IV V I vi','viva',0],
  ],
  Rock: [
    ['The stadium loop','I V vi IV','axis',0],
    ['The Southern rock loop','I bVII IV','alabama',0,false,[1,1,2]],
    ['The three-chord drive','I IV V','primary',0,true],
    ['The power-chord pulse','I5 IV5 V5 IV5','primary',0,true],
    ['The minor anthem','i bVI bIII bVII','minorAxis',0,true],
    ['The borrowed-chord classic','I III IV iv','borrowed',1],
    ['The Mixolydian return','I bVII','alabama',0,true],
    ['The double-plagal cadence','bVII IV I','alabama',0,true],
    ['The descending rock cadence','i bVII bVI V','andalusian',1],
    ['The major-to-minor turn','I IV iv I','borrowed',1,true],
    ['The bright fourth','I IV I V','primary',0,true],
    ['The minor turnaround','i iv V i','minorII',1,true],
    ['The Dorian rock loop','i bIII IV','dorian',1,true],
    ['The major two-chord vamp','I IV','plagal',0,true],
    ['The minor two-chord vamp','i iv','minorII',0,true],
    ['The minor-first stadium loop','vi IV I V','minorAxis',0],
    ['The power-chord descent','I5 bVII5 bVI5 bVII5','andalusian',1,true],
    ['The lifted chorus','IV I V vi','axis',0,true],
    ['The suspended resolution','Isus4 I Vsus4 V','primary',1,true],
    ['The rock-and-roll turnaround','I7 IV7 V7 IV7','blues12',1,true],
  ],
  Blues: [
    ['The classic 12-bar blues','I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7','blues12',0],
    ['The quick-change blues','I7 IV7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7','blues12',1],
    ['The resolved 12-bar blues','I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 I7','blues12',0,true],
    ['The sustained five','I7 I7 I7 I7 IV7 IV7 I7 I7 V7 V7 I7 I7','blues12',0,true],
    ['The quick-change resolution','I7 IV7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 I7','blues12',1,true],
    ['The shuffle with ninths','I9 IV9 I9 I9 IV9 IV9 I9 I9 V9 IV9 I9 V9','blues12',1,true],
    ['The sixth-chord blues','I6 I6 I6 I7 IV7 IV7 I6 I6 V7 IV7 I6 V7','blues12',1,true],
    ['The minor 12-bar blues','im7 im7 im7 im7 ivm7 ivm7 im7 im7 V7 ivm7 im7 V7','minorII',1,true],
    ['The minor flat-six turnaround','im7 im7 im7 im7 ivm7 ivm7 im7 im7 bVI7 V7 im7 V7','minorII',1,true],
    ['The jazz blues foundation','I7 IV7 I7 I7 IV7 IV7 I7 VI7 ii7 V7 I7 V7','jazzBlues',1],
    ['The passing diminished blues','I7 IV7 I7 I7 IV7 #IV°7 I7 VI7 ii7 V7 I7 V7','jazzBlues',2,true],
    ['The two-five turnaround','I7 IV7 I7 I7 IV7 IV7 I7 VI7 ii7 V7 I7 VI7 ii7 V7','jazzBlues',2,true,[1,1,1,1,1,1,1,1,1,1,0.5,0.5,0.5,0.5]],
    ['The thirteen-chord shuffle','I13 IV9 I13 I13 IV9 IV9 I13 I13 V9 IV9 I13 V9','blues12',2,true],
    ['The four-bar blues loop','I7 IV7 I7 V7','blues12',0,true],
    ['The blues turnaround drill','I7 VI7 ii7 V7','jazzBlues',1,true],
    ['The descending turnaround','I7 bIII7 II7 bII7','jazzBlues',2,true],
    ['The backdoor blues cadence','IV7 iv7 I7 VI7 ii7 V7','jazzBlues',2,true],
    ['The quick-change minor blues','im7 ivm7 im7 im7 ivm7 ivm7 im7 im7 bVI7 V7 im7 V7','minorII',1,true],
    ['The dominant two approach','I7 I7 I7 I7 IV7 IV7 I7 VI7 II7 V7 I7 V7','jazzBlues',2,true],
    ['The slow blues cadence drill','I9 IV9 V9 IV9','blues12',1,true],
  ],
  Jazz: [
    ['The essential two-five-one','ii7 V7 Imaj7','iiV',1,false,[1,1,2]],
    ['The short two-five-one','ii7 V7 Imaj7','iiV',1,true,[0.5,0.5,1]],
    ['The rhythm turnaround','Imaj7 vi7 ii7 V7','rhythm',1,false,[0.5,0.5,0.5,0.5]],
    ['The dominant-six turnaround','Imaj7 VI7 ii7 V7','rhythm',1,true,[0.5,0.5,0.5,0.5]],
    ['The minor two-five-one','iiø7 V7 im7','minorII',1,false,[1,1,2]],
    ['The backdoor cadence','iv7 bVII7 Imaj7','backdoor',1,false,[1,1,2]],
    ['The tritone approach','ii7 bII7 Imaj7','iiV',2,true,[1,1,2]],
    ['The two-five-one turnaround','ii7 V7 Imaj7 VI7','iiV',1,true],
    ['The circle-of-fifths journey','vi7 ii7 V7 Imaj7 IVmaj7 viiø7 III7 vi7','circle',1],
    ['The A Train opening','Imaj7 II7 ii7 V7 Imaj7','train',1,false,[2,2,1,1,2]],
    ['The passing diminished climb','Imaj7 #I°7 ii7 #II°7 iii7 VI7','passing',2,false,[0.5,0.5,0.5,0.5,0.5,0.5]],
    ['The minor line cliché','i imaj7 i7 i6','line',2],
    ['The borrowed-four cadence','Imaj7 I7 IVmaj7 iv7','backdoor',1,true],
    ['The altered minor cadence','iiø7 V7b9 im6','minorII',2,true,[1,1,2]],
    ['The rhythm bridge','III7 VI7 II7 V7','rhythm',1,true,[2,2,2,2]],
    ['The descending key centers','Imaj7 i7 IV7 bVIImaj7 bVII7 bIII7 bVImaj7','descending',2,true,[2,1,1,2,1,1,2]],
    ['The extended major cadence','ii9 V13 Imaj9','iiV',2,true,[1,1,2]],
    ['The minor tritone return','iiø7 V7 im7 bIII7','minorII',2,true],
    ['The chromatic two-five','ii7 bII7 Imaj7 bIII7','iiV',2,true],
    ['The jazz minor descent','i7 bVII7 bVImaj7 V7','andalusian',1,true],
  ],
  'Neo-soul': [
    ['The soulful two-five-one','ii7 V7 Imaj7','iiV',1,false,[1,1,2]],
    ['The velvet turnaround','Imaj7 vi7 IVmaj7 V7','doowop',1,true],
    ['The floating four-chord loop','vi7 IVmaj7 Imaj7 V7','minorAxis',1,true],
    ['The minor-four sigh','IVmaj7 iv7 Imaj7','backdoor',1,true,[1,1,2]],
    ['The three-six-two-five','iii7 vi7 ii7 V7','circle',1,true],
    ['The soul classic foundation','IVmaj7 III7 vi7','two',1,false,[1,1,2]],
    ['The soul turnaround','IVmaj7 III7 vi7 v7 I7','two',2,true,[1,1,1,0.5,0.5]],
    ['The extended two-five-one','ii9 V13 Imaj9','iiV',2,true,[1,1,2]],
    ['The ninth-chord turnaround','Imaj9 vi9 ii9 V13','rhythm',2,true],
    ['The borrowed-four cloud','IVmaj9 iv9 Imaj9','backdoor',2,true,[1,1,2]],
    ['The Dorian pocket','i7 bIII v7 IV','lucky',1],
    ['The Dorian ninths','i9 bIIImaj9 v9 IVmaj9','lucky',2,true],
    ['The backdoor glow','iv9 bVII13 Imaj9','backdoor',2,true,[1,1,2]],
    ['The deceptive cadence','ii7 V7 vi7 IVmaj7','iiV',1,true],
    ['The borrowed minor passage','ii7 iv7 V7','backdoor',1,true,[1,1,2]],
    ['The warm primary loop','Imaj7 IVmaj7 V7 IVmaj7','primary',1,true],
    ['The long soul sequence','Imaj7 V7 vi7 iii7 IVmaj7 Imaj7','canon',1,true],
    ['The suspended minor pocket','i11 IV9','lucky',2,true,[2,2]],
    ['The chromatic soul cadence','ii9 bII9 Imaj9','iiV',2,true,[1,1,2]],
    ['The minor soul resolution','iiø7 V7#9 im9','minorII',2,true,[1,1,2]],
  ],
};
// Accept readable "im7" in editorial input, normalize to the parser's "i7".
export const progressions: Progression[] = GENRES.flatMap(genre => rows[genre].map((row, index) => {
  const [title, sequence, reference, level = 1, variation = false, durations] = row;
  const roman = sequence.split(' ').map(r => r.replace(/^(b?#?(?:vii|iii|vi|iv|ii|v|i))m(?=\d)/, '$1'));
  const minor = roman.some(r => /^i(?:7|9|11|6|maj7)?$/.test(r));
  const defaultKey = genre === 'Blues' ? 'A' : genre === 'Rock' ? 'G' : minor ? 'A' : 'C';
  return {
    id: `${genre.toLowerCase().replace('-', '')}-${index + 1}`, genre, title, roman,
    bars: durations || roman.map(() => 1), difficulty: (['Beginner','Intermediate','Advanced'] as const)[level],
    bpm: genre === 'Neo-soul' ? 76 : genre === 'Blues' ? 80 : genre === 'Jazz' ? 100 : 90,
    key: defaultKey, minor, feel: genre === 'Blues' || genre === 'Jazz' ? 'Swing' : 'Straight',
    tip: genre === 'Blues' ? 'Keep the shuffle even. Listen for the move to IV and prepare the turnaround before it arrives.'
      : genre === 'Neo-soul' ? 'Let the chord colors breathe. Move between shapes slowly, then add a light, relaxed groove.'
      : genre === 'Jazz' ? 'Follow the thirds and sevenths. Aim for a clean change before adding rhythmic variations.'
      : genre === 'Rock' ? 'Keep your strumming hand moving. Prepare your fretting hand just before each chord change.'
      : 'Start with one strum per chord. Keep the pulse steady as you move between shapes.',
    songs: refs[reference], source: genre === 'Jazz' ? jazz : genre === 'Blues' ? blues : genre === 'Neo-soul' ? neo : hook+'popular-chord-progressions',
    variation,
  };
}));
