import { 
  Home, 
  Settings, 
  FileText, 
  ChevronLeft,
  Menu,
  Bell,
  MessageSquare,
  Calendar,
  BarChart3,
  FileBarChart,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "./ui/utils";
import { useState } from "react";

interface SidebarProps {
  className?: string;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ className, currentPage, onPageChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: "Home", href: "home", active: currentPage === "home" },
    { icon: Settings, label: "Settings / Data", href: "settings", active: currentPage === "settings" },
    { icon: FileBarChart, label: "Reports", href: "reports", active: currentPage === "reports" },
  ];

  const reservedItems = [
    { icon: Bell, label: "Notifications", href: "notifications" },
    { icon: MessageSquare, label: "Team", href: "team" },
    { icon: BarChart3, label: "Billing", href: "billing" },
  ];

  return (
    <aside className={cn(
      "bg-surface-card border-r border-border-subtle transition-all duration-300",
      isCollapsed ? "w-20" : "w-60",
      className
    )}>
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="p-4 border-b border-border-subtle">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full justify-start"
          >
            <Menu className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2 font-body text-body-s">Menu</span>}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant={item.active ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-body-s font-body",
                  item.active && "bg-primary/10 text-primary border-primary/20"
                )}
                onClick={() => onPageChange(item.href)}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            );
          })}

          {/* Reserved Section */}
          <div className="pt-6">
            {!isCollapsed && (
              <div className="text-mono-label font-mono text-text-secondary mb-2 px-3">
                RESERVED
              </div>
            )}
            {reservedItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  disabled
                  className="w-full justify-start text-body-s font-body opacity-50"
                >
                  <Icon className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Upgrade Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border-subtle">
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
        )}
      </div>
    </aside>
  );
}