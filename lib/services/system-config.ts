import { prisma } from "@/lib/prisma";
import { z } from "zod";

const configSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
  description: z.string().optional(),
});

const updateSchema = configSchema.partial();

export type CreateSystemConfigInput = z.infer<typeof configSchema>;
export type UpdateSystemConfigInput = z.infer<typeof updateSchema>;

export class SystemConfigService {
  static async create(data: CreateSystemConfigInput, userId?: string) {
    const validated = configSchema.parse(data);
    return prisma.systemConfig.create({
      data: {
        key: validated.key,
        value: validated.value,
        description: validated.description,
        updatedById: userId,
      },
    });
  }

  static async list() {
    return prisma.systemConfig.findMany({
      orderBy: { updatedAt: "desc" },
    });
  }

  static async update(id: string, data: UpdateSystemConfigInput, userId?: string) {
    const validated = updateSchema.parse(data);
    return prisma.systemConfig.update({
      where: { id },
      data: {
        ...validated,
        updatedById: userId,
      },
    });
  }

  static async remove(id: string) {
    return prisma.systemConfig.delete({ where: { id } });
  }
}
