import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { requireSuperAdmin } from "@/lib/auth/permissions";

export async function getCurrentSession() {
  return auth();
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function requireAdminSession() {
  const session = await requireSession();
  if (!session.user.isSuperAdmin && session.user.role === "MEMBER") {
    redirect("/dashboard");
  }

  return session;
}

export async function requireSuperAdminSession() {
  const session = await requireSession();
  try {
    requireSuperAdmin(session);
  } catch {
    redirect("/dashboard");
  }

  return session;
}
