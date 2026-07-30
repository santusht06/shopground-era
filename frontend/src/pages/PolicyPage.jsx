import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RotateCcw, Shield, FileText, Gift, Mail, ChevronRight, HelpCircle } from 'lucide-react';
import applySEO from '@/hooks/useSEO';

const POLICY_DATA = {
    refund: {
        title: "Refund & Return Policy",
        subtitle: "Comprehensive 30-day money-back guarantee terms and hassle-free return guidelines.",
        icon: RotateCcw,
        seoTitle: "Refund & Return Policy — ShopGround Era 30-Day Money-Back Guarantee",
        seoDesc: "Read ShopGround Era official 30-day return policy. 100% money-back guarantee, free domestic return shipping, and zero restocking fees on GroundEra anti-vibration pads."
    },
    privacy: {
        title: "Privacy Policy",
        subtitle: "Information collection, data security standards, and user privacy protections.",
        icon: Shield,
        seoTitle: "Privacy Policy — ShopGround Era Enterprise Data Protection & Security",
        seoDesc: "ShopGround Era Privacy Policy. 256-bit TLS encryption, zero data selling, and strict protection for personal and commercial client information."
    },
    terms: {
        title: "Terms & Conditions",
        subtitle: "Operational terms of sale, technical specifications, and warranty coverage.",
        icon: FileText,
        seoTitle: "Terms & Conditions — ShopGround Era Operations & Warranty Terms",
        seoDesc: "Review ShopGround Era Terms of Service. 800 LB load capacity specifications, lifetime warranty conditions, and commercial purchase agreements."
    },
    sample: {
        title: "Get a Sample — Evaluation Program",
        subtitle: "Commercial sample kit eligibility and application guidelines for bulk buyers.",
        icon: Gift,
        seoTitle: "Get a Sample — ShopGround Era Commercial Evaluation Program",
        seoDesc: "Request free physical evaluation sample kits for GroundEra Anti-Vibration Pads. Express 48-hour dispatch for qualified commercial buyers and OEM partners."
    }
};

export default function PolicyPage({ defaultTab }) {
    const location = useLocation();
    const navigate = useNavigate();

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

                {/* Header Title Banner */}
                <div className="p-8 rounded-3xl bg-[#0C0C12] border border-white/10 space-y-2">
                    <span className="text-xs uppercase tracking-widest text-[#F27E24] font-black font-heading">
                        ShopGround Era Legal Documentation
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
                        {activeInfo.title}
                    </h1>
                    <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
                        {activeInfo.subtitle}
                    </p>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Sidebar Menu */}
                    <div className="lg:col-span-3 space-y-4 sticky top-24">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 px-1 block font-heading">
                            Policy Navigation
                        </span>
                        <div className="bg-[#0C0C12] border border-white/10 rounded-2xl p-2 space-y-1">
                            {Object.entries(POLICY_DATA).map(([id, info]) => {
                                const Icon = info.icon;
                                const isActive = activeTab === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => handleTabChange(id)}
                                        className={`w-full px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                                            isActive
                                                ? 'bg-[#F27E24] text-white shadow-md'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                            <span>{info.title.split('—')[0]}</span>
                                        </div>
                                        <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Support Contact Box */}
                        <div className="p-4 rounded-2xl bg-[#0C0C12] border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-white font-bold text-xs">
                                <HelpCircle className="w-4 h-4 text-[#F27E24]" />
                                <span>Support Assistance</span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                For inquiries regarding existing orders or custom policies, contact support directly:
                            </p>
                            <a
                                href="mailto:info@shopgroundera.com"
                                className="text-xs font-bold text-[#F27E24] hover:underline flex items-center gap-1.5 pt-1"
                            >
                                <Mail className="w-3.5 h-3.5" />
                                info@shopgroundera.com
                            </a>
                        </div>
                    </div>

                    {/* Right Standalone Article Content */}
                    <div className="lg:col-span-9 bg-[#0C0C12] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-300 text-xs leading-relaxed">

                        {/* ─────────────────────────────────────────────────────────────
                             1. REFUND & RETURN POLICY (EXTENSIVE TEXT)
                        ────────────────────────────────────────────────────────────── */}
                        {activeTab === 'refund' && (
                            <article className="space-y-8 animate-in fade-in duration-300">
                                
                                <div className="space-y-3">
                                    <h2 className="text-xl font-black text-white font-heading">30-Day Money-Back Guarantee Policy</h2>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        At ShopGround Era (shopgroundera.com), we stand firmly behind the performance and durability of GroundEra Anti-Vibration Pads. Every purchase is backed by our full 30-day money-back guarantee. If for any reason our pads do not reduce appliance vibration, stop walking, or meet your performance expectations, you are entitled to a full refund within 30 days of delivery.
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 1: Return Eligibility &amp; Timeframe</h3>
                                    <ul className="space-y-2.5 list-disc pl-5 text-slate-400">
                                        <li><strong className="text-white">Eligibility Window:</strong> Return requests must be initiated within 30 calendar days from the date of confirmed delivery as recorded by the carrier shipping tracking system.</li>
                                        <li><strong className="text-white">Included Components:</strong> Returned product packages should include all 4 GroundEra anti-vibration pads, included leveling shims, and the keychain mini spirit level tool.</li>
                                        <li><strong className="text-white">Product Condition:</strong> Normal cosmetic wear resulting from installing and testing the pads under washing machines, dryers, treadmills, or HVAC units is completely accepted.</li>
                                        <li><strong className="text-white">Zero Restocking Fees:</strong> ShopGround Era does not charge any restocking, handling, or processing fees on returned orders.</li>
                                    </ul>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 2: Pre-Paid Shipping &amp; Domestic Coverage</h3>
                                    <p className="text-slate-400">
                                        For all domestic retail orders within the United States, ShopGround Era provides a pre-paid printable return shipping label upon approval of your return request. You do not have to pay out of pocket to return your items. International returns are handled on a case-by-case basis through our support team.
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 3: Step-by-Step Return Instructions</h3>
                                    <ol className="space-y-3 text-slate-300">
                                        <li className="p-4 rounded-xl bg-[#050507] border border-white/5">
                                            <strong className="text-white font-bold block mb-1">Step 1 — Email Support Request</strong>
                                            Send an email to <a href="mailto:info@shopgroundera.com" className="text-[#F27E24] font-bold hover:underline">info@shopgroundera.com</a> with your order number, purchasing email address, or Amazon order ID. Please state briefly that you would like to initiate a return.
                                        </li>
                                        <li className="p-4 rounded-xl bg-[#050507] border border-white/5">
                                            <strong className="text-white font-bold block mb-1">Step 2 — Print Shipping Label</strong>
                                            Our support department will review your order details and email a digital pre-paid PDF shipping label within 2 to 4 business hours. Print the label and attach it securely to your return package.
                                        </li>
                                        <li className="p-4 rounded-xl bg-[#050507] border border-white/5">
                                            <strong className="text-white font-bold block mb-1">Step 3 — Drop Off &amp; Refund Issuance</strong>
                                            Drop off the package at any authorized carrier shipping location. Once the carrier scans your package into transit, your full purchase refund is automatically released back to your original credit card or payment method within 3 to 5 business days.
                                        </li>
                                    </ol>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 4: Damaged, Defective, or Missing Items</h3>
                                    <p className="text-slate-400">
                                        If your shipment arrives damaged, incomplete, or with defective parts, you do not need to return the item. Contact <a href="mailto:info@shopgroundera.com" className="text-[#F27E24] font-bold hover:underline">info@shopgroundera.com</a> immediately with a quick photo of the package, and we will dispatch a brand-new replacement set within 48 hours at zero cost to you.
                                    </p>
                                </div>

                            </article>
                        )}

                        {/* ─────────────────────────────────────────────────────────────
                             2. PRIVACY POLICY (EXTENSIVE TEXT)
                        ────────────────────────────────────────────────────────────── */}
                        {activeTab === 'privacy' && (
                            <article className="space-y-8 animate-in fade-in duration-300">
                                
                                <div className="space-y-3">
                                    <h2 className="text-xl font-black text-white font-heading">Privacy Policy &amp; Information Security Standards</h2>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        ShopGround Era is committed to safeguarding the privacy and security of all visitors, retail customers, and commercial partners who interact with shopgroundera.com. This Privacy Policy details how we collect, store, utilize, and protect your information.
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 1: Information We Collect</h3>
                                    <p className="text-slate-400">
                                        We collect information strictly necessary to process retail orders, fulfill commercial OEM sample requests, and communicate with you regarding your inquiries:
                                    </p>
                                    <ul className="space-y-2 list-disc pl-5 text-slate-400">
                                        <li><strong className="text-white">Order &amp; Contact Details:</strong> Full name, company name, business email address, phone number, shipping address, and billing address.</li>
                                        <li><strong className="text-white">Transaction Logs:</strong> Order histories, item quantities, tracking numbers, and customer service correspondence.</li>
                                        <li><strong className="text-white">Technical Analytics:</strong> IP addresses, browser types, device identifiers, and page interaction metrics collected via anonymous server logs for web performance optimization.</li>
                                    </ul>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 2: Zero Data Monetization &amp; Third-Party Policy</h3>
                                    <p className="text-slate-400">
                                        ShopGround Era maintains a strict policy: <strong className="text-white">We do not sell, trade, rent, lease, or monetize customer data or business lead information to any third parties under any circumstances.</strong> Your contact details are accessed solely by authorized ShopGround Era personnel to service your account.
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 3: Payment Encryption &amp; Financial Security</h3>
                                    <p className="text-slate-400">
                                        All payment transactions on shopgroundera.com are transmitted using 256-bit TLS (Transport Layer Security) encryption. Credit card processing is handled by PCI-DSS Level 1 compliant payment gateways. Credit card numbers, card verification codes (CVC), and sensitive financial credentials are never stored on ShopGround Era web servers.
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 4: Data Retention &amp; User Removal Rights</h3>
                                    <p className="text-slate-400">
                                        You maintain full ownership of your data. You may request a complete export of your personal information or request permanent deletion of your customer profile from our records at any time by emailing <a href="mailto:info@shopgroundera.com" className="text-[#F27E24] font-bold hover:underline">info@shopgroundera.com</a>. Requests are processed within 24 hours.
                                    </p>
                                </div>

                            </article>
                        )}

                        {/* ─────────────────────────────────────────────────────────────
                             3. TERMS & CONDITIONS (EXTENSIVE TEXT)
                        ────────────────────────────────────────────────────────────── */}
                        {activeTab === 'terms' && (
                            <article className="space-y-8 animate-in fade-in duration-300">
                                
                                <div className="space-y-3">
                                    <h2 className="text-xl font-black text-white font-heading">Terms &amp; Conditions of Sale and Operation</h2>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        These Terms &amp; Conditions govern all transactions, site usage, product performance claims, and operational agreements conducted with ShopGround Era via shopgroundera.com. By placing an order or submitting an OEM inquiry, you accept these terms.
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 1: Product Specifications &amp; Load Capacity</h3>
                                    <p className="text-slate-400">
                                        GroundEra Anti-Vibration Pads are engineered using industrial-grade high-density elastomer compounds. The rated weight capacity is 800 LBS per 4-pad set (200 LBS per pad). Ratings apply when installed on flat structural surfaces (tile, hardwood, vinyl, concrete) supporting standard residential washing machines, dryers, commercial treadmills, refrigerators, or HVAC compressor units.
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 2: Order Dispatch &amp; Delivery Commitments</h3>
                                    <ul className="space-y-2 list-disc pl-5 text-slate-400">
                                        <li><strong className="text-white">48-Hour Dispatch Guarantee:</strong> Orders received Monday through Friday are processed and dispatched from our primary distribution warehouse within 48 hours.</li>
                                        <li><strong className="text-white">Tracking &amp; Confirmation:</strong> Tracking numbers are generated and emailed automatically upon carrier pickup. Delivery transit estimates are provided by shipping carriers and may vary due to weather or regional transit delays.</li>
                                    </ul>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 3: Lifetime Manufacturer Warranty Coverage</h3>
                                    <p className="text-slate-400">
                                        Every set of GroundEra pads carries a Lifetime Structural Warranty covering cracking, material tearing, disintegration, or manufacturing defects under normal operating conditions. Warranty coverage entitles the original buyer to replacement parts shipped free of charge upon verified failure proof.
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 4: Wholesale Quotations &amp; Intellectual Property</h3>
                                    <p className="text-slate-400">
                                        Formal commercial quotations, custom OEM branding specs, and volume tier price agreements issued by ShopGround Era remain valid for 30 calendar days. All logos, product photography, technical specifications, and digital branding assets on shopgroundera.com are the exclusive intellectual property of ShopGround Era.
                                    </p>
                                </div>

                            </article>
                        )}

                        {/* ─────────────────────────────────────────────────────────────
                             4. GET A SAMPLE (EXTENSIVE TEXT)
                        ────────────────────────────────────────────────────────────── */}
                        {activeTab === 'sample' && (
                            <article className="space-y-8 animate-in fade-in duration-300">
                                
                                <div className="space-y-3">
                                    <h2 className="text-xl font-black text-white font-heading">Commercial &amp; OEM Evaluation Sample Program</h2>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        ShopGround Era provides physical evaluation sample kits to qualified commercial buyers, hardware distributors, appliance OEMs, and commercial laundry operators. Test product density, stacking mechanics, and vibration dampening before committing to bulk volume orders.
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 1: Sample Kit Contents</h3>
                                    <p className="text-slate-400">
                                        Each commercial sample evaluation package includes:
                                    </p>
                                    <ul className="space-y-2 list-disc pl-5 text-slate-400">
                                        <li><strong className="text-white">Full 4-Pad GroundEra Set:</strong> Industrial-grade high-density anti-vibration pads.</li>
                                        <li><strong className="text-white">Precision Stacking Shims:</strong> Fine-tuning height adjustment leveling shims.</li>
                                        <li><strong className="text-white">Keychain Spirit Level:</strong> Portable bubble level alignment tool.</li>
                                        <li><strong className="text-white">Technical Spec Datasheet:</strong> Material elastomer hardness test reports, load ratings, and wholesale volume pricing tiers.</li>
                                    </ul>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 2: Qualification Criteria for Free Samples</h3>
                                    <p className="text-slate-400">
                                        Sample evaluation kits are reserved for business entities evaluating bulk purchases, OEM customization, or retail distribution. Requests must include valid business information (company name, business email, and estimated annual order quantity).
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-[#F27E24]">Section 3: How to Apply for a Sample Kit</h3>
                                    <div className="space-y-3 text-slate-300">
                                        <div className="p-4 rounded-xl bg-[#050507] border border-white/5">
                                            <strong className="text-white font-bold block mb-1">Option A — Submit Online Form</strong>
                                            Navigate to our <Link to="/#inquiry-section" className="text-[#F27E24] font-bold hover:underline">OEM Quote &amp; Sample Request Form</Link> on the homepage, select your interest category, and specify "Sample Request" in the message notes.
                                        </div>
                                        <div className="p-4 rounded-xl bg-[#050507] border border-white/5">
                                            <strong className="text-white font-bold block mb-1">Option B — Email Direct to Sales</strong>
                                            Email <a href="mailto:info@shopgroundera.com?subject=Sample%20Evaluation%20Request" className="text-[#F27E24] font-bold hover:underline">info@shopgroundera.com</a> with your business details. Approved sample kits ship via priority express freight within 48 hours.
                                        </div>
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
