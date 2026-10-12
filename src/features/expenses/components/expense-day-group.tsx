import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { formatDayHeader } from '@/lib/dates';
import type { Category, Expense } from '../types';
import { ExpenseRow } from './expense-row';

export interface ExpenseDay {
  date: string;
  expenses: Expense[];
}

interface ExpenseDayGroupProps {
  day: ExpenseDay;
  categoriesById: Map<string, Category>;
}

export function ExpenseDayGroup({ day, categoriesById }: ExpenseDayGroupProps) {
  return (
    <View className="gap-2 pb-5">
      <Text className="font-sans-medium text-sm tracking-wide text-muted">
        {formatDayHeader(day.date)}
      </Text>
      <Card>
        {day.expenses.map((expense, index) => (
          <View key={expense.id} className={index > 0 ? 'border-t border-border' : undefined}>
            <ExpenseRow
              expense={expense}
              category={expense.categoryId ? categoriesById.get(expense.categoryId) : undefined}
            />
          </View>
        ))}
      </Card>
    </View>
  );
}
