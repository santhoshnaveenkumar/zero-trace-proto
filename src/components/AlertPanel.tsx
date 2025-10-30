import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const alerts = [
  {
    id: 1,
    type: "threat",
    title: "Potential Ransomware Detected",
    description: "Process explorer.exe is rapidly encrypting files in Documents folder",
    time: "2 minutes ago",
    severity: "critical",
  },
  {
    id: 2,
    type: "threat",
    title: "Suspicious File Renaming Pattern",
    description: "Detected 847 files renamed in 15 seconds - Process blocked",
    time: "5 minutes ago",
    severity: "high",
  },
  {
    id: 3,
    type: "warning",
    title: "Elevated Entropy Detected",
    description: "File entropy spike in C:\\Users\\Admin\\Downloads",
    time: "12 minutes ago",
    severity: "medium",
  },
];

export function AlertPanel() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold text-foreground">Active Threats</h2>
        </div>
        <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/30">
          {alerts.filter(a => a.type === "threat").length} Critical
        </Badge>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-all animate-slide-in-up"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                {alert.type === "threat" ? (
                  <Shield className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{alert.title}</h3>
                    <Badge
                      variant={alert.severity === "critical" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
