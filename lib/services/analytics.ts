import { prisma } from "@/lib/prisma";

export interface AgencySummary {
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  roas: number | null;
  cpa: number | null;
  spendChangePct: number | null;
}

export interface CampaignSummary {
  platform: "META" | "GOOGLE";
  campaignId: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas?: number | null;
  cpa?: number | null;
}

const startOfDay = (value: Date) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const percentChange = (current: number, previous: number) => {
  if (previous === 0) {
    return null;
  }
  return ((current - previous) / previous) * 100;
};

export class AnalyticsService {
  static async getAgencySummary(agencyId: string, days = 7): Promise<AgencySummary> {
    const end = new Date();
    const start = startOfDay(new Date(end.getTime() - days * 24 * 60 * 60 * 1000));
    const previousStart = startOfDay(
      new Date(start.getTime() - days * 24 * 60 * 60 * 1000)
    );

    const current = await prisma.campaignMetric.aggregate({
      where: {
        date: { gte: start, lte: end },
        client: { agencyId },
      },
      _sum: {
        spend: true,
        impressions: true,
        clicks: true,
        conversions: true,
      },
      _avg: {
        roas: true,
        cpa: true,
      },
    });

    const previous = await prisma.campaignMetric.aggregate({
      where: {
        date: { gte: previousStart, lt: start },
        client: { agencyId },
      },
      _sum: {
        spend: true,
      },
    });

    const spend = Number(current._sum.spend ?? 0);
    const impressions = Number(current._sum.impressions ?? 0);
    const clicks = Number(current._sum.clicks ?? 0);
    const conversions = Number(current._sum.conversions ?? 0);
    const ctr = impressions ? (clicks / impressions) * 100 : 0;
    const roas = current._avg.roas ? Number(current._avg.roas) : null;
    const cpa = current._avg.cpa ? Number(current._avg.cpa) : null;

    return {
      spend,
      impressions,
      clicks,
      conversions,
      ctr,
      roas,
      cpa,
      spendChangePct: percentChange(spend, Number(previous._sum.spend ?? 0)),
    };
  }

  static async getTopCampaigns(agencyId: string, days = 7, limit = 5) {
    const end = new Date();
    const start = startOfDay(new Date(end.getTime() - days * 24 * 60 * 60 * 1000));

    const rows = await prisma.campaignMetric.groupBy({
      by: ["platform", "campaignId"],
      where: {
        date: { gte: start, lte: end },
        client: { agencyId },
      },
      _sum: {
        spend: true,
        impressions: true,
        clicks: true,
        conversions: true,
      },
      orderBy: {
        _sum: {
          spend: "desc",
        },
      },
      take: limit,
    });

    return rows.map((row) => ({
      platform: row.platform,
      campaignId: row.campaignId,
      spend: Number(row._sum.spend ?? 0),
      impressions: Number(row._sum.impressions ?? 0),
      clicks: Number(row._sum.clicks ?? 0),
      conversions: Number(row._sum.conversions ?? 0),
    })) as CampaignSummary[];
  }

  static async getSpendTrend(
    agencyId: string,
    days = 7,
    platform?: "META" | "GOOGLE"
  ) {
    const end = new Date();
    const start = startOfDay(new Date(end.getTime() - days * 24 * 60 * 60 * 1000));

    const metrics = await prisma.campaignMetric.findMany({
      where: {
        date: { gte: start, lte: end },
        client: { agencyId },
        ...(platform ? { platform } : {}),
      },
      select: { date: true, spend: true },
      orderBy: { date: "asc" },
    });

    const totals = new Map<string, number>();
    for (const metric of metrics) {
      const key = metric.date.toISOString().slice(0, 10);
      const current = totals.get(key) ?? 0;
      totals.set(key, current + Number(metric.spend ?? 0));
    }

    return Array.from(totals.entries()).map(([date, spend]) => ({
      date,
      spend,
    }));
  }
}
