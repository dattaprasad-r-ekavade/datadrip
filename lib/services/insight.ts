import type { InsightType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateInsightText } from "@/lib/services/ai";

const DEFAULT_IMPACT = 50;

// Mock insights for demo - used when no AI provider is configured
const MOCK_INSIGHTS: Record<InsightType, { texts: string[]; impacts: number[] }> = {
  PERFORMANCE_ALERT: {
    texts: [
      "Your campaign CTR has dropped 15% this week. Consider refreshing ad creatives or adjusting targeting to improve engagement. Impact score: 75",
      "Cost per acquisition increased by 22% compared to last period. Review audience segments and consider pausing underperforming ad sets. Impact score: 80",
      "Impressions are down 30% while spend remains constant. Check if your ads are being shown to saturated audiences. Impact score: 70",
    ],
    impacts: [75, 80, 70],
  },
  OPTIMIZATION_OPPORTUNITY: {
    texts: [
      "Top performing ad set has 40% higher ROAS than average. Consider increasing budget allocation by 25% to maximize returns. Impact score: 85",
      "Mobile traffic converts 2x better than desktop. Shift 30% of budget to mobile-first campaigns for better ROI. Impact score: 82",
      "Weekend campaigns show 35% lower CPA. Schedule more budget during Saturday-Sunday for cost efficiency. Impact score: 78",
    ],
    impacts: [85, 82, 78],
  },
  BUDGET_ALERT: {
    texts: [
      "Current spend rate will exhaust monthly budget 5 days early. Consider reducing daily caps or pausing low-performers. Impact score: 90",
      "Campaign is underspending by 40% of daily budget. Broaden targeting or increase bids to improve delivery. Impact score: 72",
      "Budget utilization at 95% with 10 days remaining. Strong performance - consider requesting budget increase. Impact score: 65",
    ],
    impacts: [90, 72, 65],
  },
  CREATIVE_IDEA: {
    texts: [
      "Video ads in your vertical show 3x engagement. Consider creating short-form video content for top products. Impact score: 70",
      "Competitor analysis shows carousel ads trending. Test multi-product carousels highlighting your bestsellers. Impact score: 68",
      "User-generated content style ads see 45% higher trust signals. Source customer testimonials for ad creatives. Impact score: 72",
    ],
    impacts: [70, 68, 72],
  },
  AUDIENCE_RECOMMENDATION: {
    texts: [
      "Lookalike audience based on converters could expand reach by 200%. Create 1% lookalike from purchase events. Impact score: 80",
      "Age 25-34 segment drives 60% of conversions. Consider creating dedicated campaigns for this demographic. Impact score: 76",
      "Retargeting window of 7 days shows highest ROAS. Adjust remarketing lists for optimal conversion timing. Impact score: 74",
    ],
    impacts: [80, 76, 74],
  },
};

const getRandomMockInsight = (type: InsightType) => {
  const insights = MOCK_INSIGHTS[type];
  const index = Math.floor(Math.random() * insights.texts.length);
  return {
    text: insights.texts[index],
    impact: insights.impacts[index],
  };
};

const parseImpactScore = (text: string) => {
  const match = text.match(/impact score[:\s]+(\d{1,3})/i);
  if (!match) {
    return DEFAULT_IMPACT;
  }
  const value = Number(match[1]);
  if (Number.isNaN(value)) {
    return DEFAULT_IMPACT;
  }
  return Math.min(Math.max(value, 1), 100);
};

const buildSummary = (metrics: {
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}) =>
  `Spend ${metrics.spend.toFixed(2)}, impressions ${metrics.impressions}, clicks ${metrics.clicks}, conversions ${metrics.conversions}.`;

export class InsightService {
  static async generateForClient(clientId: string, type: InsightType) {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { agency: true },
    });

    if (!client) {
      throw new Error("Client not found");
    }

    const metrics = await prisma.campaignMetric.aggregate({
      where: { clientId },
      _sum: {
        spend: true,
        impressions: true,
        clicks: true,
        conversions: true,
      },
    });

    const summaryMetrics = {
      spend: Number(metrics._sum.spend ?? 0),
      impressions: Number(metrics._sum.impressions ?? 0),
      clicks: Number(metrics._sum.clicks ?? 0),
      conversions: Number(metrics._sum.conversions ?? 0),
    };

    const summary = buildSummary(summaryMetrics);

    // Try AI providers first if AI is enabled
    let aiText: string | null = null;
    let aiProvider: string | null = null;
    let aiModel: string | null = null;
    let impactScore = DEFAULT_IMPACT;

    if (client.agency.aiEnabled) {
      const providers = await prisma.aIProvider.findMany({
        where: { isEnabled: true },
        orderBy: [{ priority: "asc" }],
      });

      for (const provider of providers) {
        try {
          const completion = await generateInsightText({
            provider,
            type,
            summary,
          });
          aiText = completion.text || null;
          aiProvider = provider.name;
          aiModel = completion.model;
          impactScore = parseImpactScore(aiText || "");
          break;
        } catch (error) {
          console.error("AI provider failed:", error);
        }
      }
    }

    // Fall back to mock insights if no AI provider worked
    if (!aiText) {
      const mock = getRandomMockInsight(type);
      aiText = mock.text;
      aiProvider = "DataDrip AI";
      aiModel = "mock-v1";
      impactScore = mock.impact;
    }

    return prisma.insight.create({
      data: {
        clientId,
        type,
        payload: {
          recommendation: aiText,
          summary,
        },
        impactScore,
        aiProvider,
        aiModel,
      },
    });
  }

  static async listForAgency(agencyId: string) {
    return prisma.insight.findMany({
      where: { client: { agencyId } },
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: { id: true, name: true },
        },
      },
    });
  }
}
