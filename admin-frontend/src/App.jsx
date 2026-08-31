import React from 'react';
import { useSelector } from 'react-redux';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardOverview from '@/components/admin/DashboardOverview';
import ProductManagement from '@/components/admin/ProductManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import WarrantyManagement from '@/components/admin/WarrantyManagement';
import SchedulingView from '@/components/admin/SchedulingView';
import LogisticsView from '@/components/admin/LogisticsView';
import RbacView from '@/components/admin/RbacView';
import AnalyticsView from '@/components/admin/AnalyticsView';
import AuditLogsView from '@/components/admin/AuditLogsView';
import SettingsView from '@/components/admin/SettingsView';

export default function App() {
  const activeTab = useSelector((state) => state.admin.activeTab);

  return (
    <div className="min-h-screen flex bg-[#F4F5F8] text-[#0F172A]">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'warranty' && <WarrantyManagement />}
          {activeTab === 'scheduling' && <SchedulingView />}
          {activeTab === 'logistics' && <LogisticsView />}
          {activeTab === 'rbac' && <RbacView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'audit' && <AuditLogsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
