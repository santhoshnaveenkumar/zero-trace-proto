import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const logs = [
  {
    id: 1,
    process: "explorer.exe",
    path: "C:\\Users\\Admin\\Documents\\report.docx.encrypted",
    entropy: 7.82,
    status: "blocked",
    timestamp: "2025-10-30 14:32:15",
  },
  {
    id: 2,
    process: "chrome.exe",
    path: "C:\\Users\\Admin\\Downloads\\setup.exe",
    entropy: 6.91,
    status: "flagged",
    timestamp: "2025-10-30 14:31:42",
  },
  {
    id: 3,
    process: "system",
    path: "C:\\Windows\\System32\\config\\SAM",
    entropy: 3.45,
    status: "safe",
    timestamp: "2025-10-30 14:30:18",
  },
  {
    id: 4,
    process: "svchost.exe",
    path: "C:\\ProgramData\\temp\\data.tmp",
    entropy: 5.23,
    status: "flagged",
    timestamp: "2025-10-30 14:28:56",
  },
  {
    id: 5,
    process: "notepad.exe",
    path: "C:\\Users\\Admin\\Desktop\\notes.txt",
    entropy: 2.87,
    status: "safe",
    timestamp: "2025-10-30 14:25:33",
  },
];

export function SystemLogsTable() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">System Activity Logs</h2>
        <p className="text-sm text-muted-foreground mt-1">Real-time process and file monitoring</p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="text-foreground font-semibold">Process</TableHead>
              <TableHead className="text-foreground font-semibold">File Path</TableHead>
              <TableHead className="text-foreground font-semibold text-center">Entropy</TableHead>
              <TableHead className="text-foreground font-semibold text-center">Status</TableHead>
              <TableHead className="text-foreground font-semibold">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-secondary/50">
                <TableCell className="font-medium data-mono">{log.process}</TableCell>
                <TableCell className="data-mono text-muted-foreground text-sm max-w-md truncate">
                  {log.path}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`font-semibold ${
                      log.entropy > 6.5
                        ? "status-threat"
                        : log.entropy > 4.5
                        ? "status-warning"
                        : "status-safe"
                    }`}
                  >
                    {log.entropy.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      log.status === "blocked"
                        ? "destructive"
                        : log.status === "flagged"
                        ? "secondary"
                        : "default"
                    }
                    className={
                      log.status === "blocked"
                        ? "bg-destructive/20 text-destructive border-destructive/30"
                        : log.status === "flagged"
                        ? "bg-warning/20 text-warning border-warning/30"
                        : "bg-success/20 text-success border-success/30"
                    }
                  >
                    {log.status === "blocked" ? "🔴 Blocked" : log.status === "flagged" ? "🟡 Flagged" : "🟢 Safe"}
                  </Badge>
                </TableCell>
                <TableCell className="data-mono text-sm text-muted-foreground">
                  {log.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
