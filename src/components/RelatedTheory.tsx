import { useState } from 'react';
import { ArrowUpRight, BookOpen, ChevronDown } from 'lucide-react';
import type { VoicingMode } from '../music';
import type { Progression } from '../catalog';
import { THEORY_CONCEPTS, type TheoryLesson, theoryPosition, theoryReference } from '../theory';

type Props = {
  progression: Progression;
  lesson: TheoryLesson;
  durations: number[];
  meter: number;
  voicingMode: VoicingMode;
  rhythmChanged: boolean;
};

export default function RelatedTheory({
  progression,
  lesson,
  durations,
  meter,
  voicingMode,
  rhythmChanged,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const concepts = [...new Set(lesson.focus.map((item) => item.concept))];
  return (
    <section className="related-theory" aria-labelledby="related-theory-title">
      <div className="theory-heading">
        <h3 id="related-theory-title">
          <button
            type="button"
            className="theory-disclosure"
            aria-expanded={expanded}
            aria-controls="related-theory-body"
            onClick={() => setExpanded((open) => !open)}
          >
            <BookOpen size={16} />
            Related theory
            <ChevronDown size={15} className={expanded ? 'rotated' : ''} />
          </button>
        </h3>
        <a href={theoryReference(progression)} target="_blank" rel="noreferrer">
          Further reading <ArrowUpRight size={13} />
        </a>
      </div>
      <div id="related-theory-body" hidden={!expanded}>
        {progression.variation && (
          <p className="theory-variation">
            <strong>About this variation.</strong> Variation identifies an adapted practice
            arrangement of a familiar chord family. Chord colors, order, or durations may be
            changed; the notes below explain the choices in this version.
          </p>
        )}
        <p>{lesson.explanation}</p>
        <p className="theory-listen">
          <strong>Listen for it:</strong> {lesson.listen}
        </p>
        <ul className="theory-notes">
          {lesson.focus.map(({ index, concept, note }) => (
            <li key={`${index}-${concept}`} id={`theory-${progression.id}-${index}-${concept}`}>
              <span className="theory-location">
                {theoryPosition(durations, meter, index)} ·{' '}
                {progression.roman[index].replaceAll('b', '♭').replaceAll('#', '♯')}
              </span>
              <span>
                <strong>{THEORY_CONCEPTS[concept][0]}.</strong> {note}
              </span>
            </li>
          ))}
        </ul>
        {rhythmChanged && (
          <p className="theory-context">
            The explanation describes the default form. The locations above follow your current
            rhythm settings.
          </p>
        )}
        {voicingMode !== 'basic' && (
          <p className="theory-context">
            The selected voicing can omit tones from the named harmony. Chord names and these notes
            describe the full progression; the Chord diagrams settings explain reductions and
            fallbacks.
          </p>
        )}
        <details className="theory-glossary">
          <summary>What do these labels mean?</summary>
          <dl>
            {concepts.map((concept) => (
              <div key={concept}>
                <dt>{THEORY_CONCEPTS[concept][0]}</dt>
                <dd>{THEORY_CONCEPTS[concept][1]}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </section>
  );
}
