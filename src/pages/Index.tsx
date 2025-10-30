import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCards } from "@/components/StatsCards";
import { EntropyChart } from "@/components/EntropyChart";
import { RenameSpikeDetector } from "@/components/RenameSpikeDetector";
import { AlertPanel } from "@/components/AlertPanel";
import { SystemLogsTable } from "@/components/SystemLogsTable";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        
        <div className="p-6 space-y-6">
          {/* Stats Overview */}
          <StatsCards />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EntropyChart />
            <RenameSpikeDetector />
          </div>

          {/* Alerts and Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <AlertPanel />
            </div>
            <div className="lg:col-span-2">
              <SystemLogsTable />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
