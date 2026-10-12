import { Car, Fuel, Package, Plane, ShoppingBasket, Utensils } from 'lucide-react-native';

import { View } from 'react-native';

import type { CategoryColor, CategoryIcon } from '@/features/expenses/types';
import { useThemeColors } from '@/lib/theme';

const ICONS = {
  'shopping-basket': ShoppingBasket,
  utensils: Utensils,
  car: Car,
  plane: Plane,
  package: Package,
  fuel: Fuel,
};

// Full class names so Tailwind can detect them.
const TINTS: Record<CategoryColor, string> = {
  green: 'bg-tint-green',
  amber: 'bg-tint-amber',
  blue: 'bg-tint-blue',
  violet: 'bg-tint-violet',
  slate: 'bg-tint-slate',
  red: 'bg-tint-red',
};

interface IconBadgeProps {
  icon: CategoryIcon;
  color: CategoryColor;
  size?: 'md' | 'lg';
}

export function IconBadge({ icon, color, size = 'md' }: IconBadgeProps) {
  const colors = useThemeColors();
  const Icon = ICONS[icon];

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={`items-center justify-center rounded-pill ${size === 'lg' ? 'size-20' : 'size-12'} ${TINTS[color]}`}>
      <Icon size={size === 'lg' ? 32 : 22} color={colors[color]} />
    </View>
  );
}
