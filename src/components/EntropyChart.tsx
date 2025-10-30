import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { time: "00:00", entropy: 3.2 },
  { time: "00:05", entropy: 3.4 },
  { time: "00:10", entropy: 3.1 },
  { time: "00:15", entropy: 3.5 },
  { time: "00:20", entropy: 4.2 },
  { time: "00:25", entropy: 5.8 },
  { time: "00:30", entropy: 7.2 },
  { time: "00:35", entropy: 7.5 },
  { time: "00:40", entropy: 7.8 },
  { time: "00:45", entropy: 6.9 },
  { time: "00:50", entropy: 4.1 },
  { time: "00:55", entropy: 3.3 },
];

export function EntropyChart() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">File Entropy Monitor</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time entropy analysis across system files</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Live</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
              label={{ value: "Entropy", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Line
              type="monotone"
              dataKey="entropy"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-muted-foreground">Normal (&lt; 4.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-muted-foreground">Elevated (4.5-6.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Critical (&gt; 6.5)</span>
          </div>
        </div>
        <span className="text-muted-foreground">Last updated: 2 seconds ago</span>
      </div>
    </Card>
  );
}
