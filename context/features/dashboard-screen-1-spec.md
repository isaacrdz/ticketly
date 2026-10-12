# Dashboard Screen 1: Expenses

## Overview

Screen 1 of the dashboard UI is the **Expenses** tab, the app's home screen. It shows the month's spend, plan usage, search and category filters, a sync notice, and the saved expenses grouped by day. This pass is **UI only, driven by mock data**: no SQLite, Supabase, sync, or scanner wiring yet. Build the components so the data layer can replace the mock data later without changing the UI.

Visual reference: `@context/screenshots/ticketly-expenses.png` (the list). Card, typography, and color language also follow `@context/screenshots/ticketly-expense-detail.png`, and tapping a row must navigate to that detail route (the detail screen itself is a separate spec).

Note: `@context/features/dashboard-phase-1-spec.md` describes a web layout (ShadCN, sidebar, top bar). It does not apply to this Expo app. Only its structure (overview, requirements, references) is reused here.

## Requirements

### Route and navigation

- Route: `src/app/(tabs)/index.tsx` (the Expenses tab). Keep it thin: it composes components from `src/features/expenses/`.
- Add `src/app/(tabs)/_layout.tsx` with three tabs: **Expenses**, a prominent center **Scan** button, and **Reports**. `scan` and `reports` get placeholder screens (a centered title only). The Scan button does not launch the scanner yet.
- Remove the current template `src/app/index.tsx` so it does not conflict with `(tabs)/index`.
- Tapping an expense row navigates to `/expense/[id]` with a type-safe href. Create only a placeholder route if one does not exist.
- Tapping the profile button navigates to `/settings` (placeholder if missing).
- Use Expo Router only. Verify APIs against the SDK 57 docs (`https://docs.expo.dev/versions/v57.0.0/`) before using them, as `AGENTS.md` requires.

### Screen layout (top to bottom)

All content scrolls inside one `FlashList` whose header holds items 1 to 5. Respect safe areas, and leave bottom padding so the tab bar never covers the last row.

1. **Header**
   - Month label (for example "October 2026") in muted text.
   - Large monthly total in a monospaced, tabular-figure font (for example `$614.61`).
   - Caption: "Spent this month across 6 receipts" (count is derived from the data, singular for 1).
   - Circular profile button, top right, with a person icon (min 44x44 pt).
2. **Plan usage card**
   - Label "Free plan" and "12/30 scans" in mono, aligned right.
   - Progress bar below, filled in the brand green. Values come from mock plan and usage data (the real source will be `plans` and `usage_counters`; do not hardcode 30 in the component).
3. **Search row**
   - Rounded search input with a search icon and the placeholder "Search merchants or notes".
   - Circular filter button with a sliders icon at the right. Display only for now; both are non-functional beyond local text state. Filtering on typed text over the mock data is allowed but optional.
4. **Category chips**
   - Horizontally scrollable pills: All, Groceries, Food & Drink, Transport, and the remaining categories (clipped at the edge, as in the screenshot).
   - Selected chip is filled dark with light text; the rest are outlined. Selecting a chip filters the list by category (local state is fine for this pass).
5. **Sync notice**
   - A muted pill: cloud-off icon and "1 expense waiting to sync — saved on this device".
   - Shown only when at least one expense has `syncStatus` of `pending`. Pluralize correctly.
6. **Expense list grouped by day**
   - Section header per day in small, uppercase, muted text, formatted like "SAT, OCT 10". Sort days newest first.
   - Each day is one rounded card. A day with several expenses is a single card with hairline dividers between rows (see Fri, Oct 9).
   - Row: round category icon on a tinted background, merchant name, a secondary line, and the amount in mono on the right. The secondary line is the category name, followed by " · notes" when notes exist, truncated to one line with an ellipsis.
   - Row min height 44 pt, with press feedback.

### Floating Scan button

- Larger circular green button centered in the tab bar and raised above it, with a scan-frame icon and a soft shadow.
- Accessibility label "Scan receipt". Placeholder action for now (no navigation, no scanner).

### States

- **Loading:** skeleton rows (static placeholders are enough) while the query resolves.
- **Empty (no expenses):** friendly message and a hint to tap Scan.
- **No results (search or filter):** "No expenses match your search" with a clear-filters action.
- Offline needs no special handling here, since the screen reads local data only.

### Theming and styling

