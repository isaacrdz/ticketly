import { router } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '@/lib/theme';

export function ProUpsellCard() {
  const colors = useThemeColors();

  return (
    <View className="gap-4 rounded-card bg-pro px-6 py-5">
      <View className="flex-row items-center gap-2">
        <Sparkles size={18} color={colors.onPro} />
        <Text className="font-sans-medium text-base text-pro-muted">Ticketly Pro</Text>
      </View>
      <Text className="font-sans-semibold text-xl text-pro-foreground">
        Expanded reports and CSV export
      </Text>
      <Text className="font-sans text-base text-pro-muted">
        Go deeper on your spending and send clean records to your accountant.
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Upgrade to Ticketly Pro"
        onPress={() => router.push('/paywall')}
        className="h-12 items-center justify-center rounded-pill bg-brand active:opacity-80">
        <Text className="font-sans-semibold text-base text-on-brand">Upgrade</Text>
      </Pressable>
    </View>
  );
}
