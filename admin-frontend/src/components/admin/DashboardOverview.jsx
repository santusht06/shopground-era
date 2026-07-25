import React from 'react';
import { useSelector } from 'react-redux';
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardOverview() {
    const adminState = useSelector((state) => state.admin) || {};
    const products = adminState.products || [];
    const orders = adminState.orders || [];
    const customers = adminState.customers || [];

    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
    const lowStockProducts = products.filter(p => (p.stock || 0) <= 10);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-extrabold text-[#0F172A]">E-Commerce Control Panel</h1>
                <p className="text-xs text-slate-500">Live operational overview pointing to backend API & MongoDB/Redis data.</p>
            </div>

            {/* Low Stock Alert Widget if any */}
            {lowStockProducts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-xs text-amber-900">
                    <div className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Restock Alert: <strong>{lowStockProducts.length}</strong> product(s) have inventory under 10 units.</span>
                    </div>
                    <Badge variant="warning" className="text-[10px]">Action Required</Badge>
                </div>
            )}

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Card className="bg-white border-[#E5E7EB] glimmer-card p-5 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <DollarSign className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-[#0F172A]">${totalRevenue.toFixed(2)}</span>
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                            +14.2% <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </div>
                </Card>

                <Card className="bg-white border-[#E5E7EB] glimmer-card p-5 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Orders</span>
                        <div className="w-8 h-8 rounded-lg bg-[#5E6AD2]/10 text-[#5E6AD2] flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-[#0F172A]">{orders.length}</span>
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                            +8.1% <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </div>
                </Card>

                <Card className="bg-white border-[#E5E7EB] glimmer-card p-5 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Products</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Package className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-[#0F172A]">{products.length}</span>
                        <span className="text-xs text-slate-400 font-medium">In Stock</span>
                    </div>
                </Card>

                <Card className="bg-white border-[#E5E7EB] glimmer-card p-5 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Customers</span>
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-[#0F172A]">{customers.length}</span>
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                            +100% <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </div>
                </Card>
            </div>

            {/* Recent Orders Table Overview */}
            <Card className="bg-white border-[#E5E7EB] shadow-xs">
                <CardHeader className="py-4 border-b border-[#E5E7EB] flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-bold text-[#0F172A]">Recent Sales Activity</CardTitle>
                        <CardDescription className="text-xs">Real-time incoming orders from customer frontend.</CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#F4F5F8] text-slate-500 font-semibold border-b border-[#E5E7EB]">
                                <tr>
                                    <th className="py-3.5 px-6">Order ID</th>
                                    <th className="py-3.5 px-6">Customer</th>
                                    <th className="py-3.5 px-6">Date</th>
                                    <th className="py-3.5 px-6">Total Amount</th>
                                    <th className="py-3.5 px-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3.5 px-6 font-bold text-[#5E6AD2]">{order.id}</td>
                                        <td className="py-3.5 px-6 font-medium text-slate-900">{order.customer}</td>
                                        <td className="py-3.5 px-6 text-slate-500">{order.date}</td>
                                        <td className="py-3.5 px-6 font-extrabold text-[#0F172A]">${order.total.toFixed(2)}</td>
                                        <td className="py-3.5 px-6">
                                            <Badge
                                                variant={order.status === 'Delivered' ? 'success' : 'default'}
                                                className={order.status === 'Processing' ? 'bg-[#5E6AD2] text-white' : ''}
                                            >
                                                {order.status}
                                            </Badge>
                                        </td>
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
