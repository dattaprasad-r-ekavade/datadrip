"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface AIProviderRow {
  id: string;
  name: string;
  provider: string;
  model: string | null;
  priority: number;
  isEnabled: boolean;
}

export default function AIProvidersPage() {
  const [providers, setProviders] = useState<AIProviderRow[]>([]);
  const [form, setForm] = useState({
    name: "",
    provider: "OPENAI",
    apiKey: "",
    model: "gpt-4o-mini",
    priority: 0,
    isEnabled: true,
  });
  const { toast } = useToast();

  const loadProviders = async () => {
    const response = await fetch("/api/admin/ai-providers");
    if (!response.ok) {
      throw new Error("Failed to load providers");
    }
    const data = await response.json();
    setProviders(data.providers ?? []);
  };

  useEffect(() => {
    loadProviders().catch(() =>
      toast({
        title: "Error",
        description: "Failed to load AI providers.",
        variant: "destructive",
      })
    );
  }, [toast]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/admin/ai-providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to create provider");
      }

      toast({
        title: "Provider added",
        description: "AI provider saved successfully.",
      });

      setForm({
        name: "",
        provider: "OPENAI",
        apiKey: "",
        model: "gpt-4o-mini",
        priority: 0,
        isEnabled: true,
      });

      await loadProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save provider.",
        variant: "destructive",
      });
    }
  };

  const handleTest = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/ai-providers/${id}/test`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Test failed");
      }
      toast({
        title: "Connection ok",
        description: "Provider connection verified.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Provider test failed.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this provider?")) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/ai-providers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      await loadProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete provider.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Providers</h1>
        <p className="text-muted-foreground">
          Configure multi-provider AI credentials and priority order.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add provider</CardTitle>
          <CardDescription>Store credentials securely and set priority.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Input
              placeholder="Provider name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
            <select
              className="rounded-md border border-border bg-background px-3 py-2"
              value={form.provider}
              onChange={(event) => setForm({ ...form, provider: event.target.value })}
            >
              <option value="OPENAI">OpenAI</option>
              <option value="ANTHROPIC">Anthropic</option>
              <option value="GOOGLE_GEMINI">Google Gemini</option>
              <option value="AZURE_OPENAI">Azure OpenAI</option>
            </select>
            <Input
              placeholder="API key"
              value={form.apiKey}
              onChange={(event) => setForm({ ...form, apiKey: event.target.value })}
              required
            />
            <Input
              placeholder="Model"
              value={form.model}
              onChange={(event) => setForm({ ...form, model: event.target.value })}
            />
            <Input
              placeholder="Priority"
              type="number"
              value={form.priority}
              onChange={(event) =>
                setForm({ ...form, priority: Number(event.target.value) })
              }
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isEnabled}
                onChange={(event) => setForm({ ...form, isEnabled: event.target.checked })}
              />
              Enabled
            </label>
            <Button type="submit">Save provider</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing providers</CardTitle>
          <CardDescription>Priority order is ascending.</CardDescription>
        </CardHeader>
        <CardContent>
          {providers.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">No providers yet.</div>
          ) : (
            <div className="space-y-4">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{provider.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {provider.provider} · {provider.model ?? "default"} · Priority{" "}
                      {provider.priority} · {provider.isEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleTest(provider.id)}>
                      Test
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(provider.id)}>
                      Delete
                    </Button>
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
