import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrderStatus } from '@/store/adminSlice';
import { ShoppingBag, Truck, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OrderManagement() {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.admin.orders);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-[#0F172A]">Order Fulfillment</h1>
                <p className="text-xs text-slate-500">Track and update customer order dispatch statuses.</p>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id} className="bg-white border-[#E5E7EB] p-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-3">
                            <div>
                                <span className="text-xs font-bold text-[#5E6AD2]">{order.id}</span>
                                <p className="text-sm font-extrabold text-[#0F172A]">{order.customer}</p>
                                <p className="text-xs text-slate-400">{order.email} • {order.shippingAddress}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-lg font-extrabold text-[#0F172A]">${order.total.toFixed(2)}</span>
                                <select
                                    value={order.status}
                                    onChange={(e) => dispatch(updateOrderStatus({ orderId: order.id, status: e.target.value }))}
                                    className="bg-[#F4F5F8] border border-[#E5E7EB] rounded-lg text-xs py-1.5 px-3 font-semibold text-slate-800 focus:ring-1 focus:ring-[#5E6AD2]"
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="text-xs space-y-1 text-slate-600">
                            <span className="font-semibold text-slate-800">Order Items:</span>
                            <ul className="list-disc list-inside">
                                {order.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
