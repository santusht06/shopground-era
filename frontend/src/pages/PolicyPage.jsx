import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RotateCcw, Shield, FileText, Gift, Mail, CheckCircle2, Truck, ArrowRight, ChevronRight, Lock, Building2, HelpCircle, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import applySEO from '@/hooks/useSEO';

const POLICY_DATA = {
    refund: {
        title: "Refund & Return Policy",
        subtitle: "30-Day Risk-Free Guarantee & Free Return Shipping",
        icon: RotateCcw,
        seoTitle: "Refund & Return Policy — ShopGround Era 30-Day Money-Back Guarantee",
        seoDesc: "Read ShopGround Era 30-day return policy. 100% money-back guarantee, free domestic return shipping, and no restocking fees on GroundEra anti-vibration pads."
    },
    privacy: {
        title: "Privacy Policy",
        subtitle: "Data Protection & Enterprise Security Commitment",
        icon: Shield,
        seoTitle: "Privacy Policy — ShopGround Era Data Protection & SSL Security",
        seoDesc: "ShopGround Era Privacy Policy. 256-bit TLS encryption, zero data selling, and strict protection for your personal and commercial business information."
    },
    terms: {
        title: "Terms & Conditions",
        subtitle: "Operational Standards & Purchase Agreement",
        icon: FileText,
        seoTitle: "Terms & Conditions — ShopGround Era Purchase & Warranty Terms",
        seoDesc: "Review ShopGround Era Terms of Service. 800 LB load capacity specifications, lifetime warranty conditions, and commercial purchase agreements."
    },
    sample: {
        title: "Get a Sample — Commercial Program",
        subtitle: "OEM & Bulk Buyer Evaluation Sample Kits",
        icon: Gift,
        seoTitle: "Get a Sample — ShopGround Era OEM & Commercial Evaluation Kits",
        seoDesc: "Request free physical evaluation sample kits for GroundEra Anti-Vibration Pads. Express 48-hour dispatch for qualified commercial buyers and distributors."
    }
};

