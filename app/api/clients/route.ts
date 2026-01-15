import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ClientService, CreateClientInput } from "@/lib/services/client";
import { PricingService } from "@/lib/services/pricing";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's agency
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { agencyId: true, isSuperAdmin: true },
    });

    if (!user?.agencyId && !user?.isSuperAdmin) {
      return NextResponse.json({ error: "No agency found" }, { status: 400 });
    }

    const body: CreateClientInput = await request.json();

    // If not super admin, ensure client is created for user's agency
    if (!user.isSuperAdmin) {
      body.agencyId = user.agencyId!;
    }

    if (body.agencyId) {
      const agency = await prisma.agency.findUnique({
        where: { id: body.agencyId },
        select: { id: true, plan: true, _count: { select: { clients: true } } },
      });

      if (!agency) {
        return NextResponse.json({ error: "Agency not found" }, { status: 404 });
      }

      const plan = await PricingService.getPlanForAgency(agency);
      if (plan?.clientLimit && agency._count.clients >= plan.clientLimit) {
        return NextResponse.json(
          { error: "Client limit reached for current plan" },
          { status: 403 }
        );
      }
    }

    const client = await ClientService.create(body);

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's agency
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { agencyId: true, isSuperAdmin: true },
    });

    if (!user?.agencyId && !user?.isSuperAdmin) {
      return NextResponse.json({ error: "No agency found" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const agencyId = user.isSuperAdmin
      ? searchParams.get("agencyId") || undefined
      : user.agencyId;

    if (!agencyId) {
      return NextResponse.json({ error: "Agency ID required" }, { status: 400 });
    }

    const clients = await ClientService.getByAgency(agencyId, {
      skip,
      take: limit,
      search,
    });

    const total = await ClientService.getCount(agencyId);

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}
