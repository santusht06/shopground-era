import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export default function BrandStrip() {
    const brands = [
        { name: 'Apex Audio', tag: 'Official Partner' },
        { name: 'Chrono Craft', tag: 'Authorized Store' },
        { name: 'ErgoDesign', tag: 'Verified Seller' },
        { name: 'Craft & Oak', tag: 'Handmade Luxury' },
        { name: 'Nomad Goods', tag: 'Direct Import' },
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-[#0F172A] text-white rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-between shadow-sm laser-glow-horizontal">
                
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5E6AD2]/20 text-[#5E6AD2] flex items-center justify-center">
                        <Truck className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold">Express Delivery</h4>
                        <p className="text-[11px] text-slate-400">Free on orders over $150</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5E6AD2]/20 text-[#5E6AD2] flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold">ShopGround Assured</h4>
                        <p className="text-[11px] text-slate-400">100% Genuine Guarantee</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5E6AD2]/20 text-[#5E6AD2] flex items-center justify-center">
                        <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold">30-Day Easy Returns</h4>
                        <p className="text-[11px] text-slate-400">Instant refund processing</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5E6AD2]/20 text-[#5E6AD2] flex items-center justify-center">
                        <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold">24/7 Priority Support</h4>
                        <p className="text-[11px] text-slate-400">Live Concierge Chat</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
