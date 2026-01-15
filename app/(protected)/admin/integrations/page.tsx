import { requireSuperAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Prisma } from "@prisma/client";

type GoogleAccountWithClient = Prisma.GoogleAccountGetPayload<{
  include: { client: { select: { name: true } } };
}>;

export default async function IntegrationsStatusPage() {
  await requireSuperAdminSession();

  const googleAccounts: GoogleAccountWithClient[] = await prisma.googleAccount.findMany({
    include: { client: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const now = new Date();

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Google Ads Connections</CardTitle>
          <CardDescription>
            Monitor connected Google Ads accounts and token status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {googleAccounts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-2">No Google Ads accounts connected yet.</p>
              <p className="text-sm text-muted-foreground">
                Go to Clients and connect a Google Ads account to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {googleAccounts.map((account) => {
                const expiry = new Date(account.tokenExpiry);
                const isExpired = expiry < now;
                const expiressSoon = !isExpired && expiry < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

                return (
                  <div key={account.id} className="flex items-center justify-between rounded-md border border-border/60 p-4">
                    <div>
                      <div className="text-sm font-semibold">{account.client.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Customer ID: {account.customerId}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpired ? (
                        <span className="flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          Expired
                        </span>
                      ) : expiressSoon ? (
                        <span className="flex items-center gap-1 text-xs text-amber-600">
                          <AlertCircle className="h-3 w-3" />
                          Expires {expiry.toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Meta Ads Connections</CardTitle>
          <CardDescription>
            Monitor connected Meta Business accounts and token status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-2">No Meta accounts connected yet.</p>
            <p className="text-sm text-muted-foreground">
              Go to Clients and connect a Meta Ads account to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
