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
        if (inputCoupon.toUpperCase() === 'LOREM10' || inputCoupon.toUpperCase() === 'SHAREX20') {
            setCouponMsg('Coupon applied successfully!');
        } else {
            setCouponMsg('Invalid coupon code. Try LOREM10');
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={() => dispatch(toggleCartDrawer(false))} />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-white border-l border-[#E5E7EB] shadow-2xl flex flex-col justify-between">
                    
                    {/* Drawer Header */}
                    <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F4F5F8]">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-[#5E6AD2]" />
                            <h2 className="text-lg font-bold text-[#0F172A]">Your Shopping Bag</h2>
                        </div>
                        <button
                            onClick={() => dispatch(toggleCartDrawer(false))}
                            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Free Shipping Goal Progress Bar */}
                    {items.length > 0 && (
                        <div className="bg-[#5E6AD2]/5 p-4 border-b border-[#E5E7EB] space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="flex items-center gap-1.5 text-slate-700">
                                    <Truck className="w-4 h-4 text-[#5E6AD2]" />
                                    {amountNeededForFreeShipping === 0 ? (
                                        <strong className="text-emerald-600 font-bold">🎉 You unlocked FREE Express Delivery!</strong>
                                    ) : (
                                        <span>Add <strong className="text-[#5E6AD2]">${amountNeededForFreeShipping.toFixed(2)}</strong> for FREE Shipping</span>
                                    )}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">{freeShippingProgress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-[#5E6AD2] h-full transition-all duration-300 rounded-full"
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
                                    className="flex items-center gap-4 p-3 bg-white rounded-xl border border-[#E5E7EB] shadow-xs hover:border-[#5E6AD2]/40 transition-colors"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg bg-slate-100"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-[#0F172A] truncate">{item.name}</h4>
                                        <p className="text-xs font-extrabold text-[#5E6AD2]">${item.price.toFixed(2)}</p>
                                        
                                        {/* Quantity Selector */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                                className="w-6 h-6 rounded bg-[#F4F5F8] border border-[#E5E7EB] flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                                            >
                                                -
                                            </button>
                                            <span className="text-xs font-bold text-slate-800 px-1">{item.quantity}</span>
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                className="w-6 h-6 rounded bg-[#F4F5F8] border border-[#E5E7EB] flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => dispatch(removeFromCart(item.id))}
                                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 space-y-3">
                                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                                <p className="text-sm font-semibold text-slate-600">Your bag is currently empty</p>
                                <p className="text-xs text-slate-400">Discover items in our store to add them here.</p>
                            </div>
                        )}
                    </div>

                    {/* Drawer Footer & Checkout Summary */}
                    {items.length > 0 && (
                        <div className="p-6 border-t border-[#E5E7EB] bg-[#F4F5F8] space-y-4">
                            {/* Coupon Form */}
                            <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Coupon Code (e.g. LOREM10)"
                                    value={inputCoupon}
                                    onChange={(e) => setInputCoupon(e.target.value)}
                                    className="bg-white border-[#E5E7EB] text-xs h-9"
                                />
                                <Button type="submit" size="sm" variant="outline" className="h-9 text-xs font-semibold border-[#E5E7EB] bg-white">
                                    Apply
                                </Button>
                            </form>

                            {couponMsg && (
                                <p className={`text-[11px] font-medium flex items-center gap-1 ${discountPercent > 0 ? 'text-emerald-600 font-bold' : 'text-rose-500'}`}>
                                    <Tag className="w-3 h-3" />
                                    {couponMsg}
                                </p>
                            )}

                            {/* Summary Rows */}
                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                                </div>
                                {discountPercent > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-bold">
                                        <span>Discount ({discountPercent}%)</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-base font-extrabold text-[#0F172A] border-t border-slate-200 pt-2.5">
                                    <span>Total Amount</span>
                                    <span className="text-[#5E6AD2]">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <Button
                                onClick={() => {
                                    dispatch(toggleCartDrawer(false));
                                    onProceedToCheckout();
                                }}
                                className="w-full bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white font-extrabold text-sm h-11 rounded-lg gap-2 shadow-sm cursor-pointer"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
