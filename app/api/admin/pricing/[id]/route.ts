import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PricingService, UpdatePricingPlanInput } from "@/lib/services/pricing";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const plan = await PricingService.get(id);
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }
  return NextResponse.json(plan);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as UpdatePricingPlanInput;
    const plan = await PricingService.update(id, body);
    return NextResponse.json(plan);
  } catch (error) {
    console.error("Failed to update pricing plan:", error);
    return NextResponse.json({ error: "Failed to update pricing plan" }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    await PricingService.remove(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete pricing plan:", error);
    return NextResponse.json({ error: "Failed to delete pricing plan" }, { status: 400 });
  }
}
