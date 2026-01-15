import { requireSuperAdminSession } from "@/lib/auth/session";
import SystemConfigPage from "./client-page";

export default async function Page() {
  await requireSuperAdminSession();
  return <SystemConfigPage />;
}
