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
    <div className="fixed inset-0 flex items-center justify-center bg-[#01080E] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FEA55F] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#43D9AD] rounded-full blur-[120px]" />
        <div className="h-full w-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-[450px] z-10"
      >
        <div className="bg-[#011221]/80 backdrop-blur-xl border border-[#1E2D3D] rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Top Decorative Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FEA55F] to-transparent opacity-50" />
          
          <div className="text-center relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1C2B3A] to-[#010C15] text-[#FEA55F] mb-8 relative group"
            >
              <div className="absolute inset-0 rounded-3xl bg-[#FEA55F]/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
              <ShieldCheck size={48} className="relative z-10" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-white tracking-tighter mb-2">Admin OS</h1>
            <p className="text-[#607B96] text-xs font-mono uppercase tracking-[0.3em] opacity-70 italic">{"// authorized_access_only"}</p>
          </div>

          <form onSubmit={handleSendOTP} className="mt-10 space-y-6 text-center">
            <div className="p-6 bg-black/40 rounded-2xl border border-[#1E2D3D] space-y-4">
               <Mail size={24} className="text-[#FEA55F] mx-auto opacity-80" />
               <p className="text-[#607B96] text-sm leading-relaxed">
                 To proceed, an encrypted access key will be sent to your terminal at <br/>
                 <span className="text-white font-mono text-xs block mt-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">aryamgupta4@gmail.com</span>
               </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-400 text-xs font-mono"
                >
                  <Cpu size={14} className="animate-pulse" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden group py-4 px-6 bg-[#FEA55F] text-[#011627] font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-glow-sm"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span className="tracking-widest">DISPATCH ACCESS KEY</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1E2D3D]/50 flex justify-center">
             <div className="flex items-center gap-2 text-[#607B96] text-[9px] font-mono tracking-[0.2em] uppercase opacity-50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43D9AD] animate-pulse" />
                Kernel Status: Stable
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
