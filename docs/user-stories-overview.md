# SuperAdverts — Engineering User Stories (Overview)

> Senior dev audit — April 2026  
> **46 issues found** across 8 epics. Prioritised by risk and user impact.  
> Labels: 🟠 High · 🟡 Medium · 🟢 Low  
> 1 SP = 1 hour of work · Range: 0.5–3 SP

---

## Epic 1 — Security: Credentials & Secrets

### US-002 🟠 Harden cron endpoint authentication `3 SP`
**As a** platform operator, **I want** cron routes to be protected beyond a simple Bearer token, **so that** they cannot be triggered by anyone who captures the token from logs.  
**Files:** `app/api/cron/refresh-tokens/route.ts` · `app/api/cron/generate-reports/route.ts`

---

### US-003 🟠 Add CSRF protection to OAuth authorize flow `2 SP`
**As a** user, **I want** the Meta/Google OAuth flow to be protected against CSRF, **so that** a malicious site cannot trigger account linking on my behalf.  
**Files:** `app/api/integrations/meta/authorize/route.ts` · `app/api/integrations/meta/callback/route.ts`

---

### US-004 🟠 Secure invitation flow against enumeration and spam `2 SP`
**As a** platform operator, **I want** the invitation endpoint protected against spam and enumeration, **so that** we cannot be used as a relay to send unsolicited email.  
**Files:** `app/api/invitations/route.ts` · `app/api/invitations/accept/route.ts`

---

### US-005 🟡 Enforce `NEXTAUTH_URL` in production `0.5 SP`
**As a** platform operator, **I want** `NEXTAUTH_URL` to have no default in production, **so that** auth callbacks are never sent to `localhost`.  
**File:** `lib/env.ts`

---

## Epic 2 — Security: Authorisation

### US-006 🟠 Prevent cross-agency user role modification `1 SP`
**As an** agency admin, **I want** role updates to be scoped to my own agency, **so that** I cannot modify users belonging to a different agency.  
**File:** `app/api/team/route.ts`

---

### US-007 🟡 Fix admin middleware role hierarchy `1.5 SP`
**As an** agency admin, **I want** the admin panel to be accessible based on role, **so that** `ADMIN` users are not incorrectly blocked.  
**File:** `middleware.ts`

---

### US-008 🟡 Sanitize report HTML before serving `1.5 SP`
**As a** user, **I want** report previews to be safe from injected scripts, **so that** a malicious report cannot steal my session.  
**File:** `app/api/reports/[id]/preview/route.ts`

---

## Epic 3 — Input Validation & Error Handling

### US-009a 🟠 Add Zod validation — shared helper + core routes `2 SP`
**As a** developer, **I want** a shared request body validation helper and core routes protected, **so that** invalid payloads return `400` instead of crashing.  
**Files:** `lib/api/parse-body.ts` (new) · `app/api/team/route.ts` · `app/api/clients/route.ts` · `app/api/admin/ai-providers/[id]/route.ts`

---

### US-009b 🟠 Add Zod validation — remaining API routes `2 SP`
**As a** developer, **I want** all remaining API routes to validate request bodies, **so that** validation coverage is complete across the codebase.  
**Files:** All remaining `POST`/`PATCH` routes under `app/api/`

---

### US-010a 🟠 Email env validation and typed error `2 SP`
**As a** platform operator, **I want** email configuration to be validated at startup and failures to be typed, **so that** misconfigured email is caught early and callers must handle it explicitly.  
**Files:** `lib/env.ts` · `lib/services/email.ts` · `prisma/schema.prisma`

---

### US-010b 🟠 In-app alert on repeated email delivery failures `1.5 SP`
**As a** super admin, **I want** to be notified in-app when email delivery fails repeatedly, **so that** I can investigate before users are impacted.  
**Files:** `app/api/cron/generate-reports/route.ts` · `lib/services/notification.ts`

---

### US-011 🟡 Standardise API error response shape `3 SP`
**As a** frontend developer, **I want** all API errors to share a consistent response shape, **so that** the UI can handle errors uniformly.  
**Files:** All `app/api/` route files

---

## Epic 4 — Performance: Database

### US-012 🟠 Add missing database indexes `1.5 SP`
**As a** user, **I want** list and filter operations to be fast, **so that** pages don't time out as data grows.  
**File:** `prisma/schema.prisma`

