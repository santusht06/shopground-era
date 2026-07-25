import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Package, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function OrdersView() {
    const navigate = useNavigate();
    const orders = useSelector((state) => state.orders.list);
    const user = useSelector((state) => state.auth.user);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-6">
                <div>
                    <Button
                        onClick={() => navigate('/')}
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-slate-900 gap-1 pl-0 mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Store Catalog
                    </Button>
                    <h1 className="text-2xl font-bold text-[#0F172A]">Customer Dashboard & Orders</h1>
                    <p className="text-xs text-slate-500">Welcome back, {user?.name || 'Customer'}</p>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
                <h2 className="text-lg font-bold text-[#0F172A]">Recent Purchases ({orders.length})</h2>

                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order.id} className="bg-white border-[#E5E7EB] shadow-xs">
                                <CardHeader className="bg-[#F4F5F8] border-b border-[#E5E7EB] py-3 px-6 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <span className="text-xs text-slate-400 font-medium">Order ID</span>
                                            <p className="text-sm font-bold text-[#0F172A]">{order.id}</p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <span className="text-xs text-slate-400 font-medium">Date</span>
                                            <p className="text-xs font-semibold text-slate-700">{order.date}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Badge
                                            variant={order.status === 'Delivered' ? 'success' : 'default'}
                                            className={order.status === 'Processing' ? 'bg-[#5E6AD2] text-white' : ''}
                                        >
                                            {order.status}
                                        </Badge>
                                        <span className="text-base font-extrabold text-[#5E6AD2]">
                                            ${order.total.toFixed(2)}
                                        </span>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-xs">
                                                <span className="font-semibold text-slate-800">
                                                    {item.qty}x {item.name}
                                                </span>
                                                <span className="text-slate-500">${(item.price * item.qty).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-100 pt-3 flex items-center gap-2 text-xs text-slate-500">
                                        <MapPin className="w-3.5 h-3.5 text-[#5E6AD2]" />
                                        <span>Shipping Address: {order.shippingAddress}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white border border-[#E5E7EB] rounded-xl p-6">
                        <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-600">No orders placed yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
