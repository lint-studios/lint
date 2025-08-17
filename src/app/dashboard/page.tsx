"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TopBar } from "../../../components/layout/TopBar";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Dashboard } from "../../../components/dashboard/Dashboard";
import { DataSources } from "../../../components/dashboard/DataSources";
import { Reports } from "../../../components/dashboard/Reports";
import { Toaster } from "../../../components/ui/sonner";

type DashboardPage = "home" | "data-sources" | "reports";

export default function DashboardPageComponent() {
  const [currentPage, setCurrentPage] = useState<DashboardPage>("home");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle URL query parameter for page selection
  useEffect(() => {
    const pageParam = searchParams.get('page') as DashboardPage;
    if (pageParam && ["home", "data-sources", "reports"].includes(pageParam)) {
      setCurrentPage(pageParam);
    }
  }, [searchParams]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Dashboard />;
      case "data-sources":
        return <DataSources />;
      case "reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  const handlePageChange = (page: DashboardPage) => {
    setCurrentPage(page);
    if (page === "home") {
      router.push('/dashboard');
    } else {
      router.push(`/dashboard?page=${page}`);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F6F7FB]">
      <TopBar onNavigateHome={() => handlePageChange("home")} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        <main className="flex-1 overflow-auto pl-8">
          {renderPage()}
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
