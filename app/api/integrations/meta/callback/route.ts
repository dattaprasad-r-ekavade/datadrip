import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeForLongLivedToken, exchangeMetaCode, fetchMetaAdAccountId } from "@/lib/integrations/meta";
import { verifyOAuthState } from "@/lib/integrations/oauth-state";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");

  if (!code || !stateParam) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  const state = verifyOAuthState(stateParam);
  if (!state || state.provider !== "meta") {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const shortLived = await exchangeMetaCode(code);
  const longLived = await exchangeForLongLivedToken(shortLived.access_token);
  const accountId = await fetchMetaAdAccountId(longLived.access_token);

  if (!accountId) {
    return NextResponse.json({ error: "No Meta ad account found" }, { status: 400 });
  }

  const tokenExpiry = new Date(Date.now() + longLived.expires_in * 1000);

  await prisma.metaAccount.upsert({
    where: { clientId: state.clientId },
    update: {
      accountId,
      accessToken: longLived.access_token,
      refreshToken: null,
      tokenExpiry,
    },
    create: {
      clientId: state.clientId,
      accountId,
      accessToken: longLived.access_token,
      refreshToken: null,
      tokenExpiry,
    },
  });

  return NextResponse.redirect(new URL(state.returnTo ?? "/dashboard/clients", request.url));
}
