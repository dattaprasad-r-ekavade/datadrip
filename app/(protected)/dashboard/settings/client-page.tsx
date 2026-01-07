"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AgencyService } from "@/lib/services/agency";
import { AgencyForm } from "@/components/forms/agency-form";
import { useToast } from "@/hooks/use-toast";

interface AgencySettingsPageProps {
  agency: {
    id: string;
    name: string;
    timezone: string;
  };
}

export default function AgencySettingsPage({ agency }: AgencySettingsPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleUpdateAgency = async (data: { name: string; timezone: string }) => {
    setIsLoading(true);
    try {
      await AgencyService.update(agency.id, data);
      toast({
        title: "Success",
        description: "Agency settings updated successfully.",
      });
      router.refresh();
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to update agency settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Agency Settings</h1>
        <p className="text-muted-foreground">
          Manage your agency&apos;s configuration and preferences.
        </p>
      </div>

      <AgencyForm
        initialData={{
          name: agency.name,
          timezone: agency.timezone,
        }}
        onSubmit={handleUpdateAgency}
        isLoading={isLoading}
        submitLabel="Update Agency"
      />
    </div>
  );
}