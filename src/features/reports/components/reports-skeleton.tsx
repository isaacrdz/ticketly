import { View } from 'react-native';

import { Card } from '@/components/ui/card';

export function ReportsSkeleton() {
  return (
    <View accessibilityLabel="Loading reports" className="gap-5">
      <Card className="gap-4 px-6 py-5">
        <View className="h-4 w-24 rounded-pill bg-surface-muted" />
        <View className="h-8 w-40 rounded-pill bg-surface-muted" />
        <View className="h-40 rounded-2xl bg-surface-muted" />
      </Card>
      <Card className="gap-4 px-6 py-5">
        <View className="h-4 w-32 rounded-pill bg-surface-muted" />
        <View className="h-3 rounded-pill bg-surface-muted" />
        <View className="h-24 rounded-2xl bg-surface-muted" />
      </Card>
    </View>
  );
}
