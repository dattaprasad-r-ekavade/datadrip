import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

  const users = await prisma.user.findMany({
    where: { agencyId: user.agencyId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true, role: true, isSuperAdmin: true },
  });

  if (!currentUser?.agencyId) {
    return NextResponse.json({ error: "No agency found" }, { status: 400 });
  }

  if (!currentUser.isSuperAdmin && currentUser.role === "MEMBER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { userId?: string; role?: "ADMIN" | "MEMBER" };
  if (!body.userId || !body.role) {
    return NextResponse.json({ error: "User ID and role required" }, { status: 400 });
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: body.userId },
    select: { id: true, agencyId: true, isSuperAdmin: true },
  });

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Non-super-admin users can only update team members inside their own agency.
  if (!currentUser.isSuperAdmin && targetUser.agencyId !== currentUser.agencyId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Never allow changing role for super-admin accounts through agency-level endpoint.
  if (targetUser.isSuperAdmin) {
    return NextResponse.json({ error: "Cannot modify super admin role here" }, { status: 403 });
  }

  const updated = await prisma.user.update({
    where: { id: body.userId },
    data: { role: body.role },
  });

  return NextResponse.json(updated);
}
