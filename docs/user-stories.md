# SuperAdverts — Engineering User Stories

> Senior dev audit — April 2026  
> **46 issues found** across 8 epics. Prioritised by risk and user impact.  
> Labels: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low  
> 1 SP = 1 hour of work · Range: 0.5–3 SP · Stories above 3 SP are split

---

## Epic 1 — Security: Credentials & Secrets

---

### US-002 🟠 Harden cron endpoint authentication `3 SP`

**As a** platform operator,  
**I want** cron routes to be protected beyond a simple Bearer token,  
**so that** they cannot be triggered by anyone who captures the token from logs.

**File:** `app/api/cron/refresh-tokens/route.ts` · `app/api/cron/generate-reports/route.ts`

**Acceptance Criteria:**
- [ ] Requests to `/api/cron/*` are validated with an HMAC-signed timestamp (prevents replay attacks older than 5 minutes)
- [ ] `CRON_SECRET` is marked as required in `lib/env.ts` — app refuses to start if absent
- [ ] IP allowlist is checked when `CRON_ALLOWED_IPS` env var is provided
- [ ] All failed cron auth attempts are logged with IP and timestamp

---

### US-003 🟠 Add CSRF protection to OAuth authorize flow `2 SP`

**As a** user,  
**I want** the Meta/Google OAuth flow to be protected against CSRF,  
**so that** a malicious site cannot trigger account linking on my behalf.

**File:** `app/api/integrations/meta/authorize/route.ts` · `app/api/integrations/meta/callback/route.ts`

**Acceptance Criteria:**
- [ ] OAuth `state` parameter is bound to a `SameSite=Strict; Secure; HttpOnly` cookie set on redirect
- [ ] Callback route verifies cookie value matches `state` before exchanging code
- [ ] Stale OAuth state (> 10 minutes old) is rejected with `400`
- [ ] Authorization code exchange has a 30-second server timeout; user sees "Authorization timed out" on failure

---

### US-004 🟠 Secure invitation flow against enumeration and spam `2 SP`

**As a** platform operator,  
**I want** the invitation endpoint protected against spam and enumeration,  
**so that** we cannot be used as a relay to send unsolicited email.

**File:** `app/api/invitations/route.ts` · `app/api/invitations/accept/route.ts`

**Acceptance Criteria:**
- [ ] `POST /api/invitations` is rate-limited to 5 invitations per agency per hour
- [ ] `POST /api/invitations/accept` is rate-limited to 10 attempts per IP per 15 minutes
- [ ] Inviting the same email twice within 24 hours returns `409` with a clear message rather than sending a duplicate
- [ ] Invitation acceptance is wrapped in a `prisma.$transaction()` to prevent the double-accept race condition

---

### US-005 🟡 Enforce `NEXTAUTH_URL` in production `0.5 SP`

**As a** platform operator,  
**I want** `NEXTAUTH_URL` to have no default in production,  
**so that** auth callbacks are never sent to `localhost`.

**File:** `lib/env.ts`

**Acceptance Criteria:**
- [ ] `NEXTAUTH_URL` defaults to `http://localhost:3000` only when `NODE_ENV === 'development'`
- [ ] In `staging` and `production` environments, missing `NEXTAUTH_URL` causes app startup to throw with a clear message
- [ ] Existing `lib/env.ts` tests pass; a new test covers the production guard

---

## Epic 2 — Security: Authorisation

---

### US-006 🟠 Prevent cross-agency user role modification `1 SP`

**As an** agency admin,  
**I want** role updates to be scoped to my own agency,  
**so that** I cannot modify users belonging to a different agency.

**File:** `app/api/team/route.ts`

**Acceptance Criteria:**
- [ ] `PATCH /api/team` fetches the target user and verifies `targetUser.agencyId === session.user.agencyId`; returns `403` if not
- [ ] `SUPER_ADMIN` is exempt from the agency scope check
- [ ] A unit test covers the cross-agency attempt scenario

---

### US-007 🟡 Fix admin middleware role hierarchy `1.5 SP`

**As an** agency admin,  
**I want** the admin panel to be accessible based on role,  
**so that** `ADMIN` users are not incorrectly blocked.

**File:** `middleware.ts`

**Acceptance Criteria:**
- [ ] `/admin` routes allow access to both `SUPER_ADMIN` and `ADMIN` roles (based on documented intent)
- [ ] Role check is extracted to a shared `hasRole(session, roles[])` utility in `lib/auth/`
- [ ] Middleware tests cover each role attempting to access `/admin`

