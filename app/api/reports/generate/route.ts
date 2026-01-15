import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ReportService } from "@/lib/services/report";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { clientId?: string };
  if (!body.clientId) {
    return NextResponse.json({ error: "Client ID required" }, { status: 400 });
  }

  const client = await prisma.client.findUnique({
    where: { id: body.clientId },
    select: { agencyId: true },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true, isSuperAdmin: true },
  });

  if (!user?.isSuperAdmin && user?.agencyId !== client.agencyId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const report = await ReportService.generateForClient(body.clientId, 7);
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Manual report generation failed:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 400 });
  }
}
