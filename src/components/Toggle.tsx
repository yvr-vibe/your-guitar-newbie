import type { ReactNode } from 'react';

type Props = { checked: boolean; onChange: () => void; children: ReactNode };

export default function Toggle({ checked, onChange, children }: Props) {
  return (
    <button
      type="button"
      className="toggle-label"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
    >
      <span className={`switch ${checked ? 'on' : ''}`} aria-hidden="true">
        <span />
      </span>
      <span>{children}</span>
    </button>
  );
}
