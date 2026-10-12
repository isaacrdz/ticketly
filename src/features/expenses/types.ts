import type { ImageRequireSource } from 'react-native';

export type CategoryColor = 'green' | 'amber' | 'blue' | 'violet' | 'slate' | 'red';

export type CategoryIcon = 'shopping-basket' | 'utensils' | 'car' | 'plane' | 'package' | 'fuel';

export interface Category {
  id: string;
  name: string;
  color: CategoryColor;
  icon: CategoryIcon;
}

export interface Expense {
  id: string;
  merchant: string;
  purchaseDate: string;
  totalMinor: number;
  currency: string;
  taxMinor: number | null;
  categoryId: string | null;
  notes: string | null;
  source: 'scan' | 'manual';
  syncStatus: 'synced' | 'pending' | 'conflict';
}

export interface PlanUsage {
  planId: 'free' | 'pro';
  scanCount: number;
  monthlyScanLimit: number | null;
}

export interface MonthlyTotal {
  /** YYYY-MM */
  month: string;
  totalMinor: number;
  currency: string;
}

export interface Receipt {
  id: string;
  expenseId: string;
  mimeType: string;
  width: number;
  height: number;
  sizeBytes: number;
  /** Local image for now. The real source is a signed URL or local_uri. */
  image: ImageRequireSource;
}
