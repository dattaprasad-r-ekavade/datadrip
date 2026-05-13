import { prisma } from "@/lib/prisma";
import { fetchMetaInsights } from "@/lib/integrations/meta";
import { fetchGoogleCampaignMetrics } from "@/lib/integrations/google-ads";

export interface SyncSummary {
  clientId: string;
  syncedAt: string;
  meta: { synced: number; attempted: boolean; success: boolean; error?: string };
  google: { synced: number; attempted: boolean; success: boolean; error?: string };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry<T>(fn: () => Promise<T>, retries = 2, baseDelayMs = 300): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        break;
      }
      await sleep(baseDelayMs * (attempt + 1));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Retry operation failed");
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
    let metaError: string | undefined;
    let googleError: string | undefined;
    const metaAttempted = Boolean(client.metaAccount?.accessToken && client.metaAccount?.accountId);
    const googleAttempted = Boolean(
      client.googleAccount?.accessToken && client.googleAccount?.customerId
    );

    if (metaAttempted) {
      try {
        const rows = await withRetry(
          () =>
            fetchMetaInsights(
              client.metaAccount!.accessToken,
              client.metaAccount!.accountId
            ),
          2
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
      } catch (error) {
        metaError = error instanceof Error ? error.message : "Meta sync failed";
      }
    }

    if (googleAttempted) {
      try {
        const rows = await withRetry(
          () =>
            fetchGoogleCampaignMetrics(
              client.googleAccount!.accessToken,
              client.googleAccount!.customerId
            ),
          2
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
      } catch (error) {
        googleError = error instanceof Error ? error.message : "Google sync failed";
      }
    }

    return {
      clientId,
      syncedAt: new Date().toISOString(),
      meta: {
        synced: metaSynced,
        attempted: metaAttempted,
        success: metaAttempted ? !metaError : true,
        error: metaError,
      },
      google: {
        synced: googleSynced,
        attempted: googleAttempted,
        success: googleAttempted ? !googleError : true,
        error: googleError,
      },
    };
  }
}
