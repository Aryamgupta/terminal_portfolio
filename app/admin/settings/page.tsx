"use client";

import React, { useState } from "react";
import { 
  Settings, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  Bell, 
  Database,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const SettingsPage = () => {
  const [loadingRebuild, setLoadingRebuild] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleTriggerRebuild = async () => {
    setLoadingRebuild(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/rebuild", { method: "POST" });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to trigger rebuild");
      
      setMessage({ type: "success", text: "Production rebuild triggered successfully! Check Vercel dashboard for progress." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoadingRebuild(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Configuration</h1>
        <p className="text-[#607B96] text-sm font-mono mt-1">// manage platform infrastructure and security</p>
      </div>

      {message.text && (
        <div className={cn(
          "p-4 rounded-xl flex items-center gap-3 border",
          message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
        )}>
          {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rebuild Trigger Section */}
        <section className="bg-[#011221] p-8 rounded-2xl border border-[#1E2D3D] shadow-2xl flex flex-col items-center text-center space-y-6">
           <div className="w-16 h-16 rounded-full bg-[#FEA55F]/10 flex items-center justify-center text-[#FEA55F]">
              <Zap size={32} />
           </div>
           <div>
              <h3 className="text-white font-semibold text-lg">Production Rebuild</h3>
              <p className="text-[#607B96] text-xs mt-2 max-w-[200px] mx-auto leading-relaxed">
                Trigger a manual rebuild on Vercel to sync static data files with the current database state.
              </p>
           </div>
           
           <button
             onClick={handleTriggerRebuild}
             disabled={loadingRebuild}
             className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#FEA55F] text-[#011627] font-bold rounded-xl hover:bg-[#FFB77F] transition-all disabled:opacity-50 shadow-glow-sm"
           >
             {loadingRebuild ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
             DEPLOY TO PRODUCTION
           </button>
        </section>

        {/* System Stats Section (Mock) */}
        <section className="bg-[#011221] p-8 rounded-2xl border border-[#1E2D3D] shadow-2xl space-y-6">
           <h3 className="text-white font-semibold flex items-center gap-2">
              <Database size={18} className="text-[#FEA55F]" /> Environment Info
           </h3>
           
           <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-[#1E2D3D]">
                 <span className="text-xs font-mono text-[#607B96]">PLATFORM</span>
                 <span className="text-xs text-white font-bold">VERCEL / NEXT.JS</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-[#1E2D3D]">
                 <span className="text-xs font-mono text-[#607B96]">DATABASE</span>
                 <span className="text-xs text-green-400 font-bold">MONGODB ONLINE</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-[#1E2D3D]">
                 <span className="text-xs font-mono text-[#607B96]">2FA_STATUS</span>
                 <span className="text-xs text-[#FEA55F] font-bold uppercase">ENFORCED</span>
              </div>
           </div>

           <div className="pt-4 border-t border-[#1E2D3D]">
              <p className="text-[10px] text-[#607B96] font-mono leading-relaxed">
                {"// Note: To configure the deploy hook, ensure"} <br/>
                <span className="text-white opacity-60">"VERCEL_DEPLOY_HOOK"</span>
                {" is set in your server environment."}
              </p>
           </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
