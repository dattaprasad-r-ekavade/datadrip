import { Bot, DollarSign, LineChart, Timer } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const metrics = [
  {
    title: "Total ad spend",
    value: "INR 3.2Cr",
    change: "+12.4% vs last 7 days",
    icon: DollarSign,
  },
  {
    title: "AI insights generated",
    value: "42",
    change: "6 high-impact recommendations",
    icon: Bot,
  },
  {
    title: "Average ROAS",
    value: "4.6x",
    change: "+0.8 vs last period",
    icon: LineChart,
  },
  {
    title: "Sync freshness",
    value: "Last sync 12m ago",
    change: "Google Ads refresh queued",
    icon: Timer,
  },
] as const;

const upcomingTasks = [
  {
    client: "Acme Ventures",
    task: "Review AI insight: Optimize Meta lead campaign",
    due: "Today",
  },
  {
    client: "Brightline Labs",
    task: "Publish weekly performance report",
    due: "In 3 hours",
  },
  {
    client: "Fabrik Agency",
    task: "Sync Google Ads conversions",
    due: "Due tomorrow",
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Recent AI insights</CardTitle>
            <CardDescription>
              High-impact recommendations generated across connected accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/60 p-4">
                <p className="text-sm font-medium">Meta | Retention campaign optimisation</p>
                <p className="text-sm text-muted-foreground">
                  Reduce spend on high CPA ad sets and reinforce creative variants with &gt;5x ROAS.
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Next actions</CardTitle>
            <CardDescription>
              Stay ahead with today&apos;s most important follow-ups.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div
                key={task.client}
                className="flex items-start justify-between gap-3 rounded-md border border-border/60 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{task.client}</p>
                  <p className="text-sm text-muted-foreground">{task.task}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs",
                    task.due === "Today" ? "bg-amber-100 text-amber-800" : undefined
                  )}
                >
                  {task.due}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
