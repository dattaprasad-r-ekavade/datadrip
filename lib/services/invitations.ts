import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomBytes } from "crypto";
import { hash } from "bcryptjs";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MEMBER"]),
  agencyId: z.string().min(1),
  invitedById: z.string().optional(),
});

export type CreateInvitationInput = z.infer<typeof inviteSchema>;

export class InvitationService {
  static async create(data: CreateInvitationInput) {
    const validated = inviteSchema.parse(data);
    const token = randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return prisma.invitation.create({
      data: {
        email: validated.email.toLowerCase(),
        role: validated.role,
        agencyId: validated.agencyId,
        token,
        expiresAt,
        invitedById: validated.invitedById,
      },
    });
  }

  static async listByAgency(agencyId: string) {
    return prisma.invitation.findMany({
      where: { agencyId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getByToken(token: string) {
    return prisma.invitation.findUnique({ where: { token } });
  }

  static async accept(token: string, password: string, name?: string) {
    const invitation = await prisma.invitation.findUnique({ where: { token } });
    if (!invitation) {
      throw new Error("Invitation not found");
    }
    if (invitation.acceptedAt) {
      throw new Error("Invitation already accepted");
    }
    if (invitation.expiresAt < new Date()) {
      throw new Error("Invitation expired");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: invitation.email,
        name,
        role: invitation.role,
        agencyId: invitation.agencyId,
        hashedPassword,
      },
    });

    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() },
    });

    return user;
  }
}
