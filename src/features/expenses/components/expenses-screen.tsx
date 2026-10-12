import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatMonthYear, getMonthKey } from '@/lib/dates';
import { useExpenses } from '../hooks/use-expenses';
import type { Expense } from '../types';
import { CategoryChips } from './category-chips';
import { ExpenseDayGroup, type ExpenseDay } from './expense-day-group';
import { ExpenseSearchBar } from './expense-search-bar';
import { ExpensesEmptyState } from './expenses-empty-state';
import { ExpensesSkeleton } from './expenses-skeleton';
import { MonthSummary } from './month-summary';
import { PlanUsageCard } from './plan-usage-card';
import { SyncNotice } from './sync-notice';

// Room for the raised Scan button and tab bar.
const LIST_BOTTOM_PADDING = 120;

function groupByDay(expenses: Expense[]): ExpenseDay[] {
  const days = new Map<string, Expense[]>();
  for (const expense of expenses) {
    days.set(expense.purchaseDate, [...(days.get(expense.purchaseDate) ?? []), expense]);
  }
  return [...days.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, dayExpenses]) => ({ date, expenses: dayExpenses }));
}

export function ExpensesScreen() {
  const insets = useSafeAreaInsets();
  const { data, isPending } = useExpenses();
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const expenses = data?.expenses ?? [];
  const categories = data?.categories ?? [];
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  const latestDate = expenses.map((expense) => expense.purchaseDate).sort().at(-1);
  const monthExpenses = latestDate
    ? expenses.filter((expense) => getMonthKey(expense.purchaseDate) === getMonthKey(latestDate))
    : [];
  const monthTotalMinor = monthExpenses.reduce((sum, expense) => sum + expense.totalMinor, 0);
  const pendingCount = expenses.filter((expense) => expense.syncStatus === 'pending').length;

  const normalizedQuery = query.trim().toLowerCase();
  const visibleExpenses = expenses.filter((expense) => {
    if (categoryId && expense.categoryId !== categoryId) return false;
    if (!normalizedQuery) return true;
    const categoryName = expense.categoryId ? categoriesById.get(expense.categoryId)?.name : '';
    return [expense.merchant, expense.notes, categoryName].some((field) =>
      field?.toLowerCase().includes(normalizedQuery),
    );
  });

  const isFiltered = normalizedQuery !== '' || categoryId !== null;

  function clearFilters() {
    setQuery('');
    setCategoryId(null);
  }

  const header = (
    <View className="gap-5 pb-5">
      {latestDate && (
        <MonthSummary
          monthLabel={formatMonthYear(latestDate)}
          totalMinor={monthTotalMinor}
          currency={monthExpenses[0].currency}
          receiptCount={monthExpenses.length}
        />
      )}
      {data && <PlanUsageCard {...data.planUsage} />}
      <ExpenseSearchBar value={query} onChangeText={setQuery} />
      <CategoryChips categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
      {pendingCount > 0 && <SyncNotice pendingCount={pendingCount} />}
    </View>
  );

  return (
    <FlashList
      data={groupByDay(visibleExpenses)}
      keyExtractor={(day) => day.date}
      renderItem={({ item }) => <ExpenseDayGroup day={item} categoriesById={categoriesById} />}
      ListHeaderComponent={header}
      ListEmptyComponent={
        isPending ? (
          <ExpensesSkeleton />
        ) : (
          <ExpensesEmptyState isFiltered={isFiltered} onClearFilters={clearFilters} />
        )
      }
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: LIST_BOTTOM_PADDING,
      }}
    />
  );
}
