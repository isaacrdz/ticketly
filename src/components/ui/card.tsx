import { View, type ViewProps } from 'react-native';

export function Card({ className = '', ...props }: ViewProps) {
  return (
    <View
      className={`overflow-hidden rounded-card border border-border bg-surface ${className}`}
      {...props}
    />
  );
}
