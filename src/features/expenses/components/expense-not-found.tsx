import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export function ExpenseNotFound() {
  return (
    <View className="items-center gap-3 py-16">
      <Text className="font-sans-medium text-lg text-foreground">Expense not found</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace('/')}
        className="h-11 justify-center rounded-pill border border-border bg-surface px-5 active:opacity-70">
        <Text className="font-sans-medium text-base text-foreground">Back to expenses</Text>
      </Pressable>
    </View>
  );
}
