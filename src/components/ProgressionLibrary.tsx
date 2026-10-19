import { useEffect, useRef } from 'react';
import { Heart, SlidersHorizontal } from 'lucide-react';
import { GENRES, type Genre, type Progression } from '../catalog';
import { DIFFICULTIES } from '../practice';

type LibraryTab = Genre | 'Favorites';
type Props = {
  genre: LibraryTab;
  onGenreChange: (genre: LibraryTab) => void;
  difficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  items: Progression[];
  total: number;
  selectedId: string;
  favorites: string[];
  onChoose: (progression: Progression) => void;
  onFavorite: (id: string) => void;
};

export default function ProgressionLibrary({
  genre,
  onGenreChange,
  difficulty,
  onDifficultyChange,
  items,
  total,
  selectedId,
  favorites,
  onChoose,
  onFavorite,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>(`[data-progression-id="${selectedId}"]`);
    if (!list || !row) return;
    const listRect = list.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    if (rowRect.top < listRect.top || rowRect.bottom > listRect.bottom) {
      list.scrollTo({
        top:
          list.scrollTop + rowRect.top - listRect.top - (list.clientHeight - row.offsetHeight) / 2,
        behavior: 'auto',
      });
    }
  }, [selectedId, items]);

  return (
    <aside className="library panel" id="library" aria-label="Progression library">
      <div className="library-tabs" aria-label="Genre">
        {[...GENRES, 'Favorites' as const].map((tab) => (
          <button
            key={tab}
            aria-pressed={genre === tab}
            className={genre === tab ? 'active' : ''}
            onClick={() => onGenreChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="library-filters">
        <label>
          <SlidersHorizontal size={14} />
          <select
            aria-label="Difficulty filter"
            value={difficulty}
            onChange={(event) => onDifficultyChange(event.target.value)}
          >
            <option>All levels</option>
            {DIFFICULTIES.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </label>
        <span className="progression-count" aria-label={`${items.length} of ${total} progressions`}>
          {items.length} / {total}
        </span>
      </div>
      <div className="progression-list" ref={listRef}>
        {items.map((progression, index) => (
          <div
            className={`progression-row ${selectedId === progression.id ? 'selected' : ''}`}
            key={progression.id}
            data-progression-id={progression.id}
          >
            <button
              className="progression-choice"
              onClick={() => onChoose(progression)}
              aria-current={selectedId === progression.id ? 'true' : undefined}
            >
              <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="choice-content">
                <span className="choice-title">
                  <strong>{progression.title}</strong>
                  <span className="row-level">
                    <span className={`level-dot ${progression.difficulty.toLowerCase()}`} />
                    {progression.difficulty}
                  </span>
                </span>
                <span className="roman-preview-line">
                  <span className="roman-preview">{progression.roman.join(' – ')}</span>
                  {progression.variation && <span className="variation-label">Variation</span>}
                </span>
              </span>
            </button>
            <button
              className={`row-heart ${favorites.includes(progression.id) ? 'saved' : ''}`}
              aria-label={`${favorites.includes(progression.id) ? 'Unsave' : 'Save'} ${progression.title}`}
              onClick={() => onFavorite(progression.id)}
            >
              <Heart
                size={13}
                fill={favorites.includes(progression.id) ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        ))}
        {!items.length && (
          <div className="empty-state">
            <Heart size={24} />
            <strong>
              {genre === 'Favorites' && !total
                ? 'No favorites yet'
                : 'No progressions at this level'}
            </strong>
            <p>
              {genre === 'Favorites' && !total
                ? 'Tap a heart on a progression to save it here.'
                : 'Try another difficulty level.'}
            </p>
            {difficulty !== 'All levels' && (
              <button onClick={() => onDifficultyChange('All levels')}>Show all levels</button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
