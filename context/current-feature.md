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
- **Dashboard Screen 2 (Reports):** Replaced the Reports placeholder with `src/features/reports/` components: a 6-month spending trend card (plain `View` bars, current month highlighted), an "October by category" card with a segmented share bar and ranked rows, a Pro upsell card shown only on the Free plan, plus loading and empty states. Added the `useReports` hook (builds on `useExpenses`), month-name and percentage helpers, a shared `ProfileButton`, Pro and on-brand tokens, and a placeholder `/paywall` route. Updated mock data (Delta Air Lines `38420`, Blue Bottle Coffee `1875`) and added `MOCK_PREVIOUS_MONTHLY_TOTALS`. Not yet checked visually on a device.
- **Expense Detail Screen:** Replaced the `/expense/[id]` placeholder with a detail screen in `src/features/expenses/`: back, edit, and delete actions, a summary card (icon, merchant, total, Date, Category, Tax, Currency, Notes), and a receipt image card with no-receipt and load-failure states, plus loading, not-found, and pending-sync states. Delete confirms (browser dialog on web) and removes the expense from the mock query cache so Expenses and Reports update; edit opens a placeholder `/review`. Added `MOCK_RECEIPTS` with two generated sample receipt images, `useExpense` and `useDeleteExpense` hooks, `formatLongDate`, and `confirm` and `navigation` helpers. Set `staleTime: Infinity` on the mock expenses query so refetches do not undo deletes. Dark mode was turned off for now (`userInterfaceStyle: light`, light-only tokens and theme). Added Vitest with 15 unit tests for the date, money, and percent helpers (`npm test`). Not yet checked visually on a device.
