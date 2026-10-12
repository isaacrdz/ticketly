import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileButton } from '@/components/ui/profile-button';
import { useReports } from '../hooks/use-reports';
import { CategoryBreakdownCard } from './category-breakdown-card';
import { ProUpsellCard } from './pro-upsell-card';
import { ReportsSkeleton } from './reports-skeleton';
import { SpendingTrendCard } from './spending-trend-card';

// Room for the raised Scan button and tab bar.
const SCROLL_BOTTOM_PADDING = 120;

export function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const { isPending, reports } = useReports();

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: SCROLL_BOTTOM_PADDING,
      }}>
      <View className="gap-5">
        <View className="flex-row items-center justify-between">
          <Text accessibilityRole="header" className="font-sans-semibold text-4xl text-foreground">
            Reports
          </Text>
          <ProfileButton />
        </View>
        {isPending && <ReportsSkeleton />}
        {!isPending && !reports && (
          <View className="items-center gap-2 py-12">
            <Text className="font-sans-medium text-lg text-foreground">No reports yet</Text>
            <Text className="text-center font-sans text-base text-muted">
              Tap the Scan button to add your first receipt.
            </Text>
          </View>
        )}
        {reports && (
          <>
            <SpendingTrendCard
              months={reports.months}
              totalMinor={reports.rangeTotalMinor}
              currency={reports.currency}
              currentMonth={reports.month}
            />
            <CategoryBreakdownCard
              month={reports.month}
              currency={reports.currency}
              totalMinor={reports.monthTotalMinor}
              categoryTotals={reports.categoryTotals}
            />
            {!reports.isPro && <ProUpsellCard />}
          </>
        )}
      </View>
    </ScrollView>
  );
}
