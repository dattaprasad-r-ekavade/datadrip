import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { exchangeForLongLivedToken } from "@/lib/integrations/meta";
import { refreshGoogleToken } from "@/lib/integrations/google-ads";

const isAuthorized = (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return false;
  }
  const [, token] = authHeader.split(" ");
  return token === env.CRON_SECRET;
};

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const metaThreshold = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const googleThreshold = new Date(now.getTime() + 10 * 60 * 1000);

  const metaAccounts = await prisma.metaAccount.findMany({
    where: { tokenExpiry: { lt: metaThreshold } },
  });

  let metaRefreshed = 0;
  for (const account of metaAccounts) {
    try {
      const refreshed = await exchangeForLongLivedToken(account.accessToken);
      await prisma.metaAccount.update({
        where: { id: account.id },
        data: {
          accessToken: refreshed.access_token,
          tokenExpiry: new Date(Date.now() + refreshed.expires_in * 1000),
        },
      });
      metaRefreshed += 1;
    } catch (error) {
      console.error("Meta token refresh failed:", error);
    }
  }

  const googleAccounts = await prisma.googleAccount.findMany({
    where: { tokenExpiry: { lt: googleThreshold } },
  });

  let googleRefreshed = 0;
  for (const account of googleAccounts) {
    try {
      const refreshed = await refreshGoogleToken(account.refreshToken);
      await prisma.googleAccount.update({
        where: { id: account.id },
        data: {
          accessToken: refreshed.access_token,
          tokenExpiry: new Date(Date.now() + refreshed.expires_in * 1000),
        },
      });
      googleRefreshed += 1;
    } catch (error) {
      console.error("Google token refresh failed:", error);
    }
  }

  return NextResponse.json({
    meta: { refreshed: metaRefreshed },
    google: { refreshed: googleRefreshed },
  });
}
