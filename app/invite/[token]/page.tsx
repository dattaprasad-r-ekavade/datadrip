"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function InviteAcceptPage({ params }: { params: { token: string } }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token, name, password }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Failed to accept invite");
      }

      toast({
        title: "Invitation accepted",
        description: "You can now sign in with your new credentials.",
      });
      router.push("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message ?? "Failed to accept invite.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md border-border/60">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Accept invitation</CardTitle>
          <CardDescription>Create your account password to join the agency.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              placeholder="Full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Input
              placeholder="Create password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Accepting..." : "Accept invite"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
