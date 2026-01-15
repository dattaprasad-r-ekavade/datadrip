"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface SystemConfigRow {
  id: string;
  key: string;
  value: unknown;
  description?: string | null;
}

export default function SystemConfigPage() {
  const [configs, setConfigs] = useState<SystemConfigRow[]>([]);
  const [form, setForm] = useState({ key: "", value: "{}", description: "" });
  const { toast } = useToast();

  const loadConfigs = async () => {
    const response = await fetch("/api/admin/system-config");
    if (!response.ok) {
      throw new Error("Failed to load configs");
    }
    const data = await response.json();
    setConfigs(data.configs ?? []);
  };

  useEffect(() => {
    loadConfigs().catch(() =>
      toast({
        title: "Error",
        description: "Failed to load system configs.",
        variant: "destructive",
      })
    );
  }, [toast]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const parsedValue = JSON.parse(form.value || "{}");
      const response = await fetch("/api/admin/system-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: form.key,
          value: parsedValue,
          description: form.description || undefined,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save config");
      }
      setForm({ key: "", value: "{}", description: "" });
      await loadConfigs();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message ?? "Failed to save config.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this config?")) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/system-config/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete config");
      }
      await loadConfigs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete config.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">System Config</h1>
        <p className="text-muted-foreground">Manage global key-value settings.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add config</CardTitle>
          <CardDescription>Store JSON values for global settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Input
              placeholder="Key"
              value={form.key}
              onChange={(event) => setForm({ ...form, key: event.target.value })}
              required
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
            <textarea
              className="min-h-[96px] rounded-md border border-border bg-background px-3 py-2 text-sm md:col-span-2"
              placeholder='Value (JSON, e.g. {"reportingCadence":"daily"})'
              value={form.value}
              onChange={(event) => setForm({ ...form, value: event.target.value })}
            />
            <Button type="submit">Save config</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing configs</CardTitle>
        </CardHeader>
        <CardContent>
          {configs.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">No configs yet.</div>
          ) : (
            <div className="space-y-3">
              {configs.map((config) => (
                <div key={config.id} className="rounded-md border border-border/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold">{config.key}</div>
                      {config.description && (
                        <div className="text-xs text-muted-foreground">
                          {config.description}
                        </div>
                      )}
                      <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2 text-xs">
                        {JSON.stringify(config.value, null, 2)}
                      </pre>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(config.id)}
                    >
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
