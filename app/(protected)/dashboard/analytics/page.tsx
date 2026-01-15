"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  DollarSign,
  Eye,
  MousePointer,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const spendData = [
  { date: "Jan 1", google: 12500, meta: 8200 },
  { date: "Jan 2", google: 14200, meta: 9100 },
  { date: "Jan 3", google: 11800, meta: 7800 },
  { date: "Jan 4", google: 15600, meta: 10200 },
  { date: "Jan 5", google: 13400, meta: 8900 },
  { date: "Jan 6", google: 16800, meta: 11500 },
  { date: "Jan 7", google: 18200, meta: 12800 },
  { date: "Jan 8", google: 15900, meta: 10600 },
  { date: "Jan 9", google: 17400, meta: 11900 },
  { date: "Jan 10", google: 19100, meta: 13200 },
  { date: "Jan 11", google: 16200, meta: 10800 },
  { date: "Jan 12", google: 18700, meta: 12400 },
  { date: "Jan 13", google: 20500, meta: 14100 },
  { date: "Jan 14", google: 19800, meta: 13600 },
];

const roasData = [
  { date: "Jan 1", roas: 2.8 },
  { date: "Jan 2", roas: 3.1 },
  { date: "Jan 3", roas: 2.6 },
  { date: "Jan 4", roas: 3.4 },
  { date: "Jan 5", roas: 3.2 },
  { date: "Jan 6", roas: 3.8 },
  { date: "Jan 7", roas: 4.1 },
  { date: "Jan 8", roas: 3.6 },
  { date: "Jan 9", roas: 3.9 },
  { date: "Jan 10", roas: 4.2 },
  { date: "Jan 11", roas: 3.5 },
  { date: "Jan 12", roas: 4.0 },
  { date: "Jan 13", roas: 4.5 },
  { date: "Jan 14", roas: 4.3 },
];

const channelBreakdown = [
  { name: "Google Search", value: 45, color: "#4285f4" },
  { name: "Google Display", value: 20, color: "#34a853" },
  { name: "Meta Feed", value: 25, color: "#1877f2" },
  { name: "Meta Stories", value: 10, color: "#e1306c" },
];

const topCampaigns = [
  { name: "Brand Awareness - Search", spend: 45200, roas: 4.8, change: 12.5 },
  { name: "Retargeting - Display", spend: 32100, roas: 5.2, change: 8.3 },
  { name: "Lead Gen - Meta Feed", spend: 28400, roas: 3.9, change: -2.1 },
  { name: "Product Launch - Search", spend: 24800, roas: 4.1, change: 15.7 },
  { name: "Holiday Sale - All", spend: 21500, roas: 3.5, change: 6.2 },
];

const conversionFunnel = [
  { stage: "Impressions", value: 2450000, percent: 100 },
  { stage: "Clicks", value: 73500, percent: 3 },
  { stage: "Landing Page Views", value: 58800, percent: 80 },
  { stage: "Add to Cart", value: 8820, percent: 15 },
  { stage: "Purchases", value: 2646, percent: 30 },
];

const metrics = [
  {
    title: "Total Ad Spend",
    value: "₹4,85,200",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "vs last 14 days",
  },
  {
    title: "Impressions",
    value: "24.5L",
    change: "+8.3%",
    trend: "up",
    icon: Eye,
    description: "vs last 14 days",
  },
  {
    title: "Clicks",
    value: "73,500",
    change: "+15.2%",
    trend: "up",
    icon: MousePointer,
    description: "vs last 14 days",
  },
  {
    title: "Conversions",
    value: "2,646",
    change: "+22.8%",
    trend: "up",
    icon: ShoppingCart,
    description: "vs last 14 days",
  },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("14d");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive view of your advertising performance across all platforms.
          </p>
        </div>
        <div className="flex gap-2">
          {["7d", "14d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 text-sm">
                {metric.trend === "up" ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )}
                <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {metric.change}
                </span>
                <span className="text-muted-foreground">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Spend Trend */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Ad Spend by Platform</CardTitle>
            <CardDescription>Daily spend breakdown across Google and Meta</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={spendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="google"
                  stackId="1"
                  stroke="#4285f4"
                  fill="#4285f4"
                  fillOpacity={0.6}
                  name="Google Ads"
                />
                <Area
                  type="monotone"
                  dataKey="meta"
                  stackId="1"
                  stroke="#1877f2"
                  fill="#1877f2"
                  fillOpacity={0.6}
                  name="Meta Ads"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ROAS Trend */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>ROAS Trend</CardTitle>
            <CardDescription>Return on ad spend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={roasData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" domain={[0, 5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="roas"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))" }}
                  name="ROAS"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Channel Breakdown */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Channel Breakdown</CardTitle>
            <CardDescription>Spend distribution by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={channelBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {channelBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Campaigns */}
        <Card className="border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
            <CardDescription>Campaigns ranked by ROAS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCampaigns.map((campaign, index) => (
                <div key={campaign.name} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Spend: ₹{campaign.spend.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{campaign.roas}x ROAS</div>
                    <div
                      className={`flex items-center justify-end gap-1 text-sm ${
                        campaign.change > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {campaign.change > 0 ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {Math.abs(campaign.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>User journey from impression to purchase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-4">
            {conversionFunnel.map((stage, index) => (
              <div key={stage.stage} className="flex-1 text-center">
                <div
                  className="mx-auto mb-2 rounded-t-lg bg-primary/80 transition-all hover:bg-primary"
                  style={{
                    height: `${stage.percent * 2}px`,
                    minHeight: "40px",
                  }}
                />
                <div className="font-medium">{stage.stage}</div>
                <div className="text-sm text-muted-foreground">
                  {stage.value.toLocaleString()}
                </div>
                {index > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">{stage.percent}% conv.</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
