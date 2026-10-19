import { useLayoutEffect, useRef } from 'react';

export default function ChordName({ name }: { name: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const heading = headingRef.current!;
    const text = textRef.current!;
    let disposed = false;
    const fit = () => {
      if (disposed || heading.clientWidth === 0) return;
      // Measure the actual glyphs at the CSS size, including loaded fonts.
      // Keep short names unchanged; shrink only names wider than the card.
      text.style.fontSize = '';
      const available = heading.clientWidth;
      if (text.getBoundingClientRect().width <= available) return;
      let low = 0;
      let high = parseFloat(getComputedStyle(heading).fontSize);
      while (high - low > 0.1) {
        const size = (low + high) / 2;
        text.style.fontSize = `${size}px`;
        if (text.getBoundingClientRect().width <= available) low = size;
        else high = size;
      }
      text.style.fontSize = `${Math.floor(low * 10) / 10}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(heading);
    void document.fonts.ready.then(fit);
    document.fonts.addEventListener('loadingdone', fit);
    return () => {
      disposed = true;
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', fit);
    };
  }, [name]);

  return (
    <h3 ref={headingRef}>
      <span className="chord-name-text" ref={textRef}>
        {name.replaceAll('b', '♭').replaceAll('#', '♯')}
      </span>
    </h3>
  );
}
