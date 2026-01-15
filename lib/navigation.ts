import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  CreditCard,
  Home,
  LineChart,
  Settings,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

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
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: LineChart,
  },
  {
    title: "Clients",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Competitors",
    href: "/dashboard/competitors",
    icon: Target,
    badge: "New",
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
    title: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
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
