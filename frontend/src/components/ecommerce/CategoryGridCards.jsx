import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Volume2, ShieldCheck, Zap, Headphones } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function CategoryGridCards() {
    const navigate = useNavigate();

    const handleProductClick = () => {
        navigate('/product/B0H915VTB1');
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Amazon Showcase 1: Main Studio View */}
                <Card
                    onClick={handleProductClick}
                    className="bg-white border-[#E5E7EB] p-5 space-y-4 glimmer-card flex flex-col justify-between shadow-xs cursor-pointer group"
                >
                    <div>
                        <h3 className="text-base font-extrabold text-[#0F172A] mb-3 font-heading">Flagship Studio View</h3>
                        <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2 p-2 border border-slate-100">
                            <img
                                src="/images/product/main.png"
                                alt="Apex Pro Headphones Studio View"
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <span className="text-xs font-bold text-[#0F172A] block">Apex Pro ANC Headphones</span>
                        <span className="text-xs text-[#5E6AD2] font-extrabold">$249.99 <span className="text-[10px] text-slate-400 line-through font-normal">$299.99</span></span>
                    </div>
                    <div className="text-xs font-bold text-[#5E6AD2] group-hover:underline flex items-center gap-1 pt-2 border-t border-slate-100">
                        <span>View Product Details (ASIN: B0H915VTB1)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </Card>

                {/* Amazon Showcase 2: 45 Degree Angle View */}
                <Card
                    onClick={handleProductClick}
                    className="bg-white border-[#E5E7EB] p-5 space-y-4 glimmer-card flex flex-col justify-between shadow-xs cursor-pointer group"
                >
                    <div>
                        <h3 className="text-base font-extrabold text-[#0F172A] mb-3 font-heading">45° Swivel Ergonomics</h3>
                        <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2 p-2 border border-slate-100">
                            <img
                                src="/images/product/angle.png"
                                alt="Apex Pro Headphones Angle View"
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <span className="text-xs font-bold text-[#0F172A] block">Ultra-Soft Memory Foam Fit</span>
                        <span className="text-xs text-emerald-600 font-bold">285g Lightweight Fit</span>
                    </div>
                    <div className="text-xs font-bold text-[#5E6AD2] group-hover:underline flex items-center gap-1 pt-2 border-t border-slate-100">
                        <span>Explore Swivel Design</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </Card>

                {/* Amazon Showcase 3: Titanium Driver View */}
                <Card
                    onClick={handleProductClick}
                    className="bg-white border-[#E5E7EB] p-5 space-y-4 glimmer-card flex flex-col justify-between shadow-xs cursor-pointer group"
                >
                    <div>
                        <h3 className="text-base font-extrabold text-[#0F172A] mb-3 font-heading">40mm Titanium Drivers</h3>
                        <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2 p-2 border border-slate-100">
                            <img
                                src="/images/product/feature.png"
                                alt="Apex Pro Headphones Driver Feature"
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <span className="text-xs font-bold text-[#0F172A] block">Custom Acoustic Architecture</span>
                        <span className="text-xs text-[#5E6AD2] font-bold">Hi-Res Audio Certified</span>
                    </div>
                    <div className="text-xs font-bold text-[#5E6AD2] group-hover:underline flex items-center gap-1 pt-2 border-t border-slate-100">
                        <span>Explore Sound Drivers</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </Card>

                {/* Amazon Showcase 4: Active ANC Banner */}
                <Card
                    onClick={handleProductClick}
                    className="bg-white border-[#E5E7EB] p-5 space-y-4 glimmer-card flex flex-col justify-between shadow-xs cursor-pointer group"
                >
                    <div>
                        <h3 className="text-base font-extrabold text-[#0F172A] mb-3 font-heading">38dB Hybrid Active ANC</h3>
                        <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2 p-2 border border-slate-100">
                            <img
                                src="/images/product/banner1.png"
                                alt="Apex Pro Headphones ANC Feature"
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <span className="text-xs font-bold text-[#0F172A] block">30-Hour Playback Battery</span>
                        <span className="text-xs text-amber-600 font-bold">Fast Charge Ready</span>
                    </div>
                    <div className="text-xs font-bold text-[#5E6AD2] group-hover:underline flex items-center gap-1 pt-2 border-t border-slate-100">
                        <span>Explore Battery & ANC</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </Card>

            </div>
        </section>
    );
}
