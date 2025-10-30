import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Bell, User, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { startTelemetrySimulator } from "@/hooks/useTelemetry";

export function DashboardHeader() {
  const [monitoring, setMonitoring] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMonitoringStatus();
  }, []);

  const fetchMonitoringStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('status-get');
      if (error) throw error;
      if (data) {
        setMonitoring(data.monitoring_enabled);
      }
    } catch (error) {
      console.error('Error fetching monitoring status:', error);
    }
  };

  const handleMonitoringToggle = async (checked: boolean) => {
    try {
      setMonitoring(checked);
      const { error } = await supabase.functions.invoke('status-update', {
        body: { monitoring_enabled: checked }
      });
      if (error) throw error;
      toast.success(checked ? 'Monitoring activated' : 'Monitoring paused');
    } catch (error) {
      console.error('Error updating monitoring status:', error);
      toast.error('Failed to update monitoring status');
      setMonitoring(!checked);
    }
  };

  const handleStartSimulator = async () => {
    try {
      setLoading(true);
      await startTelemetrySimulator(10);
      toast.success('Simulated 10 telemetry events');
    } catch (error) {
      toast.error('Failed to start simulator');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-foreground">Security Dashboard</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Demo Mode Button */}
        <Button
          onClick={handleStartSimulator}
          disabled={loading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          {loading ? 'Generating...' : 'Generate Demo Events'}
        </Button>

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
            onCheckedChange={handleMonitoringToggle}
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
