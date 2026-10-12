# Coding Standards

Standards for the Ticketly receipt expense tracker: an Expo SDK 57 / React Native app (see [project-overview.md](project-overview.md) for the stack and data model). The previous version of this file described a Next.js, Prisma, and Tailwind web app, which this project does not use.

## Expo and React Native

- **Do not trust memory for Expo APIs.** Expo changes every SDK. Check the `expo` major version in `package.json`, then read the matching docs (`https://docs.expo.dev/versions/v57.0.0/`) before using an Expo, EAS, or React Native API.
- Install packages with `npx expo install <package>`, never `npm`, `yarn`, or `bun add`, so versions match the SDK.
- Prefer Expo modules over third-party libraries when one exists.
- Never create or edit `ios/` or `android/` by hand. Configure native behavior in `app.json` and config plugins (Continuous Native Generation).
- Native modules (document scanner, ML Kit OCR, RevenueCat) need a development build, not Expo Go.
- Write mobile-first: handle safe areas, keyboard avoidance, small screens, and both platforms. Use `Platform.select` or `.ios.tsx` / `.android.tsx` / `.web.tsx` files only when behavior truly differs.
- Web is a secondary target. Do not let it block native features, but do not crash on it either.

## TypeScript

- Strict mode enabled
- No `any` types: use proper typing or `unknown`
- Define interfaces or types for all props, API responses, and data models
- Use type inference where obvious, explicit types where helpful
- Infer types from Zod schemas (`z.infer`) instead of writing them twice
- Typed routes are on: build hrefs so they type-check, and do not cast them to silence errors

## React

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused: one job per component
- Extract reusable logic into custom hooks
- React Compiler is enabled: do not add `useMemo`, `useCallback`, or `React.memo` by default. Add them only with a measured reason.
- Follow the Rules of React so the compiler can optimize: no mutating props or state, no side effects during render
- Prefer derived values over state that duplicates other state

## Routing (Expo Router)

- Routes live in `src/app/`. Every file there is a screen and `_layout.tsx` files define navigators.
- Keep routes thin: they compose feature components and hooks. Put logic and UI in `src/features/`, `src/components/`, and `src/hooks/`.
- Import `Link`, `router`, `useLocalSearchParams`, and similar from `expo-router`.
- Use route groups for structure: `(auth)` for signed-out screens, `(tabs)` for the main app.
- Use dynamic routes for detail screens, for example `expense/[id].tsx`.
- Validate `useLocalSearchParams` values before use. They are strings (or arrays) and can be missing.

## File Organization

```
src/
  app/            routes only
  components/     shared UI, grouped by kind or feature
  features/       expenses, scan, review, auth, billing, reports
  db/             Drizzle schema, migrations, queries
  sync/           outbox, push, pull
  lib/            supabase client, zod schemas, parser, money and date utils
  hooks/          shared hooks
  stores/         Zustand stores
```

- Components: `src/components/[feature]/component-name.tsx`
- Feature code: `src/features/[feature]/` with its own `components/`, `hooks/`, and `api/` as needed
- Types: next to the code that owns them; shared types in `src/lib/types/` or inferred from Zod schemas in `src/lib/schemas/`
- Do not put non-route files in `src/app/`
- Use the `@/` path alias for imports from `src/` instead of long relative paths

## Naming

- Components: PascalCase exports (`ExpenseCard`)
- Files: kebab-case (`expense-card.tsx`), matching the existing Expo template convention
- Hooks: `use` prefix, camelCase (`useExpenses`)
- Functions and variables: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types and interfaces: PascalCase, no `I` prefix
- Database columns: `snake_case` in SQL, `camelCase` in TypeScript through Drizzle mapping
- Booleans read as questions: `isLoading`, `hasReceipt`

## Styling

- Use the project's single styling approach (NativeWind v4 with design tokens, per the project overview) for all new UI
- Define colors, spacing, and type as tokens. No hardcoded hex values or magic spacing numbers in components.
- Support light and dark mode through the system setting (`userInterfaceStyle: automatic`)
- Avoid inline style objects for anything reusable
- Use `expo-image` for images, `@shopify/flash-list` for long lists, and `react-native-safe-area-context` for insets
- Make touch targets at least 44x44 pt
- Add `accessibilityLabel` and `accessibilityRole` to interactive elements and icons that carry meaning
- Respect dynamic type; do not clip text when the font scale is large
- Use `expo-haptics` only for meaningful moments (scan success, save)

## Data and Money

