import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import WarrantyManagement from "@/components/admin/WarrantyManagement";

export default function App() {
  return (
    <div className="min-h-screen flex bg-[#F4F5F8] text-[#0F172A]">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <WarrantyManagement />
        </main>
      </div>
    </div>
  );
}
