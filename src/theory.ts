import type { Progression } from './catalog';

const book = 'https://viva.pressbooks.pub/openmusictheory/chapter/';
export const THEORY_CONCEPTS = {
  home: ['Home chord', 'The reference tonic: I in major, or i in minor.'],
  resolution: ['Resolution', 'An arrival that releases the tension of the preceding chords.'],
  turnaround: ['Turnaround', 'A closing move that prepares the next pass through the loop.'],
  quick: ['Quick change', 'An early visit to the four chord in the second bar of a blues.'],
  dominant: ['Dominant', 'The five chord, often used to create a pull toward the tonic.'],
  borrowed: ['Borrowed chord', 'A contrasting chord drawn from the parallel major or minor mode.'],
  secondary: [
    'Secondary dominant',
    'A dominant-type chord aimed at a chord other than the main tonic.',
  ],
  passing: ['Passing chord', 'A chord that connects two nearby harmonic destinations.'],
  tritone: [
    'Tritone substitute',
    'A dominant seventh rooted a tritone away from the dominant it replaces.',
  ],
  backdoor: [
    'Backdoor cadence',
    'A return to major I through minor iv and/or flat-seven dominant harmony.',
  ],
  relative: [
    'Relative minor',
    'The minor six chord shares its notes with the reference major scale.',
  ],
  modal: [
    'Modal color',
    'A chord that highlights a modal sound rather than a conventional V–I cadence.',
  ],
  deceptive: ['Deceptive move', 'V goes to vi instead of the expected I.'],
  suspension: [
    'Suspension',
    'A sus4 chord replaces the third with the fourth; this exercise then releases it.',
  ],
  power: ['Power chord', 'A root-and-fifth shape that leaves out the major or minor third.'],
  chromatic: [
    'Chromatic color',
    'A chord or note outside the reference scale adds contrast or connects nearby notes.',
  ],
  extension: [
    'Chord extension',
    'A seventh, ninth, eleventh, or thirteenth adds color to the basic harmony.',
  ],
  line: ['Moving inner voice', 'One note changes while the underlying minor tonic remains.'],
  preparation: ['Preparation', 'A chord that sets up the next harmonic move.'],
  circle: ['Fifth movement', 'Roots move by descending fifths or ascending fourths.'],
} as const;
export type TheoryConcept = keyof typeof THEORY_CONCEPTS;
export type TheoryFocus = { index: number; concept: TheoryConcept; note: string };
export type TheoryLesson = { explanation: string; listen: string; focus: TheoryFocus[] };
type FocusInput = [number, TheoryConcept, string];
function lesson(explanation: string, listen: string, ...focus: FocusInput[]): TheoryLesson {
  return {
    explanation,
    listen,
    focus: focus.map(([index, concept, note]) => ({ index, concept, note })),
  };
}

