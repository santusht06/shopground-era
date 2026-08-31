import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Truck, ShieldCheck, RotateCcw, ArrowUpRight } from 'lucide-react';

const SCROLL_LINKS = [
    { label: 'Overview', href: '#product-overview' },
    { label: 'Wholesale Tiers', href: '#wholesale-section' },
    { label: 'Gallery', href: '#gallery-section' },
    { label: 'Technical Specs', href: '#tech-specs-section' },
    { label: 'Get a Quote', href: '#inquiry-form-section' },
];

export default function Footer() {
    return (
        <footer
            aria-label="Site Footer"
            className="bg-[#050507] border-t border-white/10 text-slate-400 text-xs relative overflow-hidden"
        >
            {/* MAIN FOOTER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* BRAND MANIFESTO */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="flex items-center">
                            <Link to="/" aria-label="ShopGround Era — Home">
                                <img
                                    src="/logo.png"
                                    alt="ShopGround Era — GroundEra Anti Vibration Pads for Washing Machine, Dryers & Heavy Machinery"
                                    className="h-14 w-auto object-contain"
                                    width="112"
                                    height="56"
                                />
                            </Link>
                        </div>
                        <p className="text-slate-400 leading-relaxed max-w-sm">
                            We make one thing: the best anti-vibration pad in the world. Industrial-grade, direct from factory, shipped to your warehouse or doorstep within 48 hours.
                        </p>

                        {/* 30-Day Free Returns Banner Badge */}
                        <div className="pt-1">
                            <Link
                                to="/refund-policy"
                                className="inline-flex items-center gap-2.5 p-3 rounded-2xl bg-[#0C0C12] border border-[#F27E24]/30 hover:border-[#F27E24] text-slate-200 hover:text-white transition-all cursor-pointer text-left group"
                            >
                                <div className="w-7 h-7 rounded-xl bg-[#F27E24]/15 flex items-center justify-center text-[#F27E24] shrink-0 group-hover:scale-110 transition-transform">
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <span className="font-bold text-white block text-xs">Free returns within 30 days</span>
                                    <span className="text-[10px] text-[#F27E24] font-semibold underline">Read Refund &amp; Return Policy &rarr;</span>
                                </div>
                            </Link>
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
                                <Link
                                    to="/warranty"
                                    className="hover:text-[#F27E24] transition-colors font-semibold text-[#F27E24] block"
                                >
                                    2-Year Warranty Portal
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/refund-policy"
                                    className="hover:text-[#F27E24] transition-colors font-medium text-slate-400 block"
                                >
                                    Refund &amp; Return Policy
                                </Link>
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
            </div>

            {/* COPYRIGHT BAR */}
            <div className="border-t border-white/10 bg-[#0C0C12] py-4 text-slate-400 text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
                    <p>&copy; {new Date().getFullYear()} ShopGround Era. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-slate-500 flex-wrap">
                        <Link to="/warranty" className="hover:text-[#F27E24] text-[#F27E24] font-semibold">2-Year Warranty</Link>
                        <Link to="/refund-policy" className="hover:text-[#F27E24]">Refund Policy</Link>
                        <Link to="/privacy-policy" className="hover:text-[#F27E24]">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-[#F27E24]">Terms &amp; Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
