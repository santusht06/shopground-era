import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '@/store/adminSlice';
import { Search, Bell, Sparkles, UserCheck, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AdminHeader() {
    const dispatch = useDispatch();
    const activeTab = useSelector((state) => state.admin.activeTab);

    return (
        <header className="sticky top-0 z-30 w-full border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md">
            <div className="px-6 h-16 flex items-center justify-between gap-4">
                
                {/* Mobile Nav Selector */}
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs font-bold border-[#5E6AD2] text-[#5E6AD2]">
                        Production Admin (admin.myapp.com)
                    </Badge>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#F4F5F8] px-3 py-1.5 rounded-full border border-[#E5E7EB] text-xs font-semibold text-slate-700">
                        <Shield className="w-3.5 h-3.5 text-[#5E6AD2]" />
                        <span>System Administrator</span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#5E6AD2] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        AD
                    </div>
                </div>

            </div>
        </header>
    );
}
