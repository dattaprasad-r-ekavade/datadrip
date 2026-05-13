# SuperAdverts MVP Sprint Plan
## Production Build + Functional Validation

**Goal:** Ship a production-ready MVP with validated core workflows  
**Scope:** Google Ads + Meta Ads integrations  
**Auth:** Credentials only (no magic link)  
**Production DB:** Turso (already configured)  
**Infra Hardening:** Completed (out of scope for this sprint)  
**Deferred:** Auth/tenant hardening until live-user phase

---

## Current State Summary

| Component | Status | Action Needed |
|-----------|--------|---------------|
| Credentials Authentication | ✅ Working | Validate end-to-end flows |
| Client Management | ✅ Working | Validate limits + edge cases |
| Google Ads OAuth | ✅ Implemented | Full functional validation |
| Meta OAuth | ✅ Implemented | Full functional validation |
| Sync Engine | ✅ Implemented | Idempotency + retry validation |
| Dashboard | ✅ Implemented | Data accuracy checks |
| Reports | ✅ Implemented | Manual + scheduled flow testing |
| AI Insights | ✅ Implemented | Provider fallback + lifecycle tests |
| Admin Panel | ✅ Implemented | Pricing + config validation |
| Infra / Turso | ✅ Done | No action in this sprint |

---

## Execution Phases

### Phase 0: Baseline and Spec Alignment (Day 1) - IN PROGRESS
> Align docs and acceptance criteria with actual production scope

- [x] **0.1** Create production execution plan doc
- [x] **0.2** Align README and plan docs with credentials-only auth
- [x] **0.3** Remove old Google-only instructions in active planning docs
- [ ] **0.4** Finalize module acceptance checklist

### Phase 1: Auth and User Bootstrap (Day 1-2) - PENDING
> Validate credentials auth and role-based access

- [x] **1.1** Validate login success/failure paths *(code-path verified; runtime browser check pending)*
- [ ] **1.2** Validate logout/session handling *(runtime pending)*
- [x] **1.3** Validate protected route behavior by role *(middleware/session logic verified; runtime browser check pending)*
- [x] **1.4** Validate seed/bootstrap test accounts *(demo credentials and seed paths verified in code)*

### Phase 2: Client, Team, Invitations (Day 2-3) - IN PROGRESS
> Validate agency operations workflows

- [x] **2.1** Validate client CRUD *(API auth + agency guard paths verified in code)*
- [x] **2.2** Validate plan-limit enforcement (client/user caps) *(enforced in clients and invitations API paths)*
- [x] **2.3** Validate team invitation create/accept flow *(service + API paths verified in code)*
- [x] **2.4** Validate agency settings updates *(added `/api/agency/me` PATCH with role guard + payload validation)*

### Phase 3: Google + Meta Integrations (Day 3-5) - IN PROGRESS
> Validate connector reliability for both platforms

- [x] **3.1** Validate Google OAuth authorize/callback/reconnect *(code-path validated; state ownership + return-path hardening added)*
- [x] **3.2** Validate Meta OAuth authorize/callback/reconnect *(code-path validated; state ownership + return-path hardening added)*
- [x] **3.3** Validate token refresh cron for both providers *(cron refresh flow verified in code)*
- [ ] **3.4** Validate revoked/expired token handling *(runtime provider-account test pending)*

### Phase 4: Sync and Data Integrity (Day 5-7) - IN PROGRESS
> Ensure reliable and accurate metric ingestion

- [x] **4.1** Validate sync endpoint behavior per client *(auth/agency guard + per-platform sync summary response)*
- [x] **4.2** Validate idempotent campaign metric upserts *(unique upsert key already enforced in sync service and schema)*
- [x] **4.3** Validate retry/failure handling paths *(retry wrapper + partial-failure reporting implemented)*
- [x] **4.4** Validate last-sync visibility in UI/API *(API now returns `syncedAt` + per-platform status; client UI toasts show results)*

### Phase 5: Analytics Dashboard Validation (Day 7-8) - IN PROGRESS
> Confirm KPI accuracy for unified view

- [x] **5.1** Validate metric calculations against DB data *(dashboard summary wired to computed analytics values)*
- [x] **5.2** Validate Google+Meta aggregate behavior *(campaign summaries now compute ROAS/CPA from aggregated spend+conversions)*
- [ ] **5.3** Validate empty/stale-state UX *(runtime UI pass pending)*

### Phase 6: Reports Validation (Day 8-9) - IN PROGRESS
> Validate reporting workflows

- [x] **6.1** Validate manual report generation *(client authorization + configurable days window now enforced)*
- [x] **6.2** Validate report preview endpoint *(agency/super-admin access guard verified in code)*
- [x] **6.3** Validate scheduled report cron flow *(generation + email path verified; failure tracking added)*
- [x] **6.4** Validate report status updates and failures *(cron now reports `failed` count and failure reasons)*

### Phase 7: AI Insights Validation (Day 9-10) - IN PROGRESS
> Validate provider setup and insight lifecycle

- [x] **7.1** Validate AI provider admin CRUD *(super-admin route guards and service validation verified in code)*
- [x] **7.2** Validate provider fallback behavior *(priority-order provider fallback with mock fallback when providers fail)*
- [x] **7.3** Validate insight generation API/UI *(client/agency/plan checks + generation path verified)*
- [x] **7.4** Validate insight status lifecycle updates *(added `/api/insights` PATCH + UI status actions)*

### Phase 8: Pricing and System Config Validation (Day 10-11) - IN PROGRESS
> Validate admin controls and entitlement behavior

- [x] **8.1** Validate pricing plan CRUD and activation flags *(admin API guards + service validation verified in code)*
- [x] **8.2** Validate limit enforcement behavior in workflows *(client/user/AI limits verified; invite flow patched to include pending invites)*
- [x] **8.3** Validate system config CRUD and JSON validation *(admin API guards + zod validation paths verified)*

### Phase 9: Final Regression and Release Gate (Day 11-12) - IN PROGRESS
> Clear launch checklist with no critical defects

- [ ] **9.1** Run full regression test matrix *(runtime/UAT environment execution pending)*
- [ ] **9.2** Validate cron endpoints end-to-end *(runtime token + provider-account validation pending)*
- [ ] **9.3** Confirm lint/build/test suite pass *(lint ✅, typecheck ✅ after tsconfig fix, build command currently non-deterministic in this shell)*
- [ ] **9.4** UAT sign-off and release decision *(pending business sign-off)*

---

## Functional Validation Checklist (Must Pass)

- [ ] Credentials auth + protected route behavior
- [ ] Client/team/invitation workflows
- [ ] Google OAuth + sync
- [ ] Meta OAuth + sync
- [ ] Unified dashboard metric correctness
- [ ] Report generation + preview + scheduling
- [ ] AI insight generation + status lifecycle
- [ ] Pricing/system-config admin workflows

---

## Sprint Exit Criteria

- [ ] No P0/P1 defects in core user/admin flows
- [ ] All functional validation checklist items pass
- [ ] `npm run lint`, `npm run typecheck`, and `npm run build` pass
- [ ] Release readiness sign-off completed
