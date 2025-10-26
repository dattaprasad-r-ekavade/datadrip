import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSuperAdminSession } from "@/lib/auth/session";

export default async function AdminPage() {
  await requireSuperAdminSession();

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Platform controls</CardTitle>
          <CardDescription>
            Manage AI providers, pricing plans, and feature toggles from a single console.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              AI Providers
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure OpenAI, Anthropic, Google Gemini, or Azure OpenAI credentials and define
              fallback priority.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Pricing plans
            </h3>
            <p className="text-sm text-muted-foreground">
              Launch new plans, update seat limits, and control AI credit allocation without code
              changes.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Feature flags
            </h3>
            <p className="text-sm text-muted-foreground">
              Toggle AI features per agency and roll out beta capabilities safely.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              System config
            </h3>
            <p className="text-sm text-muted-foreground">
              Manage global settings such as reporting cadence, webhook endpoints, and audit
              logging.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
