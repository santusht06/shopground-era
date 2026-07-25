import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart3, TrendingUp, DollarSign, ArrowUpRight, PieChart, ShoppingCart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AnalyticsView() {
    const { orders, products } = useSelector((state) => state.admin);

    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-[#0F172A]">Financial Analytics & Reports</h1>
                <p className="text-xs text-slate-500">Sales velocity, category contribution, and revenue performance.</p>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Card className="bg-white border-[#E5E7EB] p-5 space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-[#0F172A]">${totalRevenue.toFixed(2)}</span>
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">+14.2% <ArrowUpRight className="w-3 h-3" /></span>
                    </div>
                </Card>

                <Card className="bg-white border-[#E5E7EB] p-5 space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Order Value (AOV)</span>
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-[#5E6AD2]">${avgOrderValue.toFixed(2)}</span>
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">+5.8% <ArrowUpRight className="w-3 h-3" /></span>
                    </div>
                </Card>

                <Card className="bg-white border-[#E5E7EB] p-5 space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conversion Rate</span>
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-[#0F172A]">3.82%</span>
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">+1.1% <ArrowUpRight className="w-3 h-3" /></span>
                    </div>
                </Card>
            </div>

            {/* Category Performance Breakdown */}
            <Card className="bg-white border-[#E5E7EB]">
                <CardHeader>
                    <CardTitle className="text-base font-bold text-[#0F172A]">Top Revenue Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3 text-xs">
                        <div>
                            <div className="flex justify-between font-semibold mb-1">
                                <span>Electronics & Audio</span>
                                <span className="text-[#5E6AD2] font-bold">62% ($480.00)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-[#5E6AD2] h-full rounded-full" style={{ width: '62%' }} />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between font-semibold mb-1">
                                <span>Furniture & Ergonomics</span>
                                <span className="text-[#5E6AD2] font-bold">25% ($190.00)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-[#5E6AD2] h-full rounded-full" style={{ width: '25%' }} />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between font-semibold mb-1">
                                <span>Accessories & Watches</span>
                                <span className="text-[#5E6AD2] font-bold">13% ($105.49)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-[#5E6AD2] h-full rounded-full" style={{ width: '13%' }} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
