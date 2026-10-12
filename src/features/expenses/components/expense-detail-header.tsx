import { ArrowLeft, Pencil, Trash2 } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { useThemeColors } from '@/lib/theme';

interface ExpenseDetailHeaderProps {
  onBack: () => void;
  /** Edit and delete are hidden when there is no expense to act on */
  onEdit?: () => void;
  onDelete?: () => void;
}

const BUTTON_CLASS =
  'size-12 items-center justify-center rounded-pill bg-surface-muted active:opacity-70';

export function ExpenseDetailHeader({ onBack, onEdit, onDelete }: ExpenseDetailHeaderProps) {
  const colors = useThemeColors();

  return (
    <View className="flex-row items-center justify-between">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        className={BUTTON_CLASS}>
        <ArrowLeft size={22} color={colors.foreground} />
      </Pressable>
      <View className="flex-row gap-3">
        {onEdit && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit expense"
            onPress={onEdit}
            className={BUTTON_CLASS}>
            <Pencil size={20} color={colors.foreground} />
          </Pressable>
        )}
        {onDelete && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete expense"
            onPress={onDelete}
            className={BUTTON_CLASS}>
            <Trash2 size={20} color={colors.red} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
