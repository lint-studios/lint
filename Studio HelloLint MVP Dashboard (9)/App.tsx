import { useState } from "react";
import { SignIn } from "./components/auth/SignIn";
import { SignUp } from "./components/auth/SignUp";
import { TopBar } from "./components/layout/TopBar";
import { Sidebar } from "./components/layout/Sidebar";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Settings } from "./components/dashboard/Settings";
import { Reports } from "./components/dashboard/Reports";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";

type AuthView = "signin" | "signup" | null;
type DashboardPage = "home" | "settings" | "reports";

export default function App() {
  const [authView, setAuthView] = useState<AuthView>("signin");
  const [currentPage, setCurrentPage] = useState<DashboardPage>("home");

  // Demo bypass button (for visual testing)
  const DemoButton = () => (
    <div className="fixed top-4 right-4 z-50">
      <Button 
        onClick={() => setAuthView(null)}
        variant="outline"
        className="bg-white shadow-lg font-mono text-mono-label"
      >
        SKIP TO DASHBOARD
      </Button>
    </div>
  );

  // Show authentication screens
  if (authView) {
    if (authView === "signup") {
      return (
        <>
          <DemoButton />
          <SignUp 
            onSwitchToSignIn={() => setAuthView("signin")}
            onSignUp={() => setAuthView(null)}
          />
          <Toaster position="bottom-right" richColors expand={true} />
        </>
      );
    }
    
    return (
      <>
        <DemoButton />
        <SignIn 
          onSwitchToSignUp={() => setAuthView("signup")}
          onSignIn={() => setAuthView(null)}
        />
        <Toaster position="bottom-right" richColors expand={true} />
      </>
    );
  }

  // Show dashboard
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