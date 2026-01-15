"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ReportRow {
  id: string;
  summary: string;
  createdAt: string;
  client: { id: string; name: string };
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/reports");
        if (!response.ok) {
          throw new Error("Failed to load reports");
        }
        const data = await response.json();
        setReports(data.reports ?? []);
        const clientsResponse = await fetch("/api/clients?limit=100");
        if (clientsResponse.ok) {
          const clientData = await clientsResponse.json();
          setClients(clientData.clients ?? []);
          setSelectedClient(clientData.clients?.[0]?.id ?? "");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load reports.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [toast]);

  const handleGenerate = async () => {
    if (!selectedClient) {
      toast({
        title: "Select a client",
        description: "Choose a client before generating a report.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: selectedClient }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      toast({
        title: "Report generated",
        description: "A new report has been generated.",
      });
      const data = await response.json();
      setReports((prev) => [data, ...prev]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Review delivered performance reports across all clients.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate report</CardTitle>
          <CardDescription>Trigger a manual report for a client.</CardDescription>
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
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report history</CardTitle>
          <CardDescription>Most recent generated reports.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No reports generated yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-lg border border-border/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{report.client.name}</p>
                      <p className="text-sm text-muted-foreground">{report.summary}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>{new Date(report.createdAt).toLocaleDateString()}</div>
                      <a
                        className="text-primary underline"
                        href={`/api/reports/${report.id}/preview`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Preview
                      </a>
                    </div>
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
