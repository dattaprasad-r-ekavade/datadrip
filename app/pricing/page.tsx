import { PricingService } from "@/lib/services/pricing";

// Force dynamic rendering - this page queries the database
export const dynamic = 'force-dynamic';

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(value);

export default async function PricingPage() {
  const plans = await PricingService.listActive();

  return (
    <div className="container mx-auto py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="mt-2 text-muted-foreground">
          Simple plans for agencies of every size.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 p-12 text-center text-muted-foreground">
          Pricing plans are coming soon.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-lg border border-border/60 p-6">
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              {plan.description && (
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              )}
              <div className="mt-4 text-3xl font-bold">
                {formatCurrency(Number(plan.priceMonthly), plan.currency)}
                <span className="text-sm font-normal text-muted-foreground">
                  /{plan.billingInterval}
                </span>
              </div>
              {plan.priceYearly && (
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(Number(plan.priceYearly), plan.currency)} billed yearly
                </div>
              )}
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {plan.clientLimit && <li>{plan.clientLimit} clients</li>}
                {plan.userLimit && <li>{plan.userLimit} team members</li>}
                {plan.aiCredits && <li>{plan.aiCredits} AI credits</li>}
                {(plan.features as string[] | null | undefined)?.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
