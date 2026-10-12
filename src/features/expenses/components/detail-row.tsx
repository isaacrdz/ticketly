import { Text, View } from 'react-native';

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View accessible accessibilityLabel={`${label}, ${value}`} className="flex-row justify-between gap-6">
      <Text className="font-sans text-lg text-muted">{label}</Text>
      <Text className="flex-1 text-right font-sans-medium text-lg text-foreground">{value}</Text>
    </View>
  );
}
