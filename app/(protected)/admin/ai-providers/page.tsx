import { requireSuperAdminSession } from "@/lib/auth/session";
import AIProvidersPage from "./client-page";

export default async function Page() {
  await requireSuperAdminSession();
  return <AIProvidersPage />;
}
