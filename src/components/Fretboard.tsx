import { voicingFor, type Chord, type VoicingMode } from '../music';

export default function Fretboard({ chord, mode }: { chord: Chord; mode: VoicingMode }) {
  const shape = voicingFor(chord, mode);
  return (
    <>
      <svg
        className="fretboard"
        viewBox="0 0 120 110"
        role="img"
        aria-label={`${chord.name} guitar chord${shape.description ? ` (${shape.description})` : ''}: frets ${shape.frets.map((f) => (f === null ? 'muted' : f)).join(', ')}, from low E to high E`}
      >
        {[0, 1, 2, 3, 4].map((f) => (
          <line
            key={`f${f}`}
            x1="22"
            x2="102"
            y1={28 + f * 18}
            y2={28 + f * 18}
            className={f === 0 && shape.start === 1 ? 'nut' : 'fret'}
          />
        ))}
        {[0, 1, 2, 3, 4, 5].map((s) => (
          <line
            key={`s${s}`}
            x1={22 + s * 16}
            x2={22 + s * 16}
            y1="28"
            y2="100"
            className="string"
          />
        ))}
        {shape.start > 1 && (
          <text x="7" y="42" className="fret-label">
            {shape.start}
          </text>
        )}
        {shape.frets.map((f, s) =>
          f === null ? (
            <text key={s} x={22 + s * 16} y="18" textAnchor="middle" className="open-string">
              ×
            </text>
          ) : f === 0 ? (
            <circle key={s} cx={22 + s * 16} cy="14" r="3.5" className="open-dot" />
          ) : (
            <circle
              key={s}
              cx={22 + s * 16}
              cy={28 + (f - shape.start + 0.5) * 18}
              r="5.5"
              className="finger-dot"
            />
          ),
        )}
      </svg>
      {mode !== 'basic' && (
        <p className="voicing-caption">
          {shape.label === 'Triad' || shape.label === 'Shell' ? shape.label : 'Basic'}
        </p>
      )}
    </>
  );
}
