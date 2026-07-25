import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrderStatus, processReturnRequest } from '@/store/adminSlice';
import { Truck, Package, CheckCircle2, RotateCcw, AlertTriangle, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function LogisticsView() {
    const dispatch = useDispatch();
    const { orders, returnRequests } = useSelector((state) => state.admin);

    const [activeSubTab, setActiveSubTab] = useState('fulfillment'); // 'fulfillment' | 'returns'

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#0F172A]">Logistics, Warehousing & Returns</h1>
                    <p className="text-xs text-slate-500">Airway Bill (AWB) generation, courier partner dispatch, and customer refund processing.</p>
                </div>
            </div>

            {/* Sub Nav */}
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-1">
                <button
                    onClick={() => setActiveSubTab('fulfillment')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg ${
                        activeSubTab === 'fulfillment' ? 'bg-[#5E6AD2] text-white' : 'text-slate-600 hover:bg-white'
                    }`}
                >
                    Order Dispatch & AWBs ({orders.length})
                </button>

                <button
                    onClick={() => setActiveSubTab('returns')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg ${
                        activeSubTab === 'returns' ? 'bg-[#5E6AD2] text-white' : 'text-slate-600 hover:bg-white'
                    }`}
                >
                    Return & Refund Requests ({returnRequests.length})
                </button>
            </div>

            {/* Sub Tab 1: Fulfillment & AWBs */}
            {activeSubTab === 'fulfillment' && (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="bg-white border-[#E5E7EB] p-5 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
                                <div>
                                    <span className="text-xs font-bold text-[#5E6AD2]">{order.id}</span>
                                    <p className="text-sm font-extrabold text-[#0F172A]">{order.customer}</p>
                                    <p className="text-xs text-slate-500">{order.shippingAddress}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Badge variant={order.status === 'Delivered' ? 'success' : 'default'}>
                                        {order.status}
                                    </Badge>
                                    <span className="text-base font-extrabold text-[#5E6AD2]">${order.total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#F4F5F8] p-3 rounded-xl border border-[#E5E7EB]">
                                <div>
                                    <span className="text-slate-400 font-medium block">Courier Partner</span>
                                    <span className="font-bold text-slate-800 flex items-center gap-1">
                                        <Truck className="w-3.5 h-3.5 text-[#5E6AD2]" /> {order.courier || 'FedEx Express'}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-slate-400 font-medium block">Airway Bill (AWB)</span>
                                    <span className="font-bold font-mono text-slate-900">{order.awbNumber || 'AWB-99824102'}</span>
                                </div>

                                <div>
                                    <span className="text-slate-400 font-medium block">Allocated Warehouse</span>
                                    <span className="font-bold text-slate-800 flex items-center gap-1">
                                        <Building className="w-3.5 h-3.5 text-[#5E6AD2]" /> {order.warehouse || 'Warehouse Alpha (US-West)'}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Sub Tab 2: Return Requests */}
            {activeSubTab === 'returns' && (
                <div className="space-y-4">
                    {returnRequests.map((req) => (
                        <Card key={req.id} className="bg-white border-[#E5E7EB] p-5 space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <RotateCcw className="w-4 h-4 text-rose-500" />
                                    <span className="font-bold text-[#0F172A] text-sm">{req.id} — Order {req.orderId}</span>
                                </div>
                                <Badge variant={req.status === 'Approved' ? 'success' : 'warning'}>
                                    {req.status}
                                </Badge>
                            </div>

                            <div className="text-xs space-y-1 text-slate-700">
                                <p><strong>Customer:</strong> {req.customer}</p>
                                <p><strong>Item:</strong> {req.product}</p>
                                <p><strong>Reason:</strong> "{req.reason}"</p>
                                <p><strong>Refund Value:</strong> <strong className="text-emerald-600">${req.refundAmount.toFixed(2)}</strong></p>
                            </div>

                            {req.status === 'Pending Approval' && (
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        size="sm"
                                        onClick={() => dispatch(processReturnRequest({ requestId: req.id, status: 'Approved' }))}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                                    >
                                        Approve Refund & AWB Return
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => dispatch(processReturnRequest({ requestId: req.id, status: 'Rejected' }))}
                                        className="text-xs text-rose-600 border-rose-200"
                                    >
                                        Reject Request
                                    </Button>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