- Store money as integer minor units plus an ISO 4217 currency code. Never use floats for amounts.
- Format and parse money and dates only through shared helpers in `src/lib/`
- Dates: `purchase_date` is a `YYYY-MM-DD` calendar date; timestamps are UTC ISO 8601
- Generate IDs on the client (UUID v4) so records can be created offline
- Use soft deletes (`deleted_at`). Exclude deleted rows in every list query.
- Every synced row carries `user_id`

## Database and Sync

- The local SQLite database (`expo-sqlite` with Drizzle) is the UI's source of truth. Read and write locally; the sync layer talks to Supabase.
- Use Drizzle for all local queries and migrations. Generate migrations with `drizzle-kit`, commit them, and never edit a migration that has shipped.
- Write expense, receipt, and outbox rows in a single transaction so a save is never half-applied
- Sync operations must be idempotent (upserts keyed by client UUID)
- Cloud schema changes go through Supabase migrations, with RLS enabled on every table in the same migration that creates it
- Never rely on app-side checks for access control. RLS and Storage policies enforce ownership.
- Receipt images go in the private `receipts` bucket under `{user_id}/{expense_id}/{receipt_id}.jpg` and are served through short-lived signed URLs

## Data Fetching and State

- Use TanStack Query for reads and mutations, wrapping local queries and Supabase calls
- Use Zustand for transient UI state only (scan draft, filters). Do not duplicate server or database data in it.
- Define query keys in one place per feature
- Validate all external input with Zod: form values, OCR parser output, Edge Function responses, and sync payloads
- Keep one Zod schema as the single definition of each shape (`ExpenseInput`, `ParsedReceipt`, `SyncChange`, `Entitlement`)

## Forms

- Use `react-hook-form` with a Zod resolver for the review and edit screen
- Highlight low-confidence OCR fields, and never save OCR results without user confirmation
- Show inline, field-level error messages
- Handle the keyboard: scroll the focused field into view and support the next/done return keys

## Error Handling

- Wrap async work in try/catch at the boundary (mutation, sync step, Edge Function call)
- Return a typed result (`{ success, data, error }`) from data-layer functions that can fail in expected ways, instead of throwing across layers
- Show user-friendly messages via toast or inline text. Never show raw error objects or stack traces.
- Report unexpected errors to Sentry with context but without personal or receipt data
- Handle permission denial (camera) and offline states explicitly with a clear next step
- Add an error boundary at the root layout and around the scan flow

## Security and Privacy

- Never put secrets in the app. Only `EXPO_PUBLIC_*` values that are public by design may ship (Supabase URL and anon key, public SDK keys).
- Service role keys, Stripe secrets, webhook secrets, and LLM keys live in Edge Function secrets only
- Store auth sessions with `expo-secure-store`
- Keep OCR on-device. Do not send receipt images or text to a third party without explicit user consent.
- Do not log receipt contents, amounts, or user identifiers. Strip them from analytics and crash reports.
- Request only the permissions the app needs, with clear purpose strings in `app.json`
- Verify billing webhook signatures and handle events idempotently, using the `webhook_events` table

## Billing and Plans

- Read plan access from the single `entitlements` record, never from provider SDK state alone
- Read limits from the `plans` table, not hardcoded constants, so they can change without an app update
- Enforce scan limits on the server (RPC). Local checks are for UX only.
- Saved expenses must remain accessible after a subscription ends

## Performance

- Use `FlashList` for the expense list with stable keys and memoized-free row components (the compiler handles memoization)
- Run animations on the UI thread with Reanimated; avoid animating layout-heavy properties from JS
- Compress receipt images before saving (about 1600 px on the long edge, under about 500 KB)
- Query with indexes in mind and paginate large lists
- Keep OCR and parsing off the render path; show progress while they run
- Lazy-load heavy, rarely used screens such as reports

## Testing

- Unit-test the parser, money and date helpers, and sync logic using fixture receipts
- Test Zod schemas with valid and invalid input
- Test the outbox: retries, ordering, and idempotency
- Keep fixtures free of real personal data

## Tooling and Workflow

- Run `npx expo lint` and `npx tsc --noEmit` before declaring any task done
- Run `npx expo-doctor` after dependency changes, and `npx expo install --fix` if versions drift
- Use EAS Build profiles: `development`, `preview`, `production`
- Run EAS CLI as `npx eas-cli@latest <command>` (use `bunx eas-cli` only if the project moves to bun)
- Commit migrations and generated types together with the code that needs them

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- No `console.log` in committed code; use a small logger that Sentry can hook into
- Keep functions under 50 lines when possible
- Prefer early returns over deep nesting
- Write comments only for non-obvious reasons ("why"), not for what the code already says
- Name things after the domain: expense, receipt, merchant, entitlement
