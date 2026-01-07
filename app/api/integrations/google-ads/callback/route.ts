import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  exchangeGoogleCode,
  fetchAccessibleCustomerId,
} from "@/lib/integrations/google-ads";
import { verifyOAuthState } from "@/lib/integrations/oauth-state";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");

  if (!code || !stateParam) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  const state = verifyOAuthState(stateParam);
  if (!state || state.provider !== "google-ads") {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const tokenResponse = await exchangeGoogleCode(code);
  const customerId = await fetchAccessibleCustomerId(tokenResponse.access_token);

  if (!customerId) {
    return NextResponse.json({ error: "No Google Ads customer found" }, { status: 400 });
  }

  const tokenExpiry = new Date(Date.now() + tokenResponse.expires_in * 1000);

  const existing = await prisma.googleAccount.findUnique({
    where: { clientId: state.clientId },
    select: { refreshToken: true },
  });

  const refreshToken = tokenResponse.refresh_token ?? existing?.refreshToken;
  if (!refreshToken) {
    return NextResponse.json({ error: "Missing refresh token" }, { status: 400 });
  }

  await prisma.googleAccount.upsert({
    where: { clientId: state.clientId },
    update: {
      customerId,
      accessToken: tokenResponse.access_token,
      refreshToken,
      tokenExpiry,
    },
    create: {
      clientId: state.clientId,
      customerId,
      accessToken: tokenResponse.access_token,
      refreshToken,
      tokenExpiry,
    },
  });

  return NextResponse.redirect(new URL(state.returnTo ?? "/dashboard/clients", request.url));
}
