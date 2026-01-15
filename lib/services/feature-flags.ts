import { prisma } from "@/lib/prisma";

export type FeatureFlags = Record<string, boolean>;

export class FeatureFlagService {
  static async getAgencyFlags(agencyId: string): Promise<FeatureFlags> {
    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
      select: { settings: true },
    });

    const settings = (agency?.settings as { featureFlags?: FeatureFlags } | null) ?? {};
    return settings.featureFlags ?? {};
  }

  static async updateAgencyFlags(agencyId: string, flags: FeatureFlags) {
    return prisma.agency.update({
      where: { id: agencyId },
      data: {
        settings: {
          featureFlags: flags,
        },
      },
    });
  }
}
