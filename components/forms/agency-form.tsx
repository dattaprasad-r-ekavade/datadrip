"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TimezoneSelector } from "@/components/ui/timezone-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const agencyFormSchema = z.object({
  name: z.string().min(1, "Agency name is required"),
  timezone: z.string().min(1, "Timezone is required"),
  aiEnabled: z.boolean().optional(),
});

type AgencyFormData = z.infer<typeof agencyFormSchema>;

interface AgencyFormProps {
  initialData?: Partial<AgencyFormData>;
  onSubmit: (data: AgencyFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function AgencyForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Create Agency",
}: AgencyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AgencyFormData>({
    resolver: zodResolver(agencyFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      timezone: initialData?.timezone || "Asia/Kolkata",
      aiEnabled: initialData?.aiEnabled ?? true,
    },
  });

  const handleSubmit = async (data: AgencyFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Agency Information</CardTitle>
        <CardDescription>
          Configure your agency&apos;s basic settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agency Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter agency name"
                      {...field}
                      disabled={isLoading || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <TimezoneSelector
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aiEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI insights</FormLabel>
                  <FormControl>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={field.value ?? true}
                        onChange={(event) => field.onChange(event.target.checked)}
                        disabled={isLoading || isSubmitting}
                      />
                      Enable AI-generated insights for this agency
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
