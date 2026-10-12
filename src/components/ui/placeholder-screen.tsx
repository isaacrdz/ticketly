import { Text, View } from 'react-native';

export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="font-sans-medium text-xl text-foreground">{title}</Text>
    </View>
  );
}
