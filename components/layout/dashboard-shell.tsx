"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { mainNavigation } from "@/lib/navigation";

type DashboardShellProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isSuperAdmin: boolean;
  };
  children: ReactNode;
};

function getInitials(name?: string | null, email?: string | null) {
  const source = name ?? email ?? "User";
  return source
    .split(" ")
    .map((token) => token.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const navItems = mainNavigation.filter((item) =>
    item.requiresSuperAdmin ? user.isSuperAdmin : true
  );

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="space-y-1">
            <SidebarGroupLabel className="text-lg font-semibold">DataDrip</SidebarGroupLabel>
            <p className="text-xs text-muted-foreground">Connected marketing intelligence</p>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          {item.badge ? (
                            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {item.badge}
                            </span>
                          ) : null}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="rounded-lg border border-dashed border-border/60 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">AI Copilot</p>
            <p>Enable AI insights per agency from the admin panel.</p>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border/60 px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h2 className="text-lg font-semibold leading-none">Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                Monitor spend, insights, and campaign health.
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn("flex items-center gap-3 px-2")}
                aria-label="Open user menu"
              >
                <Avatar className="size-8">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name ?? user.email ?? "User"} />
                  ) : null}
                  <AvatarFallback>{getInitials(user.name, user.email)}</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium leading-none sm:block">
                  {user.name ?? user.email ?? "DataDrip User"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{user.name ?? "DataDrip User"}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Account settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                <LogOut className="mr-2 size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-y-auto bg-muted/40 px-6 py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function DashboardShellFallback() {
  return (
    <div className="flex min-h-[60vh] flex-col gap-6">
      <Skeleton className="h-10 w-72" />
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-48" />
        ))}
      </div>
    </div>
  );
}
