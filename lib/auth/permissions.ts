import type { Role } from "@prisma/client";
import type { Session } from "next-auth";

const priorityMap: Record<Role, number> = {
  SUPER_ADMIN: 3,
  ADMIN: 2,
  MEMBER: 1,
};

export function hasRole(session: Session | null, roles: Role | Role[]): boolean {
  if (!session?.user) {
    return false;
  }

  const allowed = Array.isArray(roles) ? roles : [roles];
  return allowed.some((role) => priorityMap[session.user.role] >= priorityMap[role]);
}

export function requireRole(
  session: Session | null,
  roles: Role | Role[]
): asserts session is Session {
  if (!hasRole(session, roles)) {
    throw new Error("You are not authorized to access this resource");
  }
}

export function isSuperAdmin(session: Session | null): boolean {
  return Boolean(session?.user?.isSuperAdmin);
}

export function requireSuperAdmin(session: Session | null): asserts session is Session {
  if (!isSuperAdmin(session)) {
    throw new Error("Super admin privileges required");
  }
}
