# DataDrip MVP Technical Plan

## 1. Architecture Overview
- **Frontend**: Next.js 13 (App Router) deployed on Vercel with static + SSR/ISR pages, Tailwind CSS, shadcn/ui components for consistent design system.
- **Backend**: Next.js API Route Handlers and server actions, Prisma ORM with SQLite in development and MySQL (PlanetScale/Aurora Serverless) in production. Background tasks via Vercel Cron + serverless queues (Upstash/QStash) for scheduled sync/reporting.
- **Data ingestion**: OAuth to Meta Marketing API & Google Ads API, scheduled sync jobs storing normalized metrics.
- **Reporting engine**: Serverless functions generating daily HTML templates, sending via transactional email service (Resend/SendGrid).
- **AI layer**: Multi-provider LLM support (OpenAI, Anthropic, Google Gemini, Azure OpenAI) with admin-configurable API keys and model selection. AI features can be toggled on/off per agency. Guardrails invoked through serverless functions, cached recommendations per client.
- **Admin System**: Super admin panel for platform configuration including AI provider management, dynamic pricing plans, feature toggles, and global settings.
- **Observability**: Vercel analytics + Logtail/Sentry for error tracking, OpenTelemetry instrumentation for critical flows.

## 2. Development Environments
- **Local**: Next.js dev server, SQLite file-based DB (`prisma/dev.db`), `.env.local` storing API keys and OAuth secrets (use `dotenv-cli`).
- **Preview**: Vercel preview deployments triggered from Git branches, using a shared MySQL sandbox and feature-flag toggles.
- **Production**: Vercel production deployment, PlanetScale MySQL (primary), Redis (Upstash) for caching tokens and job queues, encrypted env vars managed through Vercel dashboard.

