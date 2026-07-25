import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '@/store/slices/cartSlice';
import { Flame, Clock, ShoppingBag, CheckCircle2, ChevronRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DealsCarousel() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector((state) => state.products.items);

    // Deals with discount > 0
    const dealProducts = products.filter(p => p.originalPrice > p.price);

    // Countdown Timer State
    const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 12, seconds: 35 });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6 shadow-xs">
                
                {/* Header with Deal of the Day & Live Countdown */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                            <Flame className="w-5 h-5 fill-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-extrabold text-[#0F172A]">Deal of the Day</h2>
                                <Badge className="bg-[#5E6AD2] text-white text-[10px] uppercase tracking-wider font-extrabold">
                                    Limited Time
                                </Badge>
                            </div>
                            <p className="text-xs text-slate-500">Handpicked top discounts with Flipkart Assured & Express Shipping.</p>
                        </div>
                    </div>

                    {/* Live Timer Clock */}
                    <div className="flex items-center gap-2 bg-[#F4F5F8] px-4 py-2 rounded-xl border border-[#E5E7EB]">
                        <Clock className="w-4 h-4 text-[#5E6AD2]" />
                        <span className="text-xs font-bold text-slate-700">Ends In:</span>
                        <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-[#0F172A]">
                            <span className="bg-white px-2 py-0.5 rounded border border-[#E5E7EB] shadow-2xs">
                                {String(timeLeft.hours).padStart(2, '0')}h
                            </span>
                            <span>:</span>
                            <span className="bg-white px-2 py-0.5 rounded border border-[#E5E7EB] shadow-2xs">
                                {String(timeLeft.minutes).padStart(2, '0')}m
                            </span>
                            <span>:</span>
                            <span className="bg-white px-2 py-0.5 rounded border border-[#E5E7EB] shadow-2xs text-rose-600">
                                {String(timeLeft.seconds).padStart(2, '0')}s
                            </span>
                        </div>
                    </div>
                </div>

                {/* Horizontal Scroll Cards */}
                <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-none">
                    {dealProducts.map((product) => {
                        const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                        return (
                            <div
                                key={product.id}
                                className="min-w-[240px] max-w-[240px] bg-white border border-[#E5E7EB] rounded-xl p-3.5 space-y-3 glimmer-card cursor-pointer flex flex-col justify-between"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <div className="space-y-2">
                                    <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-slate-50">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        
                                        <Badge className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-extrabold">
                                            -{discountPercent}% OFF
                                        </Badge>
                                    </div>

                                    {/* Assured Badge */}
                                    <div className="flex items-center gap-1 text-[10px] text-[#5E6AD2] font-bold">
                                        <CheckCircle2 className="w-3 h-3 text-[#5E6AD2]" />
                                        <span>ShopGround Assured</span>
                                    </div>

                                    <h4 className="text-xs font-bold text-[#0F172A] line-clamp-1">{product.name}</h4>
                                    
                                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                                        <Star className="w-3 h-3 fill-amber-400" />
                                        <span>{product.rating}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-extrabold text-[#0F172A]">${product.price.toFixed(2)}</span>
                                        <span className="text-[11px] text-slate-400 line-through block font-medium">
                                            ${product.originalPrice.toFixed(2)}
                                        </span>
                                    </div>

                                    <Button
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(addToCart(product));
                                        }}
                                        className="bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white text-xs font-bold p-2 h-8 rounded-lg"
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
