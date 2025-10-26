import { Suspense, type ReactNode } from "react";

import { DashboardShell, DashboardShellFallback } from "@/components/layout/dashboard-shell";
import { requireSession } from "@/lib/auth/session";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return (
    <DashboardShell user={session.user}>
      <Suspense fallback={<DashboardShellFallback />}>{children}</Suspense>
    </DashboardShell>
  );
}
