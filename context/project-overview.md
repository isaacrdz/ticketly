# Product Overview: Receipt Expense Tracker

## Summary

A mobile app that turns paper receipts into an organized expense list. Users scan a receipt, review the extracted information, and save it as a searchable expense. The app is built for quick capture, reliable records, and easy correction when scanning gets something wrong.

## Problem

Receipts are easy to lose and tedious to enter manually. People who want to track their spending need a faster way to record purchases and keep each receipt image linked to its expense.

## Product goal

Make capturing and organizing an expense take less effort than typing it by hand, while keeping users in control of the accuracy of their records.

## Target users

- Individuals who want a simple record of day-to-day spending
- Freelancers and small-business owners collecting receipts for bookkeeping
- Anyone who needs to find a past purchase or keep its receipt for reference

## Core user flow

1. The user creates an account or signs in.
2. The user scans a receipt.
3. The app extracts text and identifies likely expense details.
4. The user reviews and corrects merchant, date, total, tax, and other available fields.
5. The user saves the expense and its receipt image.
6. The expense appears in a list that can be searched and reviewed later.
7. The user can upgrade to Pro when they need its additional features.

## MVP features

- Scan receipts with a document scanner (edge detection, auto-crop, perspective correction)
- Extract receipt text with on-device OCR
- Create an expense with merchant, date, total, currency, tax, and optional category and notes
- Review and edit extracted fields before saving, with low-confidence fields highlighted
- Keep the receipt image linked to its expense
- Browse and search saved expenses
- Store data locally and sync when connectivity is available
- Create an account, sign in and out, and reset a forgotten password
- Back up and sync expenses across devices
- Free and Pro plans, with current plan and usage shown in the app

## Authentication

An account is required for cloud backup, cross-device sync, and subscription management.

- Email and password sign-up, sign-in, and password reset
- Apple and Google sign-in to reduce friction
- Every expense and receipt is tied to its authenticated owner
- Access is enforced with Supabase Row Level Security and private Storage policies, not only by checks in the app

## Free and Pro plans

Free makes the core receipt-to-expense workflow useful. Pro serves higher-volume and advanced needs. Limits and entitlements live in a backend table so they can change without an app update.

| Capability                             | Free                                                 | Pro                                                                   |
| -------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------- |
| Receipt scanning and expense list      | Included, with a configurable monthly scan allowance | Higher or unlimited allowance (set after validating costs and demand) |
| Search, edit, and receipt image access | Included                                             | Included                                                              |
| Sync and account backup                | Included                                             | Included                                                              |
| Reports and exports                    | Basic overview                                       | Expanded reports and CSV export                                       |
| Line-item extraction                   | Not included or limited                              | Included when available                                               |

Before launch, decide and publish the scan allowance, Pro price, trial terms, and cancellation and refund details. The app must explain clearly when a Free user reaches a limit, and saved expenses must stay accessible if a subscription ends.

## Subscription and billing

