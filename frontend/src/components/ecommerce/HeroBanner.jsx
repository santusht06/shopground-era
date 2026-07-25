import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroBanner() {
    return (
        <section className="relative overflow-hidden bg-[#F4F5F8] border-b border-[#E5E7EB] py-12 md:py-16 dot-grid">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left Copy Column */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#5E6AD2] shadow-xs laser-glow-horizontal">
                            <Zap className="w-3.5 h-3.5 fill-[#5E6AD2]" />
                            <span>ShopGround Era E-Commerce Architecture</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                            Elevate Your Shopping with <span className="text-[#5E6AD2]">Sharexpress Light Theme</span>
                        </h1>

                        <p className="text-base md:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Experience static lorem ipsum content ready for rapid deployment.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Button 
                                onClick={() => {
                                    const element = document.getElementById('product-catalog');
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="linear-btn-primary gap-2"
                            >
                                <span>Explore Products</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>

                            <Button 
                                onClick={() => {
                                    const element = document.getElementById('product-catalog');
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="linear-btn-secondary"
                            >
                                View Categories
                            </Button>
                        </div>

                        {/* Value Props Row */}
                        <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80">
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-[#5E6AD2]" />
                                <span className="text-xs font-medium text-slate-700">Free Worldwide Shipping</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-[#5E6AD2]" />
                                <span className="text-xs font-medium text-slate-700">2-Year Official Warranty</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 text-[#5E6AD2]" />
                                <span className="text-xs font-medium text-slate-700">30-Day Easy Returns</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Card / Visual Feature */}
                    <div className="lg:col-span-5 relative">
                        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xl linear-shimmer-card">
                            <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 mb-4">
                                <img
                                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                                    alt="Featured Headphones"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3 bg-[#5E6AD2] text-white text-xs font-bold px-2.5 py-1 rounded-md">
                                    Featured Flagship
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-[#0F172A] text-lg">Lorem Apex Headphones</h3>
                                    <p className="text-xs text-slate-500">Wireless Active Noise Cancelling</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-extrabold text-[#5E6AD2]">$249.99</span>
                                    <span className="text-xs text-slate-400 line-through block">$299.99</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
