import React from 'react';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';

const SCROLL_LINKS = [
    { label: 'Product Overview', href: '#product-overview' },
    { label: 'Features & Gallery', href: '#gallery-section' },
    { label: 'Technical Specs', href: '#tech-specs-section' },
    { label: 'Get a Quote', href: '#inquiry-form-section' },
];

export default function Footer() {
    return (
        <footer className="bg-[#050507] border-t border-white/10 text-xs text-slate-400">

            {/* MAIN FOOTER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* BRAND MANIFESTO */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="flex items-center">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-14 w-auto object-contain"
                            />
                        </div>
                        <p className="text-slate-400 leading-relaxed max-w-sm">
                            We make one thing: the best anti-vibration pad in the world. Industrial-grade, direct from factory, shipped to your warehouse or doorstep within 48 hours.
                        </p>
                        {/* Big CTA inline */}
                        <a
                            href="#inquiry-form-section"
                            className="inline-flex items-center gap-2 bg-[#F27E24] text-white font-black text-xs px-5 py-2.5 rounded-xl hover:bg-[#C95B0C] transition-colors"
                        >
                            Request OEM Quote
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    </div>

                    {/* SPACER on large screens */}
                    <div className="hidden md:block md:col-span-1" />

                    {/* NAV LINKS */}
                    <div className="md:col-span-2">
                        <h4 className="font-black text-white text-xs uppercase tracking-widest mb-4 font-heading">Explore</h4>
                        <ul className="space-y-2.5">
                            {SCROLL_LINKS.map((l) => (
                                <li key={l.href}>
                                    <a href={l.href} className="hover:text-[#F27E24] transition-colors font-medium">
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div className="md:col-span-4 space-y-4">
                        <h4 className="font-black text-white text-xs uppercase tracking-widest mb-4 font-heading">Contact Sales</h4>
                        <a href="mailto:info@shopgroundera.com" className="flex items-center gap-2 text-slate-200 font-medium hover:text-[#F27E24] transition-colors">
                            <Mail className="w-3.5 h-3.5 text-[#F27E24] shrink-0" />
                            info@shopgroundera.com
                        </a>
                        <a href="tel:+18005550000" className="flex items-center gap-2 text-slate-300 hover:text-[#F27E24] transition-colors">
                            <Phone className="w-3.5 h-3.5 text-[#F27E24] shrink-0" />
                            +1 (800) 555-APEX
                        </a>
                        <p className="text-slate-500 mt-2 leading-relaxed">
                            Sales team available Mon–Fri, 9AM–6PM EST. Bulk inquiries and OEM customization welcomed.
                        </p>
                    </div>

                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-slate-500">© 2026 ShopGround Era. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-slate-600">
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
