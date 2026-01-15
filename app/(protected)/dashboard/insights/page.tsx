"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ClientOption {
  id: string;
  name: string;
}

interface InsightRow {
  id: string;
  type: string;
  impactScore: number;
  status: string;
  client: { id: string; name: string };
  createdAt: string;
  aiProvider?: string | null;
  aiModel?: string | null;
}

export default function InsightsPage() {
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [insights, setInsights] = useState<InsightRow[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedType, setSelectedType] = useState("PERFORMANCE_ALERT");
  const [isLoading, setIsLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const { toast } = useToast();

  const loadInsights = async () => {
    const response = await fetch("/api/insights");
    if (!response.ok) {
      throw new Error("Failed to load insights");
    }
    const data = await response.json();
    setInsights(data.insights ?? []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const agencyResponse = await fetch("/api/agency/me");
        if (agencyResponse.ok) {
          const agencyData = await agencyResponse.json();
          setAiEnabled(agencyData.agency?.aiEnabled ?? true);
        }
        const response = await fetch("/api/clients?limit=100");
        if (!response.ok) {
          throw new Error("Failed to load clients");
        }
        const data = await response.json();
        setClients(data.clients ?? []);
        setSelectedClient(data.clients?.[0]?.id ?? "");
        await loadInsights();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load insights data.",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [toast]);

  const handleGenerate = async () => {
    if (!selectedClient) {
      toast({
        title: "Select a client",
        description: "Choose a client before generating insights.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/insights/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: selectedClient, type: selectedType }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Failed to generate insight");
      }

      toast({
        title: "Insight generated",
        description: "A new recommendation has been created.",
      });

      await loadInsights();
    } catch (error) {
      const message = (error as Error).message ?? "Failed to generate insight.";
      toast({
        title: "Error",
        description: message.includes("limit")
          ? "AI insight limit reached. Upgrade your plan to generate more insights."
          : message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Insights</h1>
        <p className="text-muted-foreground">
          Generate AI-backed recommendations and track performance impact.
        </p>
      </div>

      {!aiEnabled && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Running in demo mode - insights are generated using pre-built recommendations. Connect an AI provider for personalized insights.
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate insight</CardTitle>
          <CardDescription>Pick a client and insight type.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-2 text-sm">
            Client
            <select
              className="rounded-md border border-border bg-background px-3 py-2"
              value={selectedClient}
              onChange={(event) => setSelectedClient(event.target.value)}
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Type
            <select
              className="rounded-md border border-border bg-background px-3 py-2"
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              <option value="PERFORMANCE_ALERT">Performance alert</option>
              <option value="OPTIMIZATION_OPPORTUNITY">Optimization opportunity</option>
              <option value="BUDGET_ALERT">Budget alert</option>
              <option value="CREATIVE_IDEA">Creative idea</option>
              <option value="AUDIENCE_RECOMMENDATION">Audience recommendation</option>
            </select>
          </label>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent insights</CardTitle>
          <CardDescription>Latest recommendations across clients.</CardDescription>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No insights yet.
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className="rounded-lg border border-border/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{insight.client.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {insight.type.replace(/_/g, " ")}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(insight.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Impact score: {insight.impactScore} · Status: {insight.status}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Provider: {insight.aiProvider ?? "—"} · Model: {insight.aiModel ?? "—"}
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
