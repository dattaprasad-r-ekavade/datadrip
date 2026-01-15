import { prisma } from "@/lib/prisma";
import { renderReportHtml } from "@/lib/reports/template";

const startOfDay = (value: Date) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export class ReportService {
  static async generateForClient(clientId: string, days = 7) {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { agency: true },
    });

    if (!client) {
      throw new Error("Client not found");
    }

    const periodEnd = new Date();
    const periodStart = startOfDay(
      new Date(periodEnd.getTime() - days * 24 * 60 * 60 * 1000)
    );

    const metrics = await prisma.campaignMetric.groupBy({
      by: ["platform"],
      where: {
        clientId,
        date: { gte: periodStart, lte: periodEnd },
      },
      _sum: {
        spend: true,
        impressions: true,
        clicks: true,
        conversions: true,
      },
    });

    const formattedMetrics = metrics.map((row) => ({
      platform: row.platform,
      spend: Number(row._sum.spend ?? 0),
      impressions: Number(row._sum.impressions ?? 0),
      clicks: Number(row._sum.clicks ?? 0),
      conversions: Number(row._sum.conversions ?? 0),
    }));

    const summary =
      formattedMetrics.length === 0
        ? "No campaign data captured for this period."
        : "Here is a summary of your ad performance for the last 7 days.";

    const reportHtml = renderReportHtml({
      clientName: client.name,
      periodStart,
      periodEnd,
      summary,
      metrics: formattedMetrics,
    });

    return prisma.report.create({
      data: {
        clientId,
        periodStart,
        periodEnd,
        channelData: formattedMetrics,
        summary,
        reportHtml,
      },
    });
  }

  static async listReportsByAgency(agencyId: string) {
    return prisma.report.findMany({
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
