# Current Feature: Expense Detail Screen

## Status

In Progress

## Goals

- Replace the placeholder `src/app/expense/[id].tsx` with a thin route that validates the `id` param (strings, arrays, or missing count as invalid) and renders a component from `src/features/expenses/`
- Action bar drawn in the screen: round back, edit (pencil), and delete (trash, danger red) buttons, each at least 44x44 pt; back uses `router.back()` with a fallback to the Expenses tab when there is no history
- Summary card: centered category icon badge, merchant, large mono total, dashed divider, and Date (long format), Category, Tax (hidden when absent), Currency, and Notes (only when present) rows
- Receipt image section: "RECEIPT IMAGE" label and a rounded `expo-image` card sized from the receipt's width and height, with a "No receipt attached" placeholder, a loading placeholder, and an image-load-failure message
- Edit navigates to `/review` with the expense id (placeholder `src/app/review.tsx` if missing)
- Delete shows a native confirmation (Cancel / destructive Delete); on confirm it removes the expense from the mock query cache and goes back, so Expenses and Reports update their totals and counts
- Loading skeleton, "Expense not found" state (with a button back to Expenses), and a "Saved on this device, waiting to sync" note for pending expenses
- Add `MOCK_RECEIPTS` (shaped like the `receipts` table) and one or two fake sample receipt images under `assets/receipts/`; leave at least one scanned expense and the manual expense (Delta Air Lines) without a receipt
- `useExpense(id)` hook (builds on the `useExpenses` query; returns expense, category, and receipt, or not-found), `useDeleteExpense` mutation hook, and a `formatLongDate` helper in `src/lib/dates.ts`; money only through `formatMoney`
- Accessibility labels on the action buttons and receipt image, and the category icon marked decorative
- NativeWind tokens only, light and dark mode, no `any` types
- Tapping any Expenses row opens a detail that matches the row
- `npx expo lint` and `npx tsc --noEmit` pass

## Notes

- Spec: `context/features/expense-detail-screen.md`
- Visual references: `context/screenshots/ticketly-expense-detail.png` (layout) and `ticketly-expenses.png` (where the user comes from). Reuses `Card`, `IconBadge`, `SyncNotice`, tokens, and helpers from the earlier screens.
- UI only, driven by mock data. No SQLite, Supabase, Storage, signed URLs, or sync wiring. Keep the image source behind a small function or prop so the real private-bucket source can replace it later.
- Real delete later is a soft delete (`deleted_at`) written with the outbox in one transaction; structure the code so only the mutation function changes.
- The screenshot's receipt (Blue Bottle Coffee) on the Whole Foods expense is just a placeholder; it does not have to match. Use fake or generic receipts only.
- Install packages with `npx expo install` (`expo-image` is already installed; `expo-haptics` only if used), and check the SDK 57 docs before using any Expo or Router API.
- Out of scope: real data layer, the review and edit form, full-screen zoom viewer, re-scanning or sharing the receipt, OCR text and low-confidence highlights, line items, undo after delete.

## History

<!-- Keep this updated. Earliest to latest -->

- **Dashboard Screen 1 (Expenses):** Added the `(tabs)` layout (Expenses, raised Scan button, Reports) and the Expenses screen built from `src/features/expenses/` components over a FlashList: month summary, plan usage card, search, category chips, sync notice, and day-grouped expense cards with loading, empty, and no-results states. Data comes from `src/lib/mock-data.ts` through a `useExpenses` TanStack Query hook, with money and date helpers in `src/lib/`. Styled with NativeWind v5 RC (the release targeting Expo SDK 57) using design tokens in `src/global.css`, light and dark mode. Placeholder routes: `/settings`, `/expense/[id]`, Scan, Reports. Not yet checked visually on a device.
- **Dashboard Screen 2 (Reports):** Replaced the Reports placeholder with `src/features/reports/` components: a 6-month spending trend card (plain `View` bars, current month highlighted), an "October by category" card with a segmented share bar and ranked rows, a Pro upsell card shown only on the Free plan, plus loading and empty states. Added the `useReports` hook (builds on `useExpenses`), month-name and percentage helpers, a shared `ProfileButton`, Pro and on-brand tokens, and a placeholder `/paywall` route. Updated mock data (Delta Air Lines `38420`, Blue Bottle Coffee `1875`) and added `MOCK_PREVIOUS_MONTHLY_TOTALS`. Not yet checked visually on a device.
