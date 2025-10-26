"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().min(1, "Email address is required").email("Enter a valid business email"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("next") ?? "/dashboard";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: LoginSchema) {
    setStatus("sending");
    setError(null);

    const response = await signIn("email", {
      email: values.email,
      redirect: false,
      callbackUrl,
    });

    if (response?.ok) {
      setStatus("sent");
      form.reset();
      return;
    }

    setStatus("error");
    setError(
      response?.error ?? "We were unable to deliver your magic link. Please try again in a moment."
    );
  }

  return (
    <Card className="w-full max-w-md border-border/60">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
        <CardDescription>
          We will email you a secure magic link so you can access your DataDrip dashboard.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      inputMode="email"
                      placeholder="agencylead@yourdomain.com"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {status === "sent" ? (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                Success! Check your inbox for a link to sign in. The link expires in 24 hours.
              </p>
            ) : null}
            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
              disabled={status === "sending" || status === "sent"}
            >
              {status === "sending"
                ? "Sending magic link..."
                : status === "sent"
                  ? "Magic link sent"
                  : "Email me a link"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By continuing you agree to our platform terms and confirm you are authorized to access
              client advertising data for your agency.
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
