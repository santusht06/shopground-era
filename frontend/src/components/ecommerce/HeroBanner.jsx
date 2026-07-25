import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Flame, CreditCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HeroBanner() {
    const navigate = useNavigate();

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

    const handleShopNow = () => {
        document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative overflow-hidden bg-white border-b border-[#E5E7EB] pt-6 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Hero Split Card */}
                <div className="relative bg-[#0F172A] text-white rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl laser-glow-horizontal">
                    
                    {/* Background Light Effects */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#5E6AD2]/30 rounded-full blur-3xl -z-0" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        {/* Left Copy */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className="bg-[#5E6AD2] text-white text-xs font-extrabold px-3 py-1 uppercase tracking-wider flex items-center gap-1">
                                    <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                                    Big Billion Festival Sale
                                </Badge>
                                <span className="text-xs text-slate-400 font-medium">Up to 50% Off Top Tech & Fashion</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none text-white">
                                Flagship Tech & <br />
                                <span className="text-[#5E6AD2]">Curated Lifestyle.</span>
                            </h1>

                            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                                Experience high-performance wireless audio, ergonomic workspace furniture, and luxury accessories with Flipkart Assured dispatch.
                            </p>

                            {/* Actions & Countdown Pill */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Button
                                    onClick={handleShopNow}
                                    className="bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white font-extrabold text-sm h-11 px-6 rounded-xl gap-2 shadow-lg cursor-pointer"
                                >
                                    <span>Shop Festival Deals</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>

                                {/* Live Timer */}
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs">
                                    <Clock className="w-4 h-4 text-amber-400" />
                                    <span className="text-slate-300 font-medium">Ends in:</span>
                                    <span className="font-mono font-extrabold text-amber-400">
                                        {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Preview Image */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
                                <img
                                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                                    alt="Hero Feature"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                                    <div>
                                        <Badge className="bg-emerald-500 text-white text-[10px] font-bold">Featured Deal</Badge>
                                        <p className="text-sm font-extrabold text-white">Lorem Apex Headphones</p>
                                        <p className="text-xs text-emerald-400 font-bold">$249.99 <span className="text-slate-400 line-through text-[11px] font-normal">$299.99</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bank Discount Strip */}
                    <div className="mt-8 border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
                        <div className="flex items-center gap-2 font-semibold">
                            <CreditCard className="w-4 h-4 text-[#5E6AD2]" />
                            <span><strong>Bank Discount:</strong> 10% Instant Discount on HDFC & ICICI Cards</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">Use Coupon Code: <strong className="text-white font-bold">LOREM10</strong></span>
                    </div>

                </div>

            </div>
        </section>
    );
}