// Original editorial analysis of these specific practice arrangements. Indices are
// explicit, zero-based card positions; labels are not guessed from chord spelling.
export const THEORY_LESSONS: Record<string, TheoryLesson> = {
  'pop-1': lesson(
    'This four-chord loop balances the major home chord with its relative minor. It finishes on IV rather than completing a V–I cadence.',
    'Hear the change of mood at vi and the softer IV–I connection when the loop restarts.',
    [2, 'relative', 'vi brings in the relative-minor color.'],
    [0, 'home', 'I returns after the final IV each time the loop repeats.'],
  ),
  'pop-2': lesson(
    'Starting the same chord family on vi gives the opening a minor emphasis. The final V points back toward I, but the loop returns to vi instead.',
    'Compare the opening minor chord with I later in the loop.',
    [0, 'relative', 'vi is the opening relative-minor chord.'],
    [3, 'dominant', 'V returns to vi at the loop boundary, leaving the expected I delayed.'],
  ),
  'pop-3': lesson(
    'This doo-wop family moves from home through vi and IV to V. Its ending turns the harmony back toward the opening I.',
    'Let the last V feel unfinished until I returns.',
    [1, 'relative', 'vi adds a minor contrast after I.'],
    [3, 'turnaround', 'The final V prepares the return to the first card.'],
  ),
  'pop-4': lesson(
    'I, IV, and V are the three primary chords of a major key. The repeated IV makes this a four-card loop built from only three distinct chords.',
    'Hear IV change its role depending on whether it follows I or V.',
    [0, 'home', 'I anchors the loop.'],
    [
      2,
      'dominant',
      'V supplies the strongest conventional pull toward I, although IV comes next here.',
    ],
  ),
  'pop-5': lesson(
    'This variation begins on IV, so the home chord arrives second. Ending on vi keeps the loop open rather than giving it a V–I finish.',
    'Notice how starting away from home changes the feel of familiar chords.',
    [1, 'home', 'I appears after the opening IV.'],
    [3, 'relative', 'vi closes the loop with a minor color.'],
  ),
  'pop-6': lesson(
    'The loop moves from I to V and then back through IV. Returning from the last IV to the first I gives a gentler arrival than a direct V–I.',
    'Compare the outgoing I–V move with the returning IV–I move.',
    [1, 'dominant', 'V creates contrast after home.'],
    [0, 'resolution', 'The final IV returns to I when the loop repeats.'],
  ),
  'pop-7': lesson(
    'This two-chord vamp alternates IV and V without playing I. The home key is a reference for the numerals, but the exercise deliberately avoids a tonic arrival.',
    'Listen for the sense of motion that never quite settles.',
    [0, 'preparation', 'IV moves toward V.'],
    [1, 'dominant', 'V returns to IV rather than resolving to I.'],
  ),
  'pop-8': lesson(
    'The word suspended in this title describes a delayed arrival, not a sus chord. The actual changes use ii and IV before arriving at I, then leave on V.',
    'Find the first moment of rest at the third card.',
    [2, 'resolution', 'I arrives after ii–IV.'],
    [3, 'turnaround', 'V leads into ii at the loop boundary rather than closing on I.'],
  ),
  'pop-9': lesson(
    'The striking color comes from major III followed by IV, then minor iv. Here III does not resolve to vi, so it is highlighted as chromatic color rather than an ordinary secondary-dominant resolution.',
    'Hear IV become minor iv, then return to I across the loop boundary.',
    [1, 'chromatic', 'Major III contains a note outside the reference major scale.'],
    [3, 'borrowed', 'Minor iv contrasts with the preceding major IV.'],
  ),
  'pop-10': lesson(
    'This cadence approaches V through IV and ii. Resolution means arriving back at I, which happens when the loop restarts after the last V.',
    'Hear ii–V build expectation and I release it on the next pass.',
    [2, 'preparation', 'ii sets up the following V.'],
    [0, 'resolution', 'The closing V resolves to this I across the loop boundary.'],
  ),
  'pop-11': lesson(
    'vi–ii–V–I follows a chain of roots moving by fifths. Each step points toward the next until the final I provides a clear major-key arrival.',
    'Follow the bass roots as they lead toward the last chord.',
    [1, 'circle', 'vi–ii–V–I follows fifth-related roots.'],
    [3, 'resolution', 'V resolves directly to I.'],
  ),
  'pop-12': lesson(
    'This longer canon-family sequence alternates falling and rising root movements. Repeated I and IV cards are part of the full arrangement, even though the preview lists each chord only once.',
    'Follow the two I arrivals, then hear the final V prepare the beginning.',
    [4, 'preparation', 'IV leads back toward I in the next card.'],
    [7, 'turnaround', 'The final V leads back to the opening I.'],
  ),
  'pop-13': lesson(
    'The second chord rises from I to ii before moving to IV. The final IV–I is a plagal return, a softer homecoming than V–I.',
    'Hear the small lift into ii and the settled last I.',
    [1, 'preparation', 'ii introduces motion before IV.'],
    [3, 'resolution', 'IV resolves to I within the displayed sequence.'],
  ),
  'pop-14': lesson(
    'This I–vi–ii–V turnaround starts at home and circles back toward it. The final V connects to the first I on the next repetition.',
    'Feel the last three chords gather direction toward the restart.',
    [1, 'relative', 'vi supplies a minor color after I.'],
    [3, 'turnaround', 'V completes the turnaround by pointing back to I.'],
  ),
  'pop-15': lesson(
    'IV–V suggests a coming I, but the next chord is iii and then vi. The title describes that change of color and falling roots; this is not a direct V–vi deceptive cadence.',
    'Compare the expected home arrival with the actual move into iii.',
    [3, 'relative', 'vi is the relative minor of the reference key.'],
    [2, 'circle', 'iii–vi is a fifth-related move.'],
  ),
  'pop-16': lesson(
    'This minor loop uses i with the major chords on flat-six, flat-three, and flat-seven. The flat numerals refer to the major-scale grid, not notes that must be flattened again.',
    'Hear how the last flat-seven chord leads back to minor i.',
    [0, 'home', 'i is the minor home chord.'],
    [1, 'modal', 'Flat-six is part of the natural-minor chord palette.'],
  ),
  'pop-17': lesson(
    'The major IV gives this minor-centered loop a Dorian color. Its third contains the raised sixth of the minor key, distinguishing it from minor iv.',
    'Compare the dark i with the brighter major IV.',
    [0, 'home', 'i establishes the minor center.'],
    [3, 'modal', 'Major IV supplies the characteristic Dorian sixth.'],
  ),
  'pop-18': lesson(
    'This Andalusian-family cadence descends i–flat-seven–flat-six–V. Major V supplies the raised leading tone of the minor key and pulls back toward i.',
    'Follow the descending roots, then hear the tension of V before the restart.',
    [2, 'modal', 'Flat-six continues the descending minor-key bass.'],
    [3, 'turnaround', 'Major V prepares the return to minor i.'],
  ),
  'pop-19': lesson(
    'This three-chord minor loop omits a major dominant. Motion comes from the contrast between minor i and the major flat-six and flat-seven chords.',
    'Listen for a modal return from flat-seven to i rather than a V–i cadence.',
    [0, 'home', 'i anchors the minor loop.'],
    [2, 'modal', 'Flat-seven returns to i without a raised leading tone.'],
  ),
  'pop-20': lesson(
    'The opening IV–V delays the tonic until the third card. Resolution is that V–I arrival; the following vi changes the color after home has already arrived.',
    'Hear the release on card 3 before the minor turn on card 4.',
    [2, 'resolution', 'V resolves to I here.'],
    [3, 'relative', 'vi follows the tonic arrival; it is not a V–vi deceptive move.'],
  ),

  'rock-1': lesson(
    'This major-key rock loop contrasts I and V with relative-minor vi, then IV. Its familiar four-chord shape can support a steady repeating strum.',
    'Hear the change into vi without losing the pulse.',
    [2, 'relative', 'vi is the relative-minor contrast.'],
    [0, 'home', 'The final IV returns to this I on each pass.'],
  ),
  'rock-2': lesson(
    'I–flat-seven–IV uses a Mixolydian-style flat-seven color. This exercise treats its opening chord as I; songs using this chord family may support other tonal interpretations.',
    'Hear IV held longer before the loop returns to I.',
    [1, 'modal', 'Flat-seven supplies the lowered-seventh color.'],
    [0, 'resolution', 'IV returns to the reference I at the restart.'],
  ),
  'rock-3': lesson(
    'The three primary chords I, IV, and V outline a straightforward major-key rock loop. The last V resolves only when the first I returns.',
    'Make the final V sound ready for the restart.',
    [1, 'preparation', 'IV sets up the following V.'],
    [2, 'turnaround', 'The closing V leads back to I.'],
  ),
  'rock-4': lesson(
    'The 5 suffix denotes a power chord: root and fifth without a third. Repeated IV5 cards preserve the rhythm of the four-card arrangement.',
    'Keep the attack consistent and let the roots define the movement.',
    [0, 'power', 'I5 leaves out the major third.'],
    [2, 'power', 'V5 keeps the same root-and-fifth shape on another degree.'],
  ),
  'rock-5': lesson(
    'This anthem-style loop places minor i against the major flat-six, flat-three, and flat-seven chords. It gets its drive from repeated modal movement rather than a major V.',
    'Hear the last flat-seven chord cycle back into minor home.',
    [0, 'home', 'i is the minor center.'],
    [3, 'modal', 'Flat-seven returns to i without a conventional major dominant.'],
  ),
  'rock-6': lesson(
    'Major III and minor iv are the contrasting colors in I–III–IV–iv. III rises to IV here instead of making the usual secondary-dominant move to vi.',
    'Listen to the one-note change when IV becomes iv.',
    [1, 'chromatic', 'Major III introduces chromatic color before IV.'],
    [3, 'borrowed', 'Minor iv is borrowed from the parallel minor key.'],
  ),
  'rock-7': lesson(
    'This vamp alternates I and flat-seven, suggesting a Mixolydian color. With only two chords, the groove and emphasis help establish which one feels like home.',
    'Hear the lowered-seventh root move back up to I.',
    [0, 'home', 'I is the chosen reference tonic.'],
    [1, 'modal', 'Flat-seven replaces the leading-tone flavor of a major V cadence.'],
  ),
  'rock-8': lesson(
    'Flat-seven–IV–I is often described as a double-plagal cadence. Two fourth-related returns bring the progression back to its final tonic.',
    'Hear the last IV–I as the clearest arrival.',
    [0, 'modal', 'Flat-seven begins the double-plagal route.'],
    [2, 'resolution', 'The final IV–I reaches home.'],
  ),
  'rock-9': lesson(
    'This descending minor cadence moves through flat-seven and flat-six to major V. The major dominant adds the leading-tone tension needed to return to minor i.',
    'Let the bass descend, then hear V pull toward the next loop.',
    [2, 'modal', 'Flat-six is the last step of the descent before V.'],
    [3, 'turnaround', 'V prepares the restart on i.'],
  ),
  'rock-10': lesson(
    'Major IV changes into borrowed minor iv before returning to I. Resolution is the final iv–I arrival, colored by the descending note inside IV–iv.',
    'Track the third of IV as it lowers into minor iv.',
    [2, 'borrowed', 'iv changes the major four chord to its parallel-minor version.'],
    [3, 'resolution', 'Borrowed iv returns to I.'],
  ),
  'rock-11': lesson(
    'The opening I visits IV and returns home before leaving on V. The last dominant connects the short phrase to the next repetition.',
    'Hear the middle I as a brief rest and the final V as a question.',
    [2, 'resolution', 'IV returns to I inside the loop.'],
    [3, 'turnaround', 'V leads back to the opening tonic.'],
  ),
  'rock-12': lesson(
    'Minor i and iv lead to major V, then back to i. The raised leading tone inside V makes the last V–i a strong minor-key resolution.',
    'Compare the minor iv with the brighter major V.',
    [2, 'dominant', 'Major V creates leading-tone tension in minor.'],
    [3, 'resolution', 'V resolves to the final i.'],
  ),
  'rock-13': lesson(
    'This short minor-centered loop uses a major IV. That chord gives it a Dorian flavor by introducing the raised sixth of the minor scale.',
    'Hear major IV brighten the route back to i.',
    [0, 'home', 'i supplies the minor reference center.'],
    [2, 'modal', 'Major IV is the Dorian-colored contrast.'],
  ),
  'rock-14': lesson(
    'A vamp is a repeating accompaniment pattern; this one alternates I and IV. There is no V chord, so the loop relies on a gentler IV–I return.',
    'Keep the rhythm steady while listening to the shared chord tones.',
    [0, 'home', 'I is the home side of the vamp.'],
    [1, 'preparation', 'IV sets up the next return to I.'],
  ),
  'rock-15': lesson(
    'This minor vamp alternates i and iv. Both chords are minor, and neither acts as a major dominant with a leading tone.',
    'Hear a relaxed iv–i return instead of a tense V–i cadence.',
    [0, 'home', 'i anchors the minor vamp.'],
    [1, 'preparation', 'iv leads back to i at the loop boundary.'],
  ),
  'rock-16': lesson(
    'This version begins on vi before visiting IV, I, and V. Starting on the relative minor changes the emphasis even though the chord family is familiar.',
    'Hear the final V return to vi rather than landing on I.',
    [0, 'relative', 'vi opens the loop with a minor emphasis.'],
    [3, 'dominant', 'V leaves an expected tonic arrival unresolved at the restart.'],
  ),
  'rock-17': lesson(
    'Power chords descend through I5, flat-seven5, and flat-six5 before climbing back to flat-seven5. Without thirds, the shapes do not establish major or minor quality on their own.',
    'Follow the bass descent while keeping the fifth shapes even.',
    [0, 'power', 'I5 contains root and fifth, not a third.'],
    [2, 'modal', 'Flat-six is the low point of the root pattern.'],
  ),
  'rock-18': lesson(
    'Beginning on IV delays the home chord until the second card. The following V moves to vi, giving the ending a deceptive change instead of a tonic resolution.',
    'Hear V lead to minor vi where I might have been expected.',
    [1, 'home', 'I arrives after the opening IV.'],
    [3, 'deceptive', 'The preceding V goes to vi instead of I.'],
  ),
  'rock-19': lesson(
    'Each sus4 chord replaces its third with a fourth, then releases that note into the plain chord. This happens on both I and V in the displayed arrangement.',
    'Listen to the fourth fall to the third in each pair.',
    [0, 'suspension', 'Isus4 releases into I on the next card.'],
    [2, 'suspension', 'Vsus4 releases into V on the last card.'],
  ),
  'rock-20': lesson(
    'Dominant-seventh colors on I, IV, and V bring a blues vocabulary into a short rock loop. In this context I7 can feel like home despite its seventh.',
    'Hear the final IV7 return to I7 rather than requiring V7–I7.',
    [0, 'home', 'I7 is the blues-colored tonic.'],
    [2, 'dominant', 'V7 creates the five-chord contrast before IV7.'],
  ),

  'blues-1': lesson(
    'This twelve-bar form moves to IV7 in bar 5 and reaches I7 again in bar 11. The final V7 is a turnaround chord: it prepares the return to I7 at the beginning.',
    'Hear the release at bar 11, then the renewed pull of V7 in bar 12.',
    [8, 'dominant', 'V7 begins the closing four-bar phrase.'],
    [10, 'resolution', 'IV7 returns to I7 in bar 11.'],
    [11, 'turnaround', 'V7 in bar 12 points back to the opening I7.'],
  ),
  'blues-2': lesson(
    'Quick change means visiting IV7 in bar 2 instead of staying on I7 for all four opening bars. The ending returns to I7 in bar 11, then uses V7 to restart.',
    'Compare the early IV7 visit with the longer IV7 section beginning at bar 5.',
    [1, 'quick', 'The second bar visits IV7, then returns to I7.'],
    [10, 'resolution', 'The closing phrase reaches I7 in bar 11.'],
    [11, 'turnaround', 'The final V7 prepares another chorus.'],
  ),
  'blues-3': lesson(
    'Resolution means arriving home: this version reaches I7 in bar 11 and stays there through bar 12. Unlike the classic exercise, it does not add a final V7 turnaround chord.',
    'Hear the last two tonic bars settle rather than build new dominant tension.',
    [8, 'dominant', 'V7 starts the closing phrase.'],
    [10, 'resolution', 'I7 arrives in bar 11 and is held through the last bar.'],
  ),
  'blues-4': lesson(
    'The five chord is sustained across bars 9 and 10 rather than moving to IV7 in bar 10. It resolves directly to I7 in bar 11 and stays home to finish.',
    'Listen for two full bars of V7 tension before the last tonic pair.',
    [8, 'dominant', 'V7 is held for bars 9–10.'],
    [10, 'resolution', 'V7 resolves directly to I7 at bar 11.'],
  ),
  'blues-5': lesson(
    'Quick change is the IV7 visit in bar 2. Resolution is the arrival on I7 in bar 11, held through bar 12; this ending stays home instead of adding a final V7 turnaround chord.',
    'Compare the brief early IV7 with the settled final two bars of I7.',
    [1, 'quick', 'IV7 appears early in the second bar.'],
    [10, 'resolution', 'IV7 moves to I7 at bar 11, then I7 continues through bar 12.'],
  ),
  'blues-6': lesson(
    'This quick-change blues adds ninths to its I, IV, and V chords. Those extensions color the harmony while the twelve-bar route and final dominant turnaround remain familiar.',
    'Hear the extra color without losing the bar-2 change or bar-12 restart.',
    [1, 'quick', 'IV9 is the quick change in bar 2.'],
    [8, 'extension', 'V9 adds a ninth to the five-chord sound.'],
    [11, 'turnaround', 'The final V9 leads back to I9.'],
  ),
  'blues-7': lesson(
    'I6 colors the tonic with a sixth instead of a seventh. The change to I7 in bar 4 introduces the dominant-seventh color before the IV7 section.',
    'Compare I6 and I7, then hear how bar 4 prepares the four chord.',
    [3, 'preparation', 'I7 changes the tonic color just before IV7.'],
    [10, 'resolution', 'The closing IV7 returns to I6.'],
    [11, 'turnaround', 'V7 prepares the opening I6 again.'],
  ),
  'blues-8': lesson(
    'This twelve-bar exercise uses minor i7 and iv7 with a major V7. The major dominant contrasts with the minor chords and supplies a pull back to i7.',
    'Hear the brighter V7 against the minor tonic and four chord.',
    [8, 'dominant', 'Major V7 begins the closing phrase.'],
    [10, 'resolution', 'iv7 returns to i7 in bar 11.'],
    [11, 'turnaround', 'The last V7 points back to minor home.'],
  ),
  'blues-9': lesson(
    'The closing phrase uses flat-six major seventh before V7 and minor i7. Flat-six supplies a descending root approach; the resolution arrives at i7 in bar 11.',
    'Follow flat-six down to V, then hear V7 resolve into minor i7.',
    [8, 'preparation', 'Flat-six major seventh approaches V7.'],
    [10, 'resolution', 'V7 resolves to i7 in bar 11.'],
  ),
  'blues-10': lesson(
    'This jazz-blues variation adds VI7–ii7–V7 before the tonic arrival in bar 11. VI7 acts as the dominant of ii, while the last V7 prepares another chorus.',
    'Hear the moving roots at bars 8–11 compared with the opening blues chords.',
    [7, 'secondary', 'VI7 leads to ii7 as its secondary dominant.'],
    [10, 'resolution', 'ii7–V7 reaches I7 in bar 11.'],
    [11, 'turnaround', 'V7 in the last bar leads back to the beginning.'],
  ),
  'blues-11': lesson(
    'A raised-four diminished chord connects IV7 back toward I7 in bar 6. Later, VI7–ii7–V7 adds jazz-style direction before the return to the blues tonic.',
    'Hear the brief diminished tension between IV7 and I7.',
    [5, 'passing', 'Raised-four diminished seventh is the passing chord in bar 6.'],
    [7, 'secondary', 'VI7 points toward ii7.'],
    [11, 'turnaround', 'The final V7 prepares the next chorus.'],
  ),
  'blues-12': lesson(
    'The final two bars contain four half-bar chords: I7–VI7–ii7–V7. This is a turnaround within a twelve-bar form, so fourteen cards still add up to twelve bars.',
    'Keep two chords per bar at the ending instead of adding extra bars.',
    [11, 'secondary', 'VI7 targets the following ii7 inside the half-bar turnaround.'],
    [12, 'turnaround', 'ii7 occupies the first half of bar 12.'],
    [13, 'turnaround', 'V7 occupies the second half of bar 12 and leads back to I7.'],
  ),
  'blues-13': lesson(
    'The tonic carries a thirteenth while IV9 and V9 add ninths. These colors decorate a quick-change twelve-bar blues rather than replacing its larger form.',
    'Keep track of the form while hearing the richer dominant chords.',
    [1, 'quick', 'IV9 appears in the second bar.'],
    [0, 'extension', 'I13 adds upper color to the tonic dominant-seventh sound.'],
    [11, 'turnaround', 'The final V9 points toward the opening I13.'],
  ),
  'blues-14': lesson(
    'This is a four-bar blues drill, not a full twelve-bar chorus. It visits I7, IV7, and I7 again before V7 turns the loop back toward its opening.',
    'Feel the short phrase repeat while keeping the blues chord colors.',
    [2, 'resolution', 'IV7 returns to I7 on the third card.'],
    [3, 'turnaround', 'V7 closes the drill by preparing I7.'],
  ),
  'blues-15': lesson(
    'I7–VI7–ii7–V7 is a compact jazz-blues turnaround. VI7 intensifies the move to ii7, and the final V7 leads back to the tonic at the restart.',
    'Follow the fifth-related roots through the last three chords.',
    [1, 'secondary', 'VI7 functions as the dominant of ii7.'],
    [3, 'turnaround', 'V7 leads back to the opening I7.'],
  ),
  'blues-16': lesson(
    'This drill descends by semitone from flat-three7 through II7 and flat-two7. The last chord approaches I7 from a semitone above, using a tritone-substitution color.',
    'Listen to the descending bass rather than treating each chord as a new key.',
    [1, 'chromatic', 'Flat-three7 begins the chromatic descent.'],
    [3, 'tritone', 'Flat-two7 substitutes for V7 before the loop returns to I7.'],
  ),
  'blues-17': lesson(
    'Major IV7 changes to minor iv7 before reaching I7. The remaining VI7–ii7–V7 forms a turnaround that leads back to the opening IV7, extending the phrase rather than ending on I.',
    'Hear IV7 become minor iv7, then the secondary-dominant motion later in the loop.',
    [1, 'borrowed', 'iv7 is the minor version of the preceding IV7.'],
    [2, 'resolution', 'Minor iv7 returns to the blues tonic I7.'],
    [3, 'secondary', 'VI7 targets ii7.'],
  ),
  'blues-18': lesson(
    'The minor four chord appears early in bar 2. At the ending, flat-six7 descends to V7, i7 arrives in bar 11, and the last V7 turns back to the start.',
    'Hear both the early minor-four visit and the closing flat-six7–V7 approach.',
    [1, 'quick', 'iv7 is the second-bar quick change.'],
    [10, 'resolution', 'V7 resolves to i7 in bar 11.'],
    [11, 'turnaround', 'The last V7 prepares another minor-blues chorus.'],
  ),
  'blues-19': lesson(
    'After the opening blues phrase, VI7–II7–V7 creates a chain of secondary dominants. II7 is the dominant of V, and V7 then returns to I7 in bar 11.',
    'Follow the increasing direction through bars 8–11.',
    [7, 'secondary', 'VI7 leads to II7 in the dominant chain.'],
    [8, 'secondary', 'II7 functions as V of V.'],
    [11, 'turnaround', 'The final V7 sends the form back to I7.'],
  ),
  'blues-20': lesson(
    'This slow-blues drill uses ninth chords in a short I9–IV9–V9–IV9 loop. Its last IV9 returns to I9, so the close is a plagal-style return rather than V9–I9.',
    'Let the ninth colors ring while hearing the four chord lead back home.',
    [0, 'extension', 'I9 adds a ninth above the tonic harmony.'],
    [2, 'dominant', 'V9 is the five chord before the final IV9.'],
  ),

  'jazz-1': lesson(
    'ii7–V7–Imaj7 is a major-key cadence: preparation, dominant tension, then tonic arrival. The last chord is held for two bars in this version.',
    'Hear the seventh-chord tension settle on the longer Imaj7.',
    [0, 'preparation', 'ii7 sets up V7.'],
    [2, 'resolution', 'V7 reaches Imaj7, held for two bars.'],
  ),
  'jazz-2': lesson(
    'This shorter ii–V–I puts ii7 and V7 into half a bar each, followed by one bar of Imaj7. The harmonic roles match the longer version, but the first two changes arrive faster.',
    'Keep the two half-bar chords even before settling on Imaj7.',
    [0, 'preparation', 'ii7 begins the first half-bar.'],
    [2, 'resolution', 'Imaj7 arrives after the short ii7–V7.'],
  ),
  'jazz-3': lesson(
    'Imaj7–vi7–ii7–V7 is a short rhythm-changes turnaround family. Each chord lasts half a bar; the final dominant resolves when the first tonic repeats.',
    'Hear the final three roots guide the loop back toward home.',
    [1, 'relative', 'vi7 adds the relative-minor color.'],
    [3, 'turnaround', 'The last half-bar V7 prepares Imaj7.'],
  ),
  'jazz-4': lesson(
    'VI7 replaces the usual minor vi7 in this turnaround. Its major third adds a leading tone toward ii7, making it a secondary dominant.',
    'Compare the stronger VI7–ii7 pull with a plain vi7–ii7 move.',
    [1, 'secondary', 'VI7 is the dominant of the following ii7.'],
    [3, 'turnaround', 'V7 leads back to Imaj7 at the restart.'],
  ),
  'jazz-5': lesson(
    'A minor ii–V–i uses half-diminished iiø7 before major V7 and minor i7. The altered quality of ii and the major dominant distinguish this from the major cadence.',
    'Hear the tension of iiø7–V7 settle on the longer minor tonic.',
    [0, 'preparation', 'iiø7 is the half-diminished preparation chord.'],
    [2, 'resolution', 'V7 arrives on minor i7.'],
  ),
  'jazz-6': lesson(
    'Minor iv7 and flat-seven7 approach Imaj7 by a backdoor route. This substitutes a different color for the more familiar ii7–V7–Imaj7 arrival.',
    'Listen for the upward whole-step root move from flat-seven7 to I.',
    [0, 'borrowed', 'Minor iv7 contrasts with the reference major key.'],
    [1, 'backdoor', 'Flat-seven7 leads to Imaj7 rather than acting as the main V7.'],
    [2, 'resolution', 'Imaj7 is the destination of the backdoor cadence.'],
  ),
  'jazz-7': lesson(
    'Flat-two7 replaces the usual V7 between ii7 and Imaj7. Its root descends a semitone into I while retaining a dominant-seventh tension.',
    'Hear ii–flat-two–I as a descending chromatic bass line.',
    [1, 'tritone', 'Flat-two7 substitutes for V7.'],
    [2, 'resolution', 'The substitute dominant resolves down a semitone to Imaj7.'],
  ),
  'jazz-8': lesson(
    'The first three chords make a ii–V–I cadence. VI7 then turns the harmony toward ii7, connecting the arrival to the next repetition.',
    'Hear Imaj7 as a rest before VI7 starts the next journey.',
    [2, 'resolution', 'V7 resolves to Imaj7.'],
    [3, 'secondary', 'VI7 targets ii7 at the start of the next pass.'],
  ),
  'jazz-9': lesson(
    'This longer chain follows fifth-related roots through a major cadence and then toward vi7. III7 is a secondary dominant aimed at the final relative-minor chord.',
    'Follow the root motion and hear both the Imaj7 arrival and the later vi7 arrival.',
    [3, 'resolution', 'V7 reaches Imaj7 midway through the sequence.'],
    [6, 'secondary', 'III7 leads to the final vi7.'],
  ),
  'jazz-10': lesson(
    'The opening II7 is a chromatic major-two dominant color associated with V. Here it first changes to minor ii7, so the complete arrival is delayed until ii7–V7–Imaj7.',
    'Compare II7 with the ii7 that follows: the shared root stays while the chord quality changes.',
    [
      1,
      'secondary',
      'II7 suggests V of V, but this arrangement delays that destination through ii7.',
    ],
    [4, 'resolution', 'The final V7 reaches Imaj7.'],
  ),
  'jazz-11': lesson(
    'Raised-one and raised-two diminished sevenths connect Imaj7, ii7, and iii7 by chromatic root motion. The final VI7 prepares ii7, although this loop restarts on Imaj7 instead.',
    'Hear each diminished chord as a brief connector rather than a place to settle.',
    [1, 'passing', 'Raised-one diminished seventh connects Imaj7 to ii7.'],
    [3, 'passing', 'Raised-two diminished seventh connects ii7 to iii7.'],
    [
      5,
      'secondary',
      'VI7 carries a dominant-of-ii color; the expected ii is omitted at the restart.',
    ],
  ),
  'jazz-12': lesson(
    'A minor line cliché keeps the tonic root while an inner note descends: tonic, major seventh, minor seventh, then sixth. The exact register of that moving note depends on the voicing.',
    'Find the descending note while treating all four chords as colors of minor home.',
    [1, 'line', 'The major seventh begins the descending inner line.'],
    [2, 'line', 'The line lowers again into the minor seventh.'],
    [3, 'line', 'The sixth completes the displayed descent.'],
  ),
  'jazz-13': lesson(
    'I7 changes the tonic into a dominant aimed at IVmaj7. The last iv7 borrows a minor-four color and returns to Imaj7 across the loop boundary.',
    'Hear Imaj7 become I7, then major IV become minor iv.',
    [1, 'secondary', 'I7 acts as the dominant of IVmaj7.'],
    [3, 'borrowed', 'Minor iv7 leads back to Imaj7 at the restart.'],
  ),
  'jazz-14': lesson(
    'This minor cadence colors V7 with a flat ninth before arriving on minor i6. The flat ninth increases tension; the tonic sixth gives a different resting color from i7.',
    'Hear the altered dominant release into the longer i6.',
    [1, 'extension', 'V7 flat-nine adds an altered upper note to the dominant.'],
    [2, 'resolution', 'The altered V resolves to minor i6.'],
  ),
  'jazz-15': lesson(
    'III7–VI7–II7–V7 is a chain of dominant seventh chords related by fifths. This is a bridge-family extract, not the full rhythm-changes song form.',
    'Hear each dominant point to the next root, with the final V still asking for I outside this extract.',
    [0, 'secondary', 'III7 points toward VI7.'],
    [2, 'secondary', 'II7 is the dominant of the following V7.'],
    [3, 'dominant', 'V7 would normally prepare I, which is not included in this short loop.'],
  ),
  'jazz-16': lesson(
    'This extract shifts through temporary major destinations rather than staying in one functional key. i7–IV7 leads to flat-seven major seventh, then flat-seven7–flat-three7 leads to flat-six major seventh.',
    'Hear the two later major-seventh arrivals as new local resting points.',
    [3, 'resolution', 'i7–IV7 arrives on flat-seven major seventh.'],
    [6, 'resolution', 'Flat-seven7–flat-three7 arrives on flat-six major seventh.'],
  ),
  'jazz-17': lesson(
    'Ninths and a thirteenth add upper color to a major ii–V–I cadence. The underlying root motion is unchanged, and the final Imaj9 is held longer.',
    'Follow the familiar cadence underneath the richer chord colors.',
    [1, 'extension', 'V13 adds upper color to the dominant.'],
    [2, 'resolution', 'V13 resolves to the longer Imaj9.'],
  ),
  'jazz-18': lesson(
    'A minor iiø–V–i cadence is followed by flat-three7 as a chromatic approach to the next iiø7. Its root falls a semitone at the loop boundary.',
    'Separate the clear minor-tonic arrival from the chromatic chord that follows.',
    [2, 'resolution', 'V7 resolves to minor i7.'],
    [3, 'chromatic', 'Flat-three7 approaches the next iiø7 from a semitone above.'],
  ),
  'jazz-19': lesson(
    'Flat-two7 substitutes for V7 before Imaj7. The final flat-three7 then approaches the opening ii7 from a semitone above, creating another chromatic connection.',
    'Hear the two semitone root approaches, one to I and one to ii.',
    [1, 'tritone', 'Flat-two7 replaces the usual V7 before Imaj7.'],
    [2, 'resolution', 'Imaj7 receives the substitute-dominant arrival.'],
    [3, 'chromatic', 'Flat-three7 connects back to ii7 at the restart.'],
  ),
  'jazz-20': lesson(
    'This minor descent colors flat-seven as a dominant seventh and flat-six as a major seventh. The final major V7 supplies the leading-tone pull back toward i7.',
    'Follow the descending roots while hearing the changing seventh qualities.',
    [2, 'extension', 'Flat-six major seventh softens the descent before V7.'],
    [3, 'turnaround', 'The last V7 points back to minor i7.'],
  ),

  'neosoul-1': lesson(
    'This soulful ii–V–I uses seventh chords and a longer tonic arrival. The name describes the playing context; the harmonic preparation and resolution are the same major cadence used in jazz.',
    'Leave space for Imaj7 to settle after the first two changes.',
    [0, 'preparation', 'ii7 prepares V7.'],
    [2, 'resolution', 'V7 resolves to the longer Imaj7.'],
  ),
  'neosoul-2': lesson(
    'This seventh-chord version of I–vi–IV–V keeps a familiar turnaround family while adding softer upper colors. The final V7 returns to Imaj7 when the loop repeats.',
    'Hear the relative-minor change and the last dominant leading home.',
    [1, 'relative', 'vi7 supplies the relative-minor color.'],
    [3, 'turnaround', 'V7 closes the phrase by preparing Imaj7.'],
  ),
  'neosoul-3': lesson(
    'Opening on vi7 gives this four-chord loop a minor emphasis before IVmaj7 and Imaj7. The final V7 returns to vi7 rather than making an immediate tonic arrival.',
    'Hear the major Imaj7 inside the loop and the minor return at the restart.',
    [0, 'relative', 'vi7 is the opening relative-minor chord.'],
    [3, 'dominant', 'V7 leaves a tonic expectation open when the loop returns to vi7.'],
  ),
  'neosoul-4': lesson(
    'IVmaj7 changes to minor iv7 before reaching Imaj7. The minor-four chord is borrowed from the parallel minor key and gives the arrival a contrasting color.',
    'Listen for the note that lowers as major IV becomes minor iv.',
    [1, 'borrowed', 'Minor iv7 changes the color of the preceding IVmaj7.'],
    [2, 'resolution', 'Minor iv7 returns to the longer Imaj7.'],
  ),
  'neosoul-5': lesson(
    'iii7–vi7–ii7–V7 follows fifth-related roots. It ends on the dominant without including I, so the repeating exercise keeps the final tonic arrival open.',
    'Follow the bass roots and notice that V7 returns to iii7 at the restart.',
    [1, 'circle', 'iii7–vi7–ii7 continues a fifth-related chain.'],
    [3, 'dominant', 'The final V7 suggests I, but I is absent from this loop.'],
  ),
  'neosoul-6': lesson(
    'IVmaj7 moves through major III7 to vi7. III7 is the secondary dominant of vi, so the arrival is on the relative minor rather than the major tonic.',
    'Hear III7 intensify the move into the longer vi7.',
    [1, 'secondary', 'III7 functions as V of vi.'],
    [2, 'resolution', 'III7 resolves to vi7, a local minor destination.'],
  ),
  'neosoul-7': lesson(
    'The opening IVmaj7–III7–vi7 reaches a relative-minor destination. The half-bar v7–I7 at the ending then acts as a local ii–V leading back to IVmaj7.',
    'Hear the short last two chords aim toward the first chord of the next loop.',
    [1, 'secondary', 'III7 targets vi7.'],
    [4, 'secondary', 'I7 acts as the dominant of IVmaj7 at the loop boundary.'],
  ),
  'neosoul-8': lesson(
    'This extended ii–V–I adds ninth and thirteenth colors without changing the cadence roots. Imaj9 is the resting point and lasts two bars by default.',
    'Hear the upper colors while keeping the final tonic arrival clear.',
    [1, 'extension', 'V13 adds upper dominant color.'],
    [2, 'resolution', 'V13 resolves to the longer Imaj9.'],
  ),
  'neosoul-9': lesson(
    'Imaj9–vi9–ii9–V13 is a turnaround with extended chord colors. The final V13 connects back to Imaj9 rather than ending on a separate tonic card.',
    'Hear the root direction underneath the ninths and thirteenth.',
    [1, 'relative', 'vi9 provides the relative-minor color.'],
    [3, 'turnaround', 'V13 prepares the opening Imaj9.'],
  ),
  'neosoul-10': lesson(
    'Major IVmaj9 turns into minor iv9 before returning to Imaj9. The borrowed minor-four color changes the inside notes while the root of IV stays in place.',
    'Compare the two four-chord qualities before the tonic release.',
    [1, 'borrowed', 'iv9 supplies the parallel-minor color after IVmaj9.'],
    [2, 'resolution', 'The minor four returns to Imaj9.'],
  ),
  'neosoul-11': lesson(
    'Minor i7 and v7 sit alongside major flat-three and IV. Major IV contributes the raised sixth associated with a Dorian minor sound.',
    'Hear the contrast between the minor chords and the bright major IV.',
    [0, 'home', 'i7 supplies the minor reference center.'],
    [3, 'modal', 'Major IV introduces the Dorian sixth.'],
  ),
  'neosoul-12': lesson(
    'This Dorian-inspired variation expands the chord colors beyond a strict Dorian collection. In particular, IVmaj9 adds a major seventh that is not part of the same Dorian scale.',
    'Hear the familiar minor-centered roots and the extra color of IVmaj9.',
    [0, 'extension', 'i9 adds a ninth to the minor tonic.'],
    [3, 'chromatic', 'The major seventh of IVmaj9 goes beyond the basic Dorian palette.'],
  ),
  'neosoul-13': lesson(
    'Minor iv9 and flat-seven13 form an extended backdoor approach to Imaj9. The tonic is reached by a different route from the usual V7–I cadence.',
    'Hear the flat-seven root rise a whole step into I.',
    [1, 'backdoor', 'Flat-seven13 leads into Imaj9 after minor iv9.'],
    [2, 'resolution', 'Imaj9 is the destination of the backdoor approach.'],
  ),
  'neosoul-14': lesson(
    'ii7–V7 sets up an expected I, but vi7 arrives instead. That V–vi move is deceptive; IVmaj7 follows and keeps the loop moving.',
    'Listen for the minor arrival where a major tonic might have been expected.',
    [1, 'dominant', 'V7 establishes the tonic expectation.'],
    [2, 'deceptive', 'V7 moves to vi7 instead of Imaj7.'],
  ),
  'neosoul-15': lesson(
    'Minor iv7 is inserted between ii7 and V7 as a borrowed color. This short passage ends on V7, so a tonic resolution is suggested but not included.',
    'Hear the darker iv7 before the stronger dominant tension.',
    [1, 'borrowed', 'iv7 comes from the parallel minor palette.'],
    [2, 'dominant', 'V7 ends the passage without an I card.'],
  ),
  'neosoul-16': lesson(
    'This primary-chord loop adds major sevenths on I and IV and a dominant seventh on V. The final IVmaj7 returns gently to Imaj7.',
    'Hear the seventh-chord colors without treating every chord as a new key.',
    [0, 'home', 'Imaj7 is the major reference tonic.'],
    [2, 'dominant', 'V7 provides dominant tension before the final IVmaj7.'],
  ),
  'neosoul-17': lesson(
    'This longer soul sequence passes through vi7 and iii7 before IVmaj7 returns to Imaj7. The final IV–I movement gives a gentler resolution than a direct V–I.',
    'Hear the last two chords as the homecoming after the longer middle passage.',
    [2, 'relative', 'vi7 introduces the relative-minor color.'],
    [5, 'resolution', 'IVmaj7 resolves to the final Imaj7.'],
  ),
  'neosoul-18': lesson(
    'The title suspended describes the open sound, but i11 still contains a minor third: it is not a literal sus4 chord. IV9 adds the raised-sixth color of a Dorian minor setting.',
    'Compare the spacious minor-eleventh chord with the brighter dominant-ninth IV.',
    [0, 'extension', 'i11 adds an eleventh above a minor harmony rather than replacing its third.'],
    [1, 'modal', 'IV9 provides a major-four, Dorian-colored contrast.'],
  ),
  'neosoul-19': lesson(
    'Flat-two9 replaces V between ii9 and Imaj9. Its semitone approach to the tonic combines a tritone-substitution root with an extended dominant color.',
    'Hear the roots descend ii–flat-two–I.',
    [1, 'tritone', 'Flat-two9 replaces the usual dominant on V.'],
    [2, 'resolution', 'The substitute dominant resolves to Imaj9.'],
  ),
  'neosoul-20': lesson(
    'Half-diminished iiø7 leads to an altered V7 sharp-nine and then minor i9. The sharp ninth colors the dominant tension before the tonic arrival.',
    'Hear the altered V chord release into the longer minor ninth.',
    [1, 'extension', 'V7 sharp-nine adds an altered upper color.'],
    [2, 'resolution', 'The altered dominant resolves to minor i9.'],
  ),
};

