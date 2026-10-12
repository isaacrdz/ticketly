import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import type { PlanUsage } from '../types';

export function PlanUsageCard({ planId, scanCount, monthlyScanLimit }: PlanUsage) {
  const planLabel = planId === 'pro' ? 'Pro plan' : 'Free plan';
  const usageLabel =
    monthlyScanLimit === null ? `${scanCount} scans` : `${scanCount}/${monthlyScanLimit} scans`;

  return (
    <Card className="gap-3 rounded-3xl px-5 py-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-sans-medium text-base text-foreground">{planLabel}</Text>
        <Text className="font-mono text-base text-muted" style={{ fontVariant: ['tabular-nums'] }}>
          {usageLabel}
        </Text>
      </View>
      {monthlyScanLimit !== null && <ProgressBar value={scanCount / monthlyScanLimit} />}
    </Card>
  );
}
