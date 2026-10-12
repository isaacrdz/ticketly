import { Pressable, Text, View } from 'react-native';

interface ExpensesEmptyStateProps {
  /** True when a search or category filter produced no matches */
  isFiltered: boolean;
  onClearFilters: () => void;
}

export function ExpensesEmptyState({ isFiltered, onClearFilters }: ExpensesEmptyStateProps) {
  if (isFiltered) {
    return (
      <View className="items-center gap-3 py-12">
        <Text className="font-sans-medium text-lg text-foreground">
          No expenses match your search
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onClearFilters}
          className="h-11 justify-center rounded-pill border border-border bg-surface px-5 active:opacity-70">
          <Text className="font-sans-medium text-base text-foreground">Clear filters</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="items-center gap-2 py-12">
      <Text className="font-sans-medium text-lg text-foreground">No expenses yet</Text>
      <Text className="text-center font-sans text-base text-muted">
        Tap the Scan button to add your first receipt.
      </Text>
    </View>
  );
}
