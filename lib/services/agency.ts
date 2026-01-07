import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const createAgencySchema = z.object({
  name: z.string().min(1, "Agency name is required"),
  timezone: z.string().optional().default("Asia/Kolkata"),
  plan: z.enum(["STARTER", "GROWTH", "SCALE", "ENTERPRISE"]).optional().default("STARTER"),
  aiEnabled: z.boolean().optional().default(true),
});

const updateAgencySchema = z.object({
  name: z.string().min(1, "Agency name is required").optional(),
  timezone: z.string().optional(),
  plan: z.enum(["STARTER", "GROWTH", "SCALE", "ENTERPRISE"]).optional(),
  aiEnabled: z.boolean().optional(),
  settings: z.any().optional(),
});

export type CreateAgencyInput = z.infer<typeof createAgencySchema>;
export type UpdateAgencyInput = z.infer<typeof updateAgencySchema>;

export class AgencyService {
  static async create(data: CreateAgencyInput) {
    const validatedData = createAgencySchema.parse(data);

    return prisma.agency.create({
      data: validatedData,
    });
  }

  static async getById(id: string) {
    return prisma.agency.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isSuperAdmin: true,
            createdAt: true,
          },
        },
        clients: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            users: true,
            clients: true,
          },
        },
      },
    });
  }

  static async update(id: string, data: UpdateAgencyInput) {
    const validatedData = updateAgencySchema.parse(data);

    return prisma.agency.update({
      where: { id },
      data: validatedData,
    });
  }

  static async delete(id: string) {
    return prisma.agency.delete({
      where: { id },
    });
  }

  static async getAll() {
    return prisma.agency.findMany({
      include: {
        _count: {
          select: {
            users: true,
            clients: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getUserAgency(userId: string) {
    return prisma.agency.findFirst({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isSuperAdmin: true,
          },
        },
        clients: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
    });
  }
}