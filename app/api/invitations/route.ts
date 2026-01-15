import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { InvitationService } from "@/lib/services/invitations";
import { PricingService } from "@/lib/services/pricing";
import { sendEmail } from "@/lib/services/email";

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

  const invitations = await InvitationService.listByAgency(user.agencyId);
  return NextResponse.json({ invitations });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true, isSuperAdmin: true, role: true },
  });

  if (!user?.agencyId) {
    return NextResponse.json({ error: "No agency found" }, { status: 400 });
  }

  if (!user.isSuperAdmin && user.role === "MEMBER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const agency = await prisma.agency.findUnique({
    where: { id: user.agencyId },
    select: { id: true, plan: true, _count: { select: { users: true } } },
  });

  if (!agency) {
    return NextResponse.json({ error: "Agency not found" }, { status: 404 });
  }

  const plan = await PricingService.getPlanForAgency(agency);
  if (plan?.userLimit && agency._count.users >= plan.userLimit) {
    return NextResponse.json(
      { error: "User limit reached for current plan" },
      { status: 403 }
    );
  }

  try {
    const body = (await request.json()) as {
      email: string;
      role: "ADMIN" | "MEMBER";
    };

    const invitation = await InvitationService.create({
      email: body.email,
      role: body.role,
      agencyId: agency.id,
      invitedById: session.user.id,
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const inviteUrl = `${baseUrl}/invite/${invitation.token}`;

    await sendEmail({
      to: invitation.email,
      subject: "You're invited to DataDrip",
      html: `<p>You have been invited to DataDrip. <a href="${inviteUrl}">Accept invitation</a>.</p>`,
    });

    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    console.error("Failed to create invitation:", error);
    return NextResponse.json({ error: "Failed to invite user" }, { status: 400 });
  }
}
