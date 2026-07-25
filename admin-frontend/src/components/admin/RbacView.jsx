import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentRole } from '@/store/adminSlice';
import { Shield, Check, X, UserPlus, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function RbacView() {
    const dispatch = useDispatch();
    const { currentRole, availableRoles } = useSelector((state) => state.admin);

    const permissionsMatrix = [
        { feature: 'View Product Inventory', 'Super Admin': true, 'Store Manager': true, 'Catalog Specialist': true, 'Fulfillment Agent': true, 'Support Agent': true },
        { feature: 'Add / Edit / Delete Products', 'Super Admin': true, 'Store Manager': true, 'Catalog Specialist': true, 'Fulfillment Agent': false, 'Support Agent': false },
        { feature: 'Override Order Status & AWBs', 'Super Admin': true, 'Store Manager': true, 'Catalog Specialist': false, 'Fulfillment Agent': true, 'Support Agent': false },
        { feature: 'Approve Return & Refunds', 'Super Admin': true, 'Store Manager': true, 'Catalog Specialist': false, 'Fulfillment Agent': false, 'Support Agent': true },
        { feature: 'Schedule Flash Sales & Deals', 'Super Admin': true, 'Store Manager': true, 'Catalog Specialist': false, 'Fulfillment Agent': false, 'Support Agent': false },
        { feature: 'Manage Admin Users & Roles', 'Super Admin': true, 'Store Manager': false, 'Catalog Specialist': false, 'Fulfillment Agent': false, 'Support Agent': false },
        { feature: 'View Live System Audit Logs', 'Super Admin': true, 'Store Manager': true, 'Catalog Specialist': false, 'Fulfillment Agent': false, 'Support Agent': false },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#0F172A]">Role-Based Access Control (RBAC)</h1>
                    <p className="text-xs text-slate-500">Configure administrative security matrix and team permissions.</p>
                </div>
            </div>

            {/* Role Active Switcher Bar */}
            <Card className="bg-white border-[#E5E7EB] p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#5E6AD2]" />
                    <div>
                        <span className="text-xs text-slate-400 font-medium block">Current Context Role</span>
                        <h3 className="text-lg font-bold text-[#0F172A]">{currentRole}</h3>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Simulate Role:</span>
                    <select
                        value={currentRole}
                        onChange={(e) => dispatch(setCurrentRole(e.target.value))}
                        className="bg-[#F4F5F8] border border-[#E5E7EB] rounded-lg text-xs py-2 px-3 font-bold text-[#5E6AD2]"
                    >
                        {availableRoles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
            </Card>

            {/* Permissions Matrix Table */}
            <Card className="bg-white border-[#E5E7EB]">
                <CardHeader>
                    <CardTitle className="text-base font-bold text-[#0F172A]">Granular Permissions Matrix</CardTitle>
                    <CardDescription className="text-xs">Security permissions enforced per operational role.</CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#F4F5F8] text-slate-500 font-semibold border-b border-[#E5E7EB]">
                                <tr>
                                    <th className="py-3.5 px-6">System Feature / Action</th>
                                    {availableRoles.map((role) => (
                                        <th key={role} className="py-3.5 px-4 text-center">{role}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {permissionsMatrix.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="py-3.5 px-6 font-bold text-slate-900">{row.feature}</td>
                                        {availableRoles.map((role) => (
                                            <td key={role} className="py-3.5 px-4 text-center">
                                                {row[role] ? (
                                                    <span className="inline-flex p-1 bg-emerald-100 text-emerald-700 rounded-full">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex p-1 bg-slate-100 text-slate-400 rounded-full">
                                                        <X className="w-3.5 h-3.5" />
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
