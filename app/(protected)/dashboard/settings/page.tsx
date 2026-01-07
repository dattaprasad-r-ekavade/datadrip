import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AgencyService } from "@/lib/services/agency";
import AgencySettingsPage from "./client-page";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get user's agency
  const agency = await AgencyService.getUserAgency(session.user.id);

  if (!agency) {
    redirect("/dashboard");
  }

  return <AgencySettingsPage agency={agency} />;
}