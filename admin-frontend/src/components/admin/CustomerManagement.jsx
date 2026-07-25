import React from 'react';
import { useSelector } from 'react-redux';
import { Users, Mail, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CustomerManagement() {
    const customers = useSelector((state) => state.admin.customers);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-[#0F172A]">Customer Directory</h1>
                <p className="text-xs text-slate-500">Registered user accounts and lifetime value.</p>
            </div>

            <Card className="bg-white border-[#E5E7EB]">
                <CardContent className="p-0">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#F4F5F8] text-slate-500 font-semibold border-b border-[#E5E7EB]">
                            <tr>
                                <th className="py-3.5 px-6">Customer Name</th>
                                <th className="py-3.5 px-6">Email</th>
                                <th className="py-3.5 px-6">Role</th>
                                <th className="py-3.5 px-6">Orders Placed</th>
                                <th className="py-3.5 px-6">Lifetime Spent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {customers.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50">
                                    <td className="py-3.5 px-6 font-bold text-slate-900">{c.name}</td>
                                    <td className="py-3.5 px-6 text-slate-500">{c.email}</td>
                                    <td className="py-3.5 px-6">
                                        <Badge className="bg-[#5E6AD2] text-white text-[10px]">{c.role}</Badge>
                                    </td>
                                    <td className="py-3.5 px-6 font-semibold text-slate-700">{c.ordersCount} orders</td>
                                    <td className="py-3.5 px-6 font-extrabold text-[#0F172A]">${c.totalSpent.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
