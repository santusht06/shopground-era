import React, { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle, Check, X, RefreshCw, Eye, ExternalLink, Search, Clock, FileText, Image as ImageIcon, Film, Truck, Send, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WarrantyManagement() {
  const [activeTab, setActiveTab] = useState("claims"); // "claims" | "registrations"
  const [claims, setClaims] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State for Deep Audit
  const [auditItem, setAuditItem] = useState(null); // claim object
  const [adminNotes, setAdminNotes] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [modalStatus, setModalStatus] = useState("Approved (Replacement)");

  const fetchWarranties = async () => {
    setLoading(true);
    try {
      const [cRes, rRes] = await Promise.all([
        fetch("https://api.shopgroundera.com/api/v1/warranty/admin/claims"),
        fetch("https://api.shopgroundera.com/api/v1/warranty/admin/registrations")
      ]);
      const cData = await cRes.json();
      const rData = await rRes.json();
      setClaims(Array.isArray(cData) ? cData : []);
      setRegistrations(Array.isArray(rData) ? rData : []);
    } catch (err) {
      console.error("Failed to fetch warranties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  const openAuditModal = (claim) => {
    setAuditItem(claim);
    setAdminNotes(claim.admin_notes || "");
    setTrackingNumber(claim.tracking_number || "");
    setModalStatus(claim.status || "Approved (Replacement)");
  };

  const closeAuditModal = () => {
    setAuditItem(null);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!auditItem) return;
    setActionLoading(auditItem.claim_code);

    try {
      const res = await fetch(`https://api.shopgroundera.com/api/v1/warranty/admin/claims/${auditItem.claim_code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: modalStatus,
          admin_notes: adminNotes,
          tracking_number: trackingNumber
        })
      });
      if (res.ok) {
        closeAuditModal();
        await fetchWarranties();
      }
    } catch (err) {
      console.error("Failed to update claim:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const isVideo = (url) => url && (url.toLowerCase().includes(".mp4") || url.toLowerCase().includes(".webm") || url.toLowerCase().includes(".mov"));

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Clean Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#5E6AD2]" />
            <h2 className="text-xl font-extrabold text-[#0F172A]">Warranty & Claims Audit Portal</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deep audit defect evidence media, verify customer records, and authorize replacement dispatches.
          </p>
        </div>

        <Button onClick={fetchWarranties} disabled={loading} variant="outline" className="text-xs gap-2 cursor-pointer">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex p-1 bg-slate-200/60 rounded-xl border border-slate-300/60">
          <button
            onClick={() => setActiveTab("claims")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "claims" ? "bg-white text-[#5E6AD2] shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Defect Claims ({claims.length})
          </button>
          <button
            onClick={() => setActiveTab("registrations")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "registrations" ? "bg-white text-[#5E6AD2] shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Registered Warranties ({registrations.length})
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search claim code, email, serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5E6AD2]"
          />
        </div>
      </div>

      {/* CLAIMS TAB */}
      {activeTab === "claims" && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Claim & Warranty Code</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Issue Category</th>
                  <th className="p-4">Media Evidence</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Audit</th>
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
                    <tr key={claim.claim_code} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-[#0F172A] block text-sm">{claim.claim_code}</span>
                        <span className="font-mono text-[11px] text-[#5E6AD2]">WRN: {claim.warranty_code}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{claim.customer_name}</span>
                        <span className="text-slate-500 text-[11px] block">{claim.email}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-800 block">{claim.issue_category}</span>
                        <span className="text-[10px] text-slate-400">{claim.submitted_at}</span>
                      </td>
                      <td className="p-4">
                        {claim.evidence_url ? (
                          <button
                            onClick={() => openAuditModal(claim)}
                            className="flex items-center gap-2 group cursor-pointer"
                          >
                            {isVideo(claim.evidence_url) ? (
                              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform border border-slate-200">
                                <Film className="w-5 h-5 text-[#5E6AD2]" />
                              </div>
                            ) : (
                              <img
                                src={claim.evidence_url}
                                alt="Defect Evidence"
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform bg-slate-100"
                              />
                            )}
                            <div className="text-left">
                              <span className="text-[11px] font-bold text-[#5E6AD2] block group-hover:underline">Inspect Media</span>
                              <span className="text-[9px] text-slate-400 font-mono block uppercase">{isVideo(claim.evidence_url) ? "Video File" : "Image File"}</span>
                            </div>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No media file</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          claim.status === "Approved (Replacement)" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                          claim.status === "Rejected" ? "bg-rose-100 text-rose-800 border border-rose-300" :
                          "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          onClick={() => openAuditModal(claim)}
                          className="bg-[#5E6AD2] hover:bg-[#4d59be] text-white text-[11px] font-bold h-8 px-3 rounded-xl gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Deep Audit
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
      {activeTab === "registrations" && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Warranty Code</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Serial Number & Order</th>
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
                    <tr key={reg.warranty_code} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#5E6AD2] text-sm">
                        {reg.warranty_code}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{reg.customer_name}</span>
                        <span className="text-slate-500 text-[11px] block">{reg.email}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-semibold text-slate-800 block">S/N: {reg.serial_number}</span>
                        <span className="font-mono text-[10px] text-slate-500">Order: {reg.order_id}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-700 block font-medium">Purchased: {reg.purchase_date}</span>
                        <span className="text-emerald-600 font-bold text-[10px] block">Coverage: {reg.expires_at}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
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

      {/* ─── DEEP AUDIT MODAL ────────────────────────────────────────────── */}
      {auditItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] w-full max-w-3xl shadow-2xl overflow-hidden my-8 space-y-0">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#5E6AD2]" />
                  <h3 className="text-lg font-black text-[#0F172A]">Deep Warranty Claim Audit</h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#5E6AD2]">
                  Claim Code: {auditItem.claim_code}
                </span>
              </div>
              <button
                onClick={closeAuditModal}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 space-y-6">
              {/* Grid Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E5E7EB] text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Customer</span>
                  <span className="font-bold text-slate-900 block">{auditItem.customer_name}</span>
                  <span className="text-slate-500 text-[10px]">{auditItem.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Warranty Code</span>
                  <span className="font-mono font-bold text-[#5E6AD2] block">{auditItem.warranty_code}</span>
                  <span className="text-[10px] text-slate-500">Order: {auditItem.order_id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Serial Number</span>
                  <span className="font-mono font-bold text-slate-800 block">{auditItem.serial_number}</span>
                  <span className="text-[10px] text-slate-500">Submitted: {auditItem.submitted_at}</span>
                </div>
              </div>

              {/* Defect Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-900 block">Issue Category & Description</label>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 space-y-1">
                  <span className="font-bold text-[#5E6AD2] block">{auditItem.issue_category}</span>
                  <p className="text-slate-700 leading-relaxed">{auditItem.description}</p>
                </div>
              </div>

              {/* MEDIA EVIDENCE INSPECTION VIEWER */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-900 block flex items-center justify-between">
                  <span>Defect Evidence Media Inspection</span>
                  {auditItem.evidence_url && (
                    <a
                      href={auditItem.evidence_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#5E6AD2] text-[11px] font-bold hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Full Screen
                    </a>
                  )}
                </label>

                {auditItem.evidence_url ? (
                  <div className="rounded-2xl border border-slate-300 overflow-hidden bg-black/90 flex items-center justify-center min-h-[220px] max-h-[360px] p-2 relative">
                    {isVideo(auditItem.evidence_url) ? (
                      <video
                        src={auditItem.evidence_url}
                        controls
                        className="max-h-[340px] w-auto rounded-xl object-contain"
                      />
                    ) : (
                      <img
                        src={auditItem.evidence_url}
                        alt="Defect Evidence"
                        className="max-h-[340px] w-auto rounded-xl object-contain"
                      />
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center border border-dashed border-slate-300 rounded-2xl text-slate-400 text-xs">
                    No media evidence file was uploaded for this claim.
                  </div>
                )}
              </div>

              {/* AUDIT CONTROLS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Decision / Status *</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#5E6AD2]"
                  >
                    <option value="Approved (Replacement)">Approved (Replacement Dispatch)</option>
                    <option value="Approved (Refund)">Approved (Full Refund)</option>
                    <option value="Under Review">Under Review (Need More Proof)</option>
                    <option value="Rejected">Rejected (Out of Scope / User Damage)</option>
                    <option value="Resolved">Resolved & Dispatched</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tracking Number (If Dispatched)</label>
                  <input
                    type="text"
                    placeholder="e.g. FEDEX-99824102"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5E6AD2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Internal Engineering Audit Notes</label>
                <textarea
                  rows={2}
                  placeholder="Enter audit rationale or internal notes..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5E6AD2]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
                <Button type="button" variant="outline" onClick={closeAuditModal} className="text-xs">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={actionLoading === auditItem.claim_code}
                  className="bg-[#5E6AD2] hover:bg-[#4d59be] text-white text-xs font-bold px-6 h-10 rounded-xl cursor-pointer"
                >
                  {actionLoading === auditItem.claim_code ? "Saving Audit..." : "Save Audit Decision"}
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
