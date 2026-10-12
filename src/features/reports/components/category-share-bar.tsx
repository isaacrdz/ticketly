import { View } from 'react-native';

import { useThemeColors } from '@/lib/theme';
import type { CategoryTotal } from '../hooks/use-reports';

// Decorative: the rows below carry the same information for screen readers.
export function CategoryShareBar({ categoryTotals }: { categoryTotals: CategoryTotal[] }) {
  const colors = useThemeColors();

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="h-3 flex-row gap-0.5 overflow-hidden rounded-pill">
      {categoryTotals.map(({ categoryId, category, totalMinor }) => (
        <View
          key={categoryId ?? 'uncategorized'}
          style={{ flex: totalMinor, backgroundColor: colors[category?.color ?? 'slate'] }}
        />
      ))}
    </View>
  );
}
