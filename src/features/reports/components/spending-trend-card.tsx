import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { formatMonthName, formatMonthShort } from '@/lib/dates';
import { formatMoney } from '@/lib/money';
import type { MonthlyTotal } from '@/features/expenses/types';

interface SpendingTrendCardProps {
  months: MonthlyTotal[];
  totalMinor: number;
  currency: string;
  /** YYYY-MM, highlighted */
  currentMonth: string;
}

export function SpendingTrendCard({
  months,
  totalMinor,
  currency,
  currentMonth,
}: SpendingTrendCardProps) {
  const maxMinor = Math.max(...months.map((item) => item.totalMinor), 1);
  const highest = months.reduce((top, item) => (item.totalMinor > top.totalMinor ? item : top));

  return (
    <Card className="gap-5 px-6 py-5">
      <View className="gap-1">
        <Text className="font-sans text-base text-muted">Last {months.length} months</Text>
        <Text
          className="font-mono-bold text-4xl leading-tight text-foreground"
          style={{ fontVariant: ['tabular-nums'] }}
          adjustsFontSizeToFit
          numberOfLines={1}>
          {formatMoney(totalMinor, currency)}
        </Text>
      </View>
      <View
        accessible
        accessibilityLabel={`Spending over the last ${months.length} months, ${formatMoney(totalMinor, currency)} total, highest in ${formatMonthName(highest.month)}`}
        className="flex-row gap-3">
        {months.map((item) => {
          const isCurrent = item.month === currentMonth;
          return (
            <View key={item.month} className="flex-1 items-center gap-3">
              <View className="h-40 w-full justify-end">
                <View
                  className={`w-full rounded-t-lg ${isCurrent ? 'bg-brand' : 'bg-brand-track'}`}
                  style={{ height: `${(item.totalMinor / maxMinor) * 100}%` }}
                />
              </View>
              <Text
                className={`text-sm ${isCurrent ? 'font-sans-semibold text-foreground' : 'font-sans text-muted'}`}>
                {formatMonthShort(item.month)}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
