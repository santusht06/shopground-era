import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Check, X, RefreshCw, Eye, ExternalLink, Search, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WarrantyManagement() {
  const [activeTab, setActiveTab] = useState('claims'); // 'claims' | 'registrations'
  const [claims, setClaims] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWarranties = async () => {
    setLoading(true);
    try {
      const [cRes, rRes] = await Promise.all([
        fetch('https://api.shopgroundera.com/api/v1/warranty/admin/claims'),
        fetch('https://api.shopgroundera.com/api/v1/warranty/admin/registrations')
      ]);
      const cData = await cRes.json();
      const rData = await rRes.json();
      setClaims(Array.isArray(cData) ? cData : []);
      setRegistrations(Array.isArray(rData) ? rData : []);
    } catch (err) {
      console.error('Failed to fetch warranties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  const handleUpdateClaimStatus = async (claimCode, newStatus) => {
    setActionLoading(claimCode);
    try {
      const res = await fetch(`https://api.shopgroundera.com/api/v1/warranty/admin/claims/${claimCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: `Status updated to ${newStatus} by Store Admin.`
        })
      });
      if (res.ok) {
        await fetchWarranties();
      }
    } catch (err) {
      console.error('Failed to update claim:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredClaims = claims.filter(c => 
    c.claim_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.warranty_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRegistrations = registrations.filter(r =>
    r.warranty_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#5E6AD2]" />
            <h2 className="text-xl font-extrabold text-[#0F172A]">Genuine Warranty & Claims Audit</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audit product registrations, inspect defect evidence media, and issue automated replacement authorizations.
          </p>
        </div>

        <Button onClick={fetchWarranties} disabled={loading} variant="outline" className="text-xs gap-2">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'claims' ? 'bg-white text-[#5E6AD2] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Warranty Claims ({claims.length})
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'registrations' ? 'bg-white text-[#5E6AD2] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registered Warranties ({registrations.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search code, email, serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5E6AD2]"
          />
        </div>
      </div>

      {/* CLAIMS TAB */}
      {activeTab === 'claims' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Claim & Warranty Code</th>
                  <th className="p-4">Customer & Order</th>
                  <th className="p-4">Issue Category</th>
                  <th className="p-4">Description & Evidence</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No warranty claims found.
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((claim) => (
                    <tr key={claim.claim_code} className="hover:bg-slate-50">
                      <td className="p-4">
                        <span className="font-mono font-bold text-[#0F172A] block">{claim.claim_code}</span>
                        <span className="font-mono text-[10px] text-slate-400">WRN: {claim.warranty_code}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-900 block">{claim.customer_name}</span>
                        <span className="text-slate-500 text-[10px] block">{claim.email}</span>
                        <span className="font-mono text-[10px] text-[#5E6AD2]">Order: {claim.order_id}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-800">{claim.issue_category}</span>
                        <span className="text-[10px] text-slate-400 block">{claim.submitted_at}</span>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="text-slate-600 line-clamp-2">{claim.description}</p>
                        {claim.evidence_url && (
                          <a
                            href={claim.evidence_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#5E6AD2] hover:underline mt-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Evidence Media
                          </a>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          claim.status === 'Approved (Replacement)' ? 'bg-emerald-100 text-emerald-700' :
                          claim.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <Button
                          size="sm"
                          disabled={actionLoading === claim.claim_code}
                          onClick={() => handleUpdateClaimStatus(claim.claim_code, 'Approved (Replacement)')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] h-7 px-2.5 rounded-lg"
                        >
                          Approve Replacement
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoading === claim.claim_code}
                          onClick={() => handleUpdateClaimStatus(claim.claim_code, 'Rejected')}
                          className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[10px] h-7 px-2 rounded-lg"
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REGISTRATIONS TAB */}
      {activeTab === 'registrations' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Warranty Code</th>
                  <th className="p-4">Customer & Order</th>
                  <th className="p-4">Serial Number</th>
                  <th className="p-4">Coverage Period</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No warranty registrations found.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.warranty_code} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-[#5E6AD2]">
                        {reg.warranty_code}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-900 block">{reg.customer_name}</span>
                        <span className="text-slate-500 text-[10px] block">{reg.email}</span>
                        <span className="font-mono text-[10px] text-slate-400">Order: {reg.order_id}</span>
                      </td>
                      <td className="p-4 font-mono font-semibold text-slate-800">
                        {reg.serial_number}
                      </td>
                      <td className="p-4">
                        <span className="text-slate-700 block font-medium">Purchased: {reg.purchase_date}</span>
                        <span className="text-emerald-600 font-bold text-[10px] block">Expires: {reg.expires_at}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
