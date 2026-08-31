import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '@/store/adminSlice';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Calendar,
    Truck,
    Shield,
    ShieldCheck,
    BarChart3,
    FileText,
    Settings,
} from 'lucide-react';

export default function AdminSidebar() {
    const dispatch = useDispatch();
    const { activeTab, currentRole } = useSelector((state) => state.admin);

    const navItems = [
        { id: 'dashboard', label: 'Control Center', icon: LayoutDashboard },
        { id: 'products', label: 'Inventory & Variants', icon: Package },
        { id: 'orders', label: 'Order Fulfillment', icon: ShoppingBag },
        { id: 'warranty', label: 'Warranty & Claims', icon: ShieldCheck },
        { id: 'scheduling', label: 'Flash Sales & Campaigns', icon: Calendar },
        { id: 'logistics', label: 'Logistics & Returns', icon: Truck },
        { id: 'rbac', label: 'RBAC & Permissions', icon: Shield },
        { id: 'analytics', label: 'Financial Analytics', icon: BarChart3 },
        { id: 'audit', label: 'Audit Logs & Settings', icon: FileText },
    ];

    return (
        <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col justify-between hidden md:flex min-h-screen">
            <div className="p-6 space-y-6">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#5E6AD2] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        A
                    </div>
                    <div>
                        <span className="text-base font-extrabold text-[#0F172A] block leading-tight">Amazon-Grade Portal</span>
                        <span className="text-[10px] font-semibold text-[#5E6AD2] uppercase tracking-wider block">admin.shopgroundera.com</span>
                    </div>
                </div>

                {/* Role Badge Pill */}
                <div className="bg-[#F4F5F8] p-2.5 rounded-xl border border-[#E5E7EB] text-xs">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Active Role</span>
                    <span className="font-extrabold text-[#5E6AD2]">{currentRole}</span>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => dispatch(setActiveTab(item.id))}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                    isActive
                                        ? 'bg-[#5E6AD2] text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-[#F4F5F8] hover:text-slate-900'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Footer Status */}
            <div className="p-6 border-t border-[#E5E7EB] bg-[#F4F5F8] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>MongoDB & Redis</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 1.2ms
                    </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                    CORS: admin.shopgroundera.com
                </div>
            </div>
        </aside>
    );
}
