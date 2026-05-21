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
      select: { id: true, plan: true, aiCreditsBalance: true },
    });

    if (agency) {
      if (agency.aiCreditsBalance !== null && agency.aiCreditsBalance <= 0) {
        return NextResponse.json(
          { error: "Insufficient AI credits. Please purchase credits or renew your plan." },
          { status: 403 }
        );
      }
    }

    const insight = await InsightService.generateForClient(body.clientId, body.type);

    // Decrement credits if billing has a cap
    if (agency && agency.aiCreditsBalance !== null) {
      await prisma.agency.update({
        where: { id: agency.id },
        data: {
          aiCreditsBalance: {
            decrement: 1
          }
        }
      });
    }

    return NextResponse.json(insight, { status: 201 });
  } catch (error) {
    console.error("Failed to generate insight:", error);
    return NextResponse.json({ error: "Failed to generate insight" }, { status: 400 });
  }
}
