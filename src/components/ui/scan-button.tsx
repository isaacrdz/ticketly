import { ScanLine } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { useThemeColors } from '@/lib/theme';

// Placeholder: the scanner is not wired yet.
export function ScanButton() {
  const colors = useThemeColors();

  return (
    <View className="flex-1 items-center">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Scan receipt"
        className="-mt-8 size-[72px] items-center justify-center rounded-pill border-4 border-background bg-brand shadow-lg active:opacity-80">
        <ScanLine size={30} color={colors.onBrand} />
      </Pressable>
    </View>
  );
}
