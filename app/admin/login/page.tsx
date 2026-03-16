"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, Loader2, ShieldCheck, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminLoginPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "aryamgupta4@gmail.com" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch access key.");
      }

      router.push("/admin/verify-2fa");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to dispatch access key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full fixed inset-0 flex items-center justify-center bg-[#01080E] overflow-hidden font-['Inter',_sans-serif]">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#FEA55F]/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#4D5BCE]/20 rounded-full blur-[160px] animate-pulse [animation-delay:2s]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[480px] z-10 px-6"
      >
        <div className="glass-panel rounded-[2rem] p-12 md:p-16 relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FEA55F]/40 to-transparent" />
          
          <div className="text-center relative">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1C2B3A] to-[#010C15] text-[#FEA55F] mb-10 relative group glass-border"
            >
              <div className="absolute inset-0 rounded-3xl bg-[#FEA55F]/10 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <ShieldCheck size={44} className="relative z-10" />
            </motion.div>
            
            <h1 className="text-5xl font-['Outfit',_sans-serif] font-extrabold text-white tracking-tight mb-3">
              Admin <span className="text-[#FEA55F]">OS</span>
            </h1>
            <p className="text-[#607B96] text-[10px] font-mono uppercase tracking-[0.4em] mb-4 opacity-80">
              {"// security_checkpoint_v2"}
            </p>
          </div>

          <form onSubmit={handleSendOTP} className="mt-12 space-y-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FEA55F]/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative py-10 px-8 bg-black/40 rounded-2xl border border-white/5 space-y-6 text-center">
                 <div className="p-3 bg-[#FEA55F]/5 rounded-xl inline-block mb-2">
                   <Mail size={28} className="text-[#FEA55F] opacity-90" />
                 </div>
                 <p className="text-[#E5E9F0]/80 text-sm leading-relaxed font-medium">
                   Enter the restricted zone. An encrypted access key will be dispatched to your registered terminal.
                 </p>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4 text-red-400 text-xs font-mono"
                >
                  <Cpu size={16} className="animate-pulse flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden group py-5 px-8 bg-[#FEA55F] text-[#011627] font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-glow-premium"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    <span className="tracking-[0.1em] uppercase text-sm font-extrabold">Dispatching...</span>
                  </>
                ) : (
                  <>
                    <span className="tracking-[0.1em] text-sm font-extrabold">DISPATCH ACCESS KEY</span>
                    <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </form>

          <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
             <div className="flex items-center gap-3 text-[#607B96] text-[10px] font-mono tracking-[0.2em] uppercase">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#43D9AD] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#43D9AD]"></span>
                </span>
                Core Status: encrypted_stable
             </div>
             <p className="text-[#607B96]/30 text-[9px] uppercase tracking-widest">© 2026 Admin Management System</p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
