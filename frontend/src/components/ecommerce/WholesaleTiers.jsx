import React from 'react';
import { Truck, ShieldCheck, Box, ArrowRight, Layers, Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function WholesaleTiers() {
    const scrollToInquiry = () => {
        const elem = document.getElementById('inquiry-form-section');
        if (elem) {
            const yOffset = -70;
            const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const TIERS = [
        {
            title: "Sample & Single Pack",
            units: "1 – 9 Sets",
            price: "$29.99",
            perUnit: "per set of 4 pads",
            badge: "Standard Order",
            highlight: false,
            features: [
                "4x Heavy-Duty Stackable Pads",
                "1x Precision Fine-Tuning Shim",
                "1x Portable Spirit Level Tool",
                "24-Hour Express Air Dispatch",
            ],
        },
        {
            title: "Distributor & Retail Batch",
            units: "10 – 49 Sets",
            price: "$24.99",
            perUnit: "per set (17% OEM margin)",
            badge: "Popular OEM Choice",
            highlight: true,
            features: [
                "Bulk Warehouse Packaging",
                "Includes All Shim & Level Kits",
                "Priority Expedited Shipping",
                "Custom Packing Slip Support",
            ],
        },
        {
            title: "Pallet & Container Freight",
            units: "50+ Sets",
            price: "Custom Quote",
            perUnit: "Factory Direct Pricing",
            badge: "Enterprise Wholesale",
            highlight: false,
            features: [
                "Direct Factory Floor Pricing",
                "Custom Branding & Packaging",
                "Dedicated OEM Logistics Manager",
                "Full ISO Quality Certificate",
            ],
        },
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-[#0C0C12] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 orange-glow-border shadow-2xl">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#F27E24]">
                            <Factory className="w-3.5 h-3.5" /> Direct Factory Distribution & Volume Tiers
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white font-heading">
                            Factory Direct Supply & Volume Pricing
                        </h2>
                    </div>

                    <Button
                        onClick={scrollToInquiry}
                        className="gradient-btn-orange font-black text-xs h-11 px-5 rounded-xl gap-2 cursor-pointer shadow-lg shrink-0"
                    >
                        <span>Request Custom Volume Quote</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Tier Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TIERS.map((tier, idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 ${
                                tier.highlight
                                    ? 'bg-[#12121A] border-2 border-[#F27E24] shadow-[0_0_30px_rgba(242,126,36,0.2)] scale-[1.02]'
                                    : 'bg-[#08080D] border border-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Badge className={`${tier.highlight ? 'bg-[#F27E24] text-white' : 'bg-white/10 text-slate-300'} text-[10px] font-black uppercase tracking-wider`}>
                                        {tier.badge}
                                    </Badge>
                                    <span className="text-xs font-mono text-slate-400 font-bold">{tier.units}</span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-black text-white font-heading">{tier.title}</h3>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-white font-mono">{tier.price}</span>
                                        <span className="text-xs text-slate-400 font-normal">{tier.perUnit}</span>
                                    </div>
                                </div>

                                <ul className="space-y-2.5 pt-2 text-xs text-slate-300">
                                    {tier.features.map((feat, fIdx) => (
                                        <li key={fIdx} className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#F27E24]" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                onClick={scrollToInquiry}
                                variant={tier.highlight ? "default" : "outline"}
                                className={`w-full font-bold text-xs h-10 rounded-xl cursor-pointer ${
                                    tier.highlight
                                        ? 'gradient-btn-orange text-white'
                                        : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                                }`}
                            >
                                Inquire For {tier.title}
                            </Button>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
