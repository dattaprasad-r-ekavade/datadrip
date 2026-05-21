import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { CashfreeService } from "@/lib/services/cashfree";
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
      select: { id: true, email: true, name: true, agencyId: true },
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

    const amount = Number(plan.priceMonthly);
    const orderId = `cf_${Date.now()}_${user.agencyId.slice(-6)}`;

    // Create a pending Invoice record in our database
    await prisma.invoice.create({
      data: {
        agencyId: user.agencyId,
        orderId: orderId,
        amount: plan.priceMonthly,
        status: "PENDING",
        planTier: planTier,
      },
    });

    // Determine base redirect URL
    const origin = request.nextUrl.origin;
    const returnUrl = `${origin}/api/billing/verify?order_id={order_id}`;

    // Call Cashfree API to create the order session
    const cfOrder = await CashfreeService.createOrder(
      orderId,
      amount,
      {
        customerId: user.id,
        customerPhone: "9999999999", // Dummy phone, required by Cashfree
        customerEmail: user.email,
        customerName: user.name || "Agency Admin",
      },
      returnUrl
    );

    return NextResponse.json({
      paymentSessionId: cfOrder.payment_session_id,
      orderId: cfOrder.order_id,
      cfEnv: env.CASHFREE_ENV,
    });
  } catch (error) {
    console.error("Billing checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to initiate checkout" },
      { status: 500 }
    );
  }
}
