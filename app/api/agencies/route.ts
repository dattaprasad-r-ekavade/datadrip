import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AgencyService, CreateAgencyInput } from "@/lib/services/agency";
import { requireSuperAdminSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    await requireSuperAdminSession();

    const body: CreateAgencyInput = await request.json();
    const agency = await AgencyService.create(body);

    return NextResponse.json(agency, { status: 201 });
  } catch (error) {
    console.error("Error creating agency:", error);
    return NextResponse.json(
      { error: "Failed to create agency" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is super admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isSuperAdmin: true },
    });

    if (!user?.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const agencies = await AgencyService.getAll();
    return NextResponse.json(agencies);
  } catch (error) {
    console.error("Error fetching agencies:", error);
    return NextResponse.json(
      { error: "Failed to fetch agencies" },
      { status: 500 }
    );
  }
}