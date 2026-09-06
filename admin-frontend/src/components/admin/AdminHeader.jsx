import React from "react";
import { ShieldCheck, Lock, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminHeader({ onLogout }) {
    return (
        <header className="sticky top-0 z-30 w-full border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md">
            <div className="px-6 h-16 flex items-center justify-between gap-4">
                
                {/* Portal Identity */}
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="ShopGround Era" className="h-8 w-auto object-contain md:hidden" />
                    <Badge variant="outline" className="text-xs font-extrabold border-[#5E6AD2] text-[#5E6AD2] px-3 py-1 bg-[#5E6AD2]/5">
                        ShopGround Era — Warranty Admin Portal
                    </Badge>
                </div>

                {/* Status Indicator & Sign Out */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 bg-[#F4F5F8] px-3 py-1.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-slate-700">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Session Authenticated</span>
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        title="Lock & Sign Out"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                    </button>
                </div>

            </div>
        </header>
    );
}
