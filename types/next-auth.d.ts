import { type Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
      isSuperAdmin: boolean;
      agencyId?: string | null;
    };
  }

  interface User {
    role: Role;
    isSuperAdmin: boolean;
    agencyId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    isSuperAdmin: boolean;
    agencyId?: string | null;
  }
}
