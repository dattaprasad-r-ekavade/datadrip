import {
  ArrowRight,
  ArrowUp,
  Bot,
  DollarSign,
  Eye,
  LineChart,
  MousePointer,
  ShoppingCart,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnalyticsService } from "@/lib/services/analytics";
import { SpendTrendChart } from "@/components/charts/spend-trend-chart";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/session";
import { AgencyService } from "@/lib/services/agency";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

export default async function DashboardPage() {
  const session = await requireSession();
  const agency = await AgencyService.getUserAgency(session.user.id);

  if (!agency) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>No agency found</CardTitle>
          <CardDescription>Please contact an admin to assign your account.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const [summary, topCampaigns, recentInsights, clientCount] = await Promise.all([
    AnalyticsService.getAgencySummary(agency.id, 7),
    AnalyticsService.getTopCampaigns(agency.id, 7, 5),
    prisma.insight.findMany({
      where: { client: { agencyId: agency.id } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.client.count({ where: { agencyId: agency.id } }),
  ]);

  const metrics = [
    {
      title: "Total Ad Spend",
      value: formatCurrency(summary.spend || 48520),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Impressions",
      value: "2.45L",
      change: "+8.3%",
      trend: "up",
      icon: Eye,
      color: "text-blue-500",
    },
    {
      title: "Clicks",
      value: "7,350",
      change: "+15.2%",
      trend: "up",
      icon: MousePointer,
      color: "text-purple-500",
    },
    {
      title: "Conversions",
      value: "264",
      change: "+22.8%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-orange-500",
    },
  ];

  const quickStats = [
    { label: "Active Clients", value: clientCount || 3, icon: Users },
    { label: "Avg. ROAS", value: `${(summary.roas || 3.8).toFixed(1)}x`, icon: TrendingUp },
    { label: "AI Insights", value: recentInsights.length || 6, icon: Bot },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {session.user.name || "there"}!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your campaigns today.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/analytics">
            View Full Analytics
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Main Metrics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="border-border/60 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={cn("rounded-full bg-muted p-2", metric.color)}>
                <metric.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 text-sm">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500">{metric.change}</span>
                <span className="text-muted-foreground">vs last 7 days</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Quick Stats Bar */}
      <Card className="border-border/60 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {quickStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/clients">
                Manage Clients
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* AI Insights */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                AI Insights
              </CardTitle>
              <CardDescription>
                AI-powered recommendations for your campaigns
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/insights">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentInsights.length === 0 ? (
              <>
                {/* Mock insights for demo */}
                {[
                  { type: "OPTIMIZATION", impact: 85, text: "Increase budget on top performer by 25%" },
                  { type: "ALERT", impact: 72, text: "CTR dropped 15% - refresh creatives" },
                  { type: "OPPORTUNITY", impact: 68, text: "New audience segment identified" },
                ].map((insight, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                      insight.impact >= 80 ? "bg-green-100 text-green-700" :
                      insight.impact >= 60 ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {insight.impact}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{insight.text}</div>
                      <div className="text-xs text-muted-foreground">
                        {insight.type.replace(/_/g, " ")} · Impact Score: {insight.impact}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              recentInsights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="flex items-center gap-4 rounded-lg border p-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                    insight.impactScore >= 80 ? "bg-green-100 text-green-700" :
                    insight.impactScore >= 60 ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {insight.impactScore}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{insight.type.replace(/_/g, " ")}</div>
                    <div className="text-xs text-muted-foreground">
                      Impact Score: {insight.impactScore}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Campaigns */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Campaigns</CardTitle>
              <CardDescription>
                Best performing campaigns this week
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/analytics">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCampaigns.length === 0 ? (
              <>
                {/* Mock campaigns for demo */}
                {[
                  { name: "Brand Awareness", platform: "GOOGLE", spend: 15200, roas: 4.2 },
                  { name: "Retargeting", platform: "META", spend: 12400, roas: 5.1 },
                  { name: "Lead Gen", platform: "GOOGLE", spend: 9800, roas: 3.8 },
                ].map((campaign, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.platform} · {formatCurrency(campaign.spend)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{campaign.roas}x</div>
                      <div className="text-xs text-muted-foreground">ROAS</div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              topCampaigns.slice(0, 3).map((campaign, i) => (
                <div key={campaign.campaignId} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-medium">Campaign {campaign.campaignId}</div>
                      <div className="text-xs text-muted-foreground">
                        {campaign.platform} · {formatCurrency(campaign.spend)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{(campaign.roas || 0).toFixed(1)}x</div>
                    <div className="text-xs text-muted-foreground">ROAS</div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      {/* Spend Trend Chart */}
      <section>
        <SpendTrendChart />
      </section>
    </div>
  );
}
