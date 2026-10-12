import { Search, SlidersHorizontal } from 'lucide-react-native';
import { Pressable, TextInput, View } from 'react-native';

import { useThemeColors } from '@/lib/theme';

interface ExpenseSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function ExpenseSearchBar({ value, onChangeText }: ExpenseSearchBarProps) {
  const colors = useThemeColors();

  return (
    <View className="flex-row items-center gap-3">
      <View className="h-12 flex-1 flex-row items-center gap-3 rounded-pill border border-border bg-surface px-4">
        <Search size={20} color={colors.muted} />
        <TextInput
          accessibilityLabel="Search merchants or notes"
          value={value}
          onChangeText={onChangeText}
          placeholder="Search merchants or notes"
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          autoCorrect={false}
          className="flex-1 font-sans text-base text-foreground"
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Filters"
        className="size-12 items-center justify-center rounded-pill border border-border bg-surface active:opacity-70">
        <SlidersHorizontal size={20} color={colors.foreground} />
      </Pressable>
    </View>
  );
}
