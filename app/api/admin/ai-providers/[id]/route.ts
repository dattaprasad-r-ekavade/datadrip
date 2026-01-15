import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { AIProviderService, UpdateAIProviderInput } from "@/lib/services/ai-provider";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateAIProviderInput;
    const provider = await AIProviderService.update(id, body);
    return NextResponse.json(provider);
  } catch (error) {
    console.error("Failed to update AI provider:", error);
    return NextResponse.json({ error: "Failed to update AI provider" }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    await AIProviderService.remove(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete AI provider:", error);
    return NextResponse.json({ error: "Failed to delete AI provider" }, { status: 400 });
  }
}