export function theoryReference(progression: Progression): string {
  if (progression.genre === 'Blues')
    return 'https://openmusictheory.github.io/popRockHarmony-blues.html';
  if (progression.roman.some((r) => r.startsWith('bII') && !r.startsWith('bIII')))
    return book + 'substitutions/';
  if (progression.roman.some((r) => /^iv/.test(r)) && !progression.minor)
    return book + 'modal-mixture/';
  if (/Dorian|Mixolydian/.test(progression.title)) return book + 'modal-schemas/';
  if (
    progression.roman.some(
      (r, i) => /^ii(?:7|9|ø7)$/.test(r) && /^V/.test(progression.roman[i + 1] || ''),
    )
  )
    return book + 'ii-v-i/';
  return progression.source;
}

// Positions follow the current duration and meter, so half-bar cards and custom
// beats-per-chord settings do not leave incorrect fixed bar numbers in the UI.
export function theoryPosition(durations: number[], meter: number, index: number): string {
  const start = durations.slice(0, index).reduce((a, b) => a + b, 0);
  const first = Math.floor(start / meter) + 1;
  const last = Math.ceil((start + durations[index]) / meter);
  if (start % meter === 0 && durations[index] >= meter && durations[index] % meter === 0) {
    return first === last ? `Bar ${first}` : `Bars ${first}–${last}`;
  }
  return `Bar ${first}, beat ${(start % meter) + 1}`;
}
