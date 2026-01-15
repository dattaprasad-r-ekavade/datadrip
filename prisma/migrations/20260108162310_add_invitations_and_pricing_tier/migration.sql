/*
  Warnings:

  - Added the required column `tier` to the `PricingPlan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Invitation" (
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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PricingPlan" (
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
INSERT INTO "new_PricingPlan" ("aiCredits", "clientLimit", "createdAt", "description", "features", "id", "isActive", "name", "priceMonthly", "priceYearly", "updatedAt", "userLimit") SELECT "aiCredits", "clientLimit", "createdAt", "description", "features", "id", "isActive", "name", "priceMonthly", "priceYearly", "updatedAt", "userLimit" FROM "PricingPlan";
DROP TABLE "PricingPlan";
ALTER TABLE "new_PricingPlan" RENAME TO "PricingPlan";
CREATE UNIQUE INDEX "PricingPlan_tier_key" ON "PricingPlan"("tier");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");

-- CreateIndex
CREATE INDEX "Invitation_agencyId_idx" ON "Invitation"("agencyId");
