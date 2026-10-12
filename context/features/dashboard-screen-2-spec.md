# Dashboard Screen 2: Reports

## Overview

Screen 2 of the dashboard UI is the **Reports** tab. It gives the Free plan's "basic overview": spend over the last 6 months, a breakdown of the current month by category, and an upsell card for Pro. Like screen 1, this pass is **UI only, driven by mock data**: no SQLite, Supabase, or billing wiring. Build the components so the data layer can replace the mock data later without changing the UI.

Visual reference: `@context/screenshots/ticketly-reports.png`. Reuse the tokens, `Card`, `IconBadge`, and helpers from screen 1 (`@context/features/dashboard-screen-1-spec.md`). Product rules come from `@context/project-overview.md` (plans, tabs, local-first data, money in minor units).

## Requirements

### Route and navigation

- Replace the placeholder at `src/app/(tabs)/reports.tsx` with a thin route that composes components from `src/features/reports/`. The tab, its icon, and the Scan button already exist in `(tabs)/_layout.tsx`.
- The profile button navigates to `/settings`, as on the Expenses screen.
- The Pro card navigates to `/paywall` (create a placeholder route if missing). Use type-safe hrefs.
- Verify any Expo or Router API against the SDK 57 docs before using it, as `AGENTS.md` requires.

### Screen layout (top to bottom)

All content scrolls in one `ScrollView`. Respect safe areas and leave bottom padding so the tab bar and raised Scan button never cover the last card.

1. **Header**
   - Large screen title "Reports" at the left and the circular profile button (min 44x44 pt) at the right.
2. **Spending trend card**
   - Muted label "Last 6 months", with the six-month total below in large mono text with tabular figures (for example `$6,349.90`).
   - A bar chart with one bar per month, oldest to newest. The x-axis shows the short month names (May, Jun, Jul, Aug, Sep, Oct). The current month's label is bold and its bar uses the brand green; the others use a muted tint.
   - The chart area in the screenshot is blank (it was probably captured before the chart rendered). Design it as bars, using `react-native-gifted-charts` as listed in the project's UI stack. No gridlines or y-axis labels are needed; the bars carry the shape.
   - The chart must not crash on web, and must be readable in dark mode.
3. **Category breakdown card**
   - Header row: "October by category" (month name from the data) at the left and the month total in mono at the right.
   - A segmented horizontal bar below the header. Each category is a segment whose width is proportional to its share. Segments use the category tint colors, with the largest on the left, and the bar's ends are rounded.
   - One row per category, sorted by amount descending: category icon badge, name, percentage (rounded, muted, mono), and amount (mono, right-aligned). Example: Travel, 63%, `$384.20`.
   - Show only categories that have spend in the month. Percentages are rounded to whole numbers; they may not sum to exactly 100.
4. **Pro upsell card**
   - Dark, rounded card with a sparkle icon, the title "Ticketly Pro", and a short line about expanded reports and CSV export (see Free and Pro plans in the project overview). The screenshot shows only the top of the card; add the body text and a call-to-action button, for example "Upgrade".
   - Show it only to Free users. Hide it when the entitlement is Pro.
   - Note: the screenshot reads "Tally Pro", which looks like a leftover from an earlier name. Use the product name, Ticketly.

### States

- **Loading:** static skeleton placeholders for both cards.
- **Empty (no expenses in the last 6 months):** friendly message and a hint to tap Scan, in place of the cards.
- **Month with no spend:** the category card shows "No spending this month" instead of the bar and rows. The trend chart still renders, with a zero-height bar for that month.

### Theming and styling

- NativeWind tokens only, as in screen 1: no hardcoded hex values or magic spacing numbers in components. Support light and dark mode.
- Chart colors must come from the same tokens. Gifted Charts takes colors as props, so read them from `useThemeColors()` in `src/lib/theme.ts` (add any missing chart colors there and in `src/global.css`).
- Amounts and percentages use the mono face with tabular figures. Cards use the large corner radius from screen 1.
- The dark Pro card stays dark in both themes, with light text.

### Accessibility

- `accessibilityRole` and `accessibilityLabel` on the profile button and the Pro card's button.
- The bar chart gets one summary label, for example "Spending over the last 6 months, $6,349.90 total, highest in September". Do not leave individual bars unlabeled to screen readers without a summary.
- Each category row reads as a sentence: "Travel, 63 percent, $384.20". The segmented bar is decorative and is hidden from accessibility.
- Touch targets of at least 44x44 pt, and text must not clip at large font scales.

## Data

Use mock data until the local database exists. Add it to `src/lib/mock-data.ts` (the single source of mock data) in the same style as screen 1, and shape it like the real model.

- **Current month:** derive the category breakdown from the existing `MOCK_EXPENSES`, grouped by `categoryId`. Do not duplicate those amounts in a second list.
- **Align the screen 1 mock data with this screenshot.** The screenshot shows Travel at `$384.20` and Food & Drink at `$18.75`, so change the two invented expenses: Delta Air Lines `totalMinor` from `36520` to `38420`, and Blue Bottle Coffee from `3775` to `1875`. The October total stays `61461` (`$614.61`), and the rows come out as:

  | Category     | Amount    | Share |
  | ------------ | --------- | ----- |
  | Travel       | `$384.20` | 63%   |
  | Groceries    | `$87.42`  | 14%   |
  | Fuel         | `$54.10`  | 9%    |
  | Office       | `$46.99`  | 8%    |
  | Transport    | `$23.15`  | 4%    |
  | Food & Drink | `$18.75`  | 3%    |

- **Monthly totals (last 6 months):** add a `MOCK_MONTHLY_TOTALS` list with `{ month: 'YYYY-MM', totalMinor, currency }` entries. Only the current month can be derived from the expenses; the earlier five are static mock values. Use values that add up with October to `634990` (`$6,349.90`), for example:

  | Month   | `totalMinor` |
  | ------- | ------------ |
  | 2026-05 | `98420`      |
  | 2026-06 | `112075`     |
  | 2026-07 | `104310`     |
  | 2026-08 | `121890`     |
  | 2026-09 | `136834`     |
  | 2026-10 | `61461`      |

  October's entry should match the sum of the October expenses. Derive it rather than hardcoding it twice, or keep a comment saying where the number comes from.
- **Plan:** read Free vs Pro from the existing mock plan usage (`planId`) for now. The real source will be the `entitlements` record, and the paywall decision must come from there, never from provider SDK state.
- Money is integer minor units plus a currency code. Format it only through `formatMoney` in `src/lib/money.ts`. Add shared helpers to `src/lib/` instead of formatting inline: a short month name (`May`) and a percentage helper, next to the existing date helpers.
- Read the data through a `useReports` hook wrapping TanStack Query that returns the mock data, so the screen already follows the final data flow. It should build on the same query that `useExpenses` uses where possible.

## Suggested file structure

```
src/
  app/
    (tabs)/reports.tsx        Reports screen (thin)
    paywall.tsx               placeholder, if missing
  features/reports/
    components/
      reports-screen.tsx
      spending-trend-card.tsx
      category-breakdown-card.tsx
      category-share-bar.tsx
      pro-upsell-card.tsx
    hooks/use-reports.ts
  lib/
    mock-data.ts              add MOCK_MONTHLY_TOTALS, update two expense amounts
    dates.ts                  add short month name helper
```

Reuse `Card`, `IconBadge`, and the `PlaceholderScreen` pattern from screen 1. Install new packages with `npx expo install` (`react-native-gifted-charts` and its peers, likely `react-native-svg`, which is already installed, and `expo-linear-gradient`). Check each against SDK 57 and the New Architecture before adding it. If Gifted Charts does not work, build the bars with plain `View`s, since this chart is simple.

## Out of scope

- Real data: SQLite, Drizzle, Supabase, sync
- Paywall screen, billing, RevenueCat, and Stripe (the card only navigates to a placeholder)
- CSV export and the expanded Pro reports
- Month picker, drill-down into a category, or tapping a bar for details
- Settings screen and the expense detail screen

## Acceptance criteria

- The Reports tab matches `ticketly-reports.png` in layout, hierarchy, spacing, and color on iOS and Android, and does not crash on web.
- The trend card shows six months, oldest to newest, with the current month highlighted, and the total equals the sum of the six mock months (`$6,349.90`).
- The category card total equals the sum of its rows (`$614.61`). Rows are sorted descending, and the percentages and amounts match the table above.
- The segmented bar's widths match the category shares and use the category tints.
- The Pro card appears only on the Free plan and navigates to `/paywall`.
- The Expenses screen still shows `$614.61` across 6 receipts after the mock data change.
- Light and dark modes both render with tokens only.
- `npx expo lint` and `npx tsc --noEmit` pass with no `any` types.

## References

- `@context/screenshots/ticketly-reports.png`
- `@context/features/dashboard-screen-1-spec.md`
- `@context/project-overview.md` (stack, plans and entitlements, local-first data, routes)
- `@context/coding-standards.md`
