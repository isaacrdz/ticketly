import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/ui/placeholder-screen';

export default function ExpenseDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlaceholderScreen title={`Expense ${id}`} />;
}
