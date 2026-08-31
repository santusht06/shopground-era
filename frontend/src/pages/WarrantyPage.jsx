import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Search, UploadCloud, ArrowRight, Award, Zap, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import applySEO from '@/hooks/useSEO';

export default function WarrantyPage() {
  applySEO(
    '2-Year Genuine Warranty Registration & Claims — GroundEra™',
    'Register your 2-Year Genuine Warranty for GroundEra Anti-Vibration Pads or submit a claim with photo/video proof for instant 24-hour processing.'
  );

  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'verify' | 'claim'

  // Form States — Registration
  const [regForm, setRegForm] = useState({
    order_id: '',
    customer_name: '',
    email: '',
    phone: '',
    serial_number: '',
    purchase_date: new Date().toISOString().split('T')[0],
    invoice_url: ''
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regResult, setRegResult] = useState(null);
  const [regError, setRegError] = useState(null);

  // Form States — Verification
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState(null);

  // Form States — Claim
  const [claimForm, setClaimForm] = useState({
    warranty_code: '',
    email: '',
    issue_category: 'Dampening Failure / Walking Pads',
    description: '',
    evidence_url: ''
  });
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimResult, setClaimResult] = useState(null);
  const [claimError, setClaimError] = useState(null);

  // Handlers
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError(null);
    setRegResult(null);

    try {
      const res = await fetch('https://api.shopgroundera.com/api/v1/warranty/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Registration failed.');
      setRegResult(data);
    } catch (err) {
      setRegError(err.message);
    } finally {
      setRegLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;
    setVerifyLoading(true);
    setVerifyError(null);
    setVerifyResult(null);

    try {
      const res = await fetch(`https://api.shopgroundera.com/api/v1/warranty/verify/${encodeURIComponent(verifyCode.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Warranty code not found.');
      setVerifyResult(data);
    } catch (err) {
      setVerifyError(err.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setClaimLoading(true);
    setClaimError(null);
    setClaimResult(null);

    try {
      const res = await fetch('https://api.shopgroundera.com/api/v1/warranty/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Claim submission failed.');
      setClaimResult(data);
    } catch (err) {
      setClaimError(err.message);
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Backlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#F27E24]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-10">
        
        {/* Title Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F27E24]/10 border border-[#F27E24]/30 text-[#F27E24] text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Genuine Coverage Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            GroundEra™ <span className="gradient-text-orange">2-Year Genuine Warranty</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-medium max-w-2xl mx-auto">
            Register your purchase to activate instant coverage against dampening breakdown, material tearing, or shim fitment defects.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center p-1.5 rounded-2xl bg-[#0C0C12] border border-white/10 max-w-xl mx-auto">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'register' ? 'bg-[#F27E24] text-white shadow-[0_0_20px_rgba(242,126,36,0.4)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Register Warranty</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'verify' ? 'bg-[#F27E24] text-white shadow-[0_0_20px_rgba(242,126,36,0.4)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Verify Status</span>
          </button>

          <button
            onClick={() => setActiveTab('claim')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'claim' ? 'bg-[#F27E24] text-white shadow-[0_0_20px_rgba(242,126,36,0.4)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Claim Warranty</span>
          </button>
        </div>

        {/* ─── TAB 1: REGISTRATION ────────────────────────────────────────── */}
        {activeTab === 'register' && (
          <div className="bg-[#0C0C12] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#F27E24]" />
                Register Product Warranty
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your Order ID and product Serial Number found on your box or product manual.
              </p>
            </div>

            {regResult ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg text-white">Warranty Card Generated & Active!</h4>
                    <p className="text-xs text-emerald-300">{regResult.message}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">WARRANTY CODE</span>
                    <span className="text-lg font-black text-white">{regResult.warranty_code}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">EXPIRATION DATE</span>
                    <span className="text-lg font-black text-emerald-400">{regResult.expires_at}</span>
                  </div>
                </div>

                <Button onClick={() => setRegResult(null)} className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 rounded-xl">
                  Register Another Product
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {regError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Order ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ORD-99824102"
                      value={regForm.order_id}
                      onChange={(e) => setRegForm({ ...regForm, order_id: e.target.value })}
                      className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27E24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Serial Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GE-2026-98124"
                      value={regForm.serial_number}
                      onChange={(e) => setRegForm({ ...regForm, serial_number: e.target.value })}
                      className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27E24]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={regForm.customer_name}
                      onChange={(e) => setRegForm({ ...regForm, customer_name: e.target.value })}
                      className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27E24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27E24]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27E24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Purchase Date *</label>
                    <input
                      type="date"
                      required
                      value={regForm.purchase_date}
                      onChange={(e) => setRegForm({ ...regForm, purchase_date: e.target.value })}
                      className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#F27E24]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Invoice / Receipt URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://cloud.com/receipt.pdf"
                    value={regForm.invoice_url}
                    onChange={(e) => setRegForm({ ...regForm, invoice_url: e.target.value })}
                    className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27E24]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={regLoading}
                  className="w-full gradient-btn-orange font-bold text-xs h-11 rounded-xl shadow-lg gap-2 mt-2"
                >
                  {regLoading ? 'Registering Warranty...' : 'Activate 2-Year Genuine Warranty'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        )}

        {/* ─── TAB 2: VERIFICATION ────────────────────────────────────────── */}
        {activeTab === 'verify' && (
          <div className="bg-[#0C0C12] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-[#F27E24]" />
                Instant Warranty Lookup
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your unique Warranty Code (e.g. WRN-DFD41E0D) to verify genuineness and expiration.
              </p>
            </div>

            <form onSubmit={handleVerifySubmit} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Enter Warranty Code (e.g. WRN-XXXXXX)"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                className="flex-1 bg-[#161622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#F27E24]"
              />
              <Button type="submit" disabled={verifyLoading} className="gradient-btn-orange font-bold text-xs h-12 px-6 rounded-xl">
                {verifyLoading ? 'Searching...' : 'Verify'}
              </Button>
            </form>

            {verifyError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            {verifyResult && (
              <div className="p-6 rounded-2xl bg-[#161622] border border-white/15 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#F27E24]" />
                    <span className="font-mono font-bold text-white text-base">{verifyResult.warranty_code}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    verifyResult.is_valid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {verifyResult.is_valid ? 'GENUINE ACTIVE WARRANTY' : verifyResult.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">PRODUCT</span>
                    <span className="text-white font-medium">{verifyResult.product_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SERIAL NUMBER</span>
                    <span className="text-white font-mono">{verifyResult.serial_number}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ORDER ID</span>
                    <span className="text-white font-mono">{verifyResult.order_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CUSTOMER</span>
                    <span className="text-white font-medium">{verifyResult.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PURCHASE DATE</span>
                    <span className="text-white font-mono">{verifyResult.purchase_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">EXPIRATION DATE</span>
                    <span className="text-[#F27E24] font-mono font-bold">{verifyResult.expires_at}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: FILE CLAIM ─────────────────────────────────────────── */}
        {activeTab === 'claim' && (
          <div className="bg-[#0C0C12] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#F27E24]" />
                File Warranty Claim
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Submit a genuine claim for defect review. Our engineering team responds within 24 hours.
              </p>
            </div>

            {claimResult ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg text-white">Claim Submitted Successfully!</h4>
                    <p className="text-xs text-emerald-300">{claimResult.message}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">CLAIM CODE</span>
                    <span className="text-lg font-black text-white">{claimResult.claim_code}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CLAIM STATUS</span>
                    <span className="text-lg font-black text-[#F27E24]">{claimResult.status}</span>
                  </div>
                </div>

                <Button onClick={() => setClaimResult(null)} className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 rounded-xl">
                  Submit Another Claim
                </Button>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                {claimError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{claimError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Warranty Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. WRN-DFD41E0D"
                      value={claimForm.warranty_code}
                      onChange={(e) => setClaimForm({ ...claimForm, warranty_code: e.target.value })}
                      className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27E24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Registered Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={claimForm.email}
                      onChange={(e) => setClaimForm({ ...claimForm, email: e.target.value })}
                      className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27E24]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Issue Category *</label>
                  <select
                    value={claimForm.issue_category}
                    onChange={(e) => setClaimForm({ ...claimForm, issue_category: e.target.value })}
                    className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#F27E24]"
                  >
                    <option value="Dampening Failure / Walking Pads">Dampening Failure / Walking Pads</option>
                    <option value="Material Cracking / Tearing">Material Cracking / Tearing</option>
                    <option value="Shim / Leveling Component Defect">Shim / Leveling Component Defect</option>
                    <option value="Fitment / Dimension Issue">Fitment / Dimension Issue</option>
                    <option value="Other Performance Issue">Other Performance Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Defect Description *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please describe the issue in detail, machine model, and floor surface type..."
                    value={claimForm.description}
                    onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })}
                    className="w-full bg-[#161622] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27E24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Evidence Photo / Video URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/photo.jpg"
                    value={claimForm.evidence_url}
                    onChange={(e) => setClaimForm({ ...claimForm, evidence_url: e.target.value })}
                    className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27E24]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={claimLoading}
                  className="w-full gradient-btn-orange font-bold text-xs h-11 rounded-xl shadow-lg gap-2 mt-2"
                >
                  {claimLoading ? 'Submitting Claim...' : 'Submit Claim for 24h Review'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Warranty Guarantee Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-[#0C0C12] border border-white/10 space-y-2">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F27E24]" />
              2-Year Full Coverage
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Covers material degradation, elastomeric cracking, and dampening reduction under normal 800 LB load operations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0C0C12] border border-white/10 space-y-2">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F27E24]" />
              Fast 24-Hour Review
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our quality team audits all genuine claims within 24 business hours for replacement dispatch.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0C0C12] border border-white/10 space-y-2">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F27E24]" />
              Free Replacement Shipping
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Approved claims receive zero-cost express replacement pad sets delivered directly to your address.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
