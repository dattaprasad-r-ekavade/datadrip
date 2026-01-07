import { prisma } from "@/lib/prisma";
import { fetchMetaInsights } from "@/lib/integrations/meta";
import { fetchGoogleCampaignMetrics } from "@/lib/integrations/google-ads";

export interface SyncSummary {
  clientId: string;
  meta: { synced: number };
  google: { synced: number };
}

export class SyncService {
  static async syncClient(clientId: string): Promise<SyncSummary> {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        metaAccount: true,
        googleAccount: true,
      },
    });

    if (!client) {
      throw new Error("Client not found");
    }

    let metaSynced = 0;
    let googleSynced = 0;

    if (client.metaAccount?.accessToken && client.metaAccount?.accountId) {
      const rows = await fetchMetaInsights(
        client.metaAccount.accessToken,
        client.metaAccount.accountId
      );

      for (const row of rows) {
        await prisma.campaignMetric.upsert({
          where: {
            clientId_platform_campaignId_date: {
              clientId,
              platform: "META",
              campaignId: row.campaignId,
              date: row.date,
            },
          },
          update: {
            spend: row.spend,
            impressions: row.impressions,
            clicks: row.clicks,
            conversions: row.conversions,
          },
          create: {
            clientId,
            platform: "META",
            campaignId: row.campaignId,
            date: row.date,
            spend: row.spend,
            impressions: row.impressions,
            clicks: row.clicks,
            conversions: row.conversions,
          },
        });
      }

      metaSynced = rows.length;
    }

    if (client.googleAccount?.accessToken && client.googleAccount?.customerId) {
      const rows = await fetchGoogleCampaignMetrics(
        client.googleAccount.accessToken,
        client.googleAccount.customerId
      );

      for (const row of rows) {
        await prisma.campaignMetric.upsert({
          where: {
            clientId_platform_campaignId_date: {
              clientId,
              platform: "GOOGLE",
              campaignId: row.campaignId,
              date: row.date,
            },
          },
          update: {
            spend: row.spend,
            impressions: row.impressions,
            clicks: row.clicks,
            conversions: row.conversions,
          },
          create: {
            clientId,
            platform: "GOOGLE",
            campaignId: row.campaignId,
            date: row.date,
            spend: row.spend,
            impressions: row.impressions,
            clicks: row.clicks,
            conversions: row.conversions,
          },
        });
      }

      googleSynced = rows.length;
    }

    return {
      clientId,
      meta: { synced: metaSynced },
      google: { synced: googleSynced },
    };
  }
}
