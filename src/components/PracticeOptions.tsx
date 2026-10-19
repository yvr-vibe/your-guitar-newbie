import type { Settings } from '../settings';
import Toggle from './Toggle';

type Option = 'countIn' | 'showDiagrams' | 'simplified' | 'showTheoryLabels';
type Props = {
  settings: Pick<Settings, Option>;
  challenge: boolean;
  onChallengeChange: () => void;
  onSettingChange: (key: Option, value: boolean) => void;
};

export default function PracticeOptions({
  settings,
  challenge,
  onChallengeChange,
  onSettingChange,
}: Props) {
  return (
    <div className="practice-options" role="group" aria-label="Player options">
      <Toggle checked={challenge} onChange={onChallengeChange}>
        Random challenge
      </Toggle>
      <Toggle
        checked={settings.countIn}
        onChange={() => onSettingChange('countIn', !settings.countIn)}
      >
        Count-in
      </Toggle>

      <Toggle
        checked={settings.showDiagrams}
        onChange={() => onSettingChange('showDiagrams', !settings.showDiagrams)}
      >
        Chord diagrams
      </Toggle>
      <Toggle
        checked={!settings.simplified}
        onChange={() => onSettingChange('simplified', !settings.simplified)}
      >
        Full voicings
      </Toggle>
      <Toggle
        checked={settings.showTheoryLabels}
        onChange={() => onSettingChange('showTheoryLabels', !settings.showTheoryLabels)}
      >
        Theory labels
      </Toggle>
    </div>
  );
}
