import { CloudOff } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useThemeColors } from '@/lib/theme';

export function SyncNotice({ pendingCount }: { pendingCount: number }) {
  const colors = useThemeColors();

  return (
    <View
      accessibilityRole="alert"
      className="flex-row items-center gap-3 rounded-2xl bg-surface-muted px-4 py-3">
      <CloudOff size={18} color={colors.muted} />
      <Text className="flex-1 font-sans text-base text-muted">
        {pendingCount} {pendingCount === 1 ? 'expense' : 'expenses'} waiting to sync — saved on this
        device
      </Text>
    </View>
  );
}
