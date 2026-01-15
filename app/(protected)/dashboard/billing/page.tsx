"use client";

import { useState } from "react";
import { Check, CreditCard, Download, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 2999,
    period: "month",
    description: "Perfect for freelancers and small agencies",
    features: [
      "5 client accounts",
      "Google Ads integration",
      "Basic AI insights (50/month)",
      "Weekly reports",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: 7999,
    period: "month",
    description: "For growing agencies with multiple clients",
    features: [
      "15 client accounts",
      "Google Ads + Meta integration",
      "Advanced AI insights (200/month)",
      "Daily reports",
      "White-label reports",
      "Priority support",
      "Team collaboration (5 users)",
    ],
    popular: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 14999,
    period: "month",
    description: "For established agencies at scale",
    features: [
      "50 client accounts",
      "All integrations",
      "Unlimited AI insights",
      "Real-time reports",
      "Custom branding",
      "Dedicated support",
      "Unlimited team members",
      "API access",
    ],
    popular: false,
  },
];

const invoices = [
  { id: "INV-2026-001", date: "Jan 1, 2026", amount: 7999, status: "Paid" },
  { id: "INV-2025-012", date: "Dec 1, 2025", amount: 7999, status: "Paid" },
  { id: "INV-2025-011", date: "Nov 1, 2025", amount: 7999, status: "Paid" },
  { id: "INV-2025-010", date: "Oct 1, 2025", amount: 2999, status: "Paid" },
];

export default function BillingPage() {
  const [currentPlan] = useState("growth");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowCheckout(true);
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate Razorpay checkout
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Payment Successful!",
      description: "Your plan has been upgraded successfully.",
    });

    setIsProcessing(false);
    setShowCheckout(false);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription, payment methods, and billing history.
        </p>
      </div>

      {/* Current Plan Card */}
      <Card className="mb-8 border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Current Plan: Growth
              </CardTitle>
              <CardDescription>
                Your subscription renews on February 1, 2026
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">₹7,999</div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="text-2xl font-bold">8/15</div>
              <div className="text-sm text-muted-foreground">Clients used</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="text-2xl font-bold">3/5</div>
              <div className="text-sm text-muted-foreground">Team members</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="text-2xl font-bold">142/200</div>
              <div className="text-sm text-muted-foreground">AI insights used</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="text-2xl font-bold">18</div>
              <div className="text-sm text-muted-foreground">Days until renewal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? "border-primary shadow-lg" : "border-border/60"
              } ${currentPlan === plan.id ? "ring-2 ring-primary" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              {currentPlan === plan.id && (
                <div className="absolute -top-3 right-4 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                  Current
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">₹{plan.price.toLocaleString()}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full"
                  variant={currentPlan === plan.id ? "outline" : plan.popular ? "default" : "outline"}
                  disabled={currentPlan === plan.id}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {currentPlan === plan.id ? "Current Plan" : plan.price > 7999 ? "Upgrade" : "Downgrade"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-16 items-center justify-center rounded bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <div className="font-medium">Visa ending in 4242</div>
                <div className="text-sm text-muted-foreground">Expires 12/2027</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
          <Button variant="ghost" className="mt-4">
            + Add new payment method
          </Button>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Download invoices and view past payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <div className="font-medium">{invoice.id}</div>
                  <div className="text-sm text-muted-foreground">{invoice.date}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                    <div className="text-sm text-green-600">{invoice.status}</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Razorpay Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Complete Payment</CardTitle>
              <CardDescription>
                Upgrade to {plans.find((p) => p.id === selectedPlan)?.name} plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex justify-between">
                  <span>Plan</span>
                  <span className="font-medium">
                    {plans.find((p) => p.id === selectedPlan)?.name}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>Amount</span>
                  <span className="font-medium">
                    ₹{plans.find((p) => p.id === selectedPlan)?.price.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-medium">
                    ₹{Math.round((plans.find((p) => p.id === selectedPlan)?.price || 0) * 0.18).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 flex justify-between border-t pt-2 font-bold">
                  <span>Total</span>
                  <span>
                    ₹{Math.round((plans.find((p) => p.id === selectedPlan)?.price || 0) * 1.18).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 text-sm font-medium">Pay with Razorpay</div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-12 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div className="h-8 w-12 rounded bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                    MC
                  </div>
                  <div className="h-8 w-12 rounded bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    UPI
                  </div>
                  <div className="h-8 w-12 rounded bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                    NB
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCheckout(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
