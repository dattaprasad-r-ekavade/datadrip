# Admin Features Quick Reference

## Overview
This guide provides a quick reference for all admin-specific features in the DataDrip platform.

---

## 🔐 Admin Access

### Super Admin Role
- **Field**: `User.isSuperAdmin` (boolean)
- **Access**: Platform-wide configuration and settings
- **Routes**: `/admin/*`
- **Middleware**: `requireSuperAdmin()` guard

### How to Create First Super Admin
```typescript
// In Prisma Studio or seed script
await prisma.user.update({
  where: { email: 'your@email.com' },
  data: { isSuperAdmin: true }
});
```

---

## 🤖 AI Provider Management

### Admin Panel Location
`/admin/ai-providers`

### Available Actions

#### 1. Add AI Provider
**Route**: `POST /api/admin/ai-providers`

**Required Fields**:
- `name`: Display name (e.g., "OpenAI Production")
- `provider`: One of `OPENAI`, `ANTHROPIC`, `GOOGLE_GEMINI`, `AZURE_OPENAI`
- `apiKey`: Provider API key (automatically encrypted)
- `model`: Model name (e.g., "gpt-4o-mini")
- `priority`: Lower number = higher priority (1 = primary)

**Optional Fields**:
- `config`: JSON for provider-specific settings
- `isActive`: Enable/disable provider (default: true)

**Example**:
```json
{
  "name": "OpenAI - Production",
  "provider": "OPENAI",
  "apiKey": "sk-...",
  "model": "gpt-4o-mini",
  "priority": 1,
  "isActive": true
}
```

#### 2. Test Provider Connection
**Route**: `POST /api/admin/ai-providers/:id/test`

**What it does**:
- Makes a simple API call to the provider
- Verifies API key validity
- Checks model availability
- Returns success/failure status

**Use case**: Test before activating a new provider

#### 3. Update Provider
**Route**: `PATCH /api/admin/ai-providers/:id`

**Common updates**:
- Switch models (e.g., GPT-4o-mini → GPT-4o)
- Change priority order
- Update API keys (key rotation)
- Toggle active status

#### 4. Delete Provider
**Route**: `DELETE /api/admin/ai-providers/:id`

**Safety check**: Cannot delete if it's the only active provider

#### 5. View Provider Usage
**Dashboard**: Shows per-provider metrics
- Total API calls
- Success rate
- Average response time
- Cost estimation
- Error rate

---

## 💰 Pricing Plan Management

### Admin Panel Location
`/admin/pricing`

### Available Actions

#### 1. Create Pricing Plan
**Route**: `POST /api/admin/pricing`

**Required Fields**:
```typescript
{
  tier: 'STARTER' | 'GROWTH' | 'SCALE' | 'CUSTOM',
  name: string,              // "Starter Plan"
  price: number,             // 999.00
  currency: string,          // "INR" or "USD"
  billingInterval: string,   // "monthly" or "yearly"
  features: {                // JSON object
    "reporting": true,
    "ai_insights": true,
    "api_access": false
  },
  limits: {                  // JSON object
    "max_clients": 10,
    "max_users": 3,
    "ai_calls_per_month": 1000
  },
  isActive: boolean          // Show on pricing page?
}
```

**Example - Starter Plan**:
```json
{
  "tier": "STARTER",
  "name": "Starter",
  "price": 999,
  "currency": "INR",
  "billingInterval": "monthly",
  "features": {
    "clients": "Up to 10 clients",
    "users": "3 team members",
    "reports": "Daily automated reports",
    "ai_insights": "100 AI insights/month",
    "integrations": "Meta & Google Ads",
    "support": "Email support"
  },
  "limits": {
    "max_clients": 10,
    "max_users": 3,
    "max_ai_calls": 100
  },
  "isActive": true
}
```

#### 2. Update Pricing Plan
**Route**: `PATCH /api/admin/pricing/:tier`

**Common updates**:
- Adjust pricing (market testing)
- Modify feature list
- Change limits
- Seasonal pricing (add discount fields)

**Important**: Changes affect new subscriptions immediately

#### 3. Deactivate Plan
**Route**: `PATCH /api/admin/pricing/:tier`
```json
{ "isActive": false }
```

**Effect**: 
- Removed from public pricing page
- Existing customers keep their plan
- Cannot be assigned to new agencies

#### 4. View Plan Analytics
**Dashboard shows**:
- Total agencies per plan
- Monthly recurring revenue per plan
- Conversion rates
- Upgrade/downgrade patterns

