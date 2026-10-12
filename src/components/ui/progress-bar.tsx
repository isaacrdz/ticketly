import { View } from 'react-native';

interface ProgressBarProps {
  /** 0 to 1 */
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      className="h-2 overflow-hidden rounded-pill bg-brand-track">
      <View className="h-full rounded-pill bg-brand" style={{ width: `${percent}%` }} />
    </View>
  );
}