---

### US-008 🟡 Sanitize report HTML before serving `1.5 SP`

**As a** user,  
**I want** report previews to be safe from injected scripts,  
**so that** a malicious report cannot steal my session.

**File:** `app/api/reports/[id]/preview/route.ts`

**Acceptance Criteria:**
- [ ] Report HTML is sanitised with `DOMPurify` (or `sanitize-html` on the server) before being sent
- [ ] Response includes `Content-Security-Policy: default-src 'none'` header
- [ ] A test verifies that `<script>` tags in report content are stripped

---

## Epic 3 — Input Validation & Error Handling

---

### US-009a 🟠 Add Zod validation — shared helper + core routes `2 SP`

**As a** developer,  
**I want** a shared request body validation helper and core routes protected,  
**so that** invalid payloads return `400` instead of crashing.

**Files:** `lib/api/parse-body.ts` (new) · `app/api/team/route.ts` · `app/api/clients/route.ts` · `app/api/admin/ai-providers/[id]/route.ts`

**Acceptance Criteria:**
- [ ] `parseBody<T>(request, schema)` helper is created in `lib/api/` — catches malformed JSON and returns `400`
- [ ] Above three routes use `parseBody` and return `{ error, details }` on validation failure
- [ ] No route in scope uses `as SomeType` to cast an unvalidated body

---

### US-009b 🟠 Add Zod validation — remaining API routes `2 SP`

**As a** developer,  
**I want** all remaining API routes to validate request bodies,  
**so that** validation coverage is complete across the codebase.

**Files:** All remaining `POST`/`PATCH` routes under `app/api/`

**Acceptance Criteria:**
- [ ] All remaining routes use `parseBody` from US-009a
- [ ] No `POST` or `PATCH` route in the codebase uses unvalidated `request.json()` cast
- [ ] A grep for `as .*Input` returns no matches in route files

---

### US-010a 🟠 Email env validation and typed error `2 SP`

**As a** platform operator,  
**I want** email configuration to be validated at startup and failures to be typed,  
**so that** misconfigured email is caught early and callers must handle it explicitly.

**Files:** `lib/env.ts` · `lib/services/email.ts` · `prisma/schema.prisma`

**Acceptance Criteria:**
- [ ] `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD`, `EMAIL_FROM` are added to `lib/env.ts` validation
- [ ] `sendEmail()` throws a typed `EmailError` class (not a generic `Error`)
- [ ] `Report` model gains `sentAt DateTime?` and `failedAt DateTime?` fields with a migration
- [ ] Cron report job updates `sentAt` on success and `failedAt` on failure

---

### US-010b 🟠 In-app alert on repeated email delivery failures `1.5 SP`

**As a** super admin,  
**I want** to be notified in-app when email delivery fails repeatedly,  
**so that** I can investigate before users are impacted.

**Files:** `app/api/cron/generate-reports/route.ts` · `lib/services/notification.ts`

**Acceptance Criteria:**
- [ ] After 3 consecutive `failedAt` updates for a report, an in-app notification is created for all `SUPER_ADMIN` users
- [ ] Notification message includes the report ID and client name
- [ ] Notification is not re-sent if one already exists for the same report within 24 hours

---

### US-011 🟡 Standardise API error response shape `3 SP`

**As a** frontend developer,  
**I want** all API errors to share a consistent response shape,  
**so that** the UI can handle errors uniformly.

**Files:** All `app/api/` route files

**Acceptance Criteria:**
- [ ] All error responses follow `{ error: string, code: string, details?: unknown }`
- [ ] HTTP status codes are used correctly: `400` validation, `401` unauthenticated, `403` forbidden, `404` not found, `500` server error
- [ ] A shared `apiError(code, message, status)` helper exists in `lib/api/`
- [ ] No route returns a `500` for a client-caused error

---

## Epic 4 — Performance: Database

---

### US-012 🟠 Add missing database indexes `1.5 SP`

**As a** user,  
**I want** list and filter operations to be fast,  
**so that** pages don't time out as data grows.

**File:** `prisma/schema.prisma`

