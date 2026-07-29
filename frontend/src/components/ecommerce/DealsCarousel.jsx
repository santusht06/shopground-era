import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '@/store/slices/cartSlice';
import { fetchProducts } from '@/store/slices/productsSlice';
import { Flame, Clock, ShoppingBag, CheckCircle2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DealsCarousel() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector((state) => state.products.items);

    useEffect(() => {
        if (!products.length) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    // Deals with wholesale_mrp / originalPrice > price
    const dealProducts = products.filter(p => (p.originalPrice || p.wholesale_mrp || 0) > p.price);

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

    if (!dealProducts.length) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-[#0C0C12] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)] orange-glow-border">
                
                {/* Header with Deal of the Day & Live Countdown */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#F27E24] text-white flex items-center justify-center shadow-[0_0_20px_rgba(242,126,36,0.5)]">
                            <Flame className="w-5 h-5 fill-white text-white animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-white font-heading tracking-tight">Deal of the Day — Flash Offer</h2>
                                <Badge className="bg-[#F27E24] text-white text-[10px] uppercase tracking-widest font-black">
                                    Limited Flash Offer
                                </Badge>
                            </div>
                            <p className="text-xs text-slate-400 font-normal">Handpicked flagship acoustic isolation hardware with Express Global Shipping.</p>
                        </div>
                    </div>

                    {/* Live Timer Clock */}
                    <div className="flex items-center gap-2.5 bg-black/60 px-4 py-2 rounded-2xl border border-white/10">
                        <Clock className="w-4 h-4 text-[#F27E24]" />
                        <span className="text-xs font-bold text-slate-300">Ends In:</span>
                        <div className="flex items-center gap-1.5 font-mono text-xs font-extrabold text-white">
                            <span className="bg-[#16161F] px-2.5 py-1 rounded-lg border border-white/10 shadow-inner">
                                {String(timeLeft.hours).padStart(2, '0')}h
                            </span>
                            <span className="text-[#F27E24]">:</span>
                            <span className="bg-[#16161F] px-2.5 py-1 rounded-lg border border-white/10 shadow-inner">
                                {String(timeLeft.minutes).padStart(2, '0')}m
                            </span>
                            <span className="text-[#F27E24]">:</span>
                            <span className="bg-[#16161F] px-2.5 py-1 rounded-lg border border-[#F27E24]/40 text-[#F27E24] shadow-inner animate-pulse">
                                {String(timeLeft.seconds).padStart(2, '0')}s
                            </span>
                        </div>
                    </div>
                </div>

                {/* Horizontal Scroll Cards */}
                <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-none">
                    {dealProducts.map((product) => {
                        const pid = product._id || product.id;
                        const orig = product.originalPrice || product.wholesale_mrp || (product.price * 1.25);
                        const discountPercent = Math.round(((orig - product.price) / orig) * 100);

                        return (
                            <div
                                key={pid}
                                className="min-w-[290px] max-w-[290px] bg-[#111118] border border-white/10 rounded-2xl p-4 space-y-3 glimmer-card cursor-pointer flex flex-col justify-between"
                                onClick={() => navigate(`/product/${pid}`)}
                            >
                                <div className="space-y-3">
                                    <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-black/50 border border-white/10 p-3">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" />
                                        
                                        {discountPercent > 0 && (
                                            <Badge className="absolute top-2 left-2 bg-[#F27E24] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                                                -{discountPercent}% OFF
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Assured Badge */}
                                    <div className="flex items-center gap-1.5 text-[11px] text-[#F27E24] font-bold">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F27E24]" />
                                        <span>ShopGround Assured</span>
                                    </div>

                                    <h4 className="text-xs font-bold text-white line-clamp-1">{product.name}</h4>
                                </div>

                                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                                    <div>
                                        <span className="text-base font-black text-white font-mono">${product.price.toFixed(2)}</span>
                                        <span className="text-[11px] text-slate-400 line-through block font-normal">
                                            ${orig.toFixed(2)}
                                        </span>
                                    </div>

                                    <Button
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(addToCart(product));
                                        }}
                                        className="gradient-btn-orange text-white text-xs font-bold p-2 h-9 rounded-xl"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
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
