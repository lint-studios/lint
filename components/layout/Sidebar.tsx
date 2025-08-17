import { Home, Settings, FileText, Bell, Users, CreditCard, Building, Info, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";

interface SidebarProps {
  currentPage: "home" | "data-sources" | "reports";
  onPageChange: (page: "home" | "data-sources" | "reports") => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const pathname = usePathname();
  const { organization } = useOrganization();
  const [organizationExpanded, setOrganizationExpanded] = useState(false);

  // Check if we're on an organization route
  const isOnOrgRoute = pathname?.includes('/org/') && pathname?.includes('/organization/');
  
  // Auto-expand organization section when on org routes
  useEffect(() => {
    if (isOnOrgRoute) {
      setOrganizationExpanded(true);
    }
  }, [isOnOrgRoute]);

  const navigationItems: Array<{ id: "home" | "data-sources" | "reports"; label: string; icon: any; active: boolean }> = [
    { id: "home", label: "Home", icon: Home, active: true },
    { id: "data-sources", label: "Data Sources", icon: Settings, active: true },
    { id: "reports", label: "Reports", icon: FileText, active: true },
  ];

  const organizationItems = [
    { 
      id: "business-info", 
      label: "Business Info", 
      icon: Info, 
      href: organization ? `/org/${organization.id}/organization/business-info` : "#" 
    },
    { 
      id: "members-settings", 
      label: "Members & Settings", 
      icon: Users, 
      href: organization ? `/org/${organization.id}/organization/members-settings` : "#" 
    },
    { 
      id: "billing", 
      label: "Billing", 
      icon: CreditCard, 
      href: organization ? `/org/${organization.id}/organization/billing` : "#" 
    },
  ];



  return (
    <div className="w-60 bg-surface-card border-r border-border-subtle p-6 flex flex-col h-screen">
      {/* Navigation */}
      <nav className="space-y-1">
        {navigationItems.map((item) => {
          // Don't highlight main nav items when on organization routes
          const isActive = !isOnOrgRoute && currentPage === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "w-full justify-start font-body text-xs font-medium rounded-xl h-8",
                isActive ? "bg-primary text-white shadow-sm" : "hover:bg-surface-hover text-text-secondary hover:text-text-primary"
              )}
            >
            <item.icon className="h-4 w-4" />
            <span className="ml-3">{item.label}</span>
          </Button>
          );
        })}
      </nav>

      {/* Organization Section */}
      <div className="mt-8">
        <Button
          variant="ghost"
          onClick={() => setOrganizationExpanded(!organizationExpanded)}
          className="w-full justify-between font-body text-xs font-medium hover:bg-surface-hover transition-colors duration-200 rounded-xl h-8"
        >
          <div className="flex items-center">
            <Building className="h-4 w-4" />
            <span className="ml-3">Organization</span>
          </div>
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform",
              organizationExpanded ? "rotate-180" : ""
            )} 
          />
        </Button>
        
        {organizationExpanded && (
          <nav className="mt-1 ml-4 space-y-1">
            {organizationItems.map((item) => {
              const isActive = pathname?.includes(item.id);
              return (
                <Link key={item.id} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start font-body text-xs font-medium rounded-xl h-8",
                      isActive ? "bg-primary text-white shadow-sm" : "hover:bg-surface-hover text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="ml-3">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        )}
      </div>




    </div>
  );
}