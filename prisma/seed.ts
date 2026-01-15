import { PrismaClient, Role, InsightType, InsightStatus, PlanTier } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo pricing plans
  const starterPlan = await prisma.pricingPlan.upsert({
    where: { tier: PlanTier.STARTER },
    update: {},
    create: {
      tier: PlanTier.STARTER,
      name: "Starter",
      description: "Perfect for freelancers and small agencies",
      priceMonthly: 2999,
      priceYearly: 29990,
      currency: "INR",
      clientLimit: 5,
      userLimit: 2,
      aiCredits: 50,
      features: [
        "5 client accounts",
        "Google Ads integration",
        "Basic reports",
        "Email support",
      ],
      isActive: true,
    },
  });

  const growthPlan = await prisma.pricingPlan.upsert({
    where: { tier: PlanTier.GROWTH },
    update: {},
    create: {
      tier: PlanTier.GROWTH,
      name: "Growth",
      description: "For growing agencies with multiple clients",
      priceMonthly: 7999,
      priceYearly: 79990,
      currency: "INR",
      clientLimit: 15,
      userLimit: 5,
      aiCredits: 200,
      features: [
        "15 client accounts",
        "Google Ads + Meta integration",
        "AI-powered insights",
        "Custom reports",
        "Priority support",
      ],
      isActive: true,
    },
  });

  await prisma.pricingPlan.upsert({
    where: { tier: PlanTier.SCALE },
    update: {},
    create: {
      tier: PlanTier.SCALE,
      name: "Scale",
      description: "For established agencies at scale",
      priceMonthly: 14999,
      priceYearly: 149990,
      currency: "INR",
      clientLimit: 50,
      userLimit: 15,
      aiCredits: 500,
      features: [
        "50 client accounts",
        "All integrations",
        "Unlimited AI insights",
        "White-label reports",
        "Dedicated support",
        "API access",
      ],
      isActive: true,
    },
  });

  console.log("Created pricing plans");

  // Create demo agency
  const agency = await prisma.agency.upsert({
    where: { id: "demo-agency-001" },
    update: {},
    create: {
      id: "demo-agency-001",
      name: "Demo Marketing Agency",
      plan: PlanTier.GROWTH,
      aiEnabled: true,
      timezone: "Asia/Kolkata",
    },
  });

  console.log("Created demo agency");

  // Create demo admin user
  const hashedPassword = await bcrypt.hash("demo123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "demo@datadrip.io" },
    update: {},
    create: {
      email: "demo@datadrip.io",
      name: "Demo Admin",
      hashedPassword: hashedPassword,
      role: Role.ADMIN,
      agencyId: agency.id,
    },
  });

  // Create super admin for admin panel access
  await prisma.user.upsert({
    where: { email: "admin@datadrip.io" },
    update: {},
    create: {
      email: "admin@datadrip.io",
      name: "Super Admin",
      hashedPassword: hashedPassword,
      role: Role.ADMIN,
      isSuperAdmin: true,
      agencyId: agency.id,
    },
  });

  console.log("Created demo users");

  // Create demo clients
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { id: "client-001" },
      update: {},
      create: {
        id: "client-001",
        name: "TechStart Solutions",
        agencyId: agency.id,
      },
    }),
    prisma.client.upsert({
      where: { id: "client-002" },
      update: {},
      create: {
        id: "client-002",
        name: "Fashion Forward",
        agencyId: agency.id,
      },
    }),
    prisma.client.upsert({
      where: { id: "client-003" },
      update: {},
      create: {
        id: "client-003",
        name: "Local Eats Restaurant",
        agencyId: agency.id,
      },
    }),
  ]);

  console.log("Created demo clients");

  // Create demo campaign metrics (last 14 days)
  const now = new Date();
  const campaigns = [
    { id: "camp-001", name: "Brand Awareness", clientIdx: 0 },
    { id: "camp-002", name: "Lead Generation", clientIdx: 0 },
    { id: "camp-003", name: "Summer Sale", clientIdx: 1 },
    { id: "camp-004", name: "New Collection", clientIdx: 1 },
    { id: "camp-005", name: "Weekend Special", clientIdx: 2 },
  ];

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() - dayOffset);
    date.setHours(0, 0, 0, 0);

    for (const campaign of campaigns) {
      const baseSpend = 1000 + Math.random() * 4000;
      const impressions = Math.floor(baseSpend * (15 + Math.random() * 10));
      const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.03));
      const conversions = Math.floor(clicks * (0.05 + Math.random() * 0.1));
      const spend = Math.round(baseSpend * 100) / 100;
      const roas = conversions > 0 ? (conversions * 500) / spend : 0;

      await prisma.campaignMetric.upsert({
        where: {
          clientId_platform_campaignId_date: {
            clientId: clients[campaign.clientIdx].id,
            platform: "GOOGLE",
            campaignId: campaign.id,
            date: date,
          },
        },
        update: {},
        create: {
          clientId: clients[campaign.clientIdx].id,
          platform: "GOOGLE",
          campaignId: campaign.id,
          date: date,
          spend: spend,
          impressions: impressions,
          clicks: clicks,
          conversions: conversions,
          roas: Math.round(roas * 100) / 100,
          cpa: conversions > 0 ? Math.round((spend / conversions) * 100) / 100 : 0,
        },
      });
    }
  }

  console.log("Created demo campaign metrics");

  // Create demo insights
  const insightTypes: InsightType[] = [
    "PERFORMANCE_ALERT",
    "OPTIMIZATION_OPPORTUNITY",
    "BUDGET_ALERT",
    "AUDIENCE_RECOMMENDATION",
  ];

  const insightTexts = {
    PERFORMANCE_ALERT: "Campaign CTR dropped 12% this week. Consider refreshing ad creatives.",
    OPTIMIZATION_OPPORTUNITY: "Top ad set has 45% higher ROAS. Increase budget allocation.",
    BUDGET_ALERT: "Current pace will exhaust budget 3 days early. Adjust daily caps.",
    AUDIENCE_RECOMMENDATION: "Lookalike audience could expand reach by 180%.",
    CREATIVE_IDEA: "Test new video format based on high-performing competitor content.",
  };

  for (let i = 0; i < clients.length; i++) {
    for (let j = 0; j < 2; j++) {
      const type = insightTypes[(i + j) % insightTypes.length];
      await prisma.insight.create({
        data: {
          clientId: clients[i].id,
          type: type,
          payload: {
            recommendation: insightTexts[type],
            summary: `Client ${clients[i].name} performance data`,
          },
          impactScore: 65 + Math.floor(Math.random() * 25),
          status: InsightStatus.PENDING,
          aiProvider: "DataDrip AI",
          aiModel: "mock-v1",
        },
      });
    }
  }

  console.log("Created demo insights");

  // Create a demo report
  await prisma.report.create({
    data: {
      clientId: clients[0].id,
      periodStart: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      periodEnd: now,
      summary: "Weekly performance report for TechStart Solutions",
      channelData: {
        google: {
          spend: 15420.50,
          impressions: 245000,
          clicks: 6125,
          conversions: 312,
          roas: 3.2,
        },
      },
      reportHtml: "<h1>Weekly Report</h1><p>Your campaigns performed well this week.</p>",
    },
  });

  console.log("Created demo report");

  console.log("\n========================================");
  console.log("Demo data seeded successfully!");
  console.log("========================================\n");
  console.log("Demo Accounts:");
  console.log("  Agency Admin: demo@datadrip.io / demo123");
  console.log("  Super Admin:  admin@datadrip.io / demo123");
  console.log("\nDemo Clients:");
  clients.forEach((c) => console.log(`  - ${c.name}`));
  console.log("\n");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
