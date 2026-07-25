import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '@/store/slices/cartSlice';
import { addOrder } from '@/store/slices/ordersSlice';
import { X, CheckCircle, CreditCard, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CheckoutModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, discountPercent } = useSelector((state) => state.cart);
    const [step, setStep] = useState('form'); // 'form' | 'success'
    const [formData, setFormData] = useState({
        fullName: 'Lorem Customer',
        email: 'customer@shopground.era',
        address: '124 Lorem Avenue, Suite 400',
        city: 'San Francisco',
        zip: '94107',
        cardNumber: '•••• •••• •••• 4242',
    });

    if (!isOpen) return null;

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const shipping = subtotal > 150 ? 0 : 15.0;
    const total = subtotal - discountAmount + shipping;

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        const newOrder = {
            id: orderId,
            date: new Date().toISOString().split('T')[0],
            total: total,
            status: 'Processing',
            itemsCount: items.length,
            items: items.map(item => ({ name: item.name, qty: item.quantity, price: item.price })),
            shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`,
        };

        dispatch(addOrder(newOrder));
        dispatch(clearCart());
        setStep('success');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8">
                
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {step === 'form' ? (
                    <form onSubmit={handleSubmitOrder} className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-[#0F172A]">Complete Your Order</h2>
                            <p className="text-xs text-slate-500">Provide shipping and payment details for instant processing.</p>
                        </div>

                        {/* Shipping Form */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-[#5E6AD2] uppercase tracking-wider flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5" /> Shipping Address
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-600">Full Name</label>
                                    <Input
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                        className="text-xs mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-600">Email Address</label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="text-xs mt-1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold text-slate-600">Street Address</label>
                                <Input
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    required
                                    className="text-xs mt-1"
                                />
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-[#5E6AD2] uppercase tracking-wider flex items-center gap-1.5">
                                <CreditCard className="w-3.5 h-3.5" /> Payment Method
                            </h4>
                            <div>
                                <label className="text-[11px] font-semibold text-slate-600">Card Number</label>
                                <Input
                                    value={formData.cardNumber}
                                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                    required
                                    className="text-xs mt-1"
                                />
                            </div>
                        </div>

                        {/* Total Summary */}
                        <div className="bg-[#F4F5F8] p-4 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                            <div>
                                <span className="text-xs text-slate-500 font-medium">Total to Pay</span>
                                <p className="text-xl font-extrabold text-[#5E6AD2]">${total.toFixed(2)}</p>
                            </div>
                            <Button type="submit" className="bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white font-bold text-xs px-6 py-2 rounded-lg">
                                Place Order Now
                            </Button>
                        </div>
                    </form>
                ) : (
                    /* Order Success Screen */
                    <div className="text-center py-8 space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0F172A]">Order Successfully Placed!</h2>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Thank you for your order! Static lorem ipsum simulation has recorded your purchase under order history.
                        </p>

                        <div className="pt-4 flex justify-center gap-3">
                            <Button
                                onClick={() => {
                                    onClose();
                                    navigate('/orders');
                                }}
                                className="bg-[#5E6AD2] text-white font-semibold text-xs px-5 py-2"
                            >
                                Track Order in Dashboard
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