**Acceptance Criteria:**
- [ ] `User` model has `@@index([agencyId])`
- [ ] `Client` model has `@@index([agencyId])`
- [ ] `MetaAccount` and `GoogleAccount` models have `@@index([clientId])`
- [ ] `Invitation` model has `@@index([agencyId, expiresAt])`
- [ ] `CampaignMetric` model has `@@index([clientId, date])`
- [ ] `Insight` model has `@@index([clientId, createdAt])`
- [ ] Migration is created and tested against the existing seed data

---

### US-013 🟠 Fix N+1 query in sync operations `2 SP`

**As a** platform operator,  
**I want** data sync to use batch database writes,  
**so that** syncing 100+ campaigns doesn't make 100+ individual DB round-trips.

**File:** `lib/services/sync.ts`

**Acceptance Criteria:**
- [ ] `syncMetaInsights()` and `syncGoogleMetrics()` use `prisma.campaignMetric.createMany({ data: records, skipDuplicates: true })` (or equivalent batch upsert)
- [ ] Number of DB queries per sync is O(1) regardless of record count
- [ ] A performance test confirms sync time for 500 records is < 2 seconds locally

---

### US-014 🟡 Parallelise analytics summary queries `1.5 SP`

**As a** user,  
**I want** the dashboard to load in under 2 seconds,  
**so that** I don't wait for sequential database queries.

**File:** `lib/services/analytics.ts`

**Acceptance Criteria:**
- [ ] `getAgencySummary()` fires current-period and previous-period queries concurrently using `Promise.all([...])`
- [ ] Dashboard page wraps each data section in a `<Suspense>` boundary with skeleton fallback
- [ ] Time-to-first-meaningful-paint on the dashboard is under 2 seconds on a local SQLite instance

---

### US-015 🟡 Add pagination to all list endpoints `2 SP`

**As a** developer,  
**I want** list endpoints to support pagination,  
**so that** large datasets don't cause memory and timeout issues.

**Files:** `lib/services/agency.ts` · `lib/services/client.ts` · `app/api/admin/pricing/route.ts`

**Acceptance Criteria:**
- [ ] All list endpoints accept `?page=1&limit=50` query parameters (default `limit=50`, max `limit=100`)
- [ ] Response shape includes `{ data: T[], total: number, page: number, totalPages: number }`
- [ ] Existing consumers of these services are updated to pass pagination params

---

### US-016 🟡 Prevent duplicate report generation `1 SP`

**As a** platform operator,  
**I want** report generation to be idempotent,  
**so that** running the cron job twice doesn't create duplicate reports.

**File:** `lib/services/report.ts`

**Acceptance Criteria:**
- [ ] `generateForClient()` uses `prisma.report.upsert` keyed on `{ clientId, periodStart, periodEnd }` instead of `create`
- [ ] Calling the function twice for the same period returns the existing report (no duplicate)
- [ ] `Report` model has a `@@unique([clientId, periodStart, periodEnd])` constraint added via migration

---

## Epic 5 — Architecture & Code Quality

---

### US-017 🟡 Move encryption out of Prisma middleware `3 SP`

**As a** developer,  
**I want** field encryption to happen at the service layer,  
**so that** it's explicit, testable, and doesn't cause debugging surprises.

**File:** `lib/prisma.ts`

**Acceptance Criteria:**
- [ ] Prisma middleware encryption extension is removed
- [ ] `MetaAccount`, `GoogleAccount`, and `AIProvider` service functions explicitly call `encryptString()` before write and `decryptString()` after read
- [ ] A comment in each affected service lists the encrypted fields
- [ ] Existing integration tests pass after the refactor

---

### US-018 🟡 Add schema validation to feature flags and system config `2 SP`

**As a** developer,  
**I want** feature flags and system config to be type-safe,  
**so that** typos in flag names fail loudly rather than silently.

**Files:** `lib/services/feature-flags.ts` · `lib/services/system-config.ts`

**Acceptance Criteria:**
- [ ] `FeatureFlagSchema` is a Zod object with all valid flag names as boolean keys
- [ ] Reading or writing an unknown flag key throws a typed error
- [ ] `SystemConfig` value uses a discriminated union Zod schema based on `key`
- [ ] TypeScript types are inferred from the schemas (no `any`)

---

### US-019 🟡 Deduplicate authorization checks via a shared utility `2.5 SP`

**As a** developer,  
**I want** authorization logic centralised,  
**so that** we don't accidentally omit a check in a new route.

**Files:** `app/api/clients/[id]/route.ts` · and other routes with repeated agency-access checks

