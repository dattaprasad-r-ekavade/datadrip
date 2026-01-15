import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { InsightService } from "@/lib/services/insight";
import type { InsightType } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { clientId?: string; type?: InsightType };
  if (!body.clientId || !body.type) {
    return NextResponse.json({ error: "Client ID and type required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true, isSuperAdmin: true },
  });

  const client = await prisma.client.findUnique({
    where: { id: body.clientId },
    select: { agencyId: true },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  if (!user?.isSuperAdmin && user?.agencyId !== client.agencyId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const agency = await prisma.agency.findUnique({
      where: { id: client.agencyId },
      select: { id: true, plan: true },
    });

    if (agency) {
      const { PricingService } = await import("@/lib/services/pricing");
      const plan = await PricingService.getPlanForAgency(agency);
      if (plan?.aiCredits) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const used = await prisma.insight.count({
          where: {
            client: { agencyId: agency.id },
            createdAt: { gte: startOfMonth },
          },
        });
        if (used >= plan.aiCredits) {
          return NextResponse.json(
            { error: "AI insight limit reached for current plan" },
            { status: 403 }
          );
        }
      }
    }

    const insight = await InsightService.generateForClient(body.clientId, body.type);
    return NextResponse.json(insight, { status: 201 });
  } catch (error) {
    console.error("Failed to generate insight:", error);
    return NextResponse.json({ error: "Failed to generate insight" }, { status: 400 });
  }
}
