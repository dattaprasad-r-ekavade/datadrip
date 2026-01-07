import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SyncService } from "@/lib/services/sync";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await prisma.client.findUnique({
    where: { id },
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
    const summary = await SyncService.syncClient(id);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Sync failed:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
