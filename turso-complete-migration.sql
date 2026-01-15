-- Combined migration for Turso - Copy and paste this entire file into Turso SQL editor

-- Migration 0001_init
-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "hashedPassword" TEXT,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "agencyId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Agency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "plan" TEXT NOT NULL DEFAULT 'STARTER',
    "aiEnabled" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agencyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Client_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "MetaAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "tokenExpiry" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MetaAccount_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "GoogleAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenExpiry" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GoogleAccount_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "CampaignMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "spend" DECIMAL NOT NULL,
    "impressions" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL,
    "conversions" DECIMAL NOT NULL,
    "roas" DECIMAL,
    "cpa" DECIMAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CampaignMetric_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "channelData" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "reportHtml" TEXT NOT NULL,
    "sentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Report_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Insight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "impactScore" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "aiProvider" TEXT,
    "aiModel" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME,
    CONSTRAINT "Insight_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AIProvider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "model" TEXT,
    "projectId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PricingPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceMonthly" DECIMAL NOT NULL,
    "priceYearly" DECIMAL,
    "clientLimit" INTEGER,
    "userLimit" INTEGER,
    "aiCredits" INTEGER,
    "features" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "SystemConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updatedById" TEXT,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SystemConfig_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Invitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "agencyId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "acceptedAt" DATETIME,
    "invitedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Invitation_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Invitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "MetaAccount_clientId_key" ON "MetaAccount"("clientId");
CREATE UNIQUE INDEX IF NOT EXISTS "GoogleAccount_clientId_key" ON "GoogleAccount"("clientId");
CREATE UNIQUE INDEX IF NOT EXISTS "CampaignMetric_clientId_platform_campaignId_date_key" ON "CampaignMetric"("clientId", "platform", "campaignId", "date");
CREATE UNIQUE INDEX IF NOT EXISTS "SystemConfig_key_key" ON "SystemConfig"("key");
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX IF NOT EXISTS "Invitation_token_key" ON "Invitation"("token");
CREATE INDEX IF NOT EXISTS "Invitation_agencyId_idx" ON "Invitation"("agencyId");

-- Update PricingPlan table (if needed for second migration)
-- Note: This assumes table is empty or we're creating it fresh
DROP TABLE IF EXISTS "PricingPlan";
CREATE TABLE "PricingPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceMonthly" DECIMAL NOT NULL,
    "priceYearly" DECIMAL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "billingInterval" TEXT NOT NULL DEFAULT 'monthly',
    "clientLimit" INTEGER,
    "userLimit" INTEGER,
    "aiCredits" INTEGER,
    "features" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "PricingPlan_tier_key" ON "PricingPlan"("tier");
