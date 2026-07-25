import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentRole } from '@/store/adminSlice';
import { Shield, ChevronDown, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminHeader() {
    const dispatch = useDispatch();
    const { currentRole, availableRoles } = useSelector((state) => state.admin);

    return (
        <header className="sticky top-0 z-30 w-full border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md">
            <div className="px-6 h-16 flex items-center justify-between gap-4">
                
                {/* Domain & Scope */}
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs font-bold border-[#5E6AD2] text-[#5E6AD2]">
                        Production Enterprise (admin.myapp.com)
                    </Badge>
                </div>

                {/* Role Switcher & Profile */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#F4F5F8] px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
                        <Shield className="w-4 h-4 text-[#5E6AD2]" />
                        <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Role:</span>
                        <select
                            value={currentRole}
                            onChange={(e) => dispatch(setCurrentRole(e.target.value))}
                            className="bg-transparent font-bold text-xs text-[#0F172A] focus:outline-none cursor-pointer"
                        >
                            {availableRoles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#5E6AD2] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        AD
                    </div>
                </div>

            </div>
        </header>
    );
}
