"use client";

import { useState } from "react";
import { TopBar } from "../../../components/layout/TopBar";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Dashboard } from "../../../components/dashboard/Dashboard";
import { Settings } from "../../../components/dashboard/Settings";
import { Reports } from "../../../components/dashboard/Reports";
import { Toaster } from "../../../components/ui/sonner";

type DashboardPage = "home" | "settings" | "reports";

export default function DashboardPageComponent() {
  const [currentPage, setCurrentPage] = useState<DashboardPage>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Dashboard />;
      case "settings":
        return <Settings />;
      case "reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F6F7FB]">
      <TopBar onNavigateHome={() => setCurrentPage("home")} />
      <div className="flex flex-1 overflow-hidden gap-8">
        <Sidebar 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <main className="flex-1 overflow-auto">
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
