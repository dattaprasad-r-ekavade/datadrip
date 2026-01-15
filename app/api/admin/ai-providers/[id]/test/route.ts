import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateInsightText } from "@/lib/services/ai";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const provider = await prisma.aIProvider.findUnique({ where: { id } });

  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  try {
    const response = await generateInsightText({
      provider,
      type: "PERFORMANCE_ALERT",
      summary: "Test connection with sample metrics.",
    });

    return NextResponse.json({ success: true, model: response.model });
  } catch (error) {
    console.error("AI provider test failed:", error);
    return NextResponse.json({ error: "Provider test failed" }, { status: 400 });
  }
}
