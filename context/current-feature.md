# Current Feature: Dashboard Screen 1 (Expenses)

## Status

In Progress

## Goals

- Add the `(tabs)` layout with Expenses, a raised center Scan button, and Reports; `scan` and `reports` are placeholder screens
- Remove the template `src/app/index.tsx` so it does not conflict with `(tabs)/index`
- Build the Expenses screen at `src/app/(tabs)/index.tsx` as a thin route composing `src/features/expenses/` components, scrolling in one `FlashList`
- Header with month label, monthly total (mono, tabular figures), receipt-count caption, and a profile button linking to `/settings`
- Plan usage card: "Free plan", "12/30 scans", and a green progress bar, with values read from mock data
- Search row (input plus filter button) and horizontally scrollable category chips that filter the list
- Sync notice shown only when at least one expense has `syncStatus` of `pending`, pluralized correctly
- Expenses grouped by day (newest first) in rounded cards with hairline dividers; rows show category icon, merchant, "Category · notes" line, and a mono amount
- Tapping a row navigates to `/expense/[id]` with a type-safe href (placeholder route if missing)
- Loading, empty, and no-results states
- Shared helpers for money and day-header formatting in `src/lib/` (no inline formatting); data read through a `useExpenses` hook wrapping TanStack Query, returning the mock data
- NativeWind v4 design tokens only, light and dark mode, 44x44 pt touch targets, accessibility roles and labels
- `npx expo lint` and `npx tsc --noEmit` pass with no `any` types

## Notes

- Spec: `context/features/dashboard-screen-1-spec.md`
- Visual references: `context/screenshots/ticketly-expenses.png` and `ticketly-expense-detail.png`
- UI only, driven by `src/lib/mock-data.ts` (already created). No SQLite, Supabase, sync, scanner, or OCR wiring.
- The Scan button is a placeholder and does not launch the scanner.
- Check the Expo SDK 57 docs before using any Expo or Router API. Install packages with `npx expo install` (NativeWind, `@shopify/flash-list`, `lucide-react-native`, `react-native-svg`, `@tanstack/react-query`, Inter via `expo-font`). Native-code packages need a development build.
- Out of scope: real data layer, scanner and review flow, detail/Reports/Settings/auth screens (placeholders only), the filter bottom sheet, paywall and billing.
- The mock data has no TypeScript types yet; add them (from Zod schemas) when the schemas exist.

## History

<!-- Keep this updated. Earliest to latest -->
