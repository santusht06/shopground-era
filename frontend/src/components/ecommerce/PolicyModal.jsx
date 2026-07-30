import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Shield, FileText, Gift, Mail, CheckCircle2, Truck, ArrowUpRight, Lock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * PolicyModal — Comprehensive Production-Grade Legal & Policy Modal
 * Tabs:
 * - 'refund'  : Refund & Return Policy (30-day money-back guarantee)
 * - 'privacy' : Privacy Policy & Data Security
 * - 'terms'   : Terms & Conditions of Purchase
 * - 'sample'  : Get a Sample (Commercial & OEM Evaluation Program)
 */
export default function PolicyModal({ isOpen, onClose, initialTab = 'refund' }) {
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    if (!isOpen) return null;

    const TABS = [
        { id: 'refund', label: 'Refund & Return Policy', icon: RotateCcw },
        { id: 'privacy', label: 'Privacy Policy', icon: Shield },
        { id: 'terms', label: 'Terms & Conditions', icon: FileText },
        { id: 'sample', label: 'Get a Sample', icon: Gift },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

            {/* Modal Container */}
            <div className="relative w-full max-w-3xl bg-[#0C0C12] border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 my-6 orange-glow-border text-[#F8FAFC]">

                {/* Header Bar */}
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#050507]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#F27E24]/15 border border-[#F27E24]/30 flex items-center justify-center text-[#F27E24]">
                            {activeTab === 'refund' && <RotateCcw className="w-5 h-5" />}
                            {activeTab === 'privacy' && <Shield className="w-5 h-5" />}
                            {activeTab === 'terms' && <FileText className="w-5 h-5" />}
                            {activeTab === 'sample' && <Gift className="w-5 h-5" />}
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white font-heading tracking-tight">
                                {activeTab === 'refund' && 'Refund & Return Policy'}
                                {activeTab === 'privacy' && 'Privacy Policy'}
                                {activeTab === 'terms' && 'Terms & Conditions'}
                                {activeTab === 'sample' && 'Commercial Sample Program'}
                            </h2>
                            <p className="text-xs text-slate-400 font-medium">ShopGround Era Legal &amp; Customer Guarantees</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tab Bar */}
                <div className="px-6 pt-3 pb-1 border-b border-white/10 bg-[#08080E] flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
                    {TABS.map((t) => {
                        const Icon = t.icon;
                        const isActive = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                                    isActive
                                        ? 'bg-[#F27E24] text-white shadow-md shadow-[#F27E24]/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{t.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Body Content Area */}
                <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar text-xs leading-relaxed text-slate-300">

                    {/* ─────────────────────────────────────────────────────────────
                         TAB 1: REFUND & RETURN POLICY
                    ────────────────────────────────────────────────────────────── */}
                    {activeTab === 'refund' && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                            {/* Callout */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F27E24]/15 via-[#F27E24]/5 to-transparent border border-[#F27E24]/30 flex items-center gap-4">
                                <RotateCcw className="w-8 h-8 text-[#F27E24] shrink-0" />
                                <div>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-[#F27E24]">Risk-Free Guarantee</span>
                                    <h3 className="text-sm font-bold text-white mt-0.5">Free returns within 30 days — 100% Full Refund</h3>
                                    <p className="text-slate-300 text-xs mt-1">
                                        Try GroundEra Anti-Vibration Pads in your laundry room or commercial facility. If they do not completely satisfy you, return them within 30 days for a full refund.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 space-y-1.5">
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <CheckCircle2 className="w-4 h-4 text-[#F27E24]" />
                                        <span>30-Day Return Window</span>
                                    </div>
                                    <p className="text-slate-400">
                                        All orders are eligible for a full refund within 30 days of delivery. No restocking fees applied.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 space-y-1.5">
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <Truck className="w-4 h-4 text-[#F27E24]" />
                                        <span>Pre-Paid Return Label</span>
                                    </div>
                                    <p className="text-slate-400">
                                        We provide a printable pre-paid return label. Domestic shipping fees are covered by ShopGround Era.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 pt-1">
                                <h4 className="text-xs font-black uppercase text-slate-300 font-heading">Return Steps</h4>
                                <ol className="space-y-2">
                                    <li className="p-3 rounded-xl bg-[#050507] border border-white/5 flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-[#F27E24]/20 text-[#F27E24] font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                                        <span>Email <a href="mailto:info@shopgroundera.com" className="text-[#F27E24] font-bold hover:underline">info@shopgroundera.com</a> with your order number.</span>
                                    </li>
                                    <li className="p-3 rounded-xl bg-[#050507] border border-white/5 flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-[#F27E24]/20 text-[#F27E24] font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                                        <span>Print the return label sent to your inbox and attach it to your package.</span>
                                    </li>
                                    <li className="p-3 rounded-xl bg-[#050507] border border-white/5 flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-[#F27E24]/20 text-[#F27E24] font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                                        <span>Refund triggers automatically to your payment card within 3-5 business days upon carrier scan.</span>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {/* ─────────────────────────────────────────────────────────────
                         TAB 2: PRIVACY POLICY
                    ────────────────────────────────────────────────────────────── */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                            <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 flex items-center gap-4">
                                <Lock className="w-8 h-8 text-[#F27E24] shrink-0" />
                                <div>
                                    <h3 className="text-sm font-bold text-white">Your Privacy is Fully Protected</h3>
                                    <p className="text-slate-400 text-xs mt-0.5">
                                        ShopGround Era respects your business and personal data. We enforce strict enterprise data encryption protocols.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <h4 className="font-bold text-white text-xs">1. Information We Collect</h4>
                                    <p className="text-slate-400">
                                        When you purchase products or request OEM quotes on shopgroundera.com, we collect necessary contact information (name, business email, phone number, shipping address) to fulfill your request.
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <h4 className="font-bold text-white text-xs">2. Zero Data Selling Commitment</h4>
                                    <p className="text-slate-400">
                                        We do not sell, rent, lease, or trade customer data or business lead information to any third parties. Period.
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <h4 className="font-bold text-white text-xs">3. Payment &amp; Security Standards</h4>
                                    <p className="text-slate-400">
                                        Transactions are processed via TLS 1.3 256-bit encrypted gateways. Credit card numbers are never stored on ShopGround Era servers.
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <h4 className="font-bold text-white text-xs">4. Your Rights</h4>
                                    <p className="text-slate-400">
                                        You may request the deletion of your account or contact data at any time by emailing <a href="mailto:info@shopgroundera.com" className="text-[#F27E24] font-bold hover:underline">info@shopgroundera.com</a>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─────────────────────────────────────────────────────────────
                         TAB 3: TERMS & CONDITIONS
                    ────────────────────────────────────────────────────────────── */}
                    {activeTab === 'terms' && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                            <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 flex items-center gap-4">
                                <FileText className="w-8 h-8 text-[#F27E24] shrink-0" />
                                <div>
                                    <h3 className="text-sm font-bold text-white">Terms of Sale &amp; Operations</h3>
                                    <p className="text-slate-400 text-xs mt-0.5">
                                        These terms govern direct orders, wholesale shipments, and product performance warranties for ShopGround Era.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <h4 className="font-bold text-white text-xs">1. Product Guarantee &amp; Weight Capacity</h4>
                                    <p className="text-slate-400">
                                        GroundEra Anti-Vibration Pads are engineered and rated to support up to 800 LBS per set of 4. Ratings apply to residential washers, dryers, commercial treadmills, and HVAC equipment installed on flat surfaces.
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <h4 className="font-bold text-white text-xs">2. Order Fulfillment &amp; 48-Hour Dispatch</h4>
                                    <p className="text-slate-400">
                                        Direct warehouse orders ship within 48 hours of order confirmation. Delivery tracking numbers are transmitted via email upon carrier handoff.
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <h4 className="font-bold text-white text-xs">3. Lifetime Manufacturer Warranty</h4>
                                    <p className="text-slate-400">
                                        GroundEra pads are backed by a Lifetime Structural Warranty against cracking, crumbling, or manufacturing defects. Defective units are replaced free of charge.
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <h4 className="font-bold text-white text-xs">4. OEM &amp; Bulk Orders</h4>
                                    <p className="text-slate-400">
                                        Wholesale tier pricing and OEM custom branding quotes are binding for 30 days from date of issue.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─────────────────────────────────────────────────────────────
                         TAB 4: GET A SAMPLE
                    ────────────────────────────────────────────────────────────── */}
                    {activeTab === 'sample' && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F27E24]/15 via-[#F27E24]/5 to-transparent border border-[#F27E24]/30 flex items-center gap-4">
                                <Gift className="w-8 h-8 text-[#F27E24] shrink-0" />
                                <div>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-[#F27E24]">OEM &amp; Commercial Buyers</span>
                                    <h3 className="text-sm font-bold text-white mt-0.5">Request a Free Evaluation Sample</h3>
                                    <p className="text-slate-300 text-xs mt-1">
                                        Evaluating GroundEra pads for wholesale distribution, commercial laundry facilities, or OEM appliance integration? We provide physical evaluation sample kits to qualified businesses.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 space-y-1.5">
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <Building2 className="w-4 h-4 text-[#F27E24]" />
                                        <span>For Commercial Buyers</span>
                                    </div>
                                    <p className="text-slate-400">
                                        Test physical product quality, rubber density, and leveling shims before placing bulk volume tier orders.
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 space-y-1.5">
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <Truck className="w-4 h-4 text-[#F27E24]" />
                                        <span>Dispatched in 48 Hours</span>
                                    </div>
                                    <p className="text-slate-400">
                                        Approved sample requests are packed with full technical spec datasheets and shipped via express freight.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="text-xs text-slate-300 space-y-0.5">
                                    <span className="font-bold text-white block">Ready to request your sample kit?</span>
                                    <p className="text-slate-400">Fill out our OEM quote form or email us with your business details.</p>
                                </div>
                                <a
                                    href="#inquiry-form-section"
                                    onClick={() => {
                                        onClose();
                                        setTimeout(() => {
                                            document.getElementById('inquiry-form-section')?.scrollIntoView({ behavior: 'smooth' });
                                        }, 150);
                                    }}
                                    className="inline-flex items-center gap-2 bg-[#F27E24] hover:bg-[#C95B0C] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
                                >
                                    <span>Request Sample Form</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Bar */}
                <div className="px-6 py-4 border-t border-white/10 bg-[#050507] flex items-center justify-between">
                    <a
                        href="mailto:info@shopgroundera.com"
                        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-[#F27E24] transition-colors"
                    >
                        <Mail className="w-3.5 h-3.5 text-[#F27E24]" />
                        <span>info@shopgroundera.com</span>
                    </a>

                    <Button
                        onClick={onClose}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-2 rounded-xl border border-white/10 cursor-pointer"
                    >
                        Close
                    </Button>
                </div>

            </div>
        </div>
    );
}