---

## ⚙️ System Configuration

### Admin Panel Location
`/admin/config`

### Key-Value Configuration Store

**Use cases**:
- Feature flags
- Global settings
- System limits
- Maintenance mode

#### Common Configurations

**1. Feature Flags**:
```json
{
  "key": "features.ai_insights_enabled",
  "value": true,
  "description": "Global AI insights feature flag"
}
```

**2. Rate Limits**:
```json
{
  "key": "rate_limits.api_calls_per_minute",
  "value": 60,
  "description": "API rate limit per user"
}
```

**3. Maintenance Mode**:
```json
{
  "key": "system.maintenance_mode",
  "value": {
    "enabled": false,
    "message": "Scheduled maintenance from 2am-4am UTC"
  },
  "description": "Maintenance mode configuration"
}
```

**4. Default AI Provider**:
```json
{
  "key": "ai.default_provider",
  "value": "openai",
  "description": "Fallback when no provider priority set"
}
```

---

## 🏢 Agency Management (Admin View)

### Admin Panel Location
`/admin/agencies`

### Admin-Specific Actions

#### 1. Toggle AI for Agency
**Route**: `PATCH /api/admin/agencies/:id`
```json
{ "aiEnabled": true }
```

**Use cases**:
- Disable AI for free tier
- Trial period management
- Cost control
- Feature rollout

#### 2. Override Plan Limits
**Route**: `PATCH /api/admin/agencies/:id/limits`

**Example**: Grant exception for large client
```json
{
  "customLimits": {
    "max_clients": 100,  // Override default 10
    "max_users": 20,     // Override default 3
    "max_ai_calls": 5000 // Override default 100
  }
}
```

#### 3. View Agency Usage
**Dashboard shows**:
- Current plan and limits
- Usage vs limits
- AI feature status
- Connected platforms
- Last active date

---

## 📊 Admin Dashboard Widgets

### 1. Platform Stats
- Total agencies
- Total clients managed
- Active users
- Revenue (MRR/ARR)

### 2. AI Provider Health
- Active providers
- Success rates
- Average response times
- Cost per insight

### 3. System Health
- API response times
- Error rates
- Queue status
- Database performance

### 4. Recent Activity
- New agency signups
- Plan upgrades/downgrades
- AI provider errors
- System configuration changes

---

## 🔒 Security Features

### API Key Encryption

**Stored encrypted**:
- AI provider API keys
- OAuth tokens
- Payment gateway keys

**Encryption method**: AES-256
**Key storage**: Environment variable `ENCRYPTION_KEY`

**Generate encryption key**:
```bash
openssl rand -base64 32
```

### Audit Logging

**All admin actions logged**:
- Who made the change
- What was changed
- Previous value
- Timestamp
- IP address

**View audit logs**: `/admin/audit-logs`

### API Key Masking

**In UI**: `sk-...abc123` → `sk-...***123`
**In logs**: Keys never logged in plain text
**In API**: Keys never returned in responses

---

## 🛠️ Common Admin Workflows

### Workflow 1: Add New AI Provider

1. Navigate to `/admin/ai-providers`
2. Click "Add Provider"
3. Fill in details:
   - Name: "OpenAI - Backup"
   - Provider: OPENAI
   - API Key: sk-...
   - Model: gpt-4o-mini
   - Priority: 2 (backup to primary)
4. Click "Test Connection"
5. If successful, click "Save"
6. Provider is now active as fallback

### Workflow 2: Change Pricing

1. Navigate to `/admin/pricing`
2. Select plan to edit (e.g., GROWTH)
3. Update price: 2999 → 3499
4. Update features if needed
5. Click "Save"
6. Change is live immediately for new customers
7. Existing customers unaffected

### Workflow 3: Disable AI for Agency

1. Navigate to `/admin/agencies`
2. Search for agency
3. Click "Settings"
4. Toggle "AI Features" to OFF
5. Click "Save"
6. Agency no longer generates AI insights
7. Usage tracking reflects zero AI calls

### Workflow 4: Handle AI Provider Failure

1. Receive alert: "OpenAI provider failing"
2. Check `/admin/ai-providers` dashboard
3. See: OpenAI success rate dropped to 20%
4. Option A: Switch primary to Anthropic
   - Update OpenAI priority: 1 → 3
   - Update Anthropic priority: 2 → 1
