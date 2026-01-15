import { prisma } from "@/lib/prisma";
import { z } from "zod";

const baseSchema = z.object({
  tier: z.enum(["STARTER", "GROWTH", "SCALE", "ENTERPRISE"]),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  priceMonthly: z.number().nonnegative(),
  priceYearly: z.number().nonnegative().optional(),
  currency: z.string().min(1, "Currency is required").default("INR"),
  billingInterval: z.enum(["monthly", "yearly"]).default("monthly"),
  clientLimit: z.number().int().nonnegative().optional(),
  userLimit: z.number().int().nonnegative().optional(),
  aiCredits: z.number().int().nonnegative().optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
});

const updateSchema = baseSchema.partial();

export type CreatePricingPlanInput = z.infer<typeof baseSchema>;
export type UpdatePricingPlanInput = z.infer<typeof updateSchema>;

export class PricingService {
  static async create(data: CreatePricingPlanInput) {
    const validated = baseSchema.parse(data);
    return prisma.pricingPlan.create({
      data: {
        ...validated,
        features: validated.features ?? [],
      },
    });
  }

  static async list() {
    return prisma.pricingPlan.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async listActive() {
    return prisma.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: "asc" },
    });
  }

  static async getPlanForAgency(agency: { plan: string }) {
    const plans = await PricingService.listActive();
    if (plans.length === 0) {
      return null;
    }
    const match = plans.find((plan) => plan.tier === agency.plan);
    return match ?? plans[0];
  }

  static async get(id: string) {
    return prisma.pricingPlan.findUnique({ where: { id } });
  }

  static async update(id: string, data: UpdatePricingPlanInput) {
    const validated = updateSchema.parse(data);
    return prisma.pricingPlan.update({
      where: { id },
      data: validated,
    });
  }

  static async remove(id: string) {
    return prisma.pricingPlan.delete({ where: { id } });
  }
}
