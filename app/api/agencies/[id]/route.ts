import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AgencyService, UpdateAgencyInput } from "@/lib/services/agency";
import { requireSuperAdminSession } from "@/lib/auth/session";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agency = await AgencyService.getById(id);

    if (!agency) {
      return NextResponse.json({ error: "Agency not found" }, { status: 404 });
    }

    // Check if user has access to this agency
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isSuperAdmin: true, agencyId: true },
    });

    if (!user?.isSuperAdmin && user?.agencyId !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(agency);
  } catch (error) {
    console.error("Error fetching agency:", error);
    return NextResponse.json(
      { error: "Failed to fetch agency" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has access to this agency
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isSuperAdmin: true, agencyId: true },
    });

    if (!user?.isSuperAdmin && user?.agencyId !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: UpdateAgencyInput = await request.json();
    const agency = await AgencyService.update(id, body);

    return NextResponse.json(agency);
  } catch (error) {
    console.error("Error updating agency:", error);
    return NextResponse.json(
      { error: "Failed to update agency" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    await requireSuperAdminSession();

    await AgencyService.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agency:", error);
    return NextResponse.json(
      { error: "Failed to delete agency" },
      { status: 500 }
    );
  }
}