import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { InsightService } from "@/lib/services/insight";
import { z } from "zod";

const updateInsightSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "DISMISSED"]),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true, isSuperAdmin: true },
  });

  const agencyId = user?.agencyId;
  if (!agencyId && !user?.isSuperAdmin) {
    return NextResponse.json({ error: "No agency found" }, { status: 400 });
  }

  const insights = user?.isSuperAdmin
    ? await InsightService.listAll()
    : await InsightService.listForAgency(agencyId ?? "");
  return NextResponse.json({ insights });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = updateInsightSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { agencyId: true, isSuperAdmin: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.isSuperAdmin && user.role === "MEMBER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await InsightService.updateStatus(id, status);

    if (!user.isSuperAdmin && user.agencyId !== updated.client.agencyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ insight: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid payload", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Failed to update insight status:", error);
    return NextResponse.json({ error: "Failed to update insight status" }, { status: 400 });
  }
}
