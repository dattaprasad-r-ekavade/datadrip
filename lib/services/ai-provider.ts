import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createProviderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.enum(["OPENAI", "ANTHROPIC", "GOOGLE_GEMINI", "AZURE_OPENAI"]),
  apiKey: z.string().min(1, "API key is required"),
  model: z.string().optional(),
  projectId: z.string().optional(),
  priority: z.number().int().optional().default(0),
  isEnabled: z.boolean().optional().default(true),
  metadata: z.any().optional(),
});

const updateProviderSchema = createProviderSchema.partial();

export type CreateAIProviderInput = z.infer<typeof createProviderSchema>;
export type UpdateAIProviderInput = z.infer<typeof updateProviderSchema>;

export class AIProviderService {
  static async create(data: CreateAIProviderInput) {
    const validated = createProviderSchema.parse(data);
    return prisma.aIProvider.create({ data: validated });
  }

  static async list() {
    return prisma.aIProvider.findMany({
      orderBy: [{ isEnabled: "desc" }, { priority: "asc" }],
    });
  }

  static async update(id: string, data: UpdateAIProviderInput) {
    const validated = updateProviderSchema.parse(data);
    return prisma.aIProvider.update({
      where: { id },
      data: validated,
    });
  }

  static async remove(id: string) {
    return prisma.aIProvider.delete({ where: { id } });
  }
}