- NativeWind v4 with design tokens for color, spacing, radius, and type. No hardcoded hex values or magic numbers in components.
- Support light and dark mode through the system setting. The screenshots show the light theme (warm off-white background, white cards, dark text, green accent); derive the dark equivalents as tokens.
- Inter for text, and a monospaced face with tabular figures for all amounts and the scan counter.
- Category colors come from the category's `color` token, with an icon from `lucide-react-native` mapped by the `icon` name. Suggested mapping: Groceries (basket), Transport (car), Office (package), Fuel (fuel pump), Food & Drink (utensils).
- Cards use large corner radii and a very light shadow or border, as in both screenshots.

### Accessibility

- `accessibilityRole` and `accessibilityLabel` on the profile button, filter button, chips (with selected state), rows, and the Scan button.
- A row's label reads as a sentence, for example "Whole Foods Market, Groceries, $87.42, October 10".
- Touch targets of at least 44x44 pt. Text must not clip at large font scales.

## Data

Use mock data until the local database exists. Put it in `src/lib/mock-data.ts` (which the phase 1 spec also references) and shape it like the real model, so swapping in Drizzle queries later is mechanical:

- Money as integer minor units plus an ISO 4217 currency code (`8742` and `USD`). Never use floats.
- `purchaseDate` as `YYYY-MM-DD`.
- Fields: `id` (UUID), `merchant`, `purchaseDate`, `totalMinor`, `currency`, `taxMinor?`, `categoryId?`, `notes?`, `source`, `syncStatus`.
- Categories: `id`, `name`, `color`, `icon`.
- Plan usage: `{ planId: 'free', scanCount: 12, monthlyScanLimit: 30 }`.
- Seed the mock list so it matches the screenshot: Whole Foods Market (Groceries, `$87.42`, Oct 10), Uber (Transport, `$23.15`) and Staples (Office, "Printer ink for client deliverables", `$46.99`) on Oct 9, Shell (Fuel, `$54.10`, Oct 7), plus two more to total 6 receipts and `$614.61`. One expense is `pending`.
- Format money and dates only through shared helpers in `src/lib/` (for example `formatMoney(minor, currency)` and `formatDayHeader(date)`). Do not format inline in components.
- Fetch through a `useExpenses` hook wrapping TanStack Query, which returns the mock data for now, so the screen already follows the final data flow.

## Suggested file structure

```
src/
  app/(tabs)/
    _layout.tsx            tabs + center scan button
    index.tsx              Expenses screen (thin)
    scan.tsx               placeholder
    reports.tsx            placeholder
  features/expenses/
    components/
      month-summary.tsx
      plan-usage-card.tsx
      expense-search-bar.tsx
      category-chips.tsx
      sync-notice.tsx
      expense-day-group.tsx
      expense-row.tsx
      expenses-empty-state.tsx
    hooks/use-expenses.ts
  components/ui/           shared primitives (card, icon-badge, progress-bar)
  lib/
    mock-data.ts
    money.ts
    dates.ts
```

Install anything new with `npx expo install <package>` (NativeWind, `@shopify/flash-list`, `lucide-react-native`, `react-native-svg`, `@tanstack/react-query`, `expo-font`/Inter). Packages with native code require a development build, not Expo Go.

## Out of scope

- Real data: SQLite, Drizzle, Supabase, sync outbox, FTS5 search
- Scanner, OCR, and review flow
- Expense detail, Reports, Settings, and auth screens (placeholders only where routes are needed)
- Filter bottom sheet behind the sliders button
- Paywall and billing

## Acceptance criteria

- The Expenses tab matches `ticketly-expenses.png` in layout, hierarchy, spacing, and color on iOS and Android, and does not crash on web.
- The monthly total equals the sum of the current month's mock expenses and the receipt count is correct.
- Chips filter the list, and day grouping and ordering are correct.
- The sync notice appears only when a `pending` expense exists.
- Tapping a row opens `/expense/[id]` with the correct id.
- Light and dark modes both render with tokens only.
- `npx expo lint` and `npx tsc --noEmit` pass with no `any` types.

## References

- `@context/screenshots/ticketly-expenses.png`
- `@context/screenshots/ticketly-expense-detail.png`
- `@context/features/dashboard-phase-1-spec.md`
- `@context/project-overview.md` (stack, data model, routes, plans, offline-first rules)
- `@context/coding-standards.md`
