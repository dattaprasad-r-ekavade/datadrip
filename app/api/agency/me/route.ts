import { NextResponse } from "next/server";
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

  const agency = await prisma.agency.findUnique({
    where: { id: user.agencyId },
    select: { id: true, name: true, aiEnabled: true, plan: true },
  });

  return NextResponse.json({ agency });
}
