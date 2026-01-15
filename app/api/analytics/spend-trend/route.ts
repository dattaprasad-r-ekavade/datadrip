import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AnalyticsService } from "@/lib/services/analytics";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true },
  });

  if (!user?.agencyId) {
    return NextResponse.json({ error: "No agency found" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? "7");
  const platform = searchParams.get("platform") as "META" | "GOOGLE" | null;

  const trend = await AnalyticsService.getSpendTrend(
    user.agencyId,
    Number.isNaN(days) ? 7 : days,
    platform ?? undefined
  );

  return NextResponse.json({ trend });
}
