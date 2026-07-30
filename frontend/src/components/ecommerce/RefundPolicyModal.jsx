import React from 'react';
import { X, RotateCcw, CheckCircle2, ShieldCheck, Truck, HelpCircle, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * RefundPolicyModal — Production-Grade Refund & Return Policy Modal
 * Features:
 * - 30-Day Money-Back Guarantee highlight
 * - Free Return Shipping terms
 * - Step-by-step return process
 * - Direct contact link to info@shopgroundera.com
 */
export default function RefundPolicyModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-[#0C0C12] border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 orange-glow-border text-[#F8FAFC]">
                
                {/* Header Strip */}
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#050507]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#F27E24]/10 border border-[#F27E24]/30 flex items-center justify-center text-[#F27E24]">
                            <RotateCcw className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white font-heading">Refund &amp; Return Policy</h2>
                            <p className="text-xs text-slate-400 font-medium">ShopGround Era 100% Risk-Free Guarantee</p>
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

                {/* Body Content */}
                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">

                    {/* Banner Highlight */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F27E24]/15 via-[#F27E24]/5 to-transparent border border-[#F27E24]/30 flex items-center gap-4">
                        <ShieldCheck className="w-8 h-8 text-[#F27E24] shrink-0" />
                        <div>
                            <span className="text-xs uppercase font-black tracking-widest text-[#F27E24]">30-Day Full Refund Guarantee</span>
                            <h3 className="text-sm font-bold text-white mt-0.5">Free returns within 30 days — 100% Satisfaction Guaranteed</h3>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                If GroundEra pads do not completely eliminate your appliance vibration, noise, or walking, return them within 30 days for a full refund.
                            </p>
                        </div>
                    </div>

                    {/* Policy Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">

                        {/* Card 1: 30-Day Window */}
                        <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-white font-bold">
                                <CheckCircle2 className="w-4 h-4 text-[#F27E24]" />
                                <span>30-Day Return Window</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                                You have 30 calendar days from the delivery date to return your order. No restocking fees, no hassle.
                            </p>
                        </div>

                        {/* Card 2: Free Return Shipping */}
                        <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-white font-bold">
                                <Truck className="w-4 h-4 text-[#F27E24]" />
                                <span>Free Return Shipping</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                                We provide a pre-paid printable shipping label for all domestic returns. Zero cost to send back.
                            </p>
                        </div>

                        {/* Card 3: Eligible Condition */}
                        <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-white font-bold">
                                <RotateCcw className="w-4 h-4 text-[#F27E24]" />
                                <span>Item Condition</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                                Returned sets must include all 4 pads, leveling shim, and spirit level tool in reasonable condition.
                            </p>
                        </div>

                        {/* Card 4: Fast Refund Processing */}
                        <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-white font-bold">
                                <ShieldCheck className="w-4 h-4 text-[#F27E24]" />
                                <span>3-5 Day Refund Payout</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                                Once returned items arrive, full refunds are issued to your original payment method within 3 to 5 business days.
                            </p>
                        </div>

                    </div>

                    {/* Step-by-Step Return Process */}
                    <div className="space-y-3 pt-2">
                        <h4 className="text-xs uppercase font-black tracking-widest text-slate-400 font-heading">How to Initiate a Return</h4>
                        <ol className="space-y-2.5 text-xs text-slate-300">
                            <li className="flex items-start gap-3 p-3 rounded-xl bg-[#050507] border border-white/5">
                                <span className="w-5 h-5 rounded-full bg-[#F27E24]/20 text-[#F27E24] font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                                <span>Send an email to <a href="mailto:info@shopgroundera.com" className="text-[#F27E24] font-bold hover:underline">info@shopgroundera.com</a> with your order number or purchase email.</span>
                            </li>
                            <li className="flex items-start gap-3 p-3 rounded-xl bg-[#050507] border border-white/5">
                                <span className="w-5 h-5 rounded-full bg-[#F27E24]/20 text-[#F27E24] font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                                <span>Our support team will instantly send your pre-paid shipping label and instructions.</span>
                            </li>
                            <li className="flex items-start gap-3 p-3 rounded-xl bg-[#050507] border border-white/5">
                                <span className="w-5 h-5 rounded-full bg-[#F27E24]/20 text-[#F27E24] font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                                <span>Drop off the package at any carrier location. Your full refund triggers as soon as the label scans.</span>
                            </li>
                        </ol>
                    </div>

                    {/* Need Help CTA */}
                    <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                            <HelpCircle className="w-5 h-5 text-[#F27E24] shrink-0" />
                            <span>Have a question about a return or exchange?</span>
                        </div>
                        <a
                            href="mailto:info@shopgroundera.com?subject=Return%20Request"
                            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#F27E24] hover:bg-[#C95B0C] px-4 py-2 rounded-xl transition-colors shrink-0"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            Contact Us
                        </a>
                    </div>

                </div>

                {/* Footer Action */}
                <div className="px-6 py-4 border-t border-white/10 bg-[#050507] flex items-center justify-end">
                    <Button
                        onClick={onClose}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-2 rounded-xl border border-white/10 cursor-pointer"
                    >
                        Got It
                    </Button>
                </div>

            </div>
        </div>
    );
}
