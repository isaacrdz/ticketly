import { router } from 'expo-router';
import { User } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { useThemeColors } from '@/lib/theme';

export function ProfileButton() {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Profile and settings"
      onPress={() => router.push('/settings')}
      className="size-12 items-center justify-center rounded-pill bg-surface-muted active:opacity-70">
      <User size={22} color={colors.foreground} />
    </Pressable>
  );
}
