import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { InsightService } from "@/lib/services/insight";

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

  const insights = await InsightService.listForAgency(agencyId ?? "");
  return NextResponse.json({ insights });
}
