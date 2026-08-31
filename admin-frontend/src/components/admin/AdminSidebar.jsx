import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "@/store/adminSlice";
import {
    ShieldCheck,
    FileCheck,
    HardDrive,
} from "lucide-react";

export default function AdminSidebar() {
    const dispatch = useDispatch();
    const { activeTab } = useSelector((state) => state.admin);

    const navItems = [
        { id: "warranty", label: "Warranty & Claims Management", icon: ShieldCheck },
    ];

    return (
        <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col justify-between hidden md:flex min-h-screen">
            <div className="p-6 space-y-6">
                {/* Brand Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5E6AD2] text-white flex items-center justify-center font-black text-xl shadow-md">
                        S
                    </div>
                    <div>
                        <span className="text-sm font-extrabold text-[#0F172A] block leading-tight">ShopGround Era</span>
                        <span className="text-[10px] font-bold text-[#5E6AD2] uppercase tracking-wider block">Warranty Control Panel</span>
                    </div>
                </div>

                {/* Scope Badge */}
                <div className="bg-[#F4F5F8] p-3 rounded-xl border border-[#E5E7EB] text-xs space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">System Scope</span>
                    <span className="font-extrabold text-[#0F172A] block">Lifetime Warranty Audit</span>
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
                                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    isActive
                                        ? "bg-[#5E6AD2] text-white shadow-md"
                                        : "text-slate-600 hover:bg-[#F4F5F8] hover:text-slate-900"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Footer Storage Status */}
            <div className="p-6 border-t border-[#E5E7EB] bg-[#F4F5F8] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5 font-bold text-slate-700">
                        <HardDrive className="w-3.5 h-3.5 text-[#5E6AD2]" />
                        MinIO Storage
                    </span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active
                    </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                    https://admin.shopgroundera.com
                </div>
            </div>
        </aside>
    );
}
