# Expense Detail Screen

## Overview

The **Expense Detail** screen opens when the user taps an expense on the Expenses list (`/expense/[id]`). It shows the saved fields of one expense and its linked receipt image, with actions to edit or delete it. This pass is **UI only, driven by mock data**: no SQLite, Supabase, Storage, or sync wiring. Build the components so the data layer can replace the mock data later without changing the UI.

Visual references:

- `@context/screenshots/ticketly-expense-detail.png` is the layout of this screen: top action buttons, the summary card, and the receipt image.
- `@context/screenshots/ticketly-expenses.png` is where the user comes from. It shows the row that was tapped and the shared design language: cards, category icon badges, mono amounts, and colors.

Product rules come from `@context/project-overview.md`: an expense keeps its receipt image linked, saved expenses stay editable, money is integer minor units, and everything works offline. Reuse the tokens, `Card`, `IconBadge`, `formatMoney`, and the date helpers from the Expenses and Reports screens (`@context/features/dashboard-screen-1-spec.md`).

## Requirements

### Route and navigation

- Route: `src/app/expense/[id].tsx` replaces the existing placeholder. Keep it thin: it validates the `id` param and renders a component from `src/features/expenses/`.
- `useLocalSearchParams` values are strings, arrays, or missing. Validate the `id` before use, and treat an invalid id like a missing expense.
- It is a stack screen above the tabs (the root stack already hides headers). Draw the header inside the screen, as in the screenshot, and respect safe areas.
- **Back:** goes back with `router.back()`. If there is no history (for example after a deep link), go to the Expenses tab with a type-safe href.
- **Edit:** navigates to the review and edit route (`/review`) with the expense id as a param, as in the project overview's routes table. Create a placeholder `src/app/review.tsx` if it does not exist. The edit form itself is a separate spec.
- **Delete:** see Delete behavior below.
- Verify any Expo or Router API against the SDK 57 docs before using it, as `AGENTS.md` requires.

### Screen layout (top to bottom)

All content scrolls in one `ScrollView`, with bottom padding and safe-area insets.

1. **Action bar**
   - Round back button (arrow-left icon) at the left.
   - Round edit button (pencil icon) and round delete button (trash icon, in the danger red) at the right.
   - All three are at least 44x44 pt, on the muted surface, with press feedback.
2. **Summary card**
   - A large category icon badge, centered, using the category's tint and icon.
   - Merchant name, centered, medium weight.
   - The total in large mono text with tabular figures (for example `$87.42`), centered.
   - A dashed hairline divider.
   - A key/value list, with labels in muted text at the left and values at the right:
     - **Date:** long format, for example "Saturday, October 10, 2026".
     - **Category:** the category name ("Uncategorized" if none).
     - **Tax:** formatted money, for example `$6.12`. Hide the row when there is no tax.
     - **Currency:** the ISO 4217 code, for example `USD`.
     - **Notes:** show this row only when notes exist. Long notes wrap onto several lines.
3. **Receipt image section**
   - A small uppercase muted section label, "RECEIPT IMAGE".
   - The receipt image in a rounded card, loaded with `expo-image`, using `contentFit="cover"`, filling the card width, with a height that follows the image's aspect ratio (use `width` and `height` from the receipt record). The screenshot shows the image cropped by the screen edge, so let it extend and scroll.
   - If the expense has no receipt (a manual expense, or `source` is `manual`), show the section with a muted "No receipt attached" placeholder instead of an image.
   - While the image loads, show a placeholder surface of the same size. If it fails to load, show a short message, "Couldn't load the receipt image", and do not crash.

### Delete behavior

- Tapping delete opens a native confirmation (`Alert`) titled "Delete this expense?", with the merchant and amount in the message and the options **Cancel** and **Delete** (destructive).
- On confirm, in this UI-only pass, remove the expense from the mock query cache and go back. The real behavior later is a soft delete: set `deleted_at`, write the change to the outbox in one transaction, and exclude deleted rows from all list queries. Structure the code so only the mutation function changes.
- After deleting, the Expenses and Reports screens must not show the expense, and their totals and counts must update.
- A light haptic on confirm is allowed (`expo-haptics`), but not required.

### States

- **Loading:** static skeleton for the summary card and the image block while the query resolves.
- **Not found:** the id is invalid or the expense was deleted. Show "Expense not found" with a button back to the Expenses tab. The action bar still shows the back button.
- **Sync status:** if the expense is `pending`, show a small muted note under the summary card, "Saved on this device, waiting to sync", using the same style as the Expenses screen's sync notice. Hide it when `synced`.

### Theming and styling

- NativeWind tokens only: no hardcoded hex values or magic spacing numbers in components. Support light and dark mode.
- Icons that take color as a prop (back, pencil, trash) read from `useThemeColors()`. The delete icon uses the existing red token.
- Amounts use the mono face with tabular figures. The summary card uses the large corner radius, white (surface) background, and light border or shadow, as in the screenshot.
- Rows in the key/value list have comfortable spacing, and values are right-aligned and wrap without clipping at large font scales.

