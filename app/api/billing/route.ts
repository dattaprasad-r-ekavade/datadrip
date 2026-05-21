import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PricingService } from "@/lib/services/pricing";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { agencyId: true },
    });

    if (!user?.agencyId) {
      return NextResponse.json({ error: "No agency associated with user" }, { status: 400 });
    }

    // Fetch agency with clients, users, invoices
    const agency = await prisma.agency.findUnique({
      where: { id: user.agencyId },
      include: {
        users: {
          select: { id: true },
        },
        clients: {
          select: { id: true },
        },
        invoices: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!agency) {
      return NextResponse.json({ error: "Agency not found" }, { status: 404 });
    }

    // Get current plan config
    const currentPlanConfig = await PricingService.getPlanForAgency({ plan: agency.plan });
    const allActivePlans = await PricingService.listActive();

    // Map active plans for the frontend view
    const formattedPlans = allActivePlans.map((p) => ({
      id: p.tier.toLowerCase(),
      tier: p.tier,
      name: p.name,
      price: Number(p.priceMonthly),
      period: p.billingInterval || "month",
      description: p.description || "",
      features: Array.isArray(p.features) ? (p.features as string[]) : [],
      popular: p.tier === "GROWTH",
      clientLimit: p.clientLimit,
      userLimit: p.userLimit,
      aiCredits: p.aiCredits,
    }));

    return NextResponse.json({
      agency: {
        id: agency.id,
        name: agency.name,
        plan: agency.plan,
        planExpiry: agency.planExpiry,
        billingStatus: agency.billingStatus,
        aiCreditsBalance: agency.aiCreditsBalance,
        gstin: agency.gstin,
        billingAddress: agency.billingAddress,
      },
      currentPlanConfig: currentPlanConfig ? {
        name: currentPlanConfig.name,
        price: Number(currentPlanConfig.priceMonthly),
        clientLimit: currentPlanConfig.clientLimit,
        userLimit: currentPlanConfig.userLimit,
        aiCredits: currentPlanConfig.aiCredits,
      } : null,
      stats: {
        clientsUsed: agency.clients.length,
        usersUsed: agency.users.length,
      },
      invoices: agency.invoices.map((inv) => ({
        id: inv.orderId,
        date: new Date(inv.createdAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        amount: Number(inv.amount),
        status: inv.status,
        planTier: inv.planTier,
      })),
      plans: formattedPlans,
    });
  } catch (error) {
    console.error("Failed to fetch billing info:", error);
    return NextResponse.json({ error: "Failed to fetch billing details" }, { status: 500 });
  }
}