- **Web:** Stripe Billing for Checkout and the Customer Portal. Sessions are created by a trusted backend or Supabase Edge Function; secret keys never ship in the app. Signed webhooks update an entitlement record, handled idempotently, covering renewals, failed payments, cancellations, and expiration.
- **Mobile:** Apple and Google generally require their own in-app billing for digital subscriptions that unlock app features. Use **RevenueCat** to wrap StoreKit and Google Play Billing and to unify entitlements with Stripe. The app reads a single entitlement record to decide Pro access.
- **Rollout:** Ship the MVP as Free only; add billing in the next release. Verify current store rules for each target region at implementation and submission time. See the [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) and the [Google Play payments policy](https://support.google.com/googleplay/android-developer/answer/10281818?hl=en).

---

# Technical Specification

## Technology stack

| Area                 | Choice                                                              | Purpose                                                                         |
| -------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Framework            | React Native, Expo, Expo Router, TypeScript, EAS Build              | One iOS and Android codebase with file-based navigation                         |
| Capture              | `react-native-document-scanner-plugin`, `expo-image-manipulator`    | Clean receipt scans (VisionKit on iOS, ML Kit on Android) and image compression |
| OCR                  | `@react-native-ml-kit/text-recognition`                             | One on-device OCR library for both platforms                                    |
| Parsing              | Heuristics plus Zod; optional LLM via Edge Function                 | Turn OCR text into structured fields                                            |
| Local database       | `expo-sqlite` with Drizzle ORM                                      | Offline storage, typed queries, migrations, sync outbox                         |
| Sync                 | Outbox with last-write-wins (or PowerSync)                          | Offline-first sync with Supabase                                                |
| State and data       | TanStack Query, Zustand                                             | Server and UI state                                                             |
| Forms and validation | `react-hook-form`, Zod                                              | Review and edit screen                                                          |
| Backend              | Supabase (Auth, Postgres with RLS, private Storage, Edge Functions) | Accounts, data, receipt files, trusted server logic                             |
| Billing              | RevenueCat and Stripe Billing                                       | Store IAP and web subscriptions with unified entitlements                       |
| Monitoring           | Sentry, PostHog                                                     | Crashes and product funnel metrics                                              |

Native modules (scanner, OCR) require an Expo development build; they do not run in Expo Go.

### Current project baseline

Versions currently installed in `package.json`. Always check the matching Expo SDK docs (`https://docs.expo.dev/versions/v57.0.0/`) before using an API, since Expo changes between SDKs.

| Item                   | Value                                                                    |
| ---------------------- | ------------------------------------------------------------------------ |
| Expo SDK               | 57 (`expo ~57.0.27`)                                                     |
| React Native / React   | 0.86.3 / 19.2.3                                                          |
| Routing                | `expo-router ~57.0.25`, typed routes enabled, routes in `src/app/`       |
| Language               | TypeScript ~6.0 (strict)                                                 |
| Compiler               | React Compiler enabled (`experiments.reactCompiler`)                     |
| Animation / gestures   | `react-native-reanimated 4.5.1`, `react-native-worklets`, gesture-handler |
| Targets                | iOS, Android, web (static output); portrait only                         |
| URL scheme             | `ticketly`                                                               |
| Tooling                | ESLint 9 with `eslint-config-expo`; `expo lint`, `npx tsc --noEmit`      |
| Builds                 | EAS Build (project ID in `app.json`)                                     |

### UI stack

- NativeWind v4 for styling, with design tokens for color, spacing, and type
- Reanimated and Gesture Handler for transitions and swipe actions
- `expo-haptics` on scan success and save
- `@shopify/flash-list` for the expense list
- `@gorhom/bottom-sheet` for the review screen and filters
- `lucide-react-native` icons, Inter font via `expo-font`
- `react-native-gifted-charts` for reports, `expo-image` for thumbnails
- Optional: React Native Reusables for ready-made components

Add every new package with `npx expo install <package>` so versions match SDK 57.

## Architecture

```
Scanner ──► Image compress ──► ML Kit OCR ──► Parser (heuristics + Zod)
                                                    │
                                                    ▼
                                         Review screen (RHF + Zod)
                                                    │ save
                                                    ▼
                         SQLite (source of truth on device) + outbox
                                                    │ when online
                                                    ▼
                    Supabase: Postgres (RLS) · Storage (private) · Auth
                                                    ▲
                      Stripe webhooks / RevenueCat ─┘ (entitlements)
```

- **Local first:** the device database is the source of truth for the UI. The network only syncs it.
- **TanStack Query** wraps local queries and server calls; **Zustand** holds transient UI state (scan draft, filters).
- **Edge Functions** hold trusted logic: Stripe sessions and webhooks, RevenueCat webhooks, and the optional LLM parsing fallback.

## Data structures

### Conventions

| Convention    | Rule                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------ |
| IDs           | UUID v4 generated on the client, so records can be created offline                               |
| Money         | Integer minor units (`1999` = 19.99) plus an ISO 4217 currency code; never floats                |
| Dates         | `purchase_date` is a calendar date (`YYYY-MM-DD`); timestamps are UTC ISO 8601 / `timestamptz`   |
| Deletes       | Soft delete via `deleted_at` so deletions can sync                                               |
| Ownership     | Every synced row carries `user_id`; RLS restricts access to `auth.uid() = user_id`               |
| Naming        | `snake_case` in SQL (both SQLite and Postgres); `camelCase` in TypeScript via Drizzle mapping    |

### Postgres (Supabase), cloud source of record

**`profiles`**

| Column               | Type          | Notes                                       |
| -------------------- | ------------- | ------------------------------------------- |
| `id`                 | `uuid` PK     | References `auth.users(id)`, on delete cascade |
| `display_name`       | `text`        | Optional                                    |
| `default_currency`   | `char(3)`     | ISO 4217, default `USD`                     |
| `created_at`         | `timestamptz` | Default `now()`                             |
| `updated_at`         | `timestamptz` | Updated by trigger                          |

**`categories`**

| Column       | Type          | Notes                                               |
| ------------ | ------------- | --------------------------------------------------- |
| `id`         | `uuid` PK     | Client-generated                                    |
| `user_id`    | `uuid`        | Owner; null for built-in defaults (read-only)       |
| `name`       | `text`        | Unique per user (case-insensitive)                  |
| `color`      | `text`        | Optional design token or hex                        |
| `icon`       | `text`        | Optional icon name                                  |
| `created_at` | `timestamptz` |                                                     |
| `updated_at` | `timestamptz` |                                                     |
| `deleted_at` | `timestamptz` | Soft delete                                         |

**`expenses`**

| Column               | Type           | Notes                                                              |
| -------------------- | -------------- | ------------------------------------------------------------------ |
| `id`                 | `uuid` PK      | Client-generated                                                   |
| `user_id`            | `uuid`         | Owner, references `auth.users(id)`                                 |
| `merchant`           | `text`         | Required                                                           |
| `purchase_date`      | `date`         | Required                                                           |
| `total_minor`        | `bigint`       | Required, `>= 0`                                                   |
| `currency`           | `char(3)`      | Required, ISO 4217                                                 |
| `tax_minor`          | `bigint`       | Nullable                                                           |
| `category_id`        | `uuid`         | Nullable, references `categories(id)`, on delete set null          |
| `notes`              | `text`         | Nullable                                                           |
| `source`             | `text`         | `scan` or `manual`                                                 |
| `ocr_confidence`     | `real`         | Nullable, 0 to 1 overall score                                     |
| `created_at`         | `timestamptz`  |                                                                    |
| `updated_at`         | `timestamptz`  | Used for last-write-wins; set by the client, validated by trigger  |
| `deleted_at`         | `timestamptz`  | Soft delete                                                        |

**`receipts`**

| Column          | Type          | Notes                                                       |
| --------------- | ------------- | ----------------------------------------------------------- |
| `id`            | `uuid` PK     | Client-generated                                            |
| `user_id`       | `uuid`        | Owner                                                       |
| `expense_id`    | `uuid`        | References `expenses(id)`, on delete cascade                |
| `storage_path`  | `text`        | `{user_id}/{expense_id}/{receipt_id}.jpg` in private bucket |
| `mime_type`     | `text`        | Default `image/jpeg`                                        |
| `width`         | `integer`     | Pixels                                                      |
| `height`        | `integer`     | Pixels                                                      |
| `size_bytes`    | `integer`     | After compression                                           |
| `ocr_text`      | `text`        | Raw recognized text, kept for re-parsing and search         |
| `created_at`    | `timestamptz` |                                                             |
| `deleted_at`    | `timestamptz` | Soft delete                                                 |

**`plans`** (admin-managed, readable by all authenticated users)

| Column                  | Type      | Notes                                         |
| ----------------------- | --------- | --------------------------------------------- |
| `id`                    | `text` PK | `free`, `pro`                                 |
| `monthly_scan_limit`    | `integer` | Null means unlimited                          |
| `line_items_enabled`    | `boolean` |                                               |
| `csv_export_enabled`    | `boolean` |                                               |
| `advanced_reports`      | `boolean` |                                               |

**`entitlements`** (written only by Edge Functions with the service role)

| Column                     | Type          | Notes                                                       |
| -------------------------- | ------------- | ----------------------------------------------------------- |
| `user_id`                  | `uuid` PK     | References `auth.users(id)`                                 |
| `plan_id`                  | `text`        | References `plans(id)`, default `free`                      |
| `status`                   | `text`        | `active`, `trialing`, `past_due`, `canceled`, `expired`     |
| `provider`                 | `text`        | `revenuecat`, `stripe`, or `none`                           |
| `provider_customer_id`     | `text`        | Nullable                                                    |
| `current_period_end`       | `timestamptz` | Nullable                                                    |
| `updated_at`               | `timestamptz` |                                                             |

**`usage_counters`**

| Column         | Type      | Notes                                         |
| -------------- | --------- | --------------------------------------------- |
| `user_id`      | `uuid`    | Part of PK                                    |
| `period_start` | `date`    | First day of the month, part of PK            |
| `scan_count`   | `integer` | Incremented on each saved scan                |

**`webhook_events`** (idempotency log, service role only)

| Column         | Type          | Notes                                      |
| -------------- | ------------- | ------------------------------------------ |
| `id`           | `text` PK     | Provider event ID, ensures single handling |
| `provider`     | `text`        | `stripe` or `revenuecat`                   |
| `received_at`  | `timestamptz` |                                            |

#### Indexes

| Table        | Index                                              | Purpose                              |
| ------------ | -------------------------------------------------- | ------------------------------------ |
| `expenses`   | `(user_id, purchase_date desc)` where not deleted  | Expense list ordering                |
| `expenses`   | `(user_id, updated_at)`                            | Incremental sync pull                |
| `expenses`   | `(user_id, category_id)`                           | Category filters and reports         |
| `receipts`   | `(expense_id)`                                     | Load a receipt for an expense        |
| `categories` | unique `(user_id, lower(name))`                    | Prevent duplicate names              |

### Local database (`expo-sqlite` + Drizzle)

Mirrors the cloud tables, with sync bookkeeping added.

**`expenses`**: same columns as the cloud table, plus:

| Column         | Type      | Notes                                                    |
| -------------- | --------- | -------------------------------------------------------- |
| `sync_status`  | `text`    | `synced`, `pending`, `conflict`                          |
| `server_updated_at` | `text` | Last `updated_at` seen from the server                   |

**`receipts`**: same columns as the cloud table, plus `local_uri` (file in app storage) and `upload_status` (`pending`, `uploaded`, `failed`).

**`categories`**: same as cloud.

**`outbox`** (queued changes to push)

| Column         | Type        | Notes                                                       |
| -------------- | ----------- | ----------------------------------------------------------- |
| `id`           | `integer` PK | Autoincrement, defines push order                          |
| `entity`       | `text`      | `expense`, `receipt`, `category`                            |
| `entity_id`    | `text`      | UUID of the changed row                                     |
| `operation`    | `text`      | `upsert` or `delete`                                        |
| `payload`      | `text`      | JSON snapshot at time of change                             |
| `attempts`     | `integer`   | Retry count for backoff                                     |
| `last_error`   | `text`      | Nullable                                                    |
| `created_at`   | `text`      |                                                             |

**`sync_state`**

| Column      | Type   | Notes                                              |
| ----------- | ------ | -------------------------------------------------- |
| `entity`    | `text` PK | `expense`, `receipt`, `category`                |
| `cursor`    | `text` | Latest server `updated_at` pulled for the entity   |

**Search:** an FTS5 virtual table `expenses_fts(merchant, notes, ocr_text)` kept in sync by triggers powers the search box.

### Supabase Storage

| Bucket     | Visibility | Path pattern                                   | Policy                                                      |
| ---------- | ---------- | ---------------------------------------------- | ----------------------------------------------------------- |
| `receipts` | Private    | `{user_id}/{expense_id}/{receipt_id}.jpg`      | Read, insert, and delete only when the first path segment equals `auth.uid()`. Images served through short-lived signed URLs. |

### Row Level Security

| Table                                   | Select                       | Insert / Update / Delete          |
| --------------------------------------- | ---------------------------- | --------------------------------- |
| `profiles`, `expenses`, `receipts`      | `auth.uid() = user_id`       | `auth.uid() = user_id`            |
| `categories`                            | Own rows and built-in rows   | Own rows only                     |
| `plans`                                 | Any authenticated user       | Service role only                 |
| `entitlements`, `usage_counters`        | Own row                      | Service role only (usage via RPC) |
| `webhook_events`                        | None                         | Service role only                 |

### Shared TypeScript and Zod types

Zod schemas are the single definition of the shape. TypeScript types are inferred from them (`z.infer`), and the same schema validates the review form, parser output, and sync payloads.

| Schema                | Fields                                                                                                  | Used by                         |
| --------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `ExpenseInput`        | `merchant` (non-empty), `purchaseDate` (ISO date), `totalMinor` (int, ≥ 0), `currency` (3 letters), `taxMinor?`, `categoryId?`, `notes?` | Review form, manual entry       |
| `ParsedReceipt`       | `merchant?`, `purchaseDate?`, `totalMinor?`, `taxMinor?`, `currency?`, `confidence` per field (0 to 1)  | Parser output, review highlights |
| `SyncChange`          | `entity`, `entityId`, `operation`, `payload`, `updatedAt`                                               | Outbox push and pull            |
| `Entitlement`         | `planId`, `status`, `currentPeriodEnd?`                                                                 | Plan gating in the UI           |

### Enumerations

| Enum              | Values                                                      |
| ----------------- | ----------------------------------------------------------- |
| Expense source    | `scan`, `manual`                                            |
| Sync status       | `synced`, `pending`, `conflict`                             |
| Upload status     | `pending`, `uploaded`, `failed`                             |
| Entitlement status | `active`, `trialing`, `past_due`, `canceled`, `expired`    |
| Plan ID           | `free`, `pro`                                               |
| Billing provider  | `revenuecat`, `stripe`, `none`                              |

## Capture and extraction pipeline

| Step | Component                              | Detail                                                                                          |
| ---- | -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1    | Document scanner                       | Edge detection, auto-crop, perspective correction; returns a cropped image URI                   |
| 2    | `expo-image-manipulator`               | Resize to about 1600 px on the long edge, JPEG quality about 0.7; target under 500 KB            |
| 3    | ML Kit text recognition                | On-device; returns blocks, lines, and bounding boxes                                             |
| 4    | Parser                                 | Heuristics: largest "total" amount near keywords, date formats by locale, merchant from top lines, tax from keyword lines |
| 5    | Confidence scoring                     | Each field gets a 0 to 1 score; fields under the threshold are highlighted on the review screen  |
| 6    | Review form                            | User edits and confirms; nothing is saved without confirmation                                   |
| 7    | Save                                   | One local transaction writes expense, receipt, and outbox rows; scan counter is incremented       |

Optional fallback: when confidence is low and the user consents, send the OCR text (not the image by default) to an Edge Function that calls an LLM and returns `ParsedReceipt`.

## Sync design

| Concern           | Approach                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| Push              | Drain `outbox` in order; each item is an idempotent upsert keyed by client UUID                           |
| Pull              | Fetch rows with `updated_at > cursor` per entity, apply locally, advance the cursor                        |
| Conflicts         | Last-write-wins on `updated_at`; deletions are soft so they propagate                                      |
| Images            | Uploaded separately after the row sync; `upload_status` tracks retries                                    |
| Triggers          | App start, foreground, network regained, and after each local save                                         |
| Retry             | Exponential backoff using `attempts`; surface persistent failures in Settings                              |
| Plan limits       | Scan counting is checked locally for UX and enforced server-side via RPC                                    |

## Navigation and routes

Expo Router with files under `src/app/`. Components, hooks, and utilities live outside `src/app/`.

| Route                      | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `/(auth)/sign-in`          | Email, Apple, Google sign-in                         |
| `/(auth)/sign-up`          | Account creation                                     |
| `/(auth)/reset-password`   | Password reset                                       |
| `/(tabs)/index`            | Expenses list and search                             |
| `/(tabs)/scan`             | Center Scan action, launches the scanner             |
| `/(tabs)/reports`          | Reports and settings entry                           |
| `/review`                  | Review and edit extracted fields before saving       |
| `/expense/[id]`            | Expense detail, receipt image, edit, delete          |
| `/paywall`                 | Plan comparison and upgrade                          |
| `/settings`                | Account, plan and usage, sync status, privacy        |

Currently implemented: `src/app/_layout.tsx` and `src/app/index.tsx` only.

## Suggested source layout

```
src/
  app/            routes only
  components/     shared UI
  features/       expenses, scan, review, auth, billing, reports
  db/             Drizzle schema, migrations, queries
  sync/           outbox, push, pull
  lib/            supabase client, zod schemas, parser, money and date utils
  hooks/
  stores/         Zustand stores
```

## Configuration and secrets

| Item                                   | Where                            | Notes                                              |
| -------------------------------------- | -------------------------------- | -------------------------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`             | App env                          | Public by design                                   |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`        | App env                          | Public; safe only because RLS is enforced          |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` / `_ANDROID_KEY` | App env               | Public SDK keys                                    |
| `EXPO_PUBLIC_SENTRY_DSN`, `EXPO_PUBLIC_POSTHOG_KEY` | App env             | Public ingestion keys                              |
| Supabase service role key              | Edge Function secrets only       | Never in the app                                   |
| Stripe secret and webhook secret       | Edge Function secrets only       | Never in the app                                   |
| RevenueCat webhook secret              | Edge Function secrets only       |                                                    |
| LLM provider key                       | Edge Function secrets only       | Only if the fallback is enabled                    |

Auth sessions are stored with `expo-secure-store`.

## Non-functional requirements

| Area            | Target                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Capture speed   | Photo to review screen in under 3 seconds on a mid-range device                                 |
| Offline         | Scan, review, save, search, and browse work with no connection                                  |
| List performance | Smooth scrolling at 60 fps with thousands of expenses (FlashList, indexed queries)             |
| Image size      | Under 500 KB per stored receipt                                                                 |
| Privacy         | Private bucket, signed URLs, OCR on-device, TLS only                                            |
| Accessibility   | Dynamic type, screen reader labels, sufficient contrast, dark mode (`userInterfaceStyle: automatic`) |
| Platforms       | iOS, Android; web is secondary                                                                  |

## Quality and tooling

- Run `npx expo lint` and `npx tsc --noEmit` before declaring work done.
- Run `npx expo-doctor` after dependency changes.
- Unit-test the parser, money and date utilities, and sync logic with fixture receipts.
- Track parser accuracy against a saved set of sample receipts (see `context/research`).
- Use EAS Build profiles: `development` (dev client), `preview` (internal), `production`.

## App structure

Three tabs: **Expenses**, a prominent center **Scan** button, and **Reports / Settings**. The scan flow is scan, review, save, which is two taps after the photo.

## Product principles

- **User-reviewed accuracy:** OCR suggestions are editable and confirmed by the user before saving.
- **Private by default:** Receipt images live in private storage, accessible only to their owner.
- **Useful offline:** Users can capture and review expenses without a connection.
- **Low-friction capture:** Keep the path from opening the app to a saved expense short.
- **Clear plans:** Explain Free limits and Pro benefits before upgrade, and keep saved records available if a subscription ends.

## Privacy considerations

Receipts can contain personal and financial information. Use authenticated access, private storage, and secure transport, and request only the permissions the app needs. Keep OCR on-device for the MVP. If images or text are sent to a cloud OCR or language-model service, explain it clearly and obtain consent first.

Line items come later; they add parsing complexity and must not be required to save an expense.

## Risks and open questions

- **Sync conflicts:** Offline-first sync is the riskiest part; keep the MVP model simple (client UUIDs, soft deletes, last-write-wins).
- **Parsing accuracy:** Heuristics will miss on messy receipts; plan the LLM fallback and track correction rates.
- **Native OCR and scanner support:** Confirm package compatibility with Expo SDK 57, React Native 0.86, and the New Architecture before committing.
- **Store billing compliance:** Confirm the billing path per store and region before offering in-app upgrades.
- **Pricing:** Scan allowance and Pro price need cost and demand validation.
- **Account deletion:** Stores require in-app account deletion; define how it cascades to rows and Storage files.

## Success measures

- Receipt capture completion rate
- Percentage of scans saved without abandoning
- Time from photo capture to saved expense
- Frequency and type of corrections to extracted fields
- Returning users and expenses recorded per active user
- Free-to-Pro conversion and subscription retention

## Roadmap

**MVP:** scan, OCR, review and edit, expense list and search, auth, local storage with sync, Free plan with scan allowance.

**Next:** Pro subscriptions (RevenueCat and Stripe), categories, monthly summaries, CSV export.

**Later:** line-item extraction (`line_items` table linked to `expenses`), duplicate detection, cloud OCR or LLM parsing for hard receipts, accounting-tool exports, shared household or business lists.
