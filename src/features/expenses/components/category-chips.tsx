import { Pressable, ScrollView, Text } from 'react-native';

import type { Category } from '../types';

interface CategoryChipsProps {
  categories: Category[];
  /** null selects "All" */
  selectedId: string | null;
  onSelect: (categoryId: string | null) => void;
}

interface ChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

function Chip({ label, isSelected, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      className={`h-11 justify-center rounded-pill border px-5 active:opacity-70 ${
        isSelected ? 'border-inverse-surface bg-inverse-surface' : 'border-border bg-surface'
      }`}>
      <Text
        className={`font-sans-medium text-base ${isSelected ? 'text-inverse' : 'text-muted'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export function CategoryChips({ categories, selectedId, onSelect }: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="gap-2 px-5"
      className="-mx-5 grow-0">
      <Chip label="All" isSelected={selectedId === null} onPress={() => onSelect(null)} />
      {categories.map((category) => (
        <Chip
          key={category.id}
          label={category.name}
          isSelected={selectedId === category.id}
          onPress={() => onSelect(category.id)}
        />
      ))}
    </ScrollView>
  );
}
