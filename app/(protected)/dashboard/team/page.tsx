"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN" | "MEMBER" | "SUPER_ADMIN";
  createdAt: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  acceptedAt: string | null;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "MEMBER" });
  const [isInviting, setIsInviting] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    const [teamRes, inviteRes] = await Promise.all([
      fetch("/api/team"),
      fetch("/api/invitations"),
    ]);
    if (!teamRes.ok || !inviteRes.ok) {
      throw new Error("Failed to load team data");
    }
    const teamData = await teamRes.json();
    const inviteData = await inviteRes.json();
    setMembers(teamData.users ?? []);
    setInvitations(inviteData.invitations ?? []);
  };

  useEffect(() => {
    loadData().catch(() =>
      toast({
        title: "Error",
        description: "Failed to load team data.",
        variant: "destructive",
      })
    );
  }, [toast]);

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsInviting(true);
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Failed to send invite");
      }
      setInviteForm({ email: "", role: "MEMBER" });
      await loadData();
      toast({
        title: "Invite sent",
        description: "The team member will receive an email invite.",
      });
    } catch (error) {
      const message = (error as Error).message ?? "Failed to send invite.";
      toast({
        title: "Error",
        description: message.includes("limit")
          ? "User limit reached. Upgrade your plan to add more team members."
          : message,
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (userId: string, role: "ADMIN" | "MEMBER") => {
    try {
      const response = await fetch("/api/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (!response.ok) {
        throw new Error("Failed to update role");
      }
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground">
          Invite team members and manage their access roles.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Invite team member</CardTitle>
          <CardDescription>Send an invite link to join your agency.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3" onSubmit={handleInvite}>
            <Input
              placeholder="Email address"
              type="email"
              value={inviteForm.email}
              onChange={(event) => setInviteForm({ ...inviteForm, email: event.target.value })}
              required
            />
            <select
              className="rounded-md border border-border bg-background px-3 py-2"
              value={inviteForm.role}
              onChange={(event) =>
                setInviteForm({ ...inviteForm, role: event.target.value })
              }
            >
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
            </select>
            <Button type="submit" disabled={isInviting}>
              {isInviting ? "Sending..." : "Send invite"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pending invites</CardTitle>
          <CardDescription>Track invitations awaiting acceptance.</CardDescription>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">No pending invites.</div>
          ) : (
            <div className="space-y-3">
              {invitations.map((invite) => (
                <div key={invite.id} className="rounded-md border border-border/60 p-3">
                  <div className="text-sm font-semibold">{invite.email}</div>
                  <div className="text-xs text-muted-foreground">
                    Role: {invite.role} · Expires{" "}
                    {new Date(invite.expiresAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <CardDescription>Update member roles as needed.</CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">No team members found.</div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-4 rounded-md border border-border/60 p-3">
                  <div>
                    <div className="text-sm font-semibold">
                      {member.name ?? member.email}
                    </div>
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                  </div>
                  {member.role === "SUPER_ADMIN" ? (
                    <span className="text-xs text-muted-foreground">Super admin</span>
                  ) : (
                    <select
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={member.role}
                      onChange={(event) =>
                        handleRoleChange(member.id, event.target.value as "ADMIN" | "MEMBER")
                      }
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MEMBER">Member</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
