#!/usr/bin/env tsx
/**
 * Setup script to initialize Turso database with schema and seed data
 * Run with: npx tsx scripts/setup-turso.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { hash } from "bcryptjs";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function runMigrations(prisma: PrismaClient) {
  console.log("📋 Running migrations...\n");

  // Read and execute first migration
  const migration1 = fs.readFileSync(
    path.resolve(process.cwd(), "prisma/migrations/0001_init/migration.sql"),
    "utf-8"
  );

  // Remove comments and split properly
  const cleanedMigration1 = migration1
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  console.log(`  Running 0001_init migration...`);
  try {
    await prisma.$executeRawUnsafe(cleanedMigration1);
    console.log("  ✓ 0001_init complete");
  } catch (err: any) {
    console.error("  ✗ Error running migration:", err.message);
  }

  // Read and execute second migration
  const migration2 = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "prisma/migrations/20260108162310_add_invitations_and_pricing_tier/migration.sql"
    ),
    "utf-8"
  );

  // Remove comments
  const cleanedMigration2 = migration2
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  console.log(`  Running 20260108162310_add_invitations_and_pricing_tier migration...`);
  try {
    await prisma.$executeRawUnsafe(cleanedMigration2);
    console.log("  ✓ 20260108162310_add_invitations_and_pricing_tier complete\n");
  } catch (err: any) {
    console.log(`    Note: ${err.message}\n`);
  }
}

async function main() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (!tursoUrl || !tursoToken) {
    console.error("❌ TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
    process.exit(1);
  }

  console.log("🔗 Connecting to Turso database...");
  console.log(`   URL: ${tursoUrl}`);

  const adapter = new PrismaLibSql({
    url: tursoUrl,
    authToken: tursoToken,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Connected to Turso successfully\n");

    // Run migrations first
    await runMigrations(prisma);

    // Check if User table exists and has data
    try {
      const userCount = await prisma.user.count();
      if (userCount > 0) {
        console.log(`ℹ️  Database already has ${userCount} users. Skipping seed.`);
        console.log("   To reseed, manually truncate tables first.");
        return;
      }
    } catch (err) {
      console.log("ℹ️  Tables don't exist yet or are empty. Will create seed data.");
    }

    console.log("🌱 Creating seed data...\n");

    // Create agencies
    console.log("Creating agencies...");
    const demoAgency = await prisma.agency.create({
      data: {
        name: "Demo Marketing Agency",
      },
    });
    console.log(`  ✓ Created agency: ${demoAgency.name}`);

    // Create users
    console.log("\nCreating users...");
    const hashedPassword = await hash("demo123", 10);

    const superAdmin = await prisma.user.create({
      data: {
        email: "admin@datadrip.io",
        name: "Super Admin",
        hashedPassword: hashedPassword,
        role: "SUPER_ADMIN",
        isSuperAdmin: true,
      },
    });
    console.log(`  ✓ Created super admin: ${superAdmin.email}`);

    const agencyAdmin = await prisma.user.create({
      data: {
        email: "demo@datadrip.io",
        name: "Demo Agency Admin",
        hashedPassword: hashedPassword,
        role: "ADMIN",
        agencyId: demoAgency.id,
      },
    });
    console.log(`  ✓ Created agency admin: ${agencyAdmin.email}`);

    // Create demo clients
    console.log("\nCreating demo clients...");
    const client1 = await prisma.client.create({
      data: {
        name: "Fashion Boutique Co.",
        agencyId: demoAgency.id,
        industry: "Retail",
        website: "https://fashionboutique.example.com",
      },
    });
    console.log(`  ✓ Created client: ${client1.name}`);

    const client2 = await prisma.client.create({
      data: {
        name: "TechStart Inc.",
        agencyId: demoAgency.id,
        industry: "Technology",
        website: "https://techstart.example.com",
      },
    });
    console.log(`  ✓ Created client: ${client2.name}`);

    console.log("\n✅ Turso database setup complete!\n");
    console.log("Login credentials:");
    console.log("  Agency Admin: demo@datadrip.io / demo123");
    console.log("  Super Admin:  admin@datadrip.io / demo123");
  } catch (error) {
    console.error("\n❌ Error setting up Turso:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
