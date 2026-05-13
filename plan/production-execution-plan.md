# SuperAdverts Production Execution Plan
## Google + Meta, Credentials Auth, Turso Production

**Date:** May 13, 2026  
**Status:** In Execution  
**Scope Decision:** Google Ads + Meta Ads supported  
**Auth Decision:** Credentials login only (no magic link)  
**Infra Decision:** Turso production setup is already complete  
**Deferred:** Auth hardening / tenant-safety deep work until live users

---

## 1. Goal

Ship SuperAdverts in a production-ready state for core agency workflows:
- Login and role-based app access
- Client and team management
- Google + Meta OAuth connections
- Campaign data sync
- Unified analytics dashboard
- Report generation (manual + scheduled)
- AI insight generation and lifecycle
- Admin controls (AI providers, pricing, system config)

---

## 2. Execution Phases

## Phase 0: Baseline and Spec Alignment (Day 1)
- [ ] Align documentation with actual decisions (Google+Meta, credentials auth, Turso).
- [ ] Define single acceptance checklist per module.
- [ ] Remove Google-only and magic-link instructions from active sprint docs.

## Phase 1: Auth and User Bootstrap (Day 1-2)
- [ ] Validate credentials auth end-to-end.
- [ ] Validate role-based route access for `SUPER_ADMIN`, `ADMIN`, `MEMBER`.
- [ ] Validate seed/bootstrap accounts for testing.

**Test scope**
- [ ] Login success/failure
- [ ] Logout/session persistence
- [ ] Protected route redirect behavior

## Phase 2: Client, Agency, Team, Invitations (Day 2-3)
- [ ] Validate client CRUD and plan-limit enforcement.
- [ ] Validate invite create + accept flow.
- [ ] Validate agency settings persistence.

**Test scope**
- [ ] `/api/clients`, `/api/team`, `/api/invitations` happy/edge cases
- [ ] Unauthorized access and invalid token handling

## Phase 3: Google + Meta Integrations (Day 3-5)
- [ ] Validate OAuth authorize/callback for Google and Meta.
- [ ] Validate account connection persistence and reconnect.
- [ ] Validate token refresh cron flow for both providers.

**Test scope**
- [ ] Connect/reconnect/disconnect flows
- [ ] Expired/revoked token behavior
- [ ] Provider API failure handling

## Phase 4: Data Sync and Metric Integrity (Day 5-7)
- [ ] Validate sync endpoints and service behavior.
- [ ] Enforce idempotent writes for campaign metrics.
- [ ] Add/verify retry behavior and error surfacing.
- [ ] Expose per-client last sync status in UI/API.

**Test scope**
- [ ] Repeat sync does not create duplicates
- [ ] Cross-platform data normalization checks
- [ ] Sync failure observability

## Phase 5: Dashboard and Analytics (Day 7-8)
- [ ] Validate dashboard metrics against stored data.
- [ ] Validate Google+Meta aggregation correctness.
- [ ] Polish empty and stale-data states.

**Test scope**
- [ ] Analytics service calculation checks
- [ ] Dashboard rendering with seeded + synced data

## Phase 6: Reports (Day 8-9)
- [ ] Validate manual report generation.
- [ ] Validate report preview endpoint.
- [ ] Validate scheduled report cron path and sent status.

**Test scope**
- [ ] `/api/reports`, `/api/reports/generate`, `/api/reports/[id]/preview`
- [ ] Cron simulation for report generation

## Phase 7: AI Insights (Day 9-10)
- [ ] Validate AI provider CRUD/admin flows.
- [ ] Validate provider selection/fallback behavior.
- [ ] Validate insight generation and status lifecycle.

**Test scope**
- [ ] `/api/insights`, `/api/insights/generate`
- [ ] Provider unavailable fallback behavior

## Phase 8: Pricing and Entitlements (Day 10-11)
- [ ] Validate pricing plan CRUD and activation.
- [ ] Validate limit enforcement (clients/users/AI credits where applicable).
- [ ] Validate system config CRUD stability.

**Test scope**
- [ ] `/api/admin/pricing`, `/api/admin/system-config`
- [ ] Limit-exceeded behavior in app flows

## Phase 9: Full Regression and Release Gate (Day 11-12)
- [ ] Run full workflow regression on staging/prod-like config.
- [ ] Validate cron endpoints end-to-end.
- [ ] Verify no P0/P1 defects remain.

**Release gate**
- [ ] `npm run lint` pass
- [ ] `npm run build` pass
- [ ] API and E2E checklist pass
- [ ] UAT sign-off complete

---

## 3. Required Functional Test Matrix

- [ ] Credentials auth and role routing
- [ ] Client CRUD and team invitations
- [ ] Google OAuth + sync
- [ ] Meta OAuth + sync
- [ ] Unified dashboard metrics
- [ ] Report generation + preview + scheduled run
- [ ] Insight generation + lifecycle updates
- [ ] Admin pricing/system config and limit enforcement

---

## 4. Deferred Until Live Users

- Advanced auth hardening enhancements
- Deep tenant-isolation audit program
- Extended compliance controls beyond current baseline

---

## 5. Immediate Next Actions (Now)

1. Update `plan/mvp-sprint-plan.md` to replace Google-only demo framing with this production track.
2. Update `README.md` and relevant planning docs to remove magic-link references.
3. Begin Phase 1 execution tests (credentials auth + role-route checks).
