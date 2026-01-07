import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createClientSchema = z.object({
  agencyId: z.string().min(1, "Agency ID is required"),
  name: z.string().min(1, "Client name is required"),
});

const updateClientSchema = z.object({
  name: z.string().min(1, "Client name is required").optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

export class ClientService {
  static async create(data: CreateClientInput) {
    const validatedData = createClientSchema.parse(data);

    return prisma.client.create({
      data: validatedData,
      include: {
        agency: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async getById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        agency: {
          select: {
            id: true,
            name: true,
            timezone: true,
          },
        },
        metaAccount: true,
        googleAccount: true,
        _count: {
          select: {
            reports: true,
            insights: true,
            metrics: true,
          },
        },
      },
    });
  }

  static async getByAgency(agencyId: string, options?: {
    skip?: number;
    take?: number;
    search?: string;
  }) {
    const { skip = 0, take = 50, search } = options || {};

    return prisma.client.findMany({
      where: {
        agencyId,
        ...(search && {
          name: {
            contains: search,
          },
        }),
      },
      include: {
        metaAccount: {
          select: {
            id: true,
            accountId: true,
          },
        },
        googleAccount: {
          select: {
            id: true,
            customerId: true,
          },
        },
        _count: {
          select: {
            reports: true,
            insights: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });
  }

  static async update(id: string, data: UpdateClientInput) {
    const validatedData = updateClientSchema.parse(data);

    return prisma.client.update({
      where: { id },
      data: validatedData,
      include: {
        agency: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async delete(id: string) {
    return prisma.client.delete({
      where: { id },
    });
  }

  static async getCount(agencyId: string) {
    return prisma.client.count({
      where: { agencyId },
    });
  }
}