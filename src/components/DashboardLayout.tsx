import { useState } from "react";
import { Shield, Activity, FileText, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", icon: Activity, id: "dashboard" },
  { name: "Threat Logs", icon: Shield, id: "threats" },
  { name: "Reports", icon: FileText, id: "reports" },
  { name: "Settings", icon: Settings, id: "settings" },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary cyber-glow-sm" />
              <span className="text-lg font-bold text-foreground">Zerotrace</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5 text-sidebar-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-sidebar-foreground" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border border-primary/20 cyber-glow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {sidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          {sidebarOpen && (
            <div className="text-xs text-muted-foreground">
              <p>Version 1.0.0</p>
              <p className="mt-1">© 2025 Zerotrace</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
