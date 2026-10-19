import { useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';

export default function AboutDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      className="about-dialog"
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <button className="dialog-close" aria-label="Close about" onClick={onClose}>
        <X size={20} />
      </button>
      <span className="eyebrow">A LITTLE PRACTICE, EVERY DAY</span>
      <h2>Your next good habit.</h2>
      <p>
        Fret is a free guitar practice companion. Explore 100 chord progression exercises, slow
        things down, and train yourself to adapt to new changes.
      </p>
      <h3>Using the player</h3>
      <p>
        Library previews list each distinct chord once. The player displays and plays the full
        progression, including repeated bars, in rows of up to four cards. Pick a progression,
        choose your key, and press Play. The beat counter follows the active chord’s duration.
        Enable Chord diagrams to view guitar shapes. Read diagrams from low E on the left to high E
        on the right. Open circles mean open strings; × means mute. A fret number marks a movable
        shape. Use a barre where neighboring strings share a fret.
      </p>
      <h3>The progression collection</h3>
      <p>
        Each genre includes 20 core patterns and useful variations, ordered for learning rather than
        ranked by popularity. Song references describe specific sections or related harmonic
        families. Exercises simplify arrangements and are not full song transcriptions. Roman
        numerals use major-scale degrees, so minor patterns explicitly show ♭III, ♭VI, and ♭VII.
      </p>
      <p>
        Simple shapes removes most extensions; full voicings preserves the chord colors. Chord
        accompaniment uses a soft synthesized tone. Your settings and favorites are saved in this
        browser.
      </p>
      <div className="about-links">
        <a
          href="https://www.hooktheory.com/theorytab/popular-chord-progressions"
          target="_blank"
          rel="noreferrer"
        >
          Hooktheory · Popular progressions <ArrowUpRight size={14} />
        </a>
        <a
          href="https://www.jazzguitar.be/blog/jazz-chord-progressions/"
          target="_blank"
          rel="noreferrer"
        >
          Jazz Guitar Online · Harmony <ArrowUpRight size={14} />
        </a>
        <a href="https://www.jazzstandards.com/theory/blues.htm" target="_blank" rel="noreferrer">
          Jazz Standards · Blues forms <ArrowUpRight size={14} />
        </a>
        <a
          href="https://www.pickupmusic.com/blog/10-essential-neo-soul-chord-progressions-for-guitarists"
          target="_blank"
          rel="noreferrer"
        >
          Pickup Music · Neo-soul <ArrowUpRight size={14} />
        </a>
      </div>
      <button className="play-button" onClick={onClose}>
        Back to practice <ArrowRight size={15} />
      </button>
    </dialog>
  );
}
