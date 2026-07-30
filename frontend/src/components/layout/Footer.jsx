import React from 'react';
import { ArrowUpRight, Mail, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const SCROLL_LINKS = [
    { label: 'Product Overview', href: '#product-overview' },
    { label: 'Features & Gallery', href: '#gallery-section' },
    { label: 'Technical Specs', href: '#tech-specs-section' },
    { label: 'Get a Quote', href: '#inquiry-form-section' },
];

/**
 * Footer — contains:
 * 1. Brand manifesto + OEM CTA
 * 2. Navigation with keyword-rich anchor text
 * 3. Contact Us section (sales & support)
 * 4. Free returns within 30 days trust highlight
 * 5. Refund & Return Policy modal trigger & links
 */
export default function Footer({ onOpenRefundPolicy }) {
    return (
        <footer
            className="bg-[#050507] border-t border-white/10 text-xs text-slate-400"
            itemScope
            itemType="https://schema.org/WPFooter"
        >
            {/* MAIN FOOTER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* BRAND MANIFESTO */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="flex items-center">
                            <a href="https://shopgroundera.com" aria-label="ShopGround Era — Home">
                                <img
                                    src="/logo.png"
                                    alt="ShopGround Era — GroundEra Anti Vibration Pads for Washing Machine, Dryers & Heavy Machinery"
                                    className="h-14 w-auto object-contain"
                                    width="112"
                                    height="56"
                                />
                            </a>
                        </div>
                        <p className="text-slate-400 leading-relaxed max-w-sm">
                            We make one thing: the best anti-vibration pad in the world. Industrial-grade, direct from factory, shipped to your warehouse or doorstep within 48 hours.
                        </p>

                        {/* 30-Day Free Returns Banner Badge */}
                        <div className="pt-1">
                            <button
                                onClick={onOpenRefundPolicy}
                                className="inline-flex items-center gap-2.5 p-3 rounded-2xl bg-[#0C0C12] border border-[#F27E24]/30 hover:border-[#F27E24] text-slate-200 hover:text-white transition-all cursor-pointer text-left group"
                            >
                                <div className="w-7 h-7 rounded-xl bg-[#F27E24]/15 flex items-center justify-center text-[#F27E24] shrink-0 group-hover:scale-110 transition-transform">
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <span className="font-bold text-white block text-xs">Free returns within 30 days</span>
                                    <span className="text-[10px] text-[#F27E24] font-semibold underline">Read Refund &amp; Return Policy &rarr;</span>
                                </div>
                            </button>
                        </div>

                        {/* OEM Quote CTA */}
                        <div>
                            <a
                                href="#inquiry-form-section"
                                className="inline-flex items-center gap-2 bg-[#F27E24] text-white font-black text-xs px-5 py-2.5 rounded-xl hover:bg-[#C95B0C] transition-colors"
                            >
                                Request OEM Quote
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* SPACER on large screens */}
                    <div className="hidden md:block md:col-span-1" />

                    {/* NAV LINKS */}
                    <nav aria-label="Footer navigation" className="md:col-span-2">
                        <h4 className="font-black text-white text-xs uppercase tracking-widest mb-4 font-heading">Explore</h4>
                        <ul className="space-y-2.5">
                            {SCROLL_LINKS.map((l) => (
                                <li key={l.href}>
                                    <a href={l.href} className="hover:text-[#F27E24] transition-colors font-medium">
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={onOpenRefundPolicy}
                                    className="hover:text-[#F27E24] transition-colors font-medium cursor-pointer text-left text-slate-400"
                                >
                                    Refund &amp; Return Policy
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* CONTACT US */}
                    <div className="md:col-span-4 space-y-4">
                        <h4 className="font-black text-white text-xs uppercase tracking-widest mb-4 font-heading">Contact Us</h4>
                        <a href="mailto:info@shopgroundera.com" className="flex items-center gap-2 text-slate-200 font-medium hover:text-[#F27E24] transition-colors text-sm">
                            <Mail className="w-4 h-4 text-[#F27E24] shrink-0" />
                            info@shopgroundera.com
                        </a>
                        <p className="text-slate-400 leading-relaxed">
                            Have questions regarding bulk orders, custom requirements, or returns? Contact our dedicated support team anytime.
                        </p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                            <div className="flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-[#F27E24]" />
                                <span>48h Fast Shipping</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#F27E24]" />
                                <span>Risk-Free Guarantee</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ─────────────────────────────────────────────────────────────────────
                     SEO KEYWORD SECTION
                     Readable by all crawlers. Intentionally low visual prominence.
                ──────────────────────────────────────────────────────────────────── */}
                <div className="border-t border-white/5 pt-8">
                    <p className="text-slate-600 text-[10px] leading-loose">
                        <strong className="text-slate-500">ShopGround Era</strong> (shopgroundera.com) is the official brand manufacturer for{' '}
                        <strong className="text-slate-500">GroundEra Anti Vibration Pads</strong> —
                        the best-reviewed heavy-duty <a href="https://shopgroundera.com/product/66a87f12bc09a123456789ab" className="hover:text-[#F27E24] underline transition-colors">anti vibration pads for washing machine</a> front load and top load models with <strong className="text-slate-500">free returns within 30 days</strong>.
                        Our pads feature an innovative stackable height system, high-traction honeycomb anti-skid grip, and an{' '}
                        <strong className="text-slate-500">800 LB load capacity</strong> — making them ideal for:
                        washer &amp; dryer stabilizer rubber legs,
                        treadmill vibration dampening feet,
                        HVAC compressor rubber mounts,
                        refrigerator anti-vibration pads,
                        heavy machinery anti-skid bushes,
                        rubber vibration isolation pads for industrial equipment,
                        washing machine noise reduction feet, and
                        anti skid stand bushes for front load and top load washers.
                        Compatible with all major brands: Samsung, LG, Whirlpool, Bosch, Maytag, GE, Electrolux, Miele.
                        Available direct at{' '}
                        <a href="https://shopgroundera.com" className="hover:text-[#F27E24] underline transition-colors">shopgroundera.com</a>
                        {' '}and on{' '}
                        <a href="https://www.amazon.com/dp/B0H915VTB1" rel="noopener" className="hover:text-[#F27E24] underline transition-colors" target="_blank">Amazon</a>.
                    </p>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-slate-500">© 2026 ShopGround Era. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-slate-500">
                        <button
                            onClick={onOpenRefundPolicy}
                            className="hover:text-[#F27E24] transition-colors font-bold text-slate-300 cursor-pointer"
                        >
                            Refund &amp; Return Policy
                        </button>
                        <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
                        <a href="#inquiry-form-section" className="hover:text-[#F27E24] transition-colors font-bold text-slate-400">
                            Get a Sample
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
