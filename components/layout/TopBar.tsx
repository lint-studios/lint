'use client'

import { ChevronDown, Bell, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useUser, useClerk, OrganizationSwitcher } from '@clerk/nextjs';
import { useState, useRef, useEffect } from 'react';

interface TopBarProps {
  onNavigateHome?: () => void;
}

export function TopBar({ onNavigateHome }: TopBarProps = {}) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    signOut();
    setIsUserMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        {/* Organization Switcher */}
        <div className="hidden sm:block">
          <OrganizationSwitcher
            appearance={{
              elements: {
                rootBox: "flex items-center",
                organizationSwitcherTrigger: "p-2 rounded-xl border border-border-subtle hover:bg-surface-hover transition-colors",
                organizationSwitcherTriggerIcon: "w-4 h-4",
                organizationPreview: "font-body text-body-s",
                organizationPreviewAvatarBox: "w-6 h-6",
                organizationPreviewMainIdentifier: "font-body text-body-s font-medium text-text-primary",
                organizationPreviewSecondaryIdentifier: "font-mono text-mono-label text-text-secondary",
              }
            }}
            hidePersonal={false}
            createOrganizationMode="modal"
            afterCreateOrganizationUrl="/dashboard"
            afterSelectOrganizationUrl="/dashboard"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 rounded-xl"
        >
          <Bell className="h-5 w-5 text-text-secondary" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full"></div>
        </Button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 h-auto p-2"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-body-s font-medium">
                {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-body-s font-body font-medium text-text-primary">
                {user?.fullName || user?.emailAddresses[0]?.emailAddress || 'User'}
              </div>
              <div className="text-mono-label font-mono text-text-secondary">
                {(user?.publicMetadata?.role as string) || 'Beta'}
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 text-text-secondary transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </Button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface-card border border-border-subtle rounded-xl shadow-lg py-2 z-50">
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-surface-hover transition-colors text-text-secondary hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-body text-body-s">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}