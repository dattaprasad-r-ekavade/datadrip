"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Eye,
  Globe,
  Lightbulb,
  Search,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const competitors = [
  {
    name: "CompetitorA Digital",
    domain: "competitora.com",
    adSpend: 850000,
    adSpendChange: 15.2,
    topKeywords: ["digital marketing agency", "seo services", "ppc management"],
    platforms: ["Google", "Meta", "LinkedIn"],
    adCount: 45,
    sentiment: "aggressive",
  },
  {
    name: "MarketPro Agency",
    domain: "marketpro.in",
    adSpend: 620000,
    adSpendChange: -5.8,
    topKeywords: ["performance marketing", "growth hacking", "lead generation"],
    platforms: ["Google", "Meta"],
    adCount: 32,
    sentiment: "stable",
  },
  {
    name: "GrowthFirst",
    domain: "growthfirst.co",
    adSpend: 480000,
    adSpendChange: 28.4,
    topKeywords: ["startup marketing", "d2c marketing", "ecommerce ads"],
    platforms: ["Google", "Meta", "TikTok"],
    adCount: 28,
    sentiment: "expanding",
  },
];

const competitorAds = [
  {
    competitor: "CompetitorA Digital",
    platform: "Google",
    headline: "Best Digital Marketing Agency in India | 500+ Happy Clients",
    description: "Award-winning agency. ROI-focused campaigns. Get free audit today!",
    cta: "Get Free Audit",
    firstSeen: "Dec 15, 2025",
    status: "active",
  },
  {
    competitor: "MarketPro Agency",
    platform: "Meta",
    headline: "10X Your Revenue with Performance Marketing",
    description: "We've helped 200+ brands scale. Data-driven strategies that work.",
    cta: "Book a Call",
    firstSeen: "Jan 2, 2026",
    status: "active",
  },
  {
    competitor: "GrowthFirst",
    platform: "Google",
    headline: "D2C Marketing Experts | ₹50Cr+ Revenue Generated",
    description: "Specialized in ecommerce. Meta, Google, TikTok ads. Free strategy call.",
    cta: "Get Strategy",
    firstSeen: "Jan 5, 2026",
    status: "active",
  },
];

const insights = [
  {
    type: "opportunity",
    title: "Keyword Gap Identified",
    description:
      "CompetitorA is not bidding on 'social media marketing agency' which has 12K monthly searches. Consider targeting this keyword.",
    impact: "high",
  },
  {
    type: "alert",
    title: "Competitor Increasing Spend",
    description:
      "GrowthFirst has increased ad spend by 28% this month. They're targeting your top-performing keywords.",
    impact: "medium",
  },
  {
    type: "trend",
    title: "New Ad Format Trending",
    description:
      "Competitors are seeing 2x CTR with video ads on Meta. Consider testing video creatives.",
    impact: "high",
  },
  {
    type: "opportunity",
    title: "Geographic Opportunity",
    description:
      "No competitor is actively targeting Tier-2 cities. Potential for lower CPC and untapped market.",
    impact: "medium",
  },
];

const marketShare = [
  { name: "Your Agency", share: 22, color: "hsl(var(--primary))" },
  { name: "CompetitorA", share: 28, color: "#ef4444" },
  { name: "MarketPro", share: 18, color: "#f59e0b" },
  { name: "GrowthFirst", share: 15, color: "#10b981" },
  { name: "Others", share: 17, color: "#6b7280" },
];

export default function CompetitorsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Competitor Intelligence</h1>
        <p className="text-muted-foreground">
          Monitor competitor ad strategies and discover opportunities.
        </p>
      </div>

      {/* Search */}
      <Card className="mb-8 border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Track New Competitor
          </CardTitle>
          <CardDescription>Enter a competitor's domain to start tracking their ads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter domain (e.g., competitor.com)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Button>
              <Zap className="mr-2 h-4 w-4" />
              Start Tracking
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">AI-Powered Insights</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((insight, index) => (
            <Card key={index} className="border-border/60">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      insight.type === "opportunity"
                        ? "bg-green-100 text-green-600"
                        : insight.type === "alert"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {insight.type === "opportunity" ? (
                      <Lightbulb className="h-5 w-5" />
                    ) : insight.type === "alert" ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <TrendingUp className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{insight.title}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          insight.impact === "high"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {insight.impact} impact
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Market Share */}
      <Card className="mb-8 border-border/60">
        <CardHeader>
          <CardTitle>Estimated Market Share</CardTitle>
          <CardDescription>Share of voice in your target keywords</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketShare.map((item) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className="w-32 font-medium">{item.name}</div>
                <div className="flex-1">
                  <div className="h-8 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.share}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right font-semibold">{item.share}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor List */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Tracked Competitors</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {competitors.map((competitor) => (
            <Card key={competitor.name} className="border-border/60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{competitor.name}</CardTitle>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      competitor.sentiment === "aggressive"
                        ? "bg-red-100 text-red-700"
                        : competitor.sentiment === "expanding"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {competitor.sentiment}
                  </span>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {competitor.domain}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Est. Monthly Ad Spend</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">
                        ₹{(competitor.adSpend / 100000).toFixed(1)}L
                      </span>
                      <span
                        className={`flex items-center text-sm ${
                          competitor.adSpendChange > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {competitor.adSpendChange > 0 ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs(competitor.adSpendChange)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Active Ads</div>
                    <div className="font-semibold">{competitor.adCount} ads</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Platforms</div>
                    <div className="flex gap-2 mt-1">
                      {competitor.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="rounded bg-muted px-2 py-0.5 text-xs font-medium"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Top Keywords</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {competitor.topKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full border px-2 py-0.5 text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Competitor Ads */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Recent Competitor Ads</CardTitle>
          <CardDescription>Latest ads from tracked competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitorAds.map((ad, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ad.competitor}</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs">{ad.platform}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">First seen: {ad.firstSeen}</span>
                </div>
                <div className="mb-2">
                  <div className="font-semibold text-primary">{ad.headline}</div>
                  <div className="text-sm text-muted-foreground">{ad.description}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">CTA: {ad.cta}</span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    {ad.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
