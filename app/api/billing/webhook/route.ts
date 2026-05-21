import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const timestamp = request.headers.get("x-webhook-timestamp");
    const signature = request.headers.get("x-webhook-signature");

    if (!timestamp || !signature) {
      console.warn("Webhook received without timestamp or signature headers.");
      return NextResponse.json({ error: "Missing signatures" }, { status: 400 });
    }

    // Determine Client Secret for verification
    const clientSecret = env.CASHFREE_CLIENT_SECRET || "TESTa438259db1451f28b2deea31a0e8d08cb5ee0a3a";

    // Recreate Cashfree signature: Base64(HMAC-SHA256(timestamp + rawBody, clientSecret))
    const expectedSignature = crypto
      .createHmac("sha256", clientSecret)
      .update(timestamp + rawBody)
      .digest("base64");

    if (signature !== expectedSignature) {
      console.warn("Invalid Cashfree webhook signature received.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // Only process successful payment events
    if (payload.type === "PAYMENT_SUCCESS_WEBHOOK") {
      const data = payload.data;
      const orderId = data?.order?.order_id;
      const paymentStatus = data?.payment?.payment_status;

      if (orderId && paymentStatus === "SUCCESS") {
        const invoice = await prisma.invoice.findUnique({
          where: { orderId },
        });

        if (invoice && invoice.status !== "PAID") {
          // Update Invoice status
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: "PAID" },
          });

          // Retrieve plan limits
          const plan = await prisma.pricingPlan.findUnique({
            where: { tier: invoice.planTier },
          });

          // Set 30 days expiry
          const newExpiry = new Date();
          newExpiry.setDate(newExpiry.getDate() + 30);

          // Update Agency subscription
          await prisma.agency.update({
            where: { id: invoice.agencyId },
            data: {
              plan: invoice.planTier,
              planExpiry: newExpiry,
              billingStatus: "ACTIVE",
              aiCreditsBalance: plan?.aiCredits ?? 50,
            },
          });

          console.log(`Webhook: Successfully activated agency plan ${invoice.planTier} for order ${orderId}`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
