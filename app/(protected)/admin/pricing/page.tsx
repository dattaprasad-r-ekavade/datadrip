import { requireSuperAdminSession } from "@/lib/auth/session";
import PricingAdminPage from "./client-page";

export default async function Page() {
  await requireSuperAdminSession();
  return <PricingAdminPage />;
}
