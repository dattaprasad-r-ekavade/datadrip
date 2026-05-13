import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateAgencyMeSchema = z.object({
  name: z.string().min(1).optional(),
  timezone: z.string().min(1).optional(),
  aiEnabled: z.boolean().optional(),
});

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

  const agency = await prisma.agency.findUnique({
    where: { id: user.agencyId },
    select: { id: true, name: true, aiEnabled: true, plan: true },
  });

  return NextResponse.json({ agency });
}

export async function PATCH(request: Request) {
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

  // Member users cannot mutate agency settings.
  if (!currentUser.isSuperAdmin && currentUser.role === "MEMBER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const input = updateAgencyMeSchema.parse(body);

    const updated = await prisma.agency.update({
      where: { id: currentUser.agencyId },
      data: input,
      select: { id: true, name: true, timezone: true, aiEnabled: true, plan: true },
    });

    return NextResponse.json({ agency: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload", details: error.flatten() }, { status: 400 });
    }
    console.error("Failed to update agency settings:", error);
    return NextResponse.json({ error: "Failed to update agency settings" }, { status: 500 });
  }
}
