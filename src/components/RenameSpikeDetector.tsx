import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FileSearch } from "lucide-react";

const data = [
  { time: "00:00", renames: 12 },
  { time: "00:10", renames: 8 },
  { time: "00:20", renames: 15 },
  { time: "00:30", renames: 847 },
  { time: "00:40", renames: 5 },
  { time: "00:50", renames: 9 },
];

export function RenameSpikeDetector() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Rename Activity Monitor</h2>
          <p className="text-sm text-muted-foreground mt-1">Detecting rapid file renaming patterns</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/30">
          <FileSearch className="h-4 w-4 text-destructive" />
          <span className="text-sm font-medium text-destructive">Spike Detected</span>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Bar
              dataKey="renames"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
        <p className="text-sm text-foreground">
          <span className="font-semibold text-destructive">⚠️ Alert:</span> Detected 847 file renames in 15 seconds at 00:30 - 
          <span className="font-semibold"> Process blocked automatically</span>
        </p>
      </div>
    </Card>
  );
}