## 3. Data Model (Prisma Schema Draft)
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  hashedPassword String?
  role          Role     @default(MEMBER)
  isSuperAdmin  Boolean  @default(false)
  agencyId      String?
  agency        Agency?  @relation(fields: [agencyId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Agency {
  id          String   @id @default(cuid())
  name        String
  timezone    String   @default("Asia/Kolkata")
  plan        PlanTier @default(STARTER)
  aiEnabled   Boolean  @default(true)
  users       User[]
  clients     Client[]
  settings    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Client {
  id          String   @id @default(cuid())
  agencyId    String
  agency      Agency   @relation(fields: [agencyId], references: [id])
  name        String
  metaAccount MetaAccount?
  googleAccount GoogleAccount?
  reports     Report[]
  insights    Insight[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model MetaAccount {
  id           String   @id @default(cuid())
  clientId     String   @unique
  client       Client   @relation(fields: [clientId], references: [id])
  accountId    String
  accessToken  String
  refreshToken String?
  tokenExpiry  DateTime
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model GoogleAccount {
  id           String   @id @default(cuid())
  clientId     String   @unique
  client       Client   @relation(fields: [clientId], references: [id])
  customerId   String
  accessToken  String
  refreshToken String
  tokenExpiry  DateTime
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model CampaignMetric {
  id         String   @id @default(cuid())
  clientId   String
  client     Client   @relation(fields: [clientId], references: [id])
  platform   Platform
  campaignId String
  date       Date
  spend      Decimal   @db.Decimal(12,2)
  impressions Int
  clicks     Int
  conversions Decimal @db.Decimal(12,2)
  roas        Decimal? @db.Decimal(8,2)
  cpa         Decimal? @db.Decimal(8,2)
  createdAt   DateTime @default(now())
}

model Report {
  id          String   @id @default(cuid())
  clientId    String
  client      Client   @relation(fields: [clientId], references: [id])
  periodStart DateTime
  periodEnd   DateTime
  channelData Json
  summary     String
  reportHtml  String
  sentAt      DateTime?
  createdAt   DateTime @default(now())
}

model Insight {
  id          String   @id @default(cuid())
  clientId    String
  client      Client   @relation(fields: [clientId], references: [id])
  type        InsightType
  payload     Json
  impactScore Int
  status      InsightStatus @default(PENDING)
  aiProvider  String?
  aiModel     String?
  createdAt   DateTime @default(now())
  resolvedAt  DateTime?
}

model AIProvider {
  id          String   @id @default(cuid())
  name        String
  provider    AIProviderType
  apiKey      String
  model       String
  isActive    Boolean  @default(true)
  priority    Int      @default(0)
  config      Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model PricingPlan {
  id              String   @id @default(cuid())
  tier            PlanTier @unique
  name            String
  price           Decimal  @db.Decimal(10,2)
  currency        String   @default("INR")
  billingInterval String   @default("monthly")
  features        Json
  limits          Json
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model SystemConfig {
  id          String   @id @default(cuid())
  key         String   @unique
  value       Json
  description String?
  updatedBy   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Role { OWNER MEMBER }
enum PlanTier { STARTER GROWTH SCALE CUSTOM }
enum Platform { META GOOGLE }
enum InsightType { PERFORMANCE BUDGET CREATIVE AUDIENCE }
enum InsightStatus { PENDING IN_PROGRESS APPLIED DISMISSED }
enum AIProviderType { OPENAI ANTHROPIC GOOGLE_GEMINI AZURE_OPENAI }
```

## 4. Feature Implementation Plan
### Sprint 1 (Weeks 1–2) — Project Setup & Auth
- Bootstrap Next.js 13 app with TypeScript, Tailwind, shadcn/ui, configure ESLint/Prettier + Husky pre-commit hooks.
- Set up Prisma schema, migrations (`prisma migrate dev` for SQLite), PlanetScale branch workflow for prod.
- Implement authentication using NextAuth (Email magic link + optional passwordless) with role-based access.
- Build base layout (dashboard shell, sidebar, top nav) with shadcn components.

### Sprint 2 (Weeks 3–4) — Agency & Client Management
- CRUD for agencies, client onboarding flows, invitation system for team members.
- Implement form validations with React Hook Form + Zod.
- Build client list views, filtering, empty states; integrate timezone settings.
- Add agency-level AI feature toggle (enable/disable AI insights per agency).
- Set up secrets storage for OAuth connectors (Vercel encrypted env vars).

### Sprint 2.5 (Week 5) — Admin Panel Foundation
- Build super admin dashboard for platform configuration.
- Implement SystemConfig management for global settings.
- Create admin authentication middleware and route protection.
- Add admin activity logging and audit trails.

### Sprint 3 (Weeks 6–7) — Integrations Layer
- Meta OAuth flow: use Facebook Marketing OAuth, store tokens encrypted (Prisma middleware with Crypto).
- Google Ads OAuth flow with Google Ads API, manage refresh tokens.
- Build webhook-safe callback routes, token refresh cron jobs (Vercel Cron + serverless function).
- Initial data sync service pulling campaigns, ad sets, ad-level metrics (spend, impressions, clicks, conversions).

### Sprint 4 (Weeks 8–9) — Data Normalization & Dashboard v1
- ETL pipelines to normalize metrics into `CampaignMetric`.
- Aggregate queries using Prisma + SQL views for CTR, ROAS, CPA per day.
- Dashboard pages showing blended spend, channel breakdown, top campaigns; use charts (e.g., recharts) with dynamic data fetching via Server Components + Suspense.
- Implement caching strategies with ISR for heavy analytics pages.

### Sprint 5 (Weeks 10–11) — Automated Reporting
- Template builder for daily reports (Markdown-to-HTML via `@react-email`).
- Scheduler to trigger daily report generation per client (Vercel Cron + queue).
- Integrate Resend for email delivery, include attachments (PDF via `@react-pdf` optional).
- Track email send logs in `Report` model, expose history UI.

### Sprint 6 (Weeks 12–13) — Multi-Provider AI Insights
- Build AI provider management system (admin panel for adding/configuring providers).
- Implement multi-provider adapter pattern (OpenAI, Anthropic, Google Gemini, Azure OpenAI).
- Define prompt templates capturing key metrics deltas, guardrails for budget suggestions.
- Serverless functions to call AI APIs with priority-based fallback mechanism.
- Store insights with provider/model metadata in `Insight` table.
- UI module listing insights, allow marking as applied/dismissed, capture feedback for iterations.
- Check agency AI-enabled status before generating insights.
- Cost control: implement per-agency rate limits, provider usage tracking, and caching for repeated prompts.

### Sprint 6.5 (Week 14) — Dynamic Pricing Management
- Build admin pricing plan management (create/edit pricing tiers dynamically).
- Implement plan limit enforcement (client count, user count, AI call limits).
- Create public pricing page fetching plans from database.
- Build plan upgrade workflow and usage monitoring.
- Add billing integration hooks (Stripe/Razorpay ready).

### Sprint 7 (Weeks 15–16) — Hardening & Compliance
- Add audit logs (middleware capturing mutations) stored in separate table.
- Role-based access rules on server components, include middleware for route protection.
- Super admin access control for sensitive operations.
- Implement usage metrics, plan limits via middleware & background checks.
- Encrypt AI provider API keys at rest with rotation mechanism.
- Security review: CSRF, rate limiting (Upstash Redis), vulnerability scanning (Snyk/GitHub).

### Sprint 8 (Week 17) — Launch Readiness
- Seed scripts for demo data, pricing plans, test AI providers.
- Staging environment sign-off with all AI providers tested.
- Lighthouse performance tuning, accessibility checks.
- Failover tests for OAuth token refresh, report send, AI provider switching.
- Final QA cycle with automated Playwright smoke tests.

## 5. Integrations & External Services
- **OAuth**: Meta Marketing API, Google Ads API; use separate apps with secured redirect URIs.
- **Email**: Resend or SendGrid (IN accounts) for daily reports, onboarding sequences, authentication magic links.
- **AI**: Multi-provider support with admin-configurable switching:
  - OpenAI (GPT-4o mini/GPT-4o) - Primary recommendation
  - Anthropic Claude (Haiku/Sonnet/Opus)
  - Google Gemini (Flash/Pro)
  - Azure OpenAI
  - Priority-based fallback mechanism for reliability
  - At least one provider required; multiple providers recommended
- **Queue/Scheduling**: Vercel Cron for scheduled invocations; Upstash QStash or Inngest for job orchestration.
- **Storage**: Vercel KV or Upstash Redis for cache, session storage, rate limiting; AWS S3 (via R2) for report assets if needed.
- **Payment**: Stripe (international) or Razorpay (India) for subscription billing (future phase).

**See requirements.md for detailed setup instructions, API keys, and configuration steps.**

## 6. Testing & QA Strategy
- **Unit testing**: Vitest/Jest for utilities, Prisma mocks with `@prisma/client` test harness.
- **Integration tests**: Playwright for dashboard flows; MSW for mocking API responses.
- **Contract tests**: Validate OAuth flows using test accounts; ensure rate limit handling.
- **Performance checks**: Scheduled load tests on API routes (k6 cloud or GitHub Actions).
- **CI pipeline**: GitHub Actions running lint, type check (`tsc --noEmit`), tests, build preview. Branch protection requiring green checks before merge.

## 7. Deployment Workflow
- GitHub repository with trunk-based development, feature branches, pull request review.
- Vercel integration for auto previews; `main` branch deploys to production.
- Prisma migration workflow: use `prisma migrate deploy` in production, guard via manual approval.
- Feature flags (Env-based or LaunchDarkly-lite config) to enable incremental rollouts.

## 8. Observability & Maintenance
- Sentry for error tracking, integrate with Next.js for server/client errors.
- PostHog or LogRocket for user behavior insights.
- Health checks route for uptime monitoring (Pingdom/UptimeRobot).
- AI provider performance monitoring and cost tracking dashboard.
- Weekly ops review evaluating sync success, email deliverability, AI usage costs, provider reliability.

## 9. Security & Compliance
- Encrypt secrets at rest (Prisma middleware to encrypt OAuth tokens and AI provider API keys using AES).
- Implement API key rotation mechanism for AI providers.
- Super admin access controls for sensitive operations (pricing, AI provider management).
- Implement GDPR-ready data export/delete endpoints.
- Regular dependency scans (Dependabot) and patching cadence.
- Document data flow diagrams, access controls for audits.

## 10. Future-proofing for Scale
- Abstract data connectors to allow additional platforms (YouTube, LinkedIn, TikTok) via providers.
- Move reporting workloads to background workers (e.g., AWS Lambda via SST) if Vercel limits reached.
- Consider dedicated analytics warehouse (BigQuery/Snowflake) for historical trend analysis beyond MVP.
- Add more AI providers as they become available (Cohere, Mistral, local models).
- Implement AI model fine-tuning pipeline for domain-specific insights.
- White-label solution with customer-specific branding and pricing.

---

## 11. Documentation References

For detailed implementation guidance, refer to:
- **Development Tasks**: `plan/dev-task.md` - Sprint-by-sprint implementation checklist
- **Requirements & Setup**: `plan/requirements.md` - Complete guide for all external service integrations, API keys, and configurations
- **Product Vision**: `idea.md` - Original product concept and goals

**Key Admin Features**:
1. **AI Provider Management** - Admins can add/remove/configure multiple AI providers with priority-based fallback
2. **Dynamic Pricing** - Create and modify pricing plans from admin dashboard without code changes
3. **AI Feature Toggle** - Enable/disable AI insights per agency
4. **System Configuration** - Manage global settings through admin panel