### Accessibility

- `accessibilityRole="button"` and a label on each action: "Back", "Edit expense", "Delete expense".
- The summary card reads as clear text: merchant, then amount, then each label with its value. Mark the large category icon as decorative.
- The receipt image has an `accessibilityLabel`, for example "Receipt image from Whole Foods Market".
- Touch targets of at least 44x44 pt, and text must not clip at large font scales.

## Data

Use mock data until the local database exists. Add to `src/lib/mock-data.ts`, the single source of mock data, in the same style as the other screens.

- **Expense and category:** read from the existing `MOCK_EXPENSES` and `MOCK_CATEGORIES`. Do not duplicate them. Whole Foods Market (`8742`, tax `612`, Groceries, Oct 10) is the expense shown in the screenshot.
- **Receipts:** add `MOCK_RECEIPTS`, shaped like the `receipts` table in the project overview: `id`, `expenseId`, `mimeType`, `width`, `height`, `sizeBytes`, and a local image source. Give most scanned expenses a receipt, and leave at least one scanned expense and the manual expense (Delta Air Lines) without one so the empty state can be seen.
- **Image asset:** add one or two sample receipt images under `assets/` and reference them from the mock receipts. Use fake or generic receipts only, with no real personal data. The screenshot's image is a Blue Bottle Coffee receipt on the Whole Foods expense, which is just a placeholder; it does not have to match.
- **Production source (later):** the real image comes from the private `receipts` bucket at `{user_id}/{expense_id}/{receipt_id}.jpg`, through a short-lived signed URL, with the local file (`local_uri`) preferred when it exists. Keep the image source behind a small function or prop so this swap is mechanical. Do not put signed URLs or storage paths in components.
- Money is integer minor units plus a currency code, and is formatted only through `formatMoney` in `src/lib/money.ts`. Add `formatLongDate` ("Saturday, October 10, 2026") to `src/lib/dates.ts` instead of formatting inline.
- Read the data through a `useExpense(id)` hook wrapping TanStack Query. It builds on the same query as `useExpenses`, so a deleted expense disappears everywhere. It returns the expense, its category, and its receipt, or a not-found result.
- Add a `useDeleteExpense` mutation hook that updates the cache for now.

## Suggested file structure

```
src/
  app/
    expense/[id].tsx             Expense detail (thin, validates id)
    review.tsx                   placeholder, if missing
  features/expenses/
    components/
      expense-detail-screen.tsx
      expense-detail-header.tsx  back, edit, delete buttons
      expense-summary-card.tsx
      detail-row.tsx             label/value row
      receipt-image-card.tsx
      expense-not-found.tsx
      expense-detail-skeleton.tsx
    hooks/
      use-expense.ts
      use-delete-expense.ts
  lib/
    mock-data.ts                 add MOCK_RECEIPTS
    dates.ts                     add formatLongDate
assets/
  receipts/                      sample receipt image(s)
```

Reuse `Card`, `IconBadge`, `SyncNotice`, and the `PlaceholderScreen` pattern. Install new packages with `npx expo install` (`expo-image` is already installed; `expo-haptics` only if used).

## Out of scope

- Real data: SQLite, Drizzle, Supabase, Storage, signed URLs, sync outbox
- The review and edit form (only navigation to a placeholder route)
- Full-screen receipt viewer with pinch-to-zoom
- Re-scanning, replacing, or sharing the receipt, and exporting the expense
- OCR text display and low-confidence field highlights
- Line items (a later roadmap item)
- Undo after delete

## Acceptance criteria

- Tapping any row on the Expenses screen opens its detail, and the values match the row: merchant, amount, category.
- The screen matches `ticketly-expense-detail.png` in layout, hierarchy, spacing, and color on iOS and Android, and does not crash on web.
- Tax is hidden when absent, Notes appears only when present, and the date reads like "Saturday, October 10, 2026".
- Expenses without a receipt show "No receipt attached", and the screen still works.
- Back works, including after a deep link with no history. Edit opens `/review` with the expense id.
- Deleting asks for confirmation, and after confirming, the expense is gone from the Expenses and Reports screens, and totals and counts are correct.
- An unknown or malformed id shows "Expense not found" instead of crashing.
- Light and dark modes both render with tokens only.
- `npx expo lint` and `npx tsc --noEmit` pass with no `any` types.

## References

- `@context/screenshots/ticketly-expense-detail.png`
- `@context/screenshots/ticketly-expenses.png`
- `@context/features/dashboard-screen-1-spec.md`
- `@context/features/dashboard-screen-2-spec.md`
- `@context/project-overview.md` (data model, receipts, routes, offline-first rules, privacy)
- `@context/coding-standards.md`
