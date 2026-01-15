import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { AIProviderService, CreateAIProviderInput } from "@/lib/services/ai-provider";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const providers = await AIProviderService.list();
  return NextResponse.json({ providers });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as CreateAIProviderInput;
    const provider = await AIProviderService.create(body);
    return NextResponse.json(provider, { status: 201 });
  } catch (error) {
    console.error("Failed to create AI provider:", error);
    return NextResponse.json({ error: "Failed to create AI provider" }, { status: 400 });
  }
}
