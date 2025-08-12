import { Search, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function TopBar() {
  return (
    <header className="h-16 bg-surface-card border-b border-border-subtle flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="font-display text-heading-m font-semibold text-text-primary">
          lint.
        </h1>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
          <Input
            placeholder="Search insights, products, reports…"
            className="pl-10 bg-gray-100 border-0 font-body text-body-m"
          />
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-body-s font-medium">HL</span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-body-s font-medium text-text-primary">HelloLint User</div>
            <div className="text-mono-label text-text-secondary font-mono">Free Account</div>
          </div>
          <ChevronDown className="h-4 w-4 text-text-secondary" />
        </Button>
      </div>
    </header>
  );
}