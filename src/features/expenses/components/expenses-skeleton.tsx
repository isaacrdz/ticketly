import { View } from 'react-native';

import { Card } from '@/components/ui/card';

export function ExpensesSkeleton() {
  return (
    <View accessibilityLabel="Loading expenses" className="gap-2">
      <View className="h-4 w-24 rounded-pill bg-surface-muted" />
      <Card>
        {[0, 1, 2].map((item) => (
          <View
            key={item}
            className={`flex-row items-center gap-4 px-5 py-4 ${item > 0 ? 'border-t border-border' : ''}`}>
            <View className="size-12 rounded-pill bg-surface-muted" />
            <View className="flex-1 gap-2">
              <View className="h-4 w-32 rounded-pill bg-surface-muted" />
              <View className="h-3 w-20 rounded-pill bg-surface-muted" />
            </View>
            <View className="h-4 w-16 rounded-pill bg-surface-muted" />
          </View>
        ))}
      </Card>
    </View>
  );
}
