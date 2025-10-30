import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const [monitoring, setMonitoring] = useState(true);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-foreground">Security Dashboard</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Monitoring Toggle */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary border border-border">
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              monitoring ? "bg-success animate-pulse-glow" : "bg-muted"
            )}
          />
          <span className="text-sm font-medium text-foreground">
            {monitoring ? "Monitoring Active" : "Monitoring Paused"}
          </span>
          <Switch
            checked={monitoring}
            onCheckedChange={setMonitoring}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* User */}
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <User className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </header>
  );
}
