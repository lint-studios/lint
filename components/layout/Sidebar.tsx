import { Home, Settings, FileText, Bell, Users, CreditCard, Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { cn } from "../ui/utils";

interface SidebarProps {
  currentPage: "home" | "settings" | "reports";
  onPageChange: (page: "home" | "settings" | "reports") => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const navigationItems: Array<{ id: "home" | "settings" | "reports"; label: string; icon: any; active: boolean }> = [
    { id: "home", label: "Home", icon: Home, active: true },
    { id: "settings", label: "Settings / Data", icon: Settings, active: true },
    { id: "reports", label: "Reports", icon: FileText, active: true },
  ];

  const reservedItems = [
    { id: "notifications", label: "Notifications", icon: Bell, active: false },
    { id: "team", label: "Team", icon: Users, active: false },
    { id: "billing", label: "Billing", icon: CreditCard, active: false },
  ];

  return (
    <div className="w-60 bg-surface-card border-r border-border-subtle p-6 flex flex-col">
      {/* Navigation */}
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={currentPage === item.id ? "default" : "ghost"}
            onClick={() => onPageChange(item.id)}
            className={cn(
              "w-full justify-start font-body",
              currentPage === item.id ? "text-white" : "text-body-s"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="ml-3">{item.label}</span>
          </Button>
        ))}
      </nav>

      {/* Reserved Section */}
      <div className="mt-8">
        <div className="text-mono-label font-mono text-text-secondary mb-2 px-3">
          RESERVED
        </div>
        <nav className="space-y-1">
          {reservedItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              disabled
              className="w-full justify-start text-body-s font-body opacity-50"
            >
              <item.icon className="h-4 w-4" />
              <span className="ml-3">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>

      {/* Upgrade Card */}
      <div className="mt-auto">
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-body-s font-body font-semibold text-text-primary mb-1">
                Upgrade for more insights
              </h4>
              <p className="text-mono-label font-mono text-text-secondary mb-3 leading-relaxed">
                Get unlimited reports and advanced analytics
              </p>
              <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-lg h-8">
                Upgrade
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}