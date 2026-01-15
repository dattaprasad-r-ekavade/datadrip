"use client";

import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface TrendRow {
  date: string;
  spend: number;
}

export function SpendTrendChart() {
  const [days, setDays] = useState(7);
  const [platform, setPlatform] = useState<"" | "META" | "GOOGLE">("");
  const [data, setData] = useState<TrendRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const params = new URLSearchParams({
        days: String(days),
        ...(platform ? { platform } : {}),
      });
      const response = await fetch(`/api/analytics/spend-trend?${params.toString()}`);
      if (response.ok) {
        const payload = await response.json();
        setData(payload.trend ?? []);
      }
      setIsLoading(false);
    };
    load();
  }, [days, platform]);

  return (
    <div className="rounded-lg border border-border/60 p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="text-sm font-semibold">Spend trend</div>
        <select
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          value={days}
          onChange={(event) => setDays(Number(event.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
        <select
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          value={platform}
          onChange={(event) => setPlatform(event.target.value as "" | "META" | "GOOGLE")}
        >
          <option value="">All platforms</option>
          <option value="META">Meta</option>
          <option value="GOOGLE">Google</option>
        </select>
      </div>
      <div className="h-64">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading trend...
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="spend" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
