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
  FileBarChart
} from "lucide-react";
import { Button } from "./ui/button";
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
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <p className="text-body-s font-body text-text-primary mb-2">
                Upgrade for more insights
              </p>
              <Button className="w-full text-body-s font-body" size="sm">
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}