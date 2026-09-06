import React, { useState } from "react";
import { Lock, Key, AlertCircle, ShieldCheck } from "lucide-react";

export default function AdminLoginGate({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://api.shopgroundera.com/api/v1/warranty/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Invalid Master Admin Password");
      }

      sessionStorage.setItem("sg_admin_token", data.token);
      onLoginSuccess(data.token);
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#070709] relative overflow-hidden select-none p-4">
      {/* Ambient background lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-sm p-8 bg-[#0d0d11] rounded-3xl border border-white/[0.08] shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <img
            src="/logo.png"
            alt="ShopGround Era Logo"
            className="h-12 w-auto object-contain mb-3"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 className="text-lg font-bold tracking-tight text-white">ShopGround Era</h1>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-mono uppercase tracking-wider">Warranty Control & Audit Portal</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center space-x-2 text-xs">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Master Security Key</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input
                type="password"
                placeholder="Enter Admin Master Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all disabled:opacity-50 mt-4 cursor-pointer shadow-sm"
          >
            {loading ? "Authenticating..." : "Unlock Control Panel"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-zinc-600 font-mono">Restricted Access. All sessions audited.</p>
        </div>
      </div>
    </div>
  );
}
