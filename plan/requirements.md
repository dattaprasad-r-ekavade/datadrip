# DataDrip MVP - Requirements & Configuration Guide

## Overview
This document outlines all the external services, API keys, configurations, and setup requirements needed to build and deploy the DataDrip MVP platform.

---

## 📋 Table of Contents
1. [Development Environment](#development-environment)
2. [Database Services](#database-services)
3. [Authentication Services](#authentication-services)
4. [Platform Integrations](#platform-integrations)
5. [AI Provider Integrations](#ai-provider-integrations)
6. [Email Services](#email-services)
7. [Caching & Queue Services](#caching--queue-services)
8. [Monitoring & Observability](#monitoring--observability)
9. [Deployment Platform](#deployment-platform)
10. [Payment Gateway (Future)](#payment-gateway-future)
11. [Environment Variables Reference](#environment-variables-reference)
12. [Initial Setup Checklist](#initial-setup-checklist)

---

## 1. Development Environment

### Required Software
- **Node.js**: v18.x or higher
- **npm** or **pnpm**: Latest version
- **Git**: For version control
- **VS Code**: Recommended IDE
- **Prisma CLI**: `npm install -g prisma`

### Local Development Tools
- **SQLite**: For local database (no separate installation needed)
- **Docker** (optional): For local Redis/MySQL testing
- **Postman** or **Thunder Client**: For API testing

---

## 2. Database Services

### Development (Local)
- **SQLite**: File-based database
  - No configuration needed
  - Automatically created by Prisma
  - Location: `prisma/dev.db`

### Production
- **PlanetScale** (Recommended)
  - **URL**: https://planetscale.com
  - **What you need**:
    - Create account
    - Create database: `datadrip-prod`
    - Create branch: `main` for production
    - Create branch: `dev` for development/testing
  - **Get from PlanetScale**:
    - `DATABASE_URL` connection string
  - **Features needed**:
    - Free tier sufficient for MVP
    - Upgrade to Scaler plan for production scaling

**Alternative**: 
- **Railway.app MySQL** or **Supabase PostgreSQL**
  - Similar setup process
  - Get connection string

### Configuration Required
```env
# Development
DATABASE_URL="file:./dev.db"

# Production
DATABASE_URL="mysql://user:password@host/database?sslaccept=strict"
```

---

## 3. Authentication Services

### NextAuth.js Setup
- **Service**: Built-in with Next.js
- **What you need**:
  - Generate a random secret key

### Required Configuration

#### Generate NextAuth Secret
```bash
openssl rand -base64 32
```

#### Email Provider (Magic Link)
Choose one of the following:

**Option 1: Resend (Recommended)**
- **URL**: https://resend.com
- **Steps**:
  1. Create account
  2. Verify domain or use resend.dev for testing
  3. Get API key from dashboard
- **Environment Variables**:
  ```env
  EMAIL_SERVER_HOST="smtp.resend.com"
  EMAIL_SERVER_PORT=465
  EMAIL_SERVER_USER="resend"
  EMAIL_SERVER_PASSWORD="re_your_api_key"
  EMAIL_FROM="noreply@yourdomain.com"
  ```

**Option 2: SendGrid**
- **URL**: https://sendgrid.com
- **Steps**:
  1. Create account
  2. Verify sender identity
  3. Create API key
- **Environment Variables**:
  ```env
  EMAIL_SERVER_HOST="smtp.sendgrid.net"
  EMAIL_SERVER_PORT=587
  EMAIL_SERVER_USER="apikey"
  EMAIL_SERVER_PASSWORD="SG.your_api_key"
  EMAIL_FROM="noreply@yourdomain.com"
  ```

### Environment Variables
```env
NEXTAUTH_URL="http://localhost:3000"  # Development
NEXTAUTH_URL="https://yourdomain.com" # Production
NEXTAUTH_SECRET="your_generated_secret"
```

---

## 4. Platform Integrations

### 4.1 Meta Marketing API (Facebook Ads)

#### Prerequisites
- **Facebook Business Manager Account**
- **Meta Developer Account**

#### Setup Steps
1. **Create Meta App**
   - Go to: https://developers.facebook.com
   - Create new app → Business type
   - Add "Marketing API" product
   
2. **Configure OAuth Settings**
   - **OAuth Redirect URIs**:
     - Development: `http://localhost:3000/api/auth/callback/meta`
     - Production: `https://yourdomain.com/api/auth/callback/meta`
   
3. **Get Credentials**
   - **App ID**: From app dashboard
   - **App Secret**: From app settings
   
4. **Permissions Required**:
   - `ads_read`
   - `ads_management`
   - `business_management`
   
5. **App Review** (for production):
   - Submit for review to access real ad accounts
   - Test with sandbox accounts during development

#### Environment Variables
```env
META_APP_ID="your_app_id"
META_APP_SECRET="your_app_secret"
META_API_VERSION="v18.0"
```

#### API Documentation
- https://developers.facebook.com/docs/marketing-apis

---

### 4.2 Google Ads API

#### Prerequisites
- **Google Cloud Project**
- **Google Ads Manager Account**

#### Setup Steps
1. **Create Google Cloud Project**
   - Go to: https://console.cloud.google.com
   - Create new project: "DataDrip"
   
2. **Enable Google Ads API**
   - In project → APIs & Services → Library
   - Search for "Google Ads API"
   - Click Enable
   
3. **Create OAuth 2.0 Credentials**
   - APIs & Services → Credentials
   - Create OAuth client ID → Web application
   - **Authorized redirect URIs**:
     - Development: `http://localhost:3000/api/auth/callback/google-ads`
     - Production: `https://yourdomain.com/api/auth/callback/google-ads`
   
4. **Get Credentials**
   - **Client ID**: From credentials page
   - **Client Secret**: From credentials page
   
5. **Get Developer Token**
   - Go to: https://ads.google.com
   - Navigate to Tools → API Center
   - Apply for developer token
   - **Note**: Test accounts work with standard access
   
6. **Configure OAuth Consent Screen**
   - Add app name, support email
   - Add scopes: `https://www.googleapis.com/auth/adwords`

#### Environment Variables
```env
GOOGLE_CLIENT_ID="your_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_client_secret"
GOOGLE_ADS_DEVELOPER_TOKEN="your_developer_token"
GOOGLE_ADS_LOGIN_CUSTOMER_ID="your_mcc_id"  # Optional: Manager account
```

#### API Documentation
- https://developers.google.com/google-ads/api/docs/start

---

## 5. AI Provider Integrations

The platform supports multiple AI providers that can be configured dynamically through the admin panel. At least one provider must be configured for AI features to work.

### 5.1 OpenAI

#### Setup Steps
1. **Create Account**
   - Go to: https://platform.openai.com
   - Sign up / Log in
   
2. **Get API Key**
   - Navigate to: API Keys section
   - Create new secret key
   - **Save immediately** (shown only once)
   
3. **Add Payment Method**
   - Required for API usage
   - Set usage limits to control costs
   
4. **Recommended Models**:
   - `gpt-4o-mini` - Cost-effective for insights
   - `gpt-4o` - Higher quality (more expensive)
   - `gpt-3.5-turbo` - Budget option

#### Configuration in Admin Panel
- **Provider Name**: OpenAI
- **Provider Type**: `OPENAI`
- **API Key**: `sk-...`
- **Model**: `gpt-4o-mini`
- **Priority**: `1` (highest)

#### Environment Variables (Optional - for system defaults)
```env
OPENAI_API_KEY="sk-your_openai_api_key"
OPENAI_DEFAULT_MODEL="gpt-4o-mini"
```

#### Pricing (as of 2025)
- GPT-4o-mini: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- API Docs: https://platform.openai.com/docs

---

### 5.2 Anthropic Claude

#### Setup Steps
1. **Create Account**
   - Go to: https://console.anthropic.com
   - Sign up
   
2. **Get API Key**
   - Navigate to: API Keys
   - Create new key
   
3. **Add Credits**
   - Purchase API credits or set up billing
   
4. **Recommended Models**:
   - `claude-3-haiku-20240307` - Fast and cost-effective
   - `claude-3-5-sonnet-20241022` - Balanced performance
   - `claude-3-opus-20240229` - Highest capability

#### Configuration in Admin Panel
- **Provider Name**: Anthropic Claude
- **Provider Type**: `ANTHROPIC`
- **API Key**: `sk-ant-...`
- **Model**: `claude-3-haiku-20240307`
- **Priority**: `2`

#### Environment Variables (Optional)
```env
ANTHROPIC_API_KEY="sk-ant-your_anthropic_api_key"
ANTHROPIC_DEFAULT_MODEL="claude-3-haiku-20240307"
```

#### Pricing
- Claude Haiku: ~$0.25 per 1M input tokens, ~$1.25 per 1M output tokens
- API Docs: https://docs.anthropic.com/claude/reference/

---

### 5.3 Google Gemini

#### Setup Steps
1. **Use Existing Google Cloud Project**
   - From Google Ads API setup above
   
2. **Enable Gemini API**
   - APIs & Services → Library
   - Search for "Generative Language API"
   - Click Enable
   
3. **Create API Key**
   - APIs & Services → Credentials
   - Create Credentials → API Key
   - Restrict key to Generative Language API
   
4. **Recommended Models**:
   - `gemini-1.5-flash` - Fast and efficient
   - `gemini-1.5-pro` - Advanced reasoning

#### Configuration in Admin Panel
- **Provider Name**: Google Gemini
- **Provider Type**: `GOOGLE_GEMINI`
- **API Key**: `AIza...`
- **Model**: `gemini-1.5-flash`
- **Priority**: `3`

#### Environment Variables (Optional)
```env
GOOGLE_GEMINI_API_KEY="AIza_your_gemini_api_key"
GOOGLE_GEMINI_DEFAULT_MODEL="gemini-1.5-flash"
```

#### Pricing
- Gemini Flash: Free tier available, then ~$0.35 per 1M tokens
- API Docs: https://ai.google.dev/docs

---

### 5.4 Azure OpenAI

#### Setup Steps
1. **Create Azure Account**
   - Go to: https://portal.azure.com
   - Sign up for Azure
   
2. **Create Azure OpenAI Resource**
   - Search for "Azure OpenAI"
   - Create resource
   - Select region (availability varies)
   - Note: May require access request approval
   
3. **Deploy Model**
   - In Azure OpenAI Studio
   - Deploy model (e.g., gpt-4, gpt-35-turbo)
   
4. **Get Credentials**
   - **Endpoint**: From resource overview
   - **API Key**: From Keys and Endpoint section
   - **Deployment Name**: Your model deployment name

#### Configuration in Admin Panel
- **Provider Name**: Azure OpenAI
- **Provider Type**: `AZURE_OPENAI`
- **API Key**: `your_azure_key`
- **Model**: `your-deployment-name`
- **Config JSON**:
  ```json
  {
    "endpoint": "https://your-resource.openai.azure.com",
    "apiVersion": "2024-02-15-preview"
  }
  ```
- **Priority**: `4`

#### Environment Variables (Optional)
```env
AZURE_OPENAI_API_KEY="your_azure_openai_key"
AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
AZURE_OPENAI_DEPLOYMENT="your-deployment-name"
AZURE_OPENAI_API_VERSION="2024-02-15-preview"
```

#### Pricing
- Varies by model and region
- API Docs: https://learn.microsoft.com/en-us/azure/ai-services/openai/

---

### AI Provider Selection Strategy

#### Priority-Based Fallback
The system uses a priority-based system (lower number = higher priority):
1. Primary provider (priority 1) is tried first
2. If it fails, falls back to priority 2
3. Continues until successful or all providers exhausted

#### Admin Configuration
Admins can:
- Add/remove AI providers
- Switch between providers
- Set priorities for fallback order
- Toggle providers active/inactive
- Test provider connections
- Monitor usage and costs per provider

#### Minimum Requirement
- **At least 1 AI provider must be configured** for AI features
- Recommended: Configure at least 2 providers for redundancy

---

## 6. Email Services

### Transactional Email (Reports & Notifications)

Choose one of the following:

#### Option 1: Resend (Recommended)
- **URL**: https://resend.com
- **What you need**:
  1. Create account
  2. Verify domain (or use resend.dev for testing)
  3. Get API key
- **Free Tier**: 3,000 emails/month
- **Pricing**: $20/month for 50,000 emails

**Environment Variables**:
```env
RESEND_API_KEY="re_your_resend_api_key"
EMAIL_FROM="reports@yourdomain.com"
```

#### Option 2: SendGrid
- **URL**: https://sendgrid.com
- **What you need**:
  1. Create account
  2. Verify sender identity
  3. Create API key with Mail Send permission
- **Free Tier**: 100 emails/day
- **Pricing**: $19.95/month for 50,000 emails

**Environment Variables**:
```env
SENDGRID_API_KEY="SG.your_sendgrid_api_key"
EMAIL_FROM="reports@yourdomain.com"
```

#### Email Template Testing
- Use **Mailtrap** (https://mailtrap.io) for development email testing
- Free tier: 500 emails/month in sandbox

---

## 7. Caching & Queue Services

### Redis (Upstash)

#### Purpose
- Session caching
- Rate limiting
- Job queues
- AI response caching
- Token caching

#### Setup Steps
1. **Create Account**
   - Go to: https://upstash.com
   - Sign up
   
2. **Create Redis Database**
   - Click "Create Database"
   - Select region closest to your deployment
   - Choose "Global" for multi-region (recommended)
   
3. **Get Credentials**
   - Database URL
   - Redis token
   
4. **Free Tier**: 10,000 commands/day

#### Environment Variables
```env
UPSTASH_REDIS_URL="https://your-db.upstash.io"
UPSTASH_REDIS_TOKEN="your_redis_token"
```

#### Alternative: Redis Cloud
- https://redis.com/cloud
- Similar setup process

---

### Queue Service (Optional - for background jobs)

#### Upstash QStash
- **URL**: https://upstash.com/qstash
- **Purpose**: Serverless job scheduling
- **Setup**:
  1. Same Upstash account
  2. Enable QStash
  3. Get signing keys

**Environment Variables**:
```env
QSTASH_URL="https://qstash.upstash.io"
QSTASH_TOKEN="your_qstash_token"
QSTASH_CURRENT_SIGNING_KEY="your_signing_key"
QSTASH_NEXT_SIGNING_KEY="your_next_signing_key"
```

**Alternative**: Inngest (https://inngest.com) - More features, slightly more complex

---

## 8. Monitoring & Observability

### 8.1 Error Tracking - Sentry

#### Setup Steps
1. **Create Account**
   - Go to: https://sentry.io
   - Sign up
   
2. **Create Project**
   - Select "Next.js"
   - Name: "DataDrip"
   
3. **Get DSN**
   - From project settings
   
4. **Install Sentry**:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

#### Environment Variables
```env
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."
SENTRY_AUTH_TOKEN="your_sentry_auth_token"
```

#### Free Tier
- 5,000 errors/month
- 30-day retention

---

### 8.2 Logging - Logtail (Better Stack)

#### Setup Steps
1. **Create Account**
   - Go to: https://betterstack.com/logs
   
2. **Create Source**
   - Select "Next.js" or "Custom"
   - Get source token

#### Environment Variables
```env
LOGTAIL_SOURCE_TOKEN="your_logtail_source_token"
```

#### Alternative: LogRocket
- https://logrocket.com
- Session replay + logging

---

### 8.3 Uptime Monitoring - UptimeRobot

#### Setup Steps
1. **Create Account**
   - Go to: https://uptimerobot.com
   - Free tier: 50 monitors
   
2. **Add Monitor**
   - Type: HTTP(s)
   - URL: `https://yourdomain.com/api/health`
   - Interval: 5 minutes
   
3. **Configure Alerts**
   - Email notifications
   - Webhook to Slack (optional)

**No environment variables needed** - external monitoring

---

### 8.4 Analytics - Vercel Analytics

#### Setup
- **Automatic** with Vercel deployment
- Enable in Vercel project settings
- No configuration needed

#### Alternative: PostHog
- https://posthog.com
- Self-hosted or cloud
- Product analytics + feature flags

---

## 9. Deployment Platform

### Vercel (Recommended)

#### Setup Steps
1. **Create Account**
   - Go to: https://vercel.com
   - Sign up with GitHub
   
2. **Connect Repository**
   - Import Git repository
   - Select "DataDrip" project
   
3. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Build command: `npm run build`
   - Output directory: `.next`
   
4. **Set Environment Variables**
   - Add all production environment variables
   - Use Vercel's encrypted storage
   
5. **Configure Cron Jobs**
   - In `vercel.json`:
     ```json
     {
       "crons": [
         {
           "path": "/api/cron/refresh-tokens",
           "schedule": "0 */6 * * *"
         },
         {
           "path": "/api/cron/sync-data",
           "schedule": "0 2 * * *"
         },
         {
           "path": "/api/cron/generate-reports",
           "schedule": "0 8 * * *"
         }
       ]
     }
     ```

#### Free Tier Limits
- 100 GB bandwidth/month
- Serverless function execution: 100 GB-hours
- 6,000 minutes build time

#### Production Tier ($20/month)
- Unlimited bandwidth
- Advanced analytics
- Team collaboration

---

### Alternative: Railway.app or Render.com
- Similar deployment process
- Connect GitHub repo
- Set environment variables
- Deploy

---

## 10. Payment Gateway (Future)

### For Subscription Billing

#### Stripe (International)
- **URL**: https://stripe.com
- **Setup**:
  1. Create account
  2. Get API keys (test & live)
  3. Set up webhook endpoint
  4. Create products and prices

**Environment Variables**:
```env
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### Razorpay (India)
- **URL**: https://razorpay.com
- **Setup**:
  1. Create account
  2. Complete KYC
  3. Get API keys
  4. Configure webhook

**Environment Variables**:
```env
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
```

---

## 11. Environment Variables Reference

### Complete `.env.local` Template

```env
# ===================================
# DATABASE
# ===================================
DATABASE_URL="file:./dev.db"  # Local
# DATABASE_URL="mysql://..."  # Production

# ===================================
# AUTHENTICATION
# ===================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_generated_secret_min_32_chars"

# Email Provider (Choose one)
EMAIL_SERVER_HOST="smtp.resend.com"
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER="resend"
EMAIL_SERVER_PASSWORD="re_your_api_key"
EMAIL_FROM="noreply@yourdomain.com"

# ===================================
# META MARKETING API
# ===================================
META_APP_ID="your_meta_app_id"
META_APP_SECRET="your_meta_app_secret"
META_API_VERSION="v18.0"

# ===================================
# GOOGLE ADS API
# ===================================
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_ADS_DEVELOPER_TOKEN="your_developer_token"
GOOGLE_ADS_LOGIN_CUSTOMER_ID=""  # Optional

# ===================================
# AI PROVIDERS (Optional - can be configured in admin)
# ===================================
# OpenAI
OPENAI_API_KEY="sk-your_openai_key"
OPENAI_DEFAULT_MODEL="gpt-4o-mini"

# Anthropic
ANTHROPIC_API_KEY="sk-ant-your_anthropic_key"
ANTHROPIC_DEFAULT_MODEL="claude-3-haiku-20240307"

# Google Gemini
GOOGLE_GEMINI_API_KEY="AIza_your_gemini_key"
GOOGLE_GEMINI_DEFAULT_MODEL="gemini-1.5-flash"

# Azure OpenAI
AZURE_OPENAI_API_KEY="your_azure_key"
AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
AZURE_OPENAI_DEPLOYMENT="your-deployment-name"
AZURE_OPENAI_API_VERSION="2024-02-15-preview"

# ===================================
# EMAIL SERVICE (Transactional)
# ===================================
RESEND_API_KEY="re_your_resend_api_key"
# OR
SENDGRID_API_KEY="SG.your_sendgrid_api_key"

# ===================================
# REDIS / CACHING
# ===================================
UPSTASH_REDIS_URL="https://your-db.upstash.io"
UPSTASH_REDIS_TOKEN="your_redis_token"

# ===================================
# QUEUE SERVICE (Optional)
# ===================================
QSTASH_URL="https://qstash.upstash.io"
QSTASH_TOKEN="your_qstash_token"
QSTASH_CURRENT_SIGNING_KEY="your_signing_key"
QSTASH_NEXT_SIGNING_KEY="your_next_signing_key"

# ===================================
# MONITORING
# ===================================
# Sentry
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."
SENTRY_AUTH_TOKEN="your_sentry_token"

# Logtail
LOGTAIL_SOURCE_TOKEN="your_logtail_token"

# ===================================
# PAYMENT GATEWAY (Future)
# ===================================
# Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Razorpay
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

# ===================================
# VERCEL (Auto-populated in production)
# ===================================
VERCEL_URL=""  # Auto-set by Vercel
VERCEL_ENV=""  # development | preview | production

# ===================================
# ENCRYPTION (Generate strong keys)
# ===================================
ENCRYPTION_KEY="your_32_byte_encryption_key_for_tokens"
```

---

## 12. Initial Setup Checklist

### Phase 1: Essential (MVP Launch)
- [ ] **Database**
  - [ ] Set up PlanetScale account
  - [ ] Create production database
  - [ ] Get DATABASE_URL
  
- [ ] **Authentication**
  - [ ] Generate NEXTAUTH_SECRET
  - [ ] Set up email provider (Resend/SendGrid)
  - [ ] Test magic link login
  
- [ ] **Meta Integration**
  - [ ] Create Meta Developer app
  - [ ] Configure OAuth settings
  - [ ] Get App ID and Secret
  - [ ] Test with sandbox account
  
- [ ] **Google Ads Integration**
  - [ ] Create Google Cloud project
  - [ ] Enable Google Ads API
  - [ ] Create OAuth credentials
  - [ ] Apply for developer token
  - [ ] Test with test account
  
- [ ] **AI Provider (Minimum 1)**
  - [ ] Choose primary provider (OpenAI recommended)
  - [ ] Create account and get API key
  - [ ] Set usage limits
  - [ ] Test API connection
  
- [ ] **Email Service**
  - [ ] Set up Resend/SendGrid
  - [ ] Verify domain
  - [ ] Test email delivery
  
- [ ] **Redis Cache**
  - [ ] Create Upstash Redis database
  - [ ] Get connection URL and token
  - [ ] Test connection
  
- [ ] **Deployment**
  - [ ] Connect GitHub to Vercel
  - [ ] Set all environment variables
  - [ ] Deploy to production
  - [ ] Configure custom domain

### Phase 2: Monitoring & Reliability
- [ ] **Error Tracking**
  - [ ] Set up Sentry
  - [ ] Install Sentry SDK
  - [ ] Test error reporting
  
- [ ] **Logging**
  - [ ] Set up Logtail
  - [ ] Configure log levels
  
- [ ] **Uptime Monitoring**
  - [ ] Configure UptimeRobot
  - [ ] Set up health check endpoint
  - [ ] Configure alerts

### Phase 3: Advanced Features
- [ ] **Additional AI Providers**
  - [ ] Set up Anthropic Claude
  - [ ] Set up Google Gemini
  - [ ] Configure fallback priority
  
- [ ] **Queue Service**
  - [ ] Set up QStash/Inngest
  - [ ] Configure background jobs
  
- [ ] **Payment Gateway**
  - [ ] Choose Stripe or Razorpay
  - [ ] Complete KYC (if applicable)
  - [ ] Set up products and pricing
  - [ ] Configure webhooks

---

## 13. Security Best Practices

### API Key Management
- ✅ Never commit API keys to Git
- ✅ Use `.env.local` for local development
- ✅ Use Vercel encrypted environment variables for production
- ✅ Rotate keys regularly
- ✅ Set up key expiration alerts
- ✅ Use different keys for development and production

### Encryption
- ✅ Generate strong encryption key:
  ```bash
  openssl rand -base64 32
  ```
- ✅ Store encryption key securely
- ✅ Encrypt sensitive data at rest (OAuth tokens, AI keys)
- ✅ Use HTTPS everywhere

### Access Control
- ✅ Implement proper RBAC
- ✅ Protect admin routes with super admin checks
- ✅ Validate all user inputs
- ✅ Implement rate limiting
- ✅ Add CSRF protection

---

## 14. Cost Estimation (Monthly)

### Minimum Viable Setup
| Service | Tier | Cost |
|---------|------|------|
| Vercel | Hobby | $0 (then $20 for Pro) |
| PlanetScale | Hobby | $0 (then $39 for Scaler) |
| Upstash Redis | Free | $0 |
| Resend | Free | $0 (3k emails) |
| OpenAI | Pay-as-go | ~$10-50 |
| Sentry | Free | $0 (5k errors) |
| UptimeRobot | Free | $0 |
| **Total** | | **~$10-70/month** |

### Production Scale (1000 clients)
| Service | Tier | Cost |
|---------|------|------|
| Vercel | Pro | $20 |
| PlanetScale | Scaler | $39 |
| Upstash Redis | Pay-as-go | ~$10 |
| Resend | Pro | $20 |
| OpenAI/AI | Pay-as-go | ~$200-500 |
| Sentry | Team | $26 |
| **Total** | | **~$315-615/month** |

---

## 15. Support & Documentation Links

### Official Documentation
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **NextAuth**: https://next-auth.js.org
- **Vercel**: https://vercel.com/docs
- **shadcn/ui**: https://ui.shadcn.com

### API Documentation
- **Meta Marketing API**: https://developers.facebook.com/docs/marketing-apis
- **Google Ads API**: https://developers.google.com/google-ads/api
- **OpenAI API**: https://platform.openai.com/docs
- **Anthropic API**: https://docs.anthropic.com
- **Google Gemini**: https://ai.google.dev/docs

### Community
- **Next.js Discord**: https://nextjs.org/discord
- **Prisma Discord**: https://pris.ly/discord
- **Vercel Community**: https://github.com/vercel/vercel/discussions

---

## 16. Troubleshooting Common Issues

### Database Connection Issues
- Check DATABASE_URL format
- Verify network access (Vercel IP whitelisting for PlanetScale)
- Test connection locally with `npx prisma db push`

### OAuth Redirect Issues
- Verify redirect URIs match exactly (http vs https, trailing slash)
- Check domain verification
- Test callback routes independently

### AI Provider Failures
- Verify API keys are active
- Check account balance/credits
- Review rate limits
- Test with curl/Postman first
- Ensure fallback providers are configured

### Email Delivery Issues
- Verify domain DNS records
- Check SPF/DKIM/DMARC settings
- Test with sandbox environment first
- Review bounce logs

---

## Summary

This requirements document provides all necessary information to:
1. Set up development environment
2. Configure all external services
3. Manage API keys and credentials
4. Deploy to production
5. Monitor and maintain the platform

**Next Steps**:
1. Follow the Initial Setup Checklist
2. Refer to dev-task.md for implementation steps
3. Use this document as a reference during development

**Questions?** Refer to the official documentation links or community forums above.
