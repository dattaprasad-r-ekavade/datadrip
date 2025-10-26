# DataDrip MVP Development Task Plan

## Overview
This document outlines the step-by-step development tasks to build the DataDrip MVP - a marketing analytics platform for agencies managing Meta and Google Ads campaigns.

**Target Timeline**: 16 weeks (updated to include admin features)  
**Goal**: Launch-ready MVP with authentication, integrations, automated reporting, multi-provider AI insights, and comprehensive admin controls

**Key Features**:
- Multi-provider AI support (OpenAI, Anthropic, Google Gemini, Azure OpenAI) with admin-configurable switching
- Dynamic pricing plans managed from admin panel
- AI feature toggle per agency
- Comprehensive admin dashboard for platform configuration

**📚 Related Documentation**:
- **Setup & Requirements**: `requirements.md` - Complete guide for all external services, API keys, and configurations
- **Admin Features Guide**: `admin-guide.md` - Quick reference for admin panel features and workflows
- **Technical Architecture**: `technical-plan.md` - System design and architecture decisions
- **Recent Updates**: `UPDATES.md` - Summary of changes and new features added

---

## 🚀 Sprint 1: Project Foundation & Authentication (Weeks 1-2)

### Task 1.1: Initialize Next.js Project
- [ ] Create new Next.js 13+ project with TypeScript
  ```bash
  npx create-next-app@latest datadrip --typescript --tailwind --app --use-npm
  ```
- [ ] Configure `tsconfig.json` with strict mode
- [ ] Set up folder structure:
  - `/app` - Next.js App Router pages
  - `/components` - Shared UI components
  - `/lib` - Utilities, DB clients, API helpers
  - `/prisma` - Database schema and migrations
  - `/public` - Static assets
  - `/types` - TypeScript type definitions

### Task 1.2: Install Core Dependencies
- [ ] Install shadcn/ui and configure
  ```bash
  npx shadcn-ui@latest init
  ```
- [ ] Install development tools:
  - ESLint & Prettier
  - Husky for git hooks
  - lint-staged
- [ ] Install core dependencies:
  - `@prisma/client` & `prisma`
  - `next-auth` (v5)
  - `zod` for validation
  - `react-hook-form`
  - `dotenv-cli`

### Task 1.3: Database Setup
- [ ] Create Prisma schema file (`prisma/schema.prisma`)
- [ ] Copy data models from technical plan (including new models):
  - User (with `isSuperAdmin` field)
  - Agency (with `aiEnabled` field)
  - AIProvider model
  - PricingPlan model
  - SystemConfig model
- [ ] Initialize SQLite for local development
  ```bash
  npx prisma init --datasource-provider sqlite
  ```
- [ ] Create initial migration
  ```bash
  npx prisma migrate dev --name init
  ```
- [ ] Set up Prisma Client singleton in `lib/prisma.ts`

### Task 1.4: Authentication Implementation
- [ ] Configure NextAuth with email provider
- [ ] Create `/api/auth/[...nextauth]/route.ts`
- [ ] Set up authentication middleware
- [ ] Create login page (`/app/login/page.tsx`)
- [ ] Build magic link email template
- [ ] Implement session management
- [ ] Add role-based access control (RBAC) utilities
- [ ] Create super admin detection middleware
- [ ] Create protected route wrapper
- [ ] Build admin route guard

### Task 1.5: Base Layout & UI Shell
- [ ] Install required shadcn components:
  - Button, Card, Input, Label, Dropdown
  - Sidebar, Navigation, Avatar
- [ ] Create dashboard layout component
- [ ] Build responsive sidebar navigation
- [ ] Create top navigation bar with user menu
- [ ] Add loading states and error boundaries
- [ ] Set up global styles and theme configuration

