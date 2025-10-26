import type { LucideIcon } from "lucide-react";
import { BarChart3, Bot, Home, Settings, ShieldCheck, Users } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  requiresSuperAdmin?: boolean;
};

export const mainNavigation: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Clients",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "AI Insights",
    href: "/dashboard/insights",
    icon: Bot,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: ShieldCheck,
    requiresSuperAdmin: true,
  },
];
