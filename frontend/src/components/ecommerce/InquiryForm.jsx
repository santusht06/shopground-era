import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import apiClient from '@/services/apiClient';
import { Send, CheckCircle2, Building, Mail, Phone, User, Hash, MessageSquare, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function InquiryForm({ productId = '66a87f12bc09a123456789ab', productName = 'GroundEra Anti-Vibration Pads' }) {
    const cartItems = useSelector((state) => state.cart.items);
    const totalCartUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalCartPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        target_quantity: totalCartUnits > 0 ? totalCartUnits : 10,
        message: totalCartUnits > 0 
            ? `Requesting sample dispatch & official bulk distribution quote for ${totalCartUnits} units of selected cart items.` 
            : '',
    });
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (totalCartUnits > 0 && !formData.message) {
            setFormData(prev => ({
                ...prev,
                target_quantity: totalCartUnits,
                message: `Requesting sample dispatch & official bulk distribution quote for ${totalCartUnits} units of selected cart items.`,
            }));
        }
    }, [totalCartUnits]);

    const handleAutoFillFromCart = () => {
        if (totalCartUnits > 0) {
            setFormData(prev => ({
                ...prev,
                target_quantity: totalCartUnits,
                message: `Requesting sample dispatch & official bulk quote for ${totalCartUnits} units (${cartItems.map(i => `${i.name} x${i.quantity}`).join(', ')}). Total Value: $${totalCartPrice.toFixed(2)}`,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            const payload = {
                ...formData,
                target_quantity: parseInt(formData.target_quantity, 10) || 1,
                product_id: productId,
            };

            const res = await apiClient.post('/inquiries', payload);
            if (res.data?.success) {
                setSuccessMsg(res.data.message);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    target_quantity: totalCartUnits > 0 ? totalCartUnits : 10,
                    message: '',
                });
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.detail || 'Failed to submit inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="inquiry-form-section" className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="bg-[#0C0C12] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.9)] relative overflow-hidden orange-glow-border">
                {/* Background ambient orange lighting */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#F27E24]/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F27E24]/10 border border-[#F27E24]/30 text-[#F27E24] text-xs font-black uppercase tracking-widest shadow-[0_0_10px_rgba(242,126,36,0.2)]">
                            <Building className="w-3.5 h-3.5" /> Direct Distribution & Sample Inquiry
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
                            Interested in {productName}?
                        </h2>
                        <p className="text-sm text-slate-400 leading-relaxed font-normal">
                            Submit your details below. Your inquiry will be logged directly into our database and routed immediately to our sales management team (<span className="font-bold text-[#F27E24]">info@shopgroundera.com</span>).
                        </p>
                    </div>

                    {/* Live Cart Items Summary Badge */}
                    {totalCartUnits > 0 && (
                        <div className="bg-[#12121B] border border-[#F27E24]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#F27E24]/15 border border-[#F27E24]/30 text-[#F27E24] flex items-center justify-center shrink-0 font-bold">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-white font-heading uppercase tracking-wider flex items-center gap-2">
                                        Selected Cart Items ({cartItems.length} Product{cartItems.length > 1 ? 's' : ''})
                                    </div>
                                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                                        {totalCartUnits} Total Units · Value: <span className="text-[#F27E24] font-bold">${totalCartPrice.toFixed(2)}</span>
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                onClick={handleAutoFillFromCart}
                                size="sm"
                                className="bg-[#F27E24]/20 hover:bg-[#F27E24]/30 text-[#F27E24] border border-[#F27E24]/40 text-xs font-bold px-3.5 h-9 rounded-xl gap-1.5 cursor-pointer shrink-0"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Auto-Fill Form from Cart
                            </Button>
                        </div>
                    )}

                    {/* Success Alert */}
                    {successMsg && (
                        <div className="p-4 bg-[#0A291A] border border-emerald-500/40 rounded-2xl flex items-start gap-3 text-emerald-200 text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold">Inquiry Sent Successfully!</h4>
                                <p className="text-xs text-emerald-300 mt-0.5">{successMsg}</p>
                            </div>
                        </div>
                    )}

                    {/* Error Alert */}
                    {errorMsg && (
                        <div className="p-4 bg-[#330A0E] border border-rose-500/40 rounded-2xl text-rose-200 text-sm font-medium">
                            ⚠ {errorMsg}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-heading">
                                    <User className="w-3.5 h-3.5 text-[#F27E24]" /> Full Name *
                                </label>
                                <Input
                                    required
                                    type="text"
                                    placeholder="e.g. Alex Vance"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 bg-[#12121A] border-white/10 text-white placeholder:text-slate-500 focus:border-[#F27E24] focus:ring-1 focus:ring-[#F27E24] text-sm rounded-xl"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-heading">
                                    <Mail className="w-3.5 h-3.5 text-[#F27E24]" /> Email Address *
                                </label>
                                <Input
                                    required
                                    type="email"
                                    placeholder="e.g. alex.vance@acme.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="h-12 bg-[#12121A] border-white/10 text-white placeholder:text-slate-500 focus:border-[#F27E24] focus:ring-1 focus:ring-[#F27E24] text-sm rounded-xl"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-heading">
                                    <Phone className="w-3.5 h-3.5 text-[#F27E24]" /> Phone Number
                                </label>
                                <Input
                                    type="tel"
                                    placeholder="e.g. +1 (555) 234-5678"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="h-12 bg-[#12121A] border-white/10 text-white placeholder:text-slate-500 focus:border-[#F27E24] focus:ring-1 focus:ring-[#F27E24] text-sm rounded-xl"
                                />
                            </div>

                            {/* Company */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-heading">
                                    <Building className="w-3.5 h-3.5 text-[#F27E24]" /> Company / Organization
                                </label>
                                <Input
                                    type="text"
                                    placeholder="e.g. Acme Hardware Corp"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="h-12 bg-[#12121A] border-white/10 text-white placeholder:text-slate-500 focus:border-[#F27E24] focus:ring-1 focus:ring-[#F27E24] text-sm rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-heading">
                                <Hash className="w-3.5 h-3.5 text-[#F27E24]" /> Target Quantity (Units)
                            </label>
                            <Input
                                type="number"
                                min="1"
                                placeholder="10"
                                value={formData.target_quantity}
                                onChange={(e) => setFormData({ ...formData, target_quantity: e.target.value })}
                                className="h-12 bg-[#12121A] border-white/10 text-white placeholder:text-slate-500 focus:border-[#F27E24] focus:ring-1 focus:ring-[#F27E24] text-sm rounded-xl max-w-xs font-mono font-bold"
                            />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-heading">
                                <MessageSquare className="w-3.5 h-3.5 text-[#F27E24]" /> Inquiry Details / Specifications Needed *
                            </label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Describe your requirement, delivery location, or custom distribution request..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-[#12121A] p-3 text-sm text-white placeholder:text-slate-500 focus:border-[#F27E24] focus:outline-none focus:ring-1 focus:ring-[#F27E24]"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <ShieldCheck className="w-4 h-4 text-[#F27E24]" />
                                <span>SSL Encrypted — Dispatches immediately to info@shopgroundera.com</span>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="gradient-btn-orange font-black text-sm h-12 px-8 rounded-xl gap-2 w-full sm:w-auto cursor-pointer shadow-xl"
                            >
                                <Send className="w-4 h-4" />
                                {loading ? 'Sending Inquiry...' : 'Submit Inquiry to Sales Team'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
