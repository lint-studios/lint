import { ChevronDown, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface TopBarProps {
  onNavigateHome?: () => void;
}

export function TopBar({ onNavigateHome }: TopBarProps = {}) {
  return (
    <header className="h-16 bg-surface-card border-b border-border-subtle flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center">
        <button
          onClick={() => onNavigateHome?.()}
          className="font-body text-[1.875rem] font-medium leading-tight tracking-[-0.094rem] text-black hover:text-primary transition-colors duration-200"
        >
          lint<span className="text-primary">.</span>
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* User Menu */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 rounded-xl"
        >
          <Bell className="h-5 w-5 text-text-secondary" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full"></div>
        </Button>

        {/* User Profile */}
        <Button
          variant="ghost"
          className="flex items-center space-x-2 h-auto p-2"
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-body-s font-medium">
              JD
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-body-s font-body font-medium text-text-primary">
              John Doe
            </div>
            <div className="text-mono-label font-mono text-text-secondary">
              Beta
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-text-secondary" />
        </Button>
      </div>
    </header>
  );
}