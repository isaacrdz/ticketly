import { Image } from 'expo-image';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import type { Receipt } from '../types';

interface ReceiptImageCardProps {
  merchant: string;
  receipt: Receipt | null;
}

export function ReceiptImageCard({ merchant, receipt }: ReceiptImageCardProps) {
  const [hasFailed, setHasFailed] = useState(false);

  return (
    <View className="gap-2">
      <Text className="font-sans-medium text-sm tracking-wide text-muted">RECEIPT IMAGE</Text>
      <Card className="bg-surface-muted">
        {receipt && !hasFailed ? (
          <Image
            source={receipt.image}
            accessibilityLabel={`Receipt image from ${merchant}`}
            contentFit="cover"
            onError={() => setHasFailed(true)}
            style={{ width: '100%', aspectRatio: receipt.width / receipt.height }}
          />
        ) : (
          <View className="items-center px-6 py-12">
            <Text className="text-center font-sans text-base text-muted">
              {receipt ? "Couldn't load the receipt image" : 'No receipt attached'}
            </Text>
          </View>
        )}
      </Card>
    </View>
  );
}
