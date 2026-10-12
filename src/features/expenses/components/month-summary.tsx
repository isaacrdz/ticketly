import { router } from 'expo-router';
import { User } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { formatMoney } from '@/lib/money';
import { useThemeColors } from '@/lib/theme';

interface MonthSummaryProps {
  monthLabel: string;
  totalMinor: number;
  currency: string;
  receiptCount: number;
}

export function MonthSummary({ monthLabel, totalMinor, currency, receiptCount }: MonthSummaryProps) {
  const colors = useThemeColors();

  return (
    <View className="flex-row items-start justify-between">
      <View className="flex-1 gap-1">
        <Text className="font-sans text-lg text-muted">{monthLabel}</Text>
        <Text
          className="font-mono-bold text-5xl text-foreground"
          style={{ fontVariant: ['tabular-nums'] }}
          adjustsFontSizeToFit
          numberOfLines={1}>
          {formatMoney(totalMinor, currency)}
        </Text>
        <Text className="font-sans text-base text-muted">
          Spent this month across {receiptCount} {receiptCount === 1 ? 'receipt' : 'receipts'}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profile and settings"
        onPress={() => router.push('/settings')}
        className="size-12 items-center justify-center rounded-pill bg-surface-muted active:opacity-70">
        <User size={22} color={colors.foreground} />
      </Pressable>
    </View>
  );
}
