import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12 lg:flex-row lg:items-start">
        <div className="max-w-xl space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center rounded-full border border-border/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Marketing intelligence for agencies
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Sign in to DataDrip</h1>
          <p className="text-lg text-muted-foreground">
            Connect Meta and Google Ads, automate weekly reporting, and deliver ready-to-act
            insights for your clients. Enter your work email to receive a secure magic link.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground lg:justify-start">
            <span>?? Email-based authentication</span>
            <span>?? AI insights across ad platforms</span>
            <span>?? Super admin controls</span>
          </div>
        </div>
        <LoginForm />
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        Need an invite?{" "}
        <Link href="/contact" className="underline">
          Talk to our team
        </Link>
      </footer>
    </div>
  );
}