5. Option B: Add new provider as primary
   - Add Google Gemini with priority 1
6. System automatically uses new primary
7. Investigate OpenAI issue (quota/outage)

### Workflow 5: Create Custom Enterprise Plan

1. Navigate to `/admin/pricing`
2. Click "Create Plan"
3. Select tier: CUSTOM
4. Set details:
   - Name: "Enterprise - Acme Corp"
   - Price: 49999
   - Custom features and limits
5. Save plan
6. Assign to specific agency manually
7. Plan not shown on public pricing page

---

## 📱 Admin Mobile Access

**Responsive admin panel**:
- View-only on mobile recommended
- Critical actions: AI provider toggle, pricing changes
- Full features on tablet/desktop

**Mobile-optimized views**:
- Dashboard stats
- Provider status
- Recent alerts
- Quick toggles

---

## 🚨 Alerts & Notifications

### Auto-Generated Alerts

**AI Provider Issues**:
- Success rate drops below 80%
- Average response time > 10s
- Provider returns 429 (rate limit)
- API key invalid/expired

**System Issues**:
- Database connection failures
- Queue backlog > 1000 jobs
- Disk space low
- Memory usage high

**Business Alerts**:
- New agency signup
- Plan upgrade
- Payment failure
- Usage limit exceeded

**Configuration**:
- Email notifications
- Slack webhooks
- SMS for critical alerts (optional)

---

## 🧪 Testing Admin Features

### Test AI Provider
```bash
curl -X POST https://yourapp.com/api/admin/ai-providers/test \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "OPENAI",
    "apiKey": "sk-...",
    "model": "gpt-4o-mini"
  }'
```

### Test Pricing Enforcement
1. Create test agency
2. Assign STARTER plan (limit: 10 clients)
3. Try to add 11th client
4. Should see: "Plan limit reached. Upgrade to add more clients."

### Test AI Toggle
1. Create test agency with AI enabled
2. Verify insights generating
3. Disable AI via admin panel
4. Verify no new insights generated
5. Re-enable AI
6. Verify insights resume

---

## 📖 Admin Best Practices

### AI Provider Management
✅ **Do**:
- Keep at least 2 active providers for redundancy
- Test providers before making primary
- Monitor costs and adjust priorities
- Rotate API keys quarterly
- Document provider-specific quirks

❌ **Don't**:
- Delete all providers (system will break)
- Share provider API keys
- Use personal API keys for production
- Ignore failed provider alerts

### Pricing Management
✅ **Do**:
- Test pricing changes in staging first
- Document reasons for pricing changes
- Grandfather existing customers when increasing prices
- A/B test new pricing tiers
- Monitor conversion rates after changes

❌ **Don't**:
- Change pricing without customer communication
- Remove features from existing plans
- Set limits lower than customer current usage
- Make frequent drastic changes

### System Configuration
✅ **Do**:
- Document all configuration keys
- Use version control for config changes
- Test changes in preview environment
- Have rollback plan
- Set up alerts for critical configs

❌ **Don't**:
- Change configs without understanding impact
- Use production for testing configs
- Delete configs without verification
- Bypass audit logging

---

## 🆘 Troubleshooting

### Issue: AI Provider Not Working

**Check**:
1. Is provider active? (`isActive: true`)
2. Is API key valid? (Test connection)
3. Is account funded? (Check provider dashboard)
4. Is rate limit exceeded? (Check error logs)
5. Is fallback working? (Check next priority)

**Solution**: Update API key or switch to backup provider

### Issue: Pricing Not Updating

**Check**:
1. Is plan marked as active?
2. Is cache cleared? (Redis)
3. Is database updated? (Check Prisma Studio)
4. Is correct tier selected?

**Solution**: Clear Redis cache, verify database

### Issue: Agency Can't Access AI

**Check**:
1. Is `agency.aiEnabled = true`?
2. Is at least one AI provider active?
3. Is usage limit exceeded?
4. Is plan tier allowed AI features?

**Solution**: Check agency settings, verify provider status

---

## 📚 Related Documentation

- **Setup Guide**: `requirements.md` - External service configuration
- **Implementation**: `dev-task.md` - Development tasks for admin features
- **Architecture**: `technical-plan.md` - System design and data models
- **API Reference**: `/docs/api` - Admin API endpoints (when built)

---

**Last Updated**: October 26, 2025
**For**: DataDrip MVP v1.0
**Target Audience**: Super Admins, System Operators
