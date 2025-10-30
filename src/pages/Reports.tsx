import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, TrendingUp, AlertTriangle, Shield, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('report-get');
      if (error) throw error;
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    toast.success('PDF generation feature coming soon!');
  };

  if (loading || !reportData) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </DashboardLayout>
    );
  }

  const eventTypeData = Object.entries(reportData.eventTypeCounts || {}).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

  const stats = [
    {
      title: "Total Events",
      value: reportData.totalLogs,
      icon: Activity,
      color: "text-primary",
    },
    {
      title: "Threats Blocked",
      value: reportData.threatsBlocked,
      icon: Shield,
      color: "text-success",
    },
    {
      title: "Warnings",
      value: reportData.warnings,
      icon: AlertTriangle,
      color: "text-warning",
    },
    {
      title: "Active Threats",
      value: reportData.threats,
      icon: TrendingUp,
      color: "text-destructive",
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Security Report</h1>
            <Button onClick={generatePDF} className="gap-2">
              <FileDown className="h-4 w-4" />
              Generate PDF
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Type Distribution */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Event Type Distribution</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={eventTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {eventTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Recent Threats */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Threats (Top 10)</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {reportData.recentThreats.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent threats</p>
                ) : (
                  reportData.recentThreats.map((threat: any) => (
                    <div key={threat.id} className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{threat.process_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{threat.file_path}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Entropy: {threat.entropy_score} | {new Date(threat.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Summary Text */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Report Summary</h2>
            <div className="prose prose-sm max-w-none text-foreground">
              <p>
                This report covers the security telemetry collected by Zerotrace. A total of <strong>{reportData.totalLogs}</strong> events 
                were monitored, with <strong>{reportData.threatsBlocked}</strong> threats successfully blocked and <strong>{reportData.warnings}</strong> warnings 
                flagged for review.
              </p>
              <p className="mt-4">
                The system detected <strong>{reportData.threats}</strong> active threats based on entropy analysis and file rename patterns. 
                All critical threats were automatically blocked to prevent potential ransomware encryption.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
