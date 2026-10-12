import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { IconBadge } from '@/components/ui/icon-badge';
import { formatMonthName } from '@/lib/dates';
import { formatMoney } from '@/lib/money';
import { formatPercent } from '@/lib/percent';
import type { CategoryTotal } from '../hooks/use-reports';
import { CategoryShareBar } from './category-share-bar';

interface CategoryBreakdownCardProps {
  /** YYYY-MM */
  month: string;
  currency: string;
  totalMinor: number;
  categoryTotals: CategoryTotal[];
}

export function CategoryBreakdownCard({
  month,
  currency,
  totalMinor,
  categoryTotals,
}: CategoryBreakdownCardProps) {
  return (
    <Card className="gap-4 px-6 py-5">
      <View className="flex-row items-center justify-between">
        <Text className="font-sans text-base text-muted">{formatMonthName(month)} by category</Text>
        <Text
          className="font-mono-bold text-lg text-foreground"
          style={{ fontVariant: ['tabular-nums'] }}>
          {formatMoney(totalMinor, currency)}
        </Text>
      </View>
      {categoryTotals.length === 0 ? (
        <Text className="py-4 text-center font-sans text-base text-muted">
          No spending this month
        </Text>
      ) : (
        <>
          <CategoryShareBar categoryTotals={categoryTotals} />
          <View className="gap-4">
            {categoryTotals.map(({ categoryId, category, totalMinor: categoryMinor }) => {
              const name = category?.name ?? 'Uncategorized';
              const percent = formatPercent(categoryMinor, totalMinor);
              const amount = formatMoney(categoryMinor, currency);
              return (
                <View
                  key={categoryId ?? 'uncategorized'}
                  accessible
                  accessibilityLabel={`${name}, ${percent.replace('%', ' percent')}, ${amount}`}
                  className="flex-row items-center gap-4">
                  <IconBadge icon={category?.icon ?? 'package'} color={category?.color ?? 'slate'} />
                  <Text className="flex-1 font-sans-medium text-lg text-foreground" numberOfLines={1}>
                    {name}
                  </Text>
                  <Text
                    className="font-mono text-base text-muted"
                    style={{ fontVariant: ['tabular-nums'] }}>
                    {percent}
                  </Text>
                  <Text
                    className="min-w-24 text-right font-mono-bold text-lg text-foreground"
                    style={{ fontVariant: ['tabular-nums'] }}>
                    {amount}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      )}
    </Card>
  );
}
