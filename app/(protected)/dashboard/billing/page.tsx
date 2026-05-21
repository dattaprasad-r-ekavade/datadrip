"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Script from "next/script";
import { AlertTriangle, Check, CreditCard, Download, Loader2, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cashfree: any;
  }
}

interface BillingData {
  agency: {
    id: string;
    name: string;
    plan: string;
    planExpiry: string | null;
    billingStatus: string | null;
    aiCreditsBalance: number | null;
    gstin: string | null;
    billingAddress: string | null;
  };
  currentPlanConfig: {
    name: string;
    price: number;
    clientLimit: number | null;
    userLimit: number | null;
    aiCredits: number | null;
  } | null;
  stats: {
    clientsUsed: number;
    usersUsed: number;
  };
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    planTier: string;
  }>;
  plans: Array<{
    id: string;
    tier: string;
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    popular: boolean;
    clientLimit: number | null;
    userLimit: number | null;
    aiCredits: number | null;
  }>;
}

export default function BillingPage() {
  const { data: session } = useSession();
  const isSuperAdmin = Boolean(session?.user?.isSuperAdmin);
  const { toast } = useToast();

  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isActivatingBeta, setIsActivatingBeta] = useState<string | null>(null);

  // Fetch billing details from API
  const fetchBillingData = async () => {
    try {
      const response = await fetch("/api/billing");
      if (!response.ok) throw new Error("Failed to fetch billing info");
      const result = await response.json();
      setBillingData(result);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error loading billing details",
        description: "Please check your network connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();

    // Read URL query params for payment status toasts
    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get("status");
    const reason = searchParams.get("reason");

    if (status === "success") {
      toast({
        title: "Payment Successful!",
        description: "Your agency plan has been activated successfully.",
      });
      // Clean query parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === "failed") {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: reason ? `Payment failed with status: ${reason.toUpperCase()}` : "The transaction was unsuccessful.",
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckout = async (planTier: string) => {
    if (!window.Cashfree) {
      toast({
        variant: "destructive",
        title: "Payment SDK is not loaded",
        description: "Please wait a moment and try again.",
      });
      return;
    }

    setIsProcessing(planTier);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planTier }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to initialize payment session");
      }

      const { paymentSessionId, cfEnv } = await response.json();

      // Initialize Cashfree client-side SDK
      const cashfree = window.Cashfree({
        mode: cfEnv || "sandbox",
      });

      // Launch Cashfree hosted checkout page redirect
      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Payment Initiation Failed",
        description: err instanceof Error ? err.message : "Something went wrong.",
      });
      setIsProcessing(null);
    }
  };

  const handleFreeBetaActivate = async (planTier: string) => {
    setIsActivatingBeta(planTier);
    try {
      const response = await fetch("/api/billing/free-activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planTier }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to activate beta subscription");
      }

      const result = await response.json();
      toast({
        title: "Beta Plan Activated!",
        description: `Successfully activated 30 days of ${planTier} plan with ${result.agency.aiCreditsBalance} AI credits.`,
      });

      // Refetch billing data to update UI
      await fetchBillingData();
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Beta Activation Failed",
        description: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setIsActivatingBeta(null);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading billing and subscription details...</p>
        </div>
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle>Error Loading Billing</CardTitle>
            <CardDescription>We could not pull billing data for this agency.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { agency, currentPlanConfig, stats, invoices, plans } = billingData;

  // Calculate remaining subscription days
  let daysRemaining = 0;
  let isExpired = false;
  if (agency.planExpiry) {
    const expiry = new Date(agency.planExpiry);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    isExpired = daysRemaining <= 0;
  }

  return (
    <div className="container mx-auto py-8">
      {/* Cashfree Web SDK Injection */}
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />

      {isSuperAdmin && (
        <Card className="mb-6 border-blue-300 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle>Platform Admin View</CardTitle>
            <CardDescription>
              Super admins are not tied to an agency subscription. Use admin pricing controls for platform plans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/admin/pricing">Go to Pricing Admin</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {isExpired && agency.plan !== "STARTER" && (
        <Card className="mb-6 border-destructive bg-destructive/10">
          <CardHeader className="flex flex-row items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div>
              <CardTitle className="text-destructive">Plan Expired</CardTitle>
              <CardDescription>
                Your subscription expired on {new Date(agency.planExpiry!).toLocaleDateString("en-IN")}. Please renew to unlock your plan limits.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your prepaid credits, subscription level, and billing history.
        </p>
      </div>

      {/* Current Subscription Status Card */}
      <Card className="mb-8 border-primary bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                <Zap className="h-6 w-6 text-primary animate-pulse" />
                Current Plan: {agency.plan.charAt(0) + agency.plan.slice(1).toLowerCase()}
              </CardTitle>
              <CardDescription className="mt-1">
                {agency.planExpiry ? (
                  isExpired ? (
                    <span className="font-semibold text-destructive">Expired on {new Date(agency.planExpiry).toLocaleDateString("en-IN")}</span>
                  ) : (
                    <span>Prepaid cycle active until <strong className="text-foreground">{new Date(agency.planExpiry).toLocaleDateString("en-IN")}</strong></span>
                  )
                ) : (
                  "Free Trial (No expiration set)"
                )}
              </CardDescription>
            </div>
            <div className="text-left md:text-right">
              <div className="text-3xl font-bold text-primary">
                {currentPlanConfig ? formatCurrency(currentPlanConfig.price) : "₹0"}
              </div>
              <div className="text-xs text-muted-foreground">Prepaid 30-day cycle</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="rounded-lg bg-muted/60 p-4 border border-border/40">
              <div className="text-2xl font-bold">
                {stats.clientsUsed}
                {currentPlanConfig?.clientLimit ? ` / ${currentPlanConfig.clientLimit}` : " / 5"}
              </div>
              <div className="text-sm text-muted-foreground">Clients synced</div>
            </div>
            <div className="rounded-lg bg-muted/60 p-4 border border-border/40">
              <div className="text-2xl font-bold">
                {stats.usersUsed}
                {currentPlanConfig?.userLimit ? ` / ${currentPlanConfig.userLimit}` : " / 2"}
              </div>
              <div className="text-sm text-muted-foreground">Team members</div>
            </div>
            <div className="rounded-lg bg-muted/60 p-4 border border-border/40">
              <div className="text-2xl font-bold text-primary">
                {agency.aiCreditsBalance !== null ? agency.aiCreditsBalance : "Unlimited"}
              </div>
              <div className="text-sm text-muted-foreground">AI credits balance</div>
            </div>
            <div className="rounded-lg bg-muted/60 p-4 border border-border/40">
              <div className="text-2xl font-bold">
                {agency.planExpiry && !isExpired ? `${daysRemaining} days` : "0 days"}
              </div>
              <div className="text-sm text-muted-foreground">Active days left</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Pricing Plans */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Available Prepaid Packages</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col justify-between ${
                plan.popular ? "border-primary shadow-lg ring-1 ring-primary/20" : "border-border/60"
              } ${agency.plan === plan.tier ? "ring-2 ring-primary bg-primary/5" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              {agency.plan === plan.tier && (
                <div className="absolute -top-3 right-4 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                  Active Plan
                </div>
              )}
              <div>
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                    <span className="text-muted-foreground">/ 30 Days</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm font-medium text-primary">
                      <Zap className="h-4 w-4 shrink-0" />
                      {plan.aiCredits ? `${plan.aiCredits} AI insights credits` : "Unlimited AI insights"}
                    </li>
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
              <CardContent className="pt-0 flex flex-col gap-2">
                <Button
                  className="mt-6 w-full"
                  variant={agency.plan === plan.tier ? "outline" : plan.popular ? "default" : "outline"}
                  disabled={isProcessing !== null || isActivatingBeta !== null}
                  onClick={() => handleCheckout(plan.tier)}
                >
                  {isProcessing === plan.tier ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : agency.plan === plan.tier ? (
                    "Renew Cycle (30 Days)"
                  ) : (
                    `Select ${plan.name}`
                  )}
                </Button>

                <Button
                  className="w-full border-dashed border-primary/40 hover:border-primary/80 text-primary hover:bg-primary/5 gap-2"
                  variant="outline"
                  disabled={isProcessing !== null || isActivatingBeta !== null}
                  onClick={() => handleFreeBetaActivate(plan.tier)}
                >
                  {isActivatingBeta === plan.tier ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                      Activate Free (Beta)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Prepaid Credit Warning for individual launcher */}
      <Card className="mb-8 border-border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Prepaid Credit-based Renewals</CardTitle>
          <CardDescription>
            Because we do not capture recurring auto-debit details (keeping compliance lightweight and domain registration-free), your services are on a prepaid cycle. You can extend your credits or renew your subscription tier at any time by selecting your desired package above.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Transaction & Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Download tax receipts and view past payments</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-border/80 text-muted-foreground">
              <CreditCard className="mb-2 h-8 w-8 text-muted-foreground/60" />
              <span>No transactions recorded yet.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-all duration-150"
                >
                  <div>
                    <div className="font-semibold text-foreground">{invoice.id}</div>
                    <div className="text-sm text-muted-foreground">{invoice.date}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(invoice.amount)}</div>
                      <div
                        className={`text-sm font-medium ${
                          invoice.status === "PAID"
                            ? "text-green-600"
                            : invoice.status === "FAILED"
                              ? "text-red-500"
                              : "text-amber-500"
                        }`}
                      >
                        {invoice.status}
                      </div>
                    </div>
                    {invoice.status === "PAID" && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/api/billing/invoice/${invoice.id}`} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