**Acceptance Criteria:**
- [ ] `lib/api/guards.ts` (or similar) exports `requireClientAccess(clientId, session)`, `requireAgencyAccess(agencyId, session)` functions
- [ ] Each guard returns `{ error: NextResponse } | { data: Client }` to force callers to handle both paths
- [ ] Existing routes are refactored to use these guards
- [ ] Routes no longer contain duplicated `if (client.agencyId !== agencyId)` blocks

---

### US-020 🟢 Remove unused NextAuth database tables `1 SP`

**As a** developer,  
**I want** the schema to only include what's used,  
**so that** new team members aren't confused by unused tables.

**File:** `prisma/schema.prisma`

**Acceptance Criteria:**
- [ ] `Session`, `Account`, and `VerificationToken` models are removed (JWT strategy is confirmed and documented)
- [ ] Migration removes the corresponding tables
- [ ] Auth flow tests confirm no regression

---

## Epic 6 — Rate Limiting

---

### US-021 🟠 Add rate limiting to AI insight generation `2.5 SP`

**As a** platform operator,  
**I want** the AI insight endpoint to be rate-limited per user,  
**so that** a single user cannot exhaust the AI API quota.

**File:** `app/api/insights/generate/route.ts`

**Acceptance Criteria:**
- [ ] Endpoint is rate-limited to 10 requests per user per minute using a sliding window
- [ ] Requests exceeding the limit return `429 Too Many Requests` with `Retry-After` header
- [ ] Rate limit state is stored in-memory (dev) or Redis (production) — implementation is swappable via an interface
- [ ] Superadmins have a configurable higher rate limit

---

## Epic 7 — UX & Frontend

---

### US-022 🟡 Handle missing agency state gracefully `1 SP`

**As a** user,  
**I want** a helpful message when I have no agency assigned,  
**so that** I know what to do instead of seeing a generic error.

**File:** `components/layout/dashboard-shell.tsx`

**Acceptance Criteria:**
- [ ] If `session.user.agencyId` is null, user sees: *"You don't belong to an agency yet. Accept an invitation or contact your administrator."*
- [ ] A link to `/invitations` or support contact is provided
- [ ] Dashboard data fetching is not attempted when agencyId is absent (prevents 500 errors)

---

### US-023 🟡 Add error boundaries to dashboard data fetching `2 SP`

**As a** user,  
**I want** partial failures on the dashboard to show section-level errors,  
**so that** one broken widget doesn't blank the entire page.

**File:** `app/(protected)/dashboard/page.tsx`

**Acceptance Criteria:**
- [ ] Each major dashboard section (metrics, campaigns, insights) is wrapped in a React `<ErrorBoundary>` with a "Failed to load — retry" fallback
- [ ] The `Promise.all()` calls are replaced with `Promise.allSettled()` so one failure doesn't reject the rest
- [ ] A `error.tsx` file exists in `app/(protected)/` for route-level unhandled errors

---

### US-024 🟢 Add accessibility attributes to auth forms `1.5 SP`

**As a** user with a screen reader,  
**I want** the login form to be fully accessible,  
**so that** I can authenticate without a mouse.

**File:** `app/(auth)/login/page.tsx` · `components/auth/login-form.tsx`

**Acceptance Criteria:**
- [ ] All form inputs have associated `<label htmlFor="">` or `aria-label` attributes
- [ ] Error messages are linked to their inputs via `aria-describedby`
- [ ] Form submit button has meaningful `aria-label` during loading state
- [ ] Axe/Lighthouse accessibility audit scores 0 violations on the login page

---

### US-025 🟢 Add page-specific loading skeletons `2 SP`

**As a** user,  
**I want** loading states to reflect the page structure,  
**so that** the page doesn't feel like it's jumping when data loads.

**File:** `app/(protected)/loading.tsx`

**Acceptance Criteria:**
- [ ] Dashboard has `SkeletonMetricCard`, `SkeletonChart`, and `SkeletonTable` components matching the real layout
- [ ] Each major route segment has its own `loading.tsx` with a layout-matching skeleton
- [ ] Skeletons use the same grid/column structure as the actual content

---

### US-026 🟢 Create a public landing/redirect page `0.5 SP`

**As a** visitor,  
**I want** navigating to `/` to do something useful,  
**so that** I'm not left at a blank page.

**File:** `app/page.tsx`

