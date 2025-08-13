"use client";

import { useParams } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { OrganizationProfile } from "@clerk/nextjs";

export default function MembersSettingsPage() {
  const params = useParams();
  const { organization, isLoaded } = useOrganization();

  // Check if user has access to this organization
  if (isLoaded && organization && organization.id !== params.id) {
    // Redirect to dashboard if user doesn't have access to this org
    window.location.href = "/dashboard";
    return null;
  }

  if (!isLoaded) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          <p>No organization found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Members & Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your organization's members and settings
        </p>
      </div>
      
      <OrganizationProfile 
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border border-gray-200 rounded-lg",
            pageScrollBox: "p-6",
            navbar: "border-b border-gray-200 pb-4 mb-6",
            navbarButton: "text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg",
            navbarButtonActive: "text-primary border-primary bg-primary/5",
            formButtonPrimary: "bg-primary hover:bg-primary/90",
            formButtonReset: "text-gray-600 hover:text-gray-900",
            formFieldLabel: "text-gray-700 font-medium text-sm",
            formFieldInput: "border-gray-300 focus:border-primary focus:ring-primary",
            badge: "bg-primary/10 text-primary",
            avatarBox: "w-10 h-10",
            userPreviewMainIdentifier: "text-gray-900 font-medium",
            userPreviewSecondaryIdentifier: "text-gray-600",
            tableHead: "bg-gray-50 text-gray-700 font-medium",
            tableRow: "border-b border-gray-100",
            tableCell: "text-gray-900",
            dividerLine: "bg-gray-200",
            dividerText: "text-gray-500",
            pageHeader: "mb-6",
            pageHeaderTitle: "text-xl font-semibold text-gray-900",
            pageHeaderSubtitle: "text-sm text-gray-600",
          }
        }}
      />
    </div>
  );
}
