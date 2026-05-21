import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CashfreeService } from "@/lib/services/cashfree";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order_id");

  const origin = request.nextUrl.origin;

  if (!orderId) {
    return NextResponse.redirect(`${origin}/dashboard/billing?status=failed&reason=missing_order_id`);
  }

  try {
    // 1. Verify payment status with Cashfree
    const cfOrder = await CashfreeService.verifyOrder(orderId);

    if (cfOrder.order_status === "PAID") {
      // 2. Fetch the corresponding invoice
      const invoice = await prisma.invoice.findUnique({
        where: { orderId },
      });

      if (!invoice) {
        console.error(`Invoice for order_id ${orderId} not found in database.`);
        return NextResponse.redirect(`${origin}/dashboard/billing?status=failed&reason=invoice_not_found`);
      }

      // 3. Update invoice status to PAID if not already done
      if (invoice.status !== "PAID") {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: "PAID" },
        });

        // 4. Retrieve plan limits
        const plan = await prisma.pricingPlan.findUnique({
          where: { tier: invoice.planTier },
        });

        // 5. Calculate new expiration date (30 days from now)
        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + 30);

        // 6. Update Agency subscription details
        await prisma.agency.update({
          where: { id: invoice.agencyId },
          data: {
            plan: invoice.planTier,
            planExpiry: newExpiry,
            billingStatus: "ACTIVE",
            aiCreditsBalance: plan?.aiCredits ?? 50, // Allocate credits from the plan
          },
        });
      }

      return NextResponse.redirect(`${origin}/dashboard/billing?status=success`);
    } else {
      // Payment is not completed or failed
      await prisma.invoice.update({
        where: { orderId },
        data: { status: "FAILED" },
      }).catch((err) => console.error("Failed to mark invoice as failed:", err));

      return NextResponse.redirect(
        `${origin}/dashboard/billing?status=failed&reason=${cfOrder.order_status.toLowerCase()}`
      );
    }
  } catch (error) {
    console.error("Payment verification redirect error:", error);
    return NextResponse.redirect(`${origin}/dashboard/billing?status=error`);
  }
}