**Acceptance Criteria:**
- [ ] Authenticated users visiting `/` are redirected to `/dashboard`
- [ ] Unauthenticated users visiting `/` are redirected to `/login`
- [ ] Redirect is server-side (using `redirect()` from `next/navigation`) to avoid flash

---

## Epic 8 — Developer Experience

---

### US-027 🟡 Fix env validation so app starts without third-party API keys `2.5 SP`

**As a** developer,  
**I want** the app to start locally without Meta/Google credentials,  
**so that** I can develop auth and core features without configuring integrations.

**File:** `lib/env.ts`

**Acceptance Criteria:**
- [ ] `META_APP_ID`, `META_APP_SECRET`, `META_REDIRECT_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `GOOGLE_ADS_DEVELOPER_TOKEN` are all `optional()` in the Zod schema
- [ ] Routes that use these values check for their presence before using them and return `501 Not Configured` if absent
- [ ] A `.env.local.example` file is committed listing all variables with placeholder comments
- [ ] `README.md` documents minimum required vars for local dev vs full integration

---

### US-028 🟡 Add a `.env.local.example` file `1.5 SP`

**As a** new developer,  
**I want** an example env file in the repo,  
**so that** I know exactly which variables to set without reading multiple docs.

**Acceptance Criteria:**
- [ ] `.env.local.example` is committed to the repo (not gitignored)
- [ ] Every variable used across the codebase is present with a comment explaining its purpose and where to get the value
- [ ] Variables are grouped by section (Auth, Database, Meta, Google, Email, Cron)
- [ ] `SETUP.md` references `.env.local.example` as the starting point

---

## Story Point Summary

| Story | Title | SP |
|-------|-------|----|
| US-002 | Harden cron endpoint authentication | 3 |
| US-003 | CSRF protection on OAuth flow | 2 |
| US-004 | Secure invitation flow | 2 |
| US-005 | Enforce NEXTAUTH_URL in production | 0.5 |
| US-006 | Prevent cross-agency role modification | 1 |
| US-007 | Fix admin middleware role hierarchy | 1.5 |
| US-008 | Sanitize report HTML | 1.5 |
| US-009a | Zod validation — helper + core routes | 2 |
| US-009b | Zod validation — remaining routes | 2 |
| US-010a | Email env validation + typed error | 2 |
| US-010b | In-app alert on email failures | 1.5 |
| US-011 | Standardise API error response shape | 3 |
| US-012 | Add missing database indexes | 1.5 |
| US-013 | Fix N+1 query in sync | 2 |
| US-014 | Parallelise analytics queries | 1.5 |
| US-015 | Pagination on list endpoints | 2 |
| US-016 | Prevent duplicate report generation | 1 |
| US-017 | Move encryption out of Prisma middleware | 3 |
| US-018 | Schema validation for feature flags | 2 |
| US-019 | Deduplicate authorization checks | 2.5 |
| US-020 | Remove unused NextAuth tables | 1 |
| US-021 | Rate limit AI insight generation | 2.5 |
| US-022 | Handle missing agency state | 1 |
| US-023 | Error boundaries on dashboard | 2 |
| US-024 | Accessibility on auth forms | 1.5 |
| US-025 | Page-specific loading skeletons | 2 |
| US-026 | Public landing/redirect page | 0.5 |
| US-027 | Fix env validation for local dev | 2.5 |
| US-028 | Add .env.local.example | 1.5 |
| **Total** | | **~52 SP (~52 hours)** |

## Issue Count by Epic

| Epic | Stories | 🟠 | 🟡 | 🟢 | SP |
|------|---------|----|----|----|----|
| 1 — Credentials & Secrets | 4 | 3 | 1 | 0 | 7.5 |
| 2 — Authorisation | 3 | 1 | 2 | 0 | 4 |
| 3 — Input Validation & Error Handling | 5 | 3 | 1 | 0 | 10.5 |
| 4 — Performance: Database | 5 | 2 | 3 | 0 | 8 |
| 5 — Architecture & Code Quality | 4 | 0 | 3 | 1 | 8.5 |
| 6 — Rate Limiting | 1 | 1 | 0 | 0 | 2.5 |
| 7 — UX & Frontend | 5 | 0 | 2 | 3 | 7.5 |
| 8 — Developer Experience | 2 | 0 | 2 | 0 | 4 |
| **Total** | **29** | **10** | **12** | **4** | **~52** |
