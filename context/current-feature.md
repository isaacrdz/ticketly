# Current Feature

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- **Dashboard Screen 1 (Expenses):** Added the `(tabs)` layout (Expenses, raised Scan button, Reports) and the Expenses screen built from `src/features/expenses/` components over a FlashList: month summary, plan usage card, search, category chips, sync notice, and day-grouped expense cards with loading, empty, and no-results states. Data comes from `src/lib/mock-data.ts` through a `useExpenses` TanStack Query hook, with money and date helpers in `src/lib/`. Styled with NativeWind v5 RC (the release targeting Expo SDK 57) using design tokens in `src/global.css`, light and dark mode. Placeholder routes: `/settings`, `/expense/[id]`, Scan, Reports. Not yet checked visually on a device.
