import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildGoogleAuthUrl } from "@/lib/integrations/google-ads";
import { createOAuthState } from "@/lib/integrations/oauth-state";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  const returnTo = searchParams.get("returnTo") ?? "/dashboard/clients";

  if (!clientId) {
    return NextResponse.json({ error: "Client ID required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true, isSuperAdmin: true },
  });

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { agencyId: true },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  if (!user?.isSuperAdmin && user?.agencyId !== client.agencyId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const state = createOAuthState({
    provider: "google-ads",
    clientId,
    userId: session.user.id,
    returnTo,
    exp: Date.now() + 10 * 60 * 1000,
  });

  const url = buildGoogleAuthUrl(state);
  return NextResponse.redirect(url);
}