### Task 1.6: Environment Configuration
- [ ] Create `.env.local` template
- [ ] Document required environment variables:
  - `DATABASE_URL`
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`
  - Email provider credentials
- [ ] Add `.env.example` to repository
- [ ] Configure environment variables in Vercel

---

## 🏢 Sprint 2: Agency & Client Management (Weeks 3-4)

### Task 2.1: Agency CRUD Operations
- [ ] Create Agency database model (already in schema)
- [ ] Build agency service layer (`lib/services/agency.ts`)
- [ ] Create API routes:
  - `POST /api/agencies` - Create agency
  - `GET /api/agencies/:id` - Get agency details
  - `PATCH /api/agencies/:id` - Update agency
  - `DELETE /api/agencies/:id` - Delete agency
- [ ] Implement agency settings page
- [ ] Add timezone selector component

### Task 2.2: Client Management
- [ ] Create client service layer (`lib/services/client.ts`)
- [ ] Build client CRUD API routes:
  - `POST /api/clients` - Create client
  - `GET /api/clients` - List clients with filters
  - `GET /api/clients/:id` - Get client details
  - `PATCH /api/clients/:id` - Update client
  - `DELETE /api/clients/:id` - Delete client
- [ ] Create client onboarding form with Zod validation
- [ ] Build client list page with search/filter
- [ ] Add pagination component
- [ ] Create empty state designs

### Task 2.3: Team Member Management
- [ ] Build user invitation system
- [ ] Create invite email templates
- [ ] Implement invite acceptance flow
- [ ] Build team members list page
- [ ] Add role assignment UI (Owner/Member)
- [ ] Create user profile management page
- [ ] Add super admin designation (system-level only)

### Task 2.4: Agency Settings & AI Toggle
- [ ] Build agency settings page
- [ ] Add AI features enable/disable toggle
- [ ] Create feature flags service
- [ ] Implement AI status indicator in UI
- [ ] Add agency-level AI usage tracking
- [ ] Build settings persistence layer

### Task 2.4: Agency Settings & AI Toggle
- [ ] Build agency settings page
- [ ] Add AI features enable/disable toggle
- [ ] Create feature flags service
- [ ] Implement AI status indicator in UI
- [ ] Add agency-level AI usage tracking
- [ ] Build settings persistence layer

### Task 2.5: Form Validation & Error Handling
- [ ] Set up React Hook Form integration
- [ ] Create reusable form components
- [ ] Implement Zod schemas for all forms
- [ ] Add client-side and server-side validation
- [ ] Create error display components
- [ ] Build toast notification system

---

## � Sprint 2.5: Admin Panel Foundation (Week 5)

### Task 2.5.1: Admin Dashboard Setup
- [ ] Create admin route structure (`/app/admin/`)
- [ ] Build admin dashboard layout
- [ ] Add admin navigation menu
- [ ] Create admin home/stats page
- [ ] Implement super admin middleware
- [ ] Add admin activity logging

### Task 2.5.2: System Configuration Management
- [ ] Create SystemConfig CRUD service
- [ ] Build configuration UI
- [ ] Add key-value editor component
- [ ] Implement configuration validation
- [ ] Create configuration backup/restore
- [ ] Add configuration history tracking

---

## �🔌 Sprint 3: Platform Integrations (Weeks 6-7)

### Task 3.1: Meta Marketing API Integration
- [ ] Create Meta OAuth app in Facebook Developers
- [ ] Implement OAuth flow:
  - Authorization redirect
  - Callback handler
  - Token exchange
- [ ] Build token storage with encryption
  - Install `crypto` utilities
  - Create encryption middleware for Prisma
- [ ] Create Meta API client (`lib/integrations/meta.ts`)
- [ ] Implement token refresh logic
- [ ] Add Meta account connection UI
- [ ] Test with sandbox account

### Task 3.2: Google Ads API Integration
- [ ] Set up Google Cloud project & OAuth app
- [ ] Enable Google Ads API
- [ ] Implement Google OAuth flow
- [ ] Build Google Ads API client (`lib/integrations/google-ads.ts`)
- [ ] Store and manage refresh tokens
- [ ] Create Google account connection UI
- [ ] Test with test account

### Task 3.3: Token Management & Refresh
- [ ] Create token refresh cron job (`/api/cron/refresh-tokens`)
- [ ] Set up Vercel Cron configuration
- [ ] Implement automatic token refresh logic
- [ ] Add error handling and retry mechanism
- [ ] Create token status monitoring dashboard
- [ ] Build alerts for expired tokens

### Task 3.4: Initial Data Sync Service
- [ ] Create data sync service (`lib/services/sync.ts`)
- [ ] Implement Meta campaigns fetch
- [ ] Implement Google Ads campaigns fetch
- [ ] Build data transformation layer
- [ ] Create sync status tracking
- [ ] Add manual sync trigger UI
- [ ] Schedule daily sync jobs

---

## 📊 Sprint 4: Data Processing & Dashboard (Weeks 8-9)

### Task 4.1: ETL Pipeline Development
- [ ] Create data normalization service
- [ ] Build metric transformation functions
- [ ] Implement `CampaignMetric` population logic
- [ ] Add data validation and deduplication
- [ ] Create error logging for failed syncs
- [ ] Build retry mechanism for failed data pulls

### Task 4.2: Analytics Queries & Aggregations
- [ ] Create analytics service (`lib/services/analytics.ts`)
- [ ] Implement aggregation queries:
  - Total spend by platform
  - CTR calculation (clicks/impressions)
  - ROAS calculation (revenue/spend)
  - CPA calculation (spend/conversions)
- [ ] Build date range filtering
- [ ] Add campaign-level breakdown queries
- [ ] Create SQL views for complex aggregations
- [ ] Implement caching with Redis (Upstash)

### Task 4.3: Dashboard UI Components
- [ ] Install and configure recharts
- [ ] Create metric card component
- [ ] Build line chart for spend trends
- [ ] Create bar chart for channel comparison
- [ ] Build top campaigns table
- [ ] Add date range picker
- [ ] Implement platform filter toggles

### Task 4.4: Dashboard Pages
- [ ] Create main dashboard page (`/app/dashboard/page.tsx`)
- [ ] Implement Server Components for data fetching
- [ ] Add Suspense boundaries with loading states
- [ ] Build channel breakdown view
- [ ] Create campaign detail page
- [ ] Implement ISR for heavy analytics pages
- [ ] Add export to CSV functionality

---

## 📧 Sprint 5: Automated Reporting (Weeks 10-11)

### Task 5.1: Report Template System
- [ ] Install `@react-email/components`
- [ ] Create report email templates
- [ ] Build HTML report generator
- [ ] Design responsive email layouts
- [ ] Add brand customization options
- [ ] Create report preview functionality

### Task 5.2: Email Service Integration
- [ ] Set up Resend account
- [ ] Install Resend SDK
- [ ] Create email service wrapper (`lib/services/email.ts`)
- [ ] Implement send email function
- [ ] Add email delivery tracking
- [ ] Handle bounce and error notifications

### Task 5.3: Report Generation Engine
- [ ] Create report generation service
- [ ] Build data aggregation for reports
- [ ] Implement summary text generation
- [ ] Add chart/graph embedding
- [ ] Create PDF generation (optional)
- [ ] Store generated reports in database

### Task 5.4: Report Scheduling
- [ ] Create daily report cron job (`/api/cron/generate-reports`)
- [ ] Configure Vercel Cron for report schedule
- [ ] Implement per-client scheduling logic
- [ ] Add timezone-aware sending
- [ ] Build report history UI
- [ ] Create manual report trigger button

### Task 5.5: Report Management UI
- [ ] Create reports list page
- [ ] Build report preview modal
- [ ] Add resend report functionality
- [ ] Implement report settings per client
- [ ] Create email recipient management
- [ ] Add report customization options

---

## 🤖 Sprint 6: Multi-Provider AI Insights Engine (Weeks 12-13)

### Task 6.1: AI Provider Management (Admin)
- [ ] Create AIProvider CRUD service (`lib/services/ai-provider.ts`)
- [ ] Build AI provider API routes:
  - `POST /api/admin/ai-providers` - Add provider
  - `GET /api/admin/ai-providers` - List providers
  - `PATCH /api/admin/ai-providers/:id` - Update provider
  - `DELETE /api/admin/ai-providers/:id` - Delete provider
  - `POST /api/admin/ai-providers/:id/test` - Test connection
- [ ] Create AI provider management UI page
- [ ] Build provider configuration form (API key, model, priority)
- [ ] Implement provider status indicators
- [ ] Add provider switching logic
- [ ] Create secure API key storage (encrypted)

### Task 6.2: Multi-Provider AI Integration
- [ ] Install AI SDKs:
  - `openai` - OpenAI
  - `@anthropic-ai/sdk` - Anthropic Claude
  - `@google/generative-ai` - Google Gemini
  - `@azure/openai` - Azure OpenAI
- [ ] Create unified AI service interface (`lib/services/ai/index.ts`)
- [ ] Implement provider adapters:
  - `lib/services/ai/providers/openai.ts`
  - `lib/services/ai/providers/anthropic.ts`
  - `lib/services/ai/providers/gemini.ts`
  - `lib/services/ai/providers/azure.ts`
- [ ] Build provider factory pattern
- [ ] Implement fallback mechanism (priority-based)
- [ ] Add provider health checks
- [ ] Create rate limiting per provider

### Task 6.3: Prompt Engineering
- [ ] Create prompt templates for:
  - Performance insights
  - Budget recommendations
  - Creative optimization
  - Audience targeting suggestions
- [ ] Build provider-agnostic prompt formatting
- [ ] Implement guardrails for suggestions
- [ ] Add validation for AI responses
- [ ] Create prompt versioning system
- [ ] Test prompts with all providers

### Task 6.4: Insight Generation Service
- [ ] Update insight generation service
- [ ] Check agency AI enabled status before generation
- [ ] Build data extraction for AI context
- [ ] Implement multi-provider API calls with fallback
- [ ] Parse and structure AI responses
- [ ] Store insights with provider/model metadata
- [ ] Calculate impact scores
- [ ] Create scheduled insight generation
- [ ] Add per-agency AI usage tracking

### Task 6.5: Insights UI
- [ ] Create insights dashboard page
- [ ] Build insight card components
- [ ] Add filtering by type and status
- [ ] Display AI provider badge on insights
- [ ] Implement mark as applied/dismissed actions
- [ ] Create insight detail view
- [ ] Add feedback collection form
- [ ] Build insights history timeline
- [ ] Show "AI Disabled" state when turned off

### Task 6.6: Caching & Optimization
- [ ] Implement prompt response caching
- [ ] Add deduplication logic for similar insights
- [ ] Create cache invalidation strategy
- [ ] Monitor and limit API usage per provider
- [ ] Add fallback to rule-based insights
- [ ] Implement cost tracking dashboard
- [ ] Create provider performance analytics

---

## 💰 Sprint 6.5: Dynamic Pricing Management (Week 14)

### Task 6.5.1: Pricing Plan Management (Admin)
- [ ] Create PricingPlan CRUD service (`lib/services/pricing.ts`)
- [ ] Build pricing API routes:
  - `POST /api/admin/pricing` - Create plan
  - `GET /api/admin/pricing` - List all plans
  - `GET /api/admin/pricing/:tier` - Get plan details
  - `PATCH /api/admin/pricing/:tier` - Update plan
  - `DELETE /api/admin/pricing/:tier` - Delete plan
- [ ] Create pricing management UI page
- [ ] Build plan editor form with:
  - Tier selection (Starter/Growth/Scale/Custom)
  - Price and currency settings
  - Billing interval (monthly/yearly)
  - Feature list editor (JSON)
  - Limits configuration (clients, users, AI calls)
- [ ] Add plan preview component
- [ ] Implement plan activation/deactivation

### Task 6.5.2: Public Pricing Page
- [ ] Create public pricing page (`/pricing`)
- [ ] Fetch active plans from database
- [ ] Build responsive pricing cards
- [ ] Add feature comparison table
- [ ] Implement plan selection/upgrade flow
- [ ] Create custom plan inquiry form
- [ ] Add pricing FAQ section

### Task 6.5.3: Plan Enforcement
- [ ] Update agency plan assignment
- [ ] Implement plan limit checks:
  - Client count limits
  - User count limits
  - AI insights limits
  - API call limits
- [ ] Create usage monitoring service
- [ ] Add upgrade prompts when limits reached
- [ ] Build plan upgrade workflow
- [ ] Implement billing integration hooks (Stripe/Razorpay ready)

---

## 🔒 Sprint 7: Security & Compliance (Weeks 15-16)

### Task 7.1: Audit Logging
- [ ] Create audit log table/model
- [ ] Build audit logging middleware
- [ ] Capture all data mutations
- [ ] Log authentication events
- [ ] Store user actions with context
- [ ] Create audit log viewer UI

### Task 7.2: Access Control Hardening
- [ ] Implement route-level authorization
- [ ] Add RBAC checks in API routes
- [ ] Add super admin route protection
- [ ] Create middleware for protected routes
- [ ] Build permission checking utilities
- [ ] Add resource ownership validation
- [ ] Test access control edge cases
- [ ] Implement admin action logging

### Task 7.3: Usage Limits & Plan Management
- [ ] Implement plan tier limits
- [ ] Create usage tracking service
- [ ] Add client count limits
- [ ] Build usage dashboard
- [ ] Implement soft/hard limit warnings
- [ ] Create upgrade flow UI

### Task 7.4: Security Enhancements
- [ ] Implement CSRF protection
- [ ] Add rate limiting with Upstash Redis
- [ ] Set up Snyk vulnerability scanning
- [ ] Enable GitHub Dependabot
- [ ] Conduct security code review
- [ ] Add Content Security Policy headers
- [ ] Implement request validation middleware
- [ ] Encrypt AI provider API keys at rest
- [ ] Add API key rotation mechanism

### Task 7.5: Data Protection
- [ ] Audit token encryption implementation
- [ ] Add data export functionality (GDPR)
- [ ] Create data deletion endpoints
- [ ] Implement data retention policies
- [ ] Build privacy settings page
- [ ] Create data processing documentation

---

## 🚢 Sprint 8: Launch Preparation (Week 17)

### Task 8.1: Testing Infrastructure
- [ ] Install Playwright for E2E tests
- [ ] Create smoke test suite
- [ ] Build authentication flow tests
- [ ] Test integration flows
- [ ] Add dashboard interaction tests
- [ ] Test report generation end-to-end
- [ ] Set up CI pipeline in GitHub Actions

### Task 8.2: Performance Optimization
- [ ] Run Lighthouse audits
- [ ] Optimize images and assets
- [ ] Implement code splitting
- [ ] Add lazy loading for components
- [ ] Optimize database queries
- [ ] Configure CDN caching
- [ ] Test Core Web Vitals

### Task 8.3: Staging Environment Setup
- [ ] Create staging Vercel project
- [ ] Set up PlanetScale database branch
- [ ] Configure staging environment variables (including test AI keys)
- [ ] Deploy to staging
- [ ] Create demo seed data script (including pricing plans)
- [ ] Seed test AI providers
- [ ] Test all features in staging
- [ ] Test AI provider switching
- [ ] Verify pricing plan display
- [ ] Conduct UAT with stakeholders

### Task 8.4: Production Deployment
- [ ] Review production environment variables
- [ ] Set up PlanetScale production database
- [ ] Configure Redis (Upstash) for production
- [ ] Run database migrations
- [ ] Deploy to production Vercel
- [ ] Verify OAuth redirect URIs
- [ ] Test all integrations in production

### Task 8.5: Monitoring & Observability
- [ ] Set up Sentry error tracking
- [ ] Configure Vercel Analytics
- [ ] Add custom logging with Logtail
- [ ] Create health check endpoint (`/api/health`)
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure alert notifications
- [ ] Build ops dashboard

### Task 8.6: Documentation & Training
- [ ] Write user documentation
- [ ] Create admin guide (AI provider setup, pricing management)
- [ ] Document API endpoints
- [ ] Write deployment runbook
- [ ] Create troubleshooting guide
- [ ] Document AI provider configuration steps
- [ ] Create pricing plan setup guide
- [ ] Record demo videos
- [ ] Prepare onboarding materials

### Task 8.7: Launch Checklist
- [ ] Final security review
- [ ] Performance benchmarking
- [ ] Accessibility audit (WCAG 2.1)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness check
- [ ] Email deliverability test
- [ ] OAuth flow verification
- [ ] Test all AI providers with real keys
- [ ] Verify AI provider fallback mechanism
- [ ] Test pricing plan limits enforcement
- [ ] Backup and recovery test
- [ ] Load testing with production data volume
- [ ] Launch communication plan

---

## 📋 Post-Launch Tasks

### Immediate (Week 18+)
- [ ] Monitor error rates and performance
- [ ] Track AI provider usage and costs
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Optimize slow queries
- [ ] Improve email templates based on engagement
- [ ] Refine AI prompts based on feedback
- [ ] Monitor AI provider reliability
- [ ] Adjust pricing based on market feedback

### Short-term (Months 2-3)
- [ ] Add more AI insight types
- [ ] Implement custom report scheduling
- [ ] Add webhook notifications
- [ ] Build mobile app (React Native/PWA)
- [ ] Add more platform integrations (LinkedIn, TikTok)
- [ ] Implement advanced filtering and segmentation
- [ ] Add more AI providers (Cohere, Mistral, etc.)
- [ ] Create AI model A/B testing framework
- [ ] Build subscription billing (Stripe/Razorpay)

### Long-term (Months 4-6)
- [ ] Build white-label solution
- [ ] Add client portal for end-clients
- [ ] Implement predictive analytics
- [ ] Build campaign optimization automation
- [ ] Add collaboration features (comments, annotations)
- [ ] Scale to analytics warehouse (BigQuery/Snowflake)
- [ ] Create AI fine-tuning pipeline
- [ ] Implement dynamic pricing tiers

---

## 🛠️ Development Best Practices

### Code Quality
- Write unit tests for all business logic
- Use TypeScript strict mode
- Follow component naming conventions
- Document complex functions with JSDoc
- Use Prettier for consistent formatting
- Run ESLint before commits

### Git Workflow
- Use feature branches (`feature/task-name`)
- Write descriptive commit messages
- Keep PRs focused and small
- Require code reviews before merge
- Use conventional commits format
- Tag releases with semantic versioning

### Performance Guidelines
- Use Server Components by default
- Minimize client-side JavaScript
- Implement proper caching strategies
- Optimize database queries with indexes
- Use ISR for analytics pages
- Lazy load heavy components

### Security Practices
- Never commit secrets to repository
- Use environment variables for all configs
- Implement proper input validation
- Sanitize user inputs
- Use parameterized queries
- Keep dependencies updated

---

## 📊 Success Metrics

### Technical Metrics
- Page load time < 2 seconds
- API response time < 500ms (p95)
- Uptime > 99.5%
- Test coverage > 80%
- Zero critical security vulnerabilities
- Lighthouse score > 90

### Business Metrics
- Daily active users
- Report open rates
- Insight application rate
- Platform connection success rate
- User retention rate
- Support ticket volume

---

## 🔗 Key Resources

- **Technical Plan**: `plan/technical-plan.md`
- **Product Idea**: `idea.md`
- **Repository**: GitHub - datadrip
- **Design System**: shadcn/ui documentation
- **API Docs**: Meta Marketing API, Google Ads API

---

## Notes
- Adjust timeline based on team size and availability
- Prioritize features based on user feedback
- Consider parallel development where possible
- Schedule regular demos and stakeholder reviews
- Maintain technical debt backlog
- Document architectural decisions (ADRs)
