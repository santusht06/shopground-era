import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    toggleCartDrawer,
    removeFromCart,
    updateQuantity,
    applyCoupon,
} from '@/store/slices/cartSlice';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CartDrawer({ onProceedToCheckout }) {
    const dispatch = useDispatch();
    const { items, isDrawerOpen, couponCode, discountPercent } = useSelector((state) => state.cart);
    const [inputCoupon, setInputCoupon] = useState('');
    const [couponMsg, setCouponMsg] = useState('');

    if (!isDrawerOpen) return null;

    // Subtotal Calculation
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discountAmount = (subtotal * discountPercent) / 100;

    // Free Shipping Goal ($150 target)
    const freeShippingTarget = 150;
    const amountNeededForFreeShipping = Math.max(0, freeShippingTarget - subtotal);
    const freeShippingProgress = Math.min(100, (subtotal / freeShippingTarget) * 100);
    const shipping = subtotal > 0 ? (subtotal >= freeShippingTarget ? 0 : 15.0) : 0;
    const total = subtotal - discountAmount + shipping;

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        if (!inputCoupon) return;
        dispatch(applyCoupon(inputCoupon));
        if (inputCoupon.toUpperCase() === 'APEX16' || inputCoupon.toUpperCase() === 'SHAREX20') {
            setCouponMsg('Coupon applied successfully!');
        } else {
            setCouponMsg('Invalid coupon code. Try APEX16');
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={() => dispatch(toggleCartDrawer(false))} />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-[#0C0C12] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between text-white">
                    
                    {/* Drawer Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#08080C]">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#F27E24]/10 border border-[#F27E24]/30 text-[#F27E24] flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-black text-white font-heading">Sample & Bulk Inquiry Bag</h2>
                        </div>
                        <button
                            onClick={() => dispatch(toggleCartDrawer(false))}
                            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Free Express Shipping Goal Progress Bar */}
                    {items.length > 0 && (
                        <div className="bg-[#F27E24]/10 p-4 border-b border-white/10 space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="flex items-center gap-1.5 text-slate-200">
                                    <Truck className="w-4 h-4 text-[#F27E24]" />
                                    {amountNeededForFreeShipping === 0 ? (
                                        <strong className="text-[#F27E24] font-bold">🎉 Unlocked FREE Priority Shipping!</strong>
                                    ) : (
                                        <span>Add <strong className="text-[#F27E24]">${amountNeededForFreeShipping.toFixed(2)}</strong> for FREE Shipping</span>
                                    )}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">{freeShippingProgress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/10">
                                <div
                                    className="bg-gradient-to-r from-[#F27E24] to-[#F5984A] h-full transition-all duration-300 rounded-full"
                                    style={{ width: `${freeShippingProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Cart Items List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {items.length > 0 ? (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-3.5 bg-[#111118] rounded-2xl border border-white/10 shadow-lg hover:border-[#F27E24]/40 transition-colors"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-contain rounded-xl bg-black/50 p-1 border border-white/10"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-white truncate font-heading">{item.name}</h4>
                                        <p className="text-xs font-black text-[#F27E24] font-mono mt-0.5">${item.price.toFixed(2)}</p>
                                        
                                        {/* Quantity Selector */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                                className="w-6 h-6 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300 hover:bg-[#F27E24] hover:text-white cursor-pointer transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="text-xs font-mono font-bold text-white px-1.5">{item.quantity}</span>
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                className="w-6 h-6 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300 hover:bg-[#F27E24] hover:text-white cursor-pointer transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => dispatch(removeFromCart(item.id))}
                                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 space-y-3">
                                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                                <p className="text-sm font-bold text-slate-300">Your inquiry bag is currently empty</p>
                                <p className="text-xs text-slate-500">Explore products in our catalog to add them to your sample inquiry.</p>
                            </div>
                        )}
                    </div>

                    {/* Drawer Footer & Inquiry Summary */}
                    {items.length > 0 && (
                        <div className="p-6 border-t border-white/10 bg-[#08080C] space-y-4">
                            {/* Coupon Form */}
                            <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Discount Code (e.g. APEX16)"
                                    value={inputCoupon}
                                    onChange={(e) => setInputCoupon(e.target.value)}
                                    className="bg-[#12121A] border-white/10 text-xs h-9 text-white placeholder:text-slate-500 focus:border-[#F27E24]"
                                />
                                <Button type="submit" size="sm" variant="outline" className="h-9 text-xs font-bold border-white/15 bg-white/5 text-slate-200 hover:bg-white/10">
                                    Apply
                                </Button>
                            </form>

                            {couponMsg && (
                                <p className={`text-[11px] font-medium flex items-center gap-1 ${discountPercent > 0 ? 'text-[#F27E24] font-bold' : 'text-rose-400'}`}>
                                    <Tag className="w-3 h-3" />
                                    {couponMsg}
                                </p>
                            )}

                            {/* Summary Rows */}
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between text-slate-400">
                                    <span>Target Subtotal</span>
                                    <span className="font-mono font-bold text-white">${subtotal.toFixed(2)}</span>
                                </div>
                                {discountPercent > 0 && (
                                    <div className="flex justify-between text-[#F27E24] font-bold">
                                        <span>Discount ({discountPercent}%)</span>
                                        <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-400">
                                    <span>Estimated Freight</span>
                                    <span>{shipping === 0 ? <strong className="text-[#F27E24] font-bold">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-base font-black text-[#F27E24] border-t border-white/10 pt-3">
                                    <span>Total Inquiry Value</span>
                                    <span className="text-[#F27E24] font-mono">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <Button
                                onClick={() => {
                                    dispatch(toggleCartDrawer(false));
                                    onProceedToCheckout();
                                }}
                                className="w-full gradient-btn-orange font-black text-sm h-12 rounded-xl gap-2 shadow-xl cursor-pointer"
                            >
                                <span>Proceed to Submit Inquiry</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
