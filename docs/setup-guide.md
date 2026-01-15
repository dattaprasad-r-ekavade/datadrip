# DataDrip Setup Guide
## Google Ads + AI Provider Configuration

Follow these steps to get your MVP running with real Google Ads data.

---

## Step 1: Google Cloud Project Setup

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the project dropdown at the top → **New Project**
3. Name: `DataDrip` (or any name)
4. Click **Create**
5. Wait for project creation, then select it

### 1.2 Enable Google Ads API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Ads API"
3. Click on it → Click **Enable**

### 1.3 Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. If prompted, configure OAuth consent screen first:
   - User Type: **External**
   - App name: `DataDrip`
   - User support email: your email
   - Developer contact: your email
   - Click **Save and Continue** through all steps
   - Add test users: your Gmail address
4. Back to Credentials → **+ Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Name: `DataDrip Web Client`
7. Authorized redirect URIs: Add these:
   ```
   http://localhost:3000/api/integrations/google-ads/callback
   ```
8. Click **Create**
9. **Copy the Client ID and Client Secret** - you'll need these!

---

## Step 2: Google Ads Developer Token

### 2.1 Access Google Ads API Center

1. Go to [Google Ads](https://ads.google.com)
2. Log in with an account that has a Google Ads account (even if empty)
3. Click the **Tools & Settings** icon (wrench) in the top right
4. Under **Setup**, click **API Center**

### 2.2 Get Developer Token

1. If you don't see API Center, you may need to create a Manager Account:
   - Go to [Google Ads Manager Accounts](https://ads.google.com/home/tools/manager-accounts/)
   - Create a manager account
   - Then access API Center from there

2. In API Center:
   - You'll see a **Developer Token**
   - For testing, this token has "Test Account" access level
   - **Copy this token**

> **Note:** Test tokens only work with test accounts. For real data, you need to apply for Basic Access (takes 1-2 business days to approve).

### 2.3 Apply for Basic Access (Recommended)

1. In API Center, click **Apply for Basic Access**
2. Fill out the form:
   - Describe your app: "Marketing analytics dashboard for agencies"
   - How you'll use the API: "Read campaign performance data"
3. Submit and wait for approval (usually 1-2 days)

---

## Step 3: AI Provider Setup (Choose One)

### Option A: OpenAI (Recommended for Start)

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys** → **Create new secret key**
4. Copy the key (starts with `sk-`)
5. Add credits ($5-10 is enough for testing)

### Option B: Anthropic (Claude)

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys** → Create key
4. Copy the key

### Option C: Google Gemini

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Create API Key**
3. Copy the key

---

## Step 4: Update Your .env.local

Open `D:\datadrip\.env.local` and update with your values:

```env
# Database (keep as is for local dev)
DATABASE_URL="file:./prisma/dev.db"

# NextAuth (already configured)
NEXTAUTH_SECRET="Lkj2FdSsEnWQlQf3wLpA/Jc58Dq6tTnUMhDWTCTlAAw="
NEXTAUTH_URL="http://localhost:3000"

# Token encryption (already configured)
TOKEN_ENCRYPTION_KEY="Lkj2FdSsEnWQlQf3wLpA/Jc58Dq6tTnUMhDWTCTlAAw="
OAUTH_STATE_SECRET="dev-oauth-state-secret"

# Meta OAuth (SKIP FOR NOW - we're doing Google only)
META_APP_ID="skip-for-mvp"
META_APP_SECRET="skip-for-mvp"
META_REDIRECT_URI="http://localhost:3000/api/integrations/meta/callback"
META_API_VERSION="v19.0"
META_SCOPES="ads_read,ads_management,business_management"

# Google Ads OAuth - UPDATE THESE!
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID_HERE"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET_HERE"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/integrations/google-ads/callback"
GOOGLE_ADS_DEVELOPER_TOKEN="YOUR_DEVELOPER_TOKEN_HERE"

# Cron
CRON_SECRET="dev-cron-secret"
```

---

## Step 5: Add AI Provider via Admin Panel

After setup, you'll configure AI provider through the app:

1. Start the app: `npm run dev`
2. Create an account / login
3. Go to `/admin/ai-providers`
4. Add your AI provider:
   - Provider: OpenAI (or your choice)
   - API Key: Your key
   - Model: `gpt-4o-mini` (cheap and good)
   - Enable it

---

## Step 6: Test the Setup

### 6.1 Start the App

```bash
cd D:\datadrip
npm run dev
```

### 6.2 Create First User

1. Go to http://localhost:3000/login
2. Click "Sign Up" (if available) or register
3. Check the database for the user

### 6.3 Test Google OAuth

1. Create a client in the dashboard
2. Click "Connect Google Ads"
3. You should be redirected to Google
4. Authorize the app
5. Should redirect back with account connected

---

## Troubleshooting

### "redirect_uri_mismatch" Error
- Make sure the redirect URI in Google Cloud Console EXACTLY matches:
  `http://localhost:3000/api/integrations/google-ads/callback`
- No trailing slash!

### "Access blocked: This app's request is invalid"
- Go to OAuth consent screen in Google Cloud
- Make sure your email is added as a test user
- App might be in "Testing" mode

### "Developer token is not approved"
- You're using a test token with a non-test account
- Either use a test account or wait for Basic Access approval

### No campaigns showing
- Make sure the Google Ads account has active campaigns
- Check the sync logs in console

---

## Quick Reference

| Item | Where to Get |
|------|--------------|
| Google Client ID | Google Cloud Console → Credentials |
| Google Client Secret | Google Cloud Console → Credentials |
| Developer Token | Google Ads → Tools → API Center |
| OpenAI API Key | platform.openai.com → API Keys |

---

## Next Steps

Once setup is complete:
1. Test the full flow (create client → connect Google → sync → view data)
2. Move to Phase 2: Hide Meta integration from UI
3. Create demo seed data
4. Deploy to Vercel for investor demos
