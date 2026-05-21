import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PlanTier } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { planTier } = body as { planTier: PlanTier };

    if (!planTier || !["STARTER", "GROWTH", "SCALE"].includes(planTier)) {
      return NextResponse.json({ error: "Invalid plan tier" }, { status: 400 });
    }

    // Fetch user and agency
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, agencyId: true },
    });

    if (!user?.agencyId) {
      return NextResponse.json({ error: "User is not associated with any agency" }, { status: 400 });
    }

    // Fetch plan details from database
    const plan = await prisma.pricingPlan.findUnique({
      where: { tier: planTier },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found in database" }, { status: 404 });
    }

    const orderId = `beta_${Date.now()}_${user.agencyId.slice(-6)}`;

    // Create a PAID Invoice record in our database with 0 amount
    await prisma.invoice.create({
      data: {
        agencyId: user.agencyId,
        orderId: orderId,
        amount: 0, // Free beta access
        status: "PAID",
        planTier: planTier,
      },
    });

    // Calculate expiration date (30 days from now)
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 30);

    // Update Agency subscription details directly
    const updatedAgency = await prisma.agency.update({
      where: { id: user.agencyId },
      data: {
        plan: planTier,
        planExpiry: newExpiry,
        billingStatus: "ACTIVE",
        aiCreditsBalance: plan.aiCredits ?? 50,
      },
    });

    return NextResponse.json({
      success: true,
      agency: {
        plan: updatedAgency.plan,
        planExpiry: updatedAgency.planExpiry,
        aiCreditsBalance: updatedAgency.aiCreditsBalance,
      },
    });
  } catch (error) {
    console.error("Free beta activation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to activate free beta subscription" },
      { status: 500 }
    );
  }
}
