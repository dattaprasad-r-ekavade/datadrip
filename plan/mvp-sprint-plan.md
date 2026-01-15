# DataDrip MVP Sprint Plan
## Google Ads Only - Demo Ready

**Goal:** Build a working MVP to demo to businesses and investors
**Timeline:** 5-7 days of focused work
**Focus:** Google Ads integration only (Meta deferred)

---

## Current State Summary

| Component | Status | Action Needed |
|-----------|--------|---------------|
| Authentication | ✅ Working | None |
| Client Management | ✅ Working | None (Google-only now) |
| Google Ads OAuth | ✅ Complete | Test with real credentials |
| Google Ads Sync | ✅ Complete | Test & debug |
| Dashboard | ✅ Updated | Google-only view done |
| Reports | ✅ Working | Test generation |
| AI Insights | ✅ Mock Ready | Works without AI provider |
| Admin Panel | ✅ Working | Google-only integrations view |
| Payment | ❌ Missing | Skip for demo |
| Demo Data | ✅ Ready | Run `npm run db:seed` |

---

## MVP Sprint Tasks

### Phase 1: Foundation (Day 1) - IN PROGRESS
> Get the app running with real Google Ads data

- [ ] **1.1** Set up Google Cloud project & OAuth credentials
- [ ] **1.2** Apply for Google Ads API developer token (basic access)
- [ ] **1.3** Configure environment variables
- [ ] **1.4** Test Google OAuth flow end-to-end
- [ ] **1.5** Fix any OAuth callback issues

### Phase 2: Core Fixes (Day 2-3) - COMPLETED
> Make Google Ads the primary/only integration

- [x] **2.1** Hide/disable Meta integration in UI
- [x] **2.2** Update dashboard to show Google Ads data only
- [x] **2.3** Fix client creation flow (Google-only)
- [x] **2.4** Update admin integrations page (Google-only)
- [x] **2.5** Create mock AI insights (works without AI provider)

### Phase 3: Demo Polish (Day 3-4) - COMPLETED
> Make it look good for demos

- [x] **3.1** Create demo seed data script (`npm run db:seed`)
- [x] **3.2** Update insights page for demo mode
- [ ] **3.3** Fix any UI bugs/glitches (testing needed)
- [ ] **3.4** Test report generation with demo data
- [ ] **3.5** Test AI insight generation (mock mode)

### Phase 4: Demo Flow (Day 5) - PENDING
> Prepare the demo experience

- [x] **4.1** Create demo user accounts (via seed script)
- [x] **4.2** Pre-populate with sample clients (via seed script)
- [ ] **4.3** Document demo script/walkthrough
- [ ] **4.4** Test full flow multiple times
- [ ] **4.5** Deploy to Vercel (staging)

---

## Detailed Task Breakdown

### Phase 1: Foundation

#### 1.1 Google Cloud Setup
```
1. Go to https://console.cloud.google.com
2. Create new project "DataDrip"
3. Enable Google Ads API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: http://localhost:3000/api/integrations/google-ads/callback
6. Note down Client ID and Client Secret
```

#### 1.2 Google Ads Developer Token
```
1. Go to https://ads.google.com/aw/apicenter
2. Create API access (if not exists)
3. Get developer token (starts with TEST token - limited but works for demo)
4. For production, apply for basic access (takes 1-2 days)
```

#### 1.3 Environment Variables
```env
# .env.local
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="generate-random-32-char-string"
NEXTAUTH_URL="http://localhost:3000"

# Google Ads
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/integrations/google-ads/callback"
GOOGLE_ADS_DEVELOPER_TOKEN="your-developer-token"

# Token encryption (generate random strings)
TOKEN_ENCRYPTION_KEY="32-character-random-string-here"
OAUTH_STATE_SECRET="another-random-string-here"

# AI Provider (pick one)
OPENAI_API_KEY="sk-..."
```

### Phase 2: Core Fixes

#### 2.1 Hide Meta Integration
Files to modify:
- `app/(protected)/dashboard/clients/page.tsx` - Hide Meta connect button
- `components/forms/client-form.tsx` - Remove Meta fields
- `app/(protected)/admin/integrations/page.tsx` - Hide Meta section

#### 2.2 Dashboard Updates
- Show only Google Ads metrics
- Update "channels" to just show Google
- Remove Meta-specific UI elements

### Phase 3: Demo Polish

#### 3.1 Seed Data Script
Create realistic demo data:
- 1 agency with Growth plan
- 3 sample clients
- 30 days of campaign metrics
- 5-10 AI insights
- 2-3 generated reports

### Phase 4: Demo Flow

#### Demo Script
```
1. Login as demo@datadrip.io
2. Show dashboard with real metrics
3. Navigate to Clients → Show 3 clients
4. Click client → Show connected Google Ads
5. Trigger sync → Show data flowing
6. Go to Reports → Generate new report
7. Go to Insights → Generate AI insight
8. Show Admin panel → Pricing plans
```

---

## Files to Create/Modify

### New Files Needed
```
prisma/seed.ts              # Demo data seeder
scripts/setup-demo.ts       # Demo environment setup
docs/demo-script.md         # Demo walkthrough guide
```

### Files to Modify
```
app/(protected)/dashboard/clients/page.tsx    # Hide Meta
components/forms/client-form.tsx              # Google-only
app/(protected)/dashboard/page.tsx            # Google metrics only
lib/services/analytics.ts                     # Google-only queries
app/(protected)/admin/integrations/page.tsx   # Hide Meta status
```

---

## Success Criteria

### MVP Demo Checklist
- [ ] Can login with email/password
- [ ] Can create a new client
- [ ] Can connect Google Ads account via OAuth
- [ ] Can sync campaign data from Google Ads
- [ ] Dashboard shows real spend, clicks, impressions
- [ ] Can generate a performance report
- [ ] Can generate AI-powered insights
- [ ] Can invite team members
- [ ] Admin can configure pricing plans
- [ ] No obvious errors or crashes

### Investor Demo Points
1. **Problem:** Agencies juggle multiple tools, no unified view
2. **Solution:** Single dashboard for all ad accounts
3. **Demo:** Live data from real Google Ads account
4. **AI Value:** Auto-generated optimization insights
5. **Business Model:** SaaS subscription tiers
6. **Market:** 10,000+ agencies in India

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Google OAuth fails | Test with personal ad account first |
| No ad account for demo | Use Google Ads test account or partner's |
| API rate limits | Cache responses, limit sync frequency |
| AI insights fail | Have fallback static insights |

---

## Post-MVP (After Demo)

Once you have investor/customer interest:
1. Add Razorpay payment integration
2. Re-enable Meta integration (when approved)
3. Add more platforms (LinkedIn, etc.)
4. Build mobile app
5. Implement white-label reports

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed demo data (after creating seed script)
npx prisma db seed

# Start development server
npm run dev

# Build for production
npm run build
```

---

**Start with Phase 1 today. Each phase builds on the previous one.**
