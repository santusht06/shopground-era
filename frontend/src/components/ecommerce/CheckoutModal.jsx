import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '@/store/slices/cartSlice';
import { addOrder } from '@/store/slices/ordersSlice';
import { login } from '@/store/slices/authSlice';
import { X, CheckCircle, CreditCard, Truck, UserCheck, ShieldAlert, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function CheckoutModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { items, discountPercent } = useSelector((state) => state.cart);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [checkoutMode, setCheckoutMode] = useState('auth_check'); // 'auth_check' | 'form' | 'success'
    const [isGuest, setIsGuest] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '124 Lorem Avenue, Suite 400',
        city: 'San Francisco',
        zip: '94107',
        cardNumber: '•••• •••• •••• 4242',
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || 'Lorem Customer',
                email: user.email || 'customer@shopground.era',
            }));
            setCheckoutMode('form');
        } else {
            setFormData(prev => ({
                ...prev,
                fullName: '',
                email: '',
            }));
            setCheckoutMode('auth_check');
        }
    }, [isAuthenticated, user, isOpen]);

    if (!isOpen) return null;

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const shipping = subtotal > 150 ? 0 : 15.0;
    const total = subtotal - discountAmount + shipping;

    const handleQuickLogin = () => {
        dispatch(login({
            id: 'usr-001',
            name: 'Lorem Customer',
            email: 'customer@shopground.era',
            phone: '+1 (555) 234-5678',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            role: 'VIP Customer',
            memberSince: 'January 2025',
        }));
        setIsGuest(false);
        setCheckoutMode('form');
    };

    const handleContinueGuest = () => {
        setIsGuest(true);
        setCheckoutMode('form');
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email) return;

        const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        const newOrder = {
            id: orderId,
            date: new Date().toISOString().split('T')[0],
            total: total,
            status: 'Processing',
            itemsCount: items.length,
            items: items.map(item => ({ name: item.name, qty: item.quantity, price: item.price })),
            shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`,
            customer: formData.fullName,
            email: formData.email,
        };

        dispatch(addOrder(newOrder));
        dispatch(clearCart());
        setCheckoutMode('success');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8">
                
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* STEP 1: Authentication Requirement Check */}
                {checkoutMode === 'auth_check' && (
                    <div className="space-y-6 text-center py-4">
                        <div className="w-12 h-12 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center mx-auto">
                            <ShieldAlert className="w-6 h-6" />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-[#0F172A] font-heading">Sign In Required to Place Order</h2>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                                Please sign in to your ShopGround account for instant order tracking and rewards, or continue as guest.
                            </p>
                        </div>

                        <div className="space-y-3 max-w-sm mx-auto pt-2">
                            <Button
                                onClick={handleQuickLogin}
                                className="gradient-btn-primary w-full text-xs font-bold h-11 rounded-xl gap-2 cursor-pointer"
                            >
                                <UserCheck className="w-4 h-4" />
                                <span>Sign In as Demo Customer</span>
                            </Button>

                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Or</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            <Button
                                onClick={handleContinueGuest}
                                variant="outline"
                                className="w-full text-xs font-semibold h-10 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 cursor-pointer"
                            >
                                <User className="w-4 h-4 text-slate-500" />
                                <span>Continue as Guest Checkout</span>
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Checkout Form */}
                {checkoutMode === 'form' && (
                    <form onSubmit={handleSubmitOrder} className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h2 className="text-xl font-bold text-[#0F172A] font-heading">Shipping & Payment Details</h2>
                                <p className="text-xs text-slate-500">Provide recipient info for order dispatch.</p>
                            </div>
                            {isGuest ? (
                                <Badge variant="outline" className="text-slate-600 border-slate-300 text-[10px]">
                                    Guest Checkout Mode
                                </Badge>
                            ) : (
                                <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                    Signed In ({user?.name})
                                </Badge>
                            )}
                        </div>

                        {/* Shipping Form */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5" /> Recipient Details
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-600">Full Name</label>
                                    <Input
                                        placeholder="Enter your name"
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
                                        placeholder="name@example.com"
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
                            <h4 className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest flex items-center gap-1.5">
                                <CreditCard className="w-3.5 h-3.5" /> Payment Details
                            </h4>
                            <div>
                                <label className="text-[11px] font-semibold text-slate-600">Card Number</label>
                                <Input
                                    value={formData.cardNumber}
                                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                    required
                                    className="text-xs mt-1 font-mono"
                                />
                            </div>
                        </div>

                        {/* Total Summary */}
                        <div className="bg-[#FAFAFC] p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                            <div>
                                <span className="text-xs text-slate-500 font-medium">Total Amount</span>
                                <p className="text-xl font-extrabold text-[#4F46E5]">${total.toFixed(2)}</p>
                            </div>
                            <Button type="submit" className="gradient-btn-primary font-bold text-xs px-6 py-2 rounded-xl">
                                Place Order Now
                            </Button>
                        </div>
                    </form>
                )}

                {/* STEP 3: Order Success Screen */}
                {checkoutMode === 'success' && (
                    <div className="text-center py-8 space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0F172A] font-heading">Order Successfully Placed!</h2>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Thank you for your order! Your purchase details have been saved to your account.
                        </p>

                        <div className="pt-4 flex justify-center gap-3">
                            <Button
                                onClick={() => {
                                    onClose();
                                    navigate('/profile');
                                }}
                                className="gradient-btn-primary font-bold text-xs px-6 py-2 rounded-xl"
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
