"use client";

import { useOrganization } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TopBar } from "../../../../components/layout/TopBar";
import { Sidebar } from "../../../../components/layout/Sidebar";
import { Toaster } from "../../../../components/ui/sonner";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const { organization, isLoaded } = useOrganization();
  const [currentPage, setCurrentPage] = useState<"home" | "data-sources" | "reports">("home");

  const handlePageChange = (page: "home" | "data-sources" | "reports") => {
    setCurrentPage(page);
    // Navigate back to dashboard with the selected page
    router.push(`/dashboard?page=${page}`);
  };

  // Check if user has access to this organization
  useEffect(() => {
    if (isLoaded && organization) {
      if (organization.id !== params.id) {
        // Redirect to dashboard if user doesn't have access to this org
        router.push("/dashboard");
        return;
      }
    }
  }, [isLoaded, organization, params.id, router]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex flex-col bg-[#F6F7FB]">
        <div className="flex flex-1 overflow-hidden gap-8">
          <div className="w-60 bg-surface-card border-r border-border-subtle p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <main className="flex-1 overflow-auto">
            <div className="animate-pulse p-6">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!organization || organization.id !== params.id) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="h-screen flex flex-col bg-[#F6F7FB]">
      <TopBar onNavigateHome={() => router.push("/dashboard")} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        <main className="flex-1 overflow-auto pl-8">
          {children}
        </main>
      </div>
      <Toaster 
        position="bottom-right"
        richColors
        expand={true}
      />
    </div>
  );
}
