import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import WarrantyManagement from "@/components/admin/WarrantyManagement";
import AdminLoginGate from "@/components/admin/AdminLoginGate";

export default function App() {
  const [authToken, setAuthToken] = useState(sessionStorage.getItem("sg_admin_token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthToken(sessionStorage.getItem("sg_admin_token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("sg_admin_token");
    setAuthToken(null);
  };

  if (!authToken) {
    return <AdminLoginGate onLoginSuccess={(token) => setAuthToken(token)} />;
  }

  return (
    <div className="min-h-screen flex bg-[#F4F5F8] text-[#0F172A]">
      {/* Sidebar Navigation */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onLogout={handleLogout} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <WarrantyManagement onAuthError={handleLogout} />
        </main>
      </div>
    </div>
  );
}
