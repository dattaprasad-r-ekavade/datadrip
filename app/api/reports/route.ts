import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ReportService } from "@/lib/services/report";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true, isSuperAdmin: true },
  });

  const { searchParams } = new URL(request.url);
  const agencyId = user?.isSuperAdmin
    ? searchParams.get("agencyId") || user?.agencyId
    : user?.agencyId;

  if (!agencyId) {
    return NextResponse.json({ error: "Agency ID required" }, { status: 400 });
  }

  const reports = await ReportService.listReportsByAgency(agencyId);
  return NextResponse.json({ reports });
}
