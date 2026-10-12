# Current Feature: Dashboard Screen 2 (Reports)

## Status

In Progress

## Goals

- Replace the placeholder `src/app/(tabs)/reports.tsx` with a thin route composing `src/features/reports/` components in one `ScrollView`, with bottom padding for the tab bar and raised Scan button
- Header with the large "Reports" title and a profile button linking to `/settings`
- Spending trend card: "Last 6 months" label, six-month total in mono (`$6,349.90`), and a bar chart of the six months, oldest to newest, with the current month bold and in brand green
- Category breakdown card: "October by category" with the month total, a rounded segmented share bar in category tints, and rows sorted by amount (icon badge, name, rounded percentage, amount)
- Pro upsell card ("Ticketly Pro", sparkle icon, short copy, Upgrade button) shown only on the Free plan and linking to `/paywall` (placeholder route if missing)
- Loading skeletons, empty state, and a "No spending this month" state
- Align `src/lib/mock-data.ts` with the screenshot: Delta Air Lines to `38420`, Blue Bottle Coffee to `1875`, add `MOCK_MONTHLY_TOTALS` (last 6 months summing to `634990`, October derived from the expenses)
- Shared helpers in `src/lib/` for short month names and percentages; money formatted only through `formatMoney`
- `useReports` hook wrapping TanStack Query over the mock data, building on the `useExpenses` query where possible
- Accessibility: chart summary label, category rows read as sentences, share bar hidden from screen readers, 44x44 pt targets
- NativeWind tokens only, light and dark mode (chart colors via `useThemeColors()`), no `any` types
- Expenses screen still shows `$614.61` across 6 receipts after the mock data change
- `npx expo lint` and `npx tsc --noEmit` pass

## Notes

- Spec: `context/features/dashboard-screen-2-spec.md`
- Visual reference: `context/screenshots/ticketly-reports.png`. Reuses `Card`, `IconBadge`, tokens, and helpers from screen 1.
- UI only, driven by mock data. No SQLite, Supabase, or billing wiring.
- Expected category rows: Travel `$384.20` (63%), Groceries `$87.42` (14%), Fuel `$54.10` (9%), Office `$46.99` (8%), Transport `$23.15` (4%), Food & Drink `$18.75` (3%).
- The chart area in the screenshot is blank; build it as bars. The spec suggests `react-native-gifted-charts`, with plain `View` bars as a fallback if it does not work on SDK 57 or web.
- The screenshot says "Tally Pro"; use "Ticketly Pro".
- Install packages with `npx expo install` and check the SDK 57 docs before using any Expo or Router API.
- Out of scope: real data layer, paywall, billing, CSV export and expanded Pro reports, month picker or drill-down, Settings and expense detail screens.

## History

<!-- Keep this updated. Earliest to latest -->

- **Dashboard Screen 1 (Expenses):** Added the `(tabs)` layout (Expenses, raised Scan button, Reports) and the Expenses screen built from `src/features/expenses/` components over a FlashList: month summary, plan usage card, search, category chips, sync notice, and day-grouped expense cards with loading, empty, and no-results states. Data comes from `src/lib/mock-data.ts` through a `useExpenses` TanStack Query hook, with money and date helpers in `src/lib/`. Styled with NativeWind v5 RC (the release targeting Expo SDK 57) using design tokens in `src/global.css`, light and dark mode. Placeholder routes: `/settings`, `/expense/[id]`, Scan, Reports. Not yet checked visually on a device.
