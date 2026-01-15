import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PricingService, CreatePricingPlanInput } from "@/lib/services/pricing";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const plans = await PricingService.list();
  return NextResponse.json({ plans });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as CreatePricingPlanInput;
    const plan = await PricingService.create(body);
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Failed to create pricing plan:", error);
    return NextResponse.json({ error: "Failed to create pricing plan" }, { status: 400 });
  }
}
