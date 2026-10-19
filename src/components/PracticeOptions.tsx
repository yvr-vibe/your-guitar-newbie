import { RotateCcw } from 'lucide-react';
import type { Settings } from '../settings';
import Toggle from './Toggle';

type Option = 'countIn' | 'showDiagrams' | 'simplified';
type Props = {
  settings: Pick<Settings, Option>;
  challenge: boolean;
  onChallengeChange: () => void;
  onSettingChange: (key: Option, value: boolean) => void;
  loop: number | null;
};

export default function PracticeOptions({
  settings,
  challenge,
  onChallengeChange,
  onSettingChange,
  loop,
}: Props) {
  return (
    <div className="practice-options" role="group" aria-label="Player options">
      <div className="practice-options-row">
        <Toggle checked={challenge} onChange={onChallengeChange}>
          Random challenge
        </Toggle>
        <Toggle
          checked={settings.countIn}
          onChange={() => onSettingChange('countIn', !settings.countIn)}
        >
          Count-in
        </Toggle>
        <span className="loop-status">
          <RotateCcw size={13} />
          {loop ? `Loop ${loop}` : 'Loop on'}
        </span>
      </div>
      <div className="practice-options-row">
        <Toggle
          checked={settings.showDiagrams}
          onChange={() => onSettingChange('showDiagrams', !settings.showDiagrams)}
        >
          Show chord diagrams
        </Toggle>
        <Toggle
          checked={!settings.simplified}
          onChange={() => onSettingChange('simplified', !settings.simplified)}
        >
          Full voicings
        </Toggle>
      </div>
    </div>
  );
}
