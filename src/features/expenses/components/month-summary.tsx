import { Text, View } from 'react-native';

import { ProfileButton } from '@/components/ui/profile-button';
import { formatMoney } from '@/lib/money';

interface MonthSummaryProps {
  monthLabel: string;
  totalMinor: number;
  currency: string;
  receiptCount: number;
}

export function MonthSummary({ monthLabel, totalMinor, currency, receiptCount }: MonthSummaryProps) {
  return (
    <View className="flex-row items-start justify-between">
      <View className="flex-1 gap-2">
        <Text className="font-sans text-lg text-muted">{monthLabel}</Text>
        <Text
          className="py-1 font-mono-bold text-5xl leading-tight text-foreground"
          style={{ fontVariant: ['tabular-nums'] }}
          adjustsFontSizeToFit
          numberOfLines={1}>
          {formatMoney(totalMinor, currency)}
        </Text>
        <Text className="font-sans text-base text-muted">
          Spent this month across {receiptCount} {receiptCount === 1 ? 'receipt' : 'receipts'}
        </Text>
      </View>
      <ProfileButton />
    </View>
  );
}
