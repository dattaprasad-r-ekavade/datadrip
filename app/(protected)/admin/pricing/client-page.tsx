"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface PricingPlanRow {
  id: string;
  tier: string;
  name: string;
  description?: string | null;
  priceMonthly: string;
  priceYearly?: string | null;
  currency: string;
  billingInterval: string;
  clientLimit?: number | null;
  userLimit?: number | null;
  aiCredits?: number | null;
  features?: string[] | null;
  isActive: boolean;
}

const parseFeatures = (value: string) => {
  if (!value.trim()) {
    return [];
  }
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string")) {
    throw new Error("Features must be a JSON array of strings.");
  }
  return parsed;
};

export default function PricingAdminPage() {
  const [plans, setPlans] = useState<PricingPlanRow[]>([]);
  const [form, setForm] = useState({
    tier: "STARTER",
    name: "",
    description: "",
    priceMonthly: "",
    priceYearly: "",
    currency: "INR",
    billingInterval: "monthly",
    clientLimit: "",
    userLimit: "",
    aiCredits: "",
    features: "[]",
    isActive: true,
  });
  const { toast } = useToast();

  const loadPlans = async () => {
    const response = await fetch("/api/admin/pricing");
    if (!response.ok) {
      throw new Error("Failed to load plans");
    }
    const data = await response.json();
    setPlans(data.plans ?? []);
  };

  useEffect(() => {
    loadPlans().catch(() =>
      toast({
        title: "Error",
        description: "Failed to load pricing plans.",
        variant: "destructive",
      })
    );
  }, [toast]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: form.tier,
          name: form.name,
          description: form.description || undefined,
          priceMonthly: Number(form.priceMonthly),
          priceYearly: form.priceYearly ? Number(form.priceYearly) : undefined,
          currency: form.currency,
          billingInterval: form.billingInterval,
          clientLimit: form.clientLimit ? Number(form.clientLimit) : undefined,
          userLimit: form.userLimit ? Number(form.userLimit) : undefined,
          aiCredits: form.aiCredits ? Number(form.aiCredits) : undefined,
          features: parseFeatures(form.features),
          isActive: form.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create plan");
      }

      toast({
        title: "Plan created",
        description: "Pricing plan saved successfully.",
      });

      setForm({
        tier: "STARTER",
        name: "",
        description: "",
        priceMonthly: "",
        priceYearly: "",
        currency: "INR",
        billingInterval: "monthly",
        clientLimit: "",
        userLimit: "",
        aiCredits: "",
        features: "[]",
        isActive: true,
      });

      await loadPlans();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save pricing plan.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this plan?")) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/pricing/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      await loadPlans();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete plan.",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (plan: PricingPlanRow) => {
    try {
      const response = await fetch(`/api/admin/pricing/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !plan.isActive }),
      });
      if (!response.ok) {
        throw new Error("Update failed");
      }
      await loadPlans();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Pricing Plans</h1>
        <p className="text-muted-foreground">
          Manage pricing tiers, limits, and feature entitlements.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add pricing plan</CardTitle>
          <CardDescription>Define pricing and limits.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <select
              className="rounded-md border border-border bg-background px-3 py-2"
              value={form.tier}
              onChange={(event) => setForm({ ...form, tier: event.target.value })}
            >
              <option value="STARTER">Starter</option>
              <option value="GROWTH">Growth</option>
              <option value="SCALE">Scale</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>
            <Input
              placeholder="Plan name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
            <Input
              placeholder="Monthly price"
              type="number"
              value={form.priceMonthly}
              onChange={(event) => setForm({ ...form, priceMonthly: event.target.value })}
              required
            />
            <Input
              placeholder="Yearly price"
              type="number"
              value={form.priceYearly}
              onChange={(event) => setForm({ ...form, priceYearly: event.target.value })}
            />
            <Input
              placeholder="Currency (e.g. INR)"
              value={form.currency}
              onChange={(event) => setForm({ ...form, currency: event.target.value })}
              required
            />
            <select
              className="rounded-md border border-border bg-background px-3 py-2"
              value={form.billingInterval}
              onChange={(event) =>
                setForm({ ...form, billingInterval: event.target.value })
              }
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <Input
              placeholder="Client limit"
              type="number"
              value={form.clientLimit}
              onChange={(event) => setForm({ ...form, clientLimit: event.target.value })}
            />
            <Input
              placeholder="User limit"
              type="number"
              value={form.userLimit}
              onChange={(event) => setForm({ ...form, userLimit: event.target.value })}
            />
            <Input
              placeholder="AI credits"
              type="number"
              value={form.aiCredits}
              onChange={(event) => setForm({ ...form, aiCredits: event.target.value })}
            />
            <textarea
              className="min-h-[96px] rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder='Features (JSON array, e.g. ["Daily reports","AI insights"])'
              value={form.features}
              onChange={(event) => setForm({ ...form, features: event.target.value })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
              />
              Active
            </label>
            <Button type="submit">Save plan</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing plans</CardTitle>
          <CardDescription>Active plans appear on the public pricing page.</CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">No plans yet.</div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {plan.name} · {plan.tier}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {plan.currency} {plan.priceMonthly} · {plan.billingInterval}
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(plan.id)}>
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(plan)}
                  >
                    {plan.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