export default function PolicyPage({ defaultTab }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine tab based on route pathname or prop
    const getTabFromPath = () => {
        const path = location.pathname;
        if (path.includes('privacy')) return 'privacy';
        if (path.includes('terms')) return 'terms';
        if (path.includes('sample')) return 'sample';
        return defaultTab || 'refund';
    };

    const [activeTab, setActiveTab] = useState(getTabFromPath());

    useEffect(() => {
        const current = getTabFromPath();
        setActiveTab(current);
        window.scrollTo(0, 0);
    }, [location.pathname, defaultTab]);

    const activeInfo = POLICY_DATA[activeTab] || POLICY_DATA.refund;

    // Apply SEO for active policy page
    useEffect(() => {
        applySEO({
            title: activeInfo.seoTitle,
            description: activeInfo.seoDesc,
            keywords: 'ShopGround Era return policy, GroundEra 30 day return, privacy policy, terms of service, commercial sample anti vibration pads',
            canonical: `https://shopgroundera.com/${activeTab === 'refund' ? 'refund-policy' : activeTab === 'privacy' ? 'privacy-policy' : activeTab === 'terms' ? 'terms' : 'sample'}`,
            image: 'https://shopgroundera.com/logo.png',
            type: 'website'
        });
    }, [activeTab, activeInfo]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        const pathMap = {
            refund: '/refund-policy',
            privacy: '/privacy-policy',
            terms: '/terms',
            sample: '/sample'
        };
        navigate(pathMap[tabId] || '/refund-policy');
    };

    return (
        <div className="bg-[#050507] text-[#F8FAFC] min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 border-b border-white/10 pb-4">
                    <Link to="/" className="hover:text-[#F27E24] transition-colors font-medium">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-slate-200 font-bold">Legal &amp; Policies</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-[#F27E24] font-bold">{activeInfo.title}</span>
                </nav>

                {/* Hero Title Section */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0C0C12] via-[#0C0C12] to-[#12121A] border border-white/10 orange-glow-border space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F27E24]/10 border border-[#F27E24]/30 text-[#F27E24] text-xs font-black uppercase tracking-wider">
                        <activeInfo.icon className="w-3.5 h-3.5" />
                        <span>Official Documentation</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
                        {activeInfo.title}
                    </h1>
                    <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                        {activeInfo.subtitle}
                    </p>
                </div>

                {/* Main Content Layout: Left Sidebar Tabs + Right Standalone Policy Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Sidebar Policy Tabs */}
                    <div className="lg:col-span-3 space-y-2 sticky top-24">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 px-3 block mb-2 font-heading">
                            Policy Directory
                        </span>
                        <div className="bg-[#0C0C12] border border-white/10 rounded-2xl p-2 space-y-1.5 shadow-xl">
                            {Object.entries(POLICY_DATA).map(([id, info]) => {
                                const Icon = info.icon;
                                const isActive = activeTab === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => handleTabChange(id)}
                                        className={`w-full px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between group ${
                                            isActive
                                                ? 'bg-[#F27E24] text-white shadow-lg shadow-[#F27E24]/20'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#F27E24]'}`} />
                                            <span>{info.title.split('—')[0]}</span>
                                        </div>
                                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-white translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`} />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Direct Support Card */}
                        <div className="p-5 rounded-2xl bg-[#0C0C12] border border-white/10 space-y-3 mt-4">
                            <div className="flex items-center gap-2 text-white font-bold text-xs">
                                <HelpCircle className="w-4 h-4 text-[#F27E24]" />
                                <span>Need Custom Terms?</span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Our commercial team handles custom contracts, NDA agreements, and OEM specifications.
                            </p>
                            <a
                                href="mailto:info@shopgroundera.com"
                                className="inline-flex items-center gap-2 text-xs font-bold text-[#F27E24] hover:text-white transition-colors"
                            >
                                <Mail className="w-3.5 h-3.5" />
                                info@shopgroundera.com
                            </a>
                        </div>
                    </div>

                    {/* Main Standalone Article Content Box */}
                    <div className="lg:col-span-9 bg-[#0C0C12] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">

                        {/* ─────────────────────────────────────────────────────────────
                             SECTION 1: REFUND & RETURN POLICY
                        ────────────────────────────────────────────────────────────── */}
                        {activeTab === 'refund' && (
                            <article className="space-y-8 text-slate-300 text-sm leading-relaxed animate-in fade-in duration-300">
                                
                                {/* 30-Day Guarantee Banner */}
                                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#F27E24]/20 via-[#F27E24]/10 to-transparent border border-[#F27E24]/40 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-[#F27E24] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#F27E24]/30">
                                        <RotateCcw className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-lg font-black text-white font-heading">30-Day Risk-Free Money Back Guarantee</h2>
                                        <p className="text-xs text-slate-200 leading-relaxed">
                                            Try GroundEra Anti-Vibration Pads on your appliances for 30 full days. If they fail to eliminate vibration, walking, or noise, return them for a 100% full refund.
                                        </p>
                                    </div>
                                </div>

                                {/* Policy Key Terms Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl bg-[#050507] border border-white/10 space-y-2">
                                        <div className="flex items-center gap-2.5 text-white font-bold text-sm font-heading">
                                            <CheckCircle2 className="w-4 h-4 text-[#F27E24]" />
                                            <span>30 Calendar Days</span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            You have 30 days starting from the delivery timestamp confirmed by carrier tracking to request a full return.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-[#050507] border border-white/10 space-y-2">
                                        <div className="flex items-center gap-2.5 text-white font-bold text-sm font-heading">
                                            <Truck className="w-4 h-4 text-[#F27E24]" />
                                            <span>Free Return Shipping</span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            ShopGround Era covers domestic return shipping costs. We issue a printable pre-paid return label straight to your inbox.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2 border-t border-white/10">
                                    <h3 className="text-base font-bold text-white font-heading">1. Return Eligibility &amp; Item Condition</h3>
                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        To be eligible for a full refund under our 30-day guarantee, returned items should include all 4 anti-vibration pads, fine-tuning shims, and the keychain spirit level. Normal wear and tear from appliance testing is completely acceptable.
                                    </p>
                                </div>

                                <div className="space-y-4 pt-2 border-t border-white/10">
                                    <h3 className="text-base font-bold text-white font-heading">2. Step-by-Step Return Process</h3>
                                    <div className="space-y-3 text-xs">
                                        <div className="p-4 rounded-xl bg-[#050507] border border-white/5 flex items-start gap-3">
                                            <span className="w-6 h-6 rounded-full bg-[#F27E24]/20 text-[#F27E24] font-black flex items-center justify-center shrink-0">1</span>
                                            <div>
                                                <strong className="text-white block mb-0.5">Submit Return Request</strong>
                                                <span className="text-slate-400">Email <a href="mailto:info@shopgroundera.com" className="text-[#F27E24] font-bold hover:underline">info@shopgroundera.com</a> with your order number or purchasing name.</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-[#050507] border border-white/5 flex items-start gap-3">
                                            <span className="w-6 h-6 rounded-full bg-[#F27E24]/20 text-[#F27E24] font-black flex items-center justify-center shrink-0">2</span>
                                            <div>
                                                <strong className="text-white block mb-0.5">Receive Pre-Paid Label</strong>
                                                <span className="text-slate-400">Our customer team will send your shipping label within 4 hours. Print and attach to package.</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-[#050507] border border-white/5 flex items-start gap-3">
                                            <span className="w-6 h-6 rounded-full bg-[#F27E24]/20 text-[#F27E24] font-black flex items-center justify-center shrink-0">3</span>
                                            <div>
                                                <strong className="text-white block mb-0.5">Fast Refund Payout</strong>
                                                <span className="text-slate-400">Upon carrier receipt scan, your refund triggers automatically back to your credit card or payment method within 3 to 5 business days.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-[#050507] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="space-y-1 text-xs">
                                        <strong className="text-white block font-heading text-sm">Need immediate assistance with an order?</strong>
                                        <p className="text-slate-400">Contact our support team directly — we resolve all return inquiries in under 2 hours.</p>
                                    </div>
                                    <a
                                        href="mailto:info@shopgroundera.com?subject=Return%20Request"
                                        className="inline-flex items-center gap-2 bg-[#F27E24] hover:bg-[#C95B0C] text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shrink-0"
                                    >
                                        <Mail className="w-4 h-4" />
                                        <span>Initiate Return</span>
                                    </a>
                                </div>

                            </article>
                        )}

                        {/* ─────────────────────────────────────────────────────────────
                             SECTION 2: PRIVACY POLICY
                        ────────────────────────────────────────────────────────────── */}
                        {activeTab === 'privacy' && (
                            <article className="space-y-8 text-slate-300 text-sm leading-relaxed animate-in fade-in duration-300">
                                
                                <div className="p-6 rounded-2xl bg-[#050507] border border-white/10 flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-[#F27E24]/15 text-[#F27E24] flex items-center justify-center shrink-0 border border-[#F27E24]/30">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-white font-heading">Enterprise Data Protection &amp; Security</h2>
                                        <p className="text-xs text-slate-400 mt-1">
                                            ShopGround Era strictly adheres to global data privacy laws. We utilize 256-bit TLS encryption across all web services.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6 text-xs text-slate-300">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white font-heading">1. Information We Collect</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            When you purchase products or request OEM wholesale quotes on shopgroundera.com, we collect only necessary fulfillment data: name, business email address, phone number, and shipping address.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white font-heading">2. Zero Data Selling &amp; Commercial Usage</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            ShopGround Era will never sell, rent, trade, or share your personal information or business lead data with third-party advertisers or data brokers under any circumstances.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white font-heading">3. Payment Gateway Security</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            All credit card and payment processing is handled through PCI-DSS Level 1 compliant financial gateways. Payment card details are encrypted at rest and never touch or store on our internal servers.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white font-heading">4. Cookies &amp; Local Storage</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            We utilize essential session tokens and local caching to preserve your active shopping cart state and preference settings across browser sessions.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white font-heading">5. Data Removal Rights</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            You have the complete right to inspect, export, or request deletion of all customer account data stored with ShopGround Era by emailing <a href="mailto:info@shopgroundera.com" className="text-[#F27E24] font-bold hover:underline">info@shopgroundera.com</a>.
                                        </p>
                                    </div>
                                </div>

                            </article>
                        )}

                        {/* ─────────────────────────────────────────────────────────────
                             SECTION 3: TERMS & CONDITIONS
                        ────────────────────────────────────────────────────────────── */}
                        {activeTab === 'terms' && (
                            <article className="space-y-8 text-slate-300 text-sm leading-relaxed animate-in fade-in duration-300">
                                
                                <div className="p-6 rounded-2xl bg-[#050507] border border-white/10 flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-[#F27E24]/15 text-[#F27E24] flex items-center justify-center shrink-0 border border-[#F27E24]/30">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-white font-heading">Terms &amp; Purchase Agreement</h2>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Standard operational terms governing factory-direct retail purchases, wholesale distribution, and performance guarantees.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6 text-xs text-slate-300">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white font-heading">1. Technical Performance &amp; Load Ratings</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            GroundEra Anti-Vibration Pads are engineered and lab-tested to support up to 800 LBS per 4-pad set. Load ratings apply to standard residential washing machines, dryers, commercial treadmills, and HVAC equipment installed on flat structural flooring.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white font-heading">2. Factory Shipping &amp; 48-Hour Guarantee</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            Direct warehouse orders ship within 48 hours of payment authorization. Tracking confirmation codes are dispatched via email upon carrier handoff.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white font-heading">3. Lifetime Structural Manufacturer Warranty</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            All GroundEra anti-vibration pads carry a Lifetime Manufacturer Warranty covering structural cracking, rubber deterioration, or material failure. Defective units are replaced free of charge.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white font-heading">4. Wholesale &amp; OEM Quotations</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            Wholesale volume tier pricing and custom OEM branding quotations issued by ShopGround Era remain valid for 30 calendar days from date of issue.
                                        </p>
                                    </div>
                                </div>

                            </article>
                        )}

                        {/* ─────────────────────────────────────────────────────────────
                             SECTION 4: GET A SAMPLE
                        ────────────────────────────────────────────────────────────── */}
                        {activeTab === 'sample' && (
                            <article className="space-y-8 text-slate-300 text-sm leading-relaxed animate-in fade-in duration-300">
                                
                                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#F27E24]/20 via-[#F27E24]/10 to-transparent border border-[#F27E24]/40 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-[#F27E24] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#F27E24]/30">
                                        <Gift className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-lg font-black text-white font-heading">Commercial &amp; OEM Evaluation Sample Program</h2>
                                        <p className="text-xs text-slate-200 leading-relaxed">
                                            Evaluate physical GroundEra pad quality, rubber elastomer density, and stackable leveling shims for your business or distribution network.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div className="p-5 rounded-2xl bg-[#050507] border border-white/10 space-y-2">
                                        <div className="flex items-center gap-2.5 text-white font-bold text-sm font-heading">
                                            <Building2 className="w-4 h-4 text-[#F27E24]" />
                                            <span>For Business Buyers</span>
                                        </div>
                                        <p className="text-slate-400 leading-relaxed">
                                            Sample kits are available to hardware distributors, commercial laundry contractors, equipment manufacturers, and retail buyers.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-[#050507] border border-white/10 space-y-2">
                                        <div className="flex items-center gap-2.5 text-white font-bold text-sm font-heading">
                                            <Truck className="w-4 h-4 text-[#F27E24]" />
                                            <span>48-Hour Freight Dispatch</span>
                                        </div>
                                        <p className="text-slate-400 leading-relaxed">
                                            Sample evaluation kits are prepared with complete technical datasheets and shipped via express priority freight within 48 hours.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-[#050507] border border-white/10 space-y-4">
                                    <h3 className="text-sm font-bold text-white font-heading">How to Order Evaluation Samples</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        To request your sample kit, fill out our quick OEM inquiry form below or contact our sales department directly with your company details and expected annual volume.
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                                        <Link
                                            to="/#inquiry-section"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F27E24] hover:bg-[#C95B0C] text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#F27E24]/20"
                                        >
                                            <span>Fill Out Sample Request Form</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                        <a
                                            href="mailto:info@shopgroundera.com?subject=OEM%20Sample%20Request"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3 rounded-xl border border-white/15 transition-all"
                                        >
                                            <Mail className="w-4 h-4 text-[#F27E24]" />
                                            <span>Email Sales Team</span>
                                        </a>
                                    </div>
                                </div>

                            </article>
                        )}

                    </div>

                </div>

            </div>
        </div>
    );
}
