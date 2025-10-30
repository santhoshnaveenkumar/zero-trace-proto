import { Card } from "@/components/ui/card";
import { Shield, FileSearch, AlertTriangle, Activity } from "lucide-react";

const stats = [
  {
    title: "Files Monitored",
    value: "24,847",
    change: "+12% today",
    icon: FileSearch,
    color: "text-primary",
  },
  {
    title: "Threats Blocked",
    value: "3",
    change: "Last 24 hours",
    icon: Shield,
    color: "text-success",
  },
  {
    title: "Active Alerts",
    value: "2",
    change: "Requires attention",
    icon: AlertTriangle,
    color: "text-destructive",
  },
  {
    title: "System Health",
    value: "98%",
    change: "All systems operational",
    icon: Activity,
    color: "text-primary",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-6 bg-card border-border hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
