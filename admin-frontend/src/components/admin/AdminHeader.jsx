import React from "react";
import { ShieldCheck, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminHeader() {
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

                {/* Status Indicator & Admin Avatar */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 bg-[#F4F5F8] px-3 py-1.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-slate-700">
                        <Lock className="w-3.5 h-3.5 text-[#5E6AD2]" />
                        <span>Authorized Manager</span>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-[#E5E7EB] shadow-xs">
                        <img src="/logo.png" alt="Admin Avatar" className="w-6 h-6 object-contain" />
                    </div>
                </div>

            </div>
        </header>
    );
}