---

### US-013 🟠 Fix N+1 query in sync operations `2 SP`
**As a** platform operator, **I want** data sync to use batch database writes, **so that** syncing 100+ campaigns doesn't make 100+ individual DB round-trips.  
**File:** `lib/services/sync.ts`

---

### US-014 🟡 Parallelise analytics summary queries `1.5 SP`
**As a** user, **I want** the dashboard to load in under 2 seconds, **so that** I don't wait for sequential database queries.  
**File:** `lib/services/analytics.ts`

---

### US-015 🟡 Add pagination to all list endpoints `2 SP`
**As a** developer, **I want** list endpoints to support pagination, **so that** large datasets don't cause memory and timeout issues.  
**Files:** `lib/services/agency.ts` · `lib/services/client.ts` · `app/api/admin/pricing/route.ts`

---

### US-016 🟡 Prevent duplicate report generation `1 SP`
**As a** platform operator, **I want** report generation to be idempotent, **so that** running the cron job twice doesn't create duplicate reports.  
**File:** `lib/services/report.ts`

---

## Epic 5 — Architecture & Code Quality

### US-017 🟡 Move encryption out of Prisma middleware `3 SP`
**As a** developer, **I want** field encryption to happen at the service layer, **so that** it's explicit, testable, and doesn't cause debugging surprises.  
**File:** `lib/prisma.ts`

---

### US-018 🟡 Add schema validation to feature flags and system config `2 SP`
**As a** developer, **I want** feature flags and system config to be type-safe, **so that** typos in flag names fail loudly rather than silently.  
**Files:** `lib/services/feature-flags.ts` · `lib/services/system-config.ts`

---

### US-019 🟡 Deduplicate authorization checks via a shared utility `2.5 SP`
**As a** developer, **I want** authorization logic centralised, **so that** we don't accidentally omit a check in a new route.  
**Files:** `app/api/clients/[id]/route.ts` · and other routes with repeated agency-access checks

---

### US-020 🟢 Remove unused NextAuth database tables `1 SP`
**As a** developer, **I want** the schema to only include what's used, **so that** new team members aren't confused by unused tables.  
**File:** `prisma/schema.prisma`

---

## Epic 6 — Rate Limiting

### US-021 🟠 Add rate limiting to AI insight generation `2.5 SP`
**As a** platform operator, **I want** the AI insight endpoint to be rate-limited per user, **so that** a single user cannot exhaust the AI API quota.  
**File:** `app/api/insights/generate/route.ts`

---

## Epic 7 — UX & Frontend

### US-022 🟡 Handle missing agency state gracefully `1 SP`
**As a** user, **I want** a helpful message when I have no agency assigned, **so that** I know what to do instead of seeing a generic error.  
**File:** `components/layout/dashboard-shell.tsx`

---

### US-023 🟡 Add error boundaries to dashboard data fetching `2 SP`
**As a** user, **I want** partial failures on the dashboard to show section-level errors, **so that** one broken widget doesn't blank the entire page.  
**File:** `app/(protected)/dashboard/page.tsx`

---

### US-024 🟢 Add accessibility attributes to auth forms `1.5 SP`
**As a** user with a screen reader, **I want** the login form to be fully accessible, **so that** I can authenticate without a mouse.  
**Files:** `app/(auth)/login/page.tsx` · `components/auth/login-form.tsx`

---

### US-025 🟢 Add page-specific loading skeletons `2 SP`
**As a** user, **I want** loading states to reflect the page structure, **so that** the page doesn't feel like it's jumping when data loads.  
**File:** `app/(protected)/loading.tsx`

---

### US-026 🟢 Create a public landing/redirect page `0.5 SP`
**As a** visitor, **I want** navigating to `/` to do something useful, **so that** I'm not left at a blank page.  
**File:** `app/page.tsx`

---

## Epic 8 — Developer Experience

### US-027 🟡 Fix env validation so app starts without third-party API keys `2.5 SP`
**As a** developer, **I want** the app to start locally without Meta/Google credentials, **so that** I can develop auth and core features without configuring integrations.  
**File:** `lib/env.ts`

---

### US-028 🟡 Add a `.env.local.example` file `1.5 SP`
**As a** new developer, **I want** an example env file in the repo, **so that** I know exactly which variables to set without reading multiple docs.

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
