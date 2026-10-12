import { View } from 'react-native';

import { Card } from '@/components/ui/card';

export function ExpenseDetailSkeleton() {
  return (
    <View accessibilityLabel="Loading expense" className="gap-5">
      <Card className="items-center gap-4 px-6 py-7">
        <View className="size-20 rounded-pill bg-surface-muted" />
        <View className="h-6 w-48 rounded-pill bg-surface-muted" />
        <View className="h-12 w-40 rounded-pill bg-surface-muted" />
        <View className="mt-4 h-24 w-full rounded-2xl bg-surface-muted" />
      </Card>
      <View className="h-64 rounded-card bg-surface-muted" />
    </View>
  );
}
