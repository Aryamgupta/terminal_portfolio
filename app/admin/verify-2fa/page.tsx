"use client";

import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  RefreshCw,
  ArrowRight,
  Loader2,
  Mail,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Verify2FAPage = () => {
  const { data: session } = useSession();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const handleSendOTP = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/admin/send-otp", { method: "POST" });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Terminal failed to dispatch OTP.");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Terminal failed to dispatch OTP.",
      );
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: "aryamgupta4@gmail.com",
        otp,
      });

      if (result?.error) {
        throw new Error(result.error || "Access key verification failed.");
      }

      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Access key verification failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full fixed inset-0 flex items-center justify-center bg-[#01080E] overflow-hidden font-['Inter',_sans-serif]">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#43D9AD]/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#FEA55F]/10 rounded-full blur-[160px] animate-pulse [animation-delay:2s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[480px] z-10 px-6"
      >
        <div className="glass-panel rounded-[2rem] p-12 md:p-16 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#43D9AD]/40 to-transparent" />

          <div className="space-y-6 relative flex flex-col items-center">
            <motion.div
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[#FEA55F]/10 text-[#FEA55F] mb-4 glass-border shadow-glow-premium"
            >
              <ShieldAlert size={44} />
            </motion.div>
            <h1 className="text-4xl font-['Outfit',_sans-serif] font-extrabold text-white tracking-tight">
              Security <span className="text-[#43D9AD]">Protocol</span>
            </h1>
            <p className="text-[#607B96] text-sm leading-relaxed px-4 max-w-[320px] mx-auto font-medium">
              A temporary access key has been dispatched to your terminal at <br />
              <span className="text-[#43D9AD] font-mono text-xs bg-[#43D9AD]/10 px-3 py-1.5 rounded-lg inline-block mt-3 border border-[#43D9AD]/20">
                {session?.user?.email || "aryamgupta4@gmail.com"}
              </span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="mt-12 space-y-10">
            <div className="space-y-6">
              <label className="text-[10px] font-mono text-[#607B96] uppercase tracking-[0.4em] block">
                _enter_auth_sequence
              </label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-8 text-[#FEA55F] text-center text-5xl tracking-[0.6em] outline-none focus:border-[#FEA55F]/50 transition-all font-mono shadow-inner group-hover:border-white/10 caret-[#FEA55F] text-glow"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
                <div className="absolute inset-0 rounded-2xl border border-[#FEA55F]/5 pointer-events-none group-hover:border-[#FEA55F]/10 transition-colors" />
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
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full relative overflow-hidden group py-5 px-8 bg-[#43D9AD] text-[#011627] font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(67,217,173,0.15)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    <span className="tracking-[0.1em] uppercase text-sm font-extrabold">Verifying...</span>
                  </>
                ) : (
                  <>
                    <span className="tracking-[0.1em] text-sm font-extrabold uppercase">Validate Access</span>
                    <ArrowRight
                      size={22}
                      className="group-hover:translate-x-2 transition-transform duration-300"
                    />
                  </>
                )}
              </div>
            </button>
          </form>

          <footer className="mt-12 space-y-8">
            <button
              onClick={handleSendOTP}
              disabled={sending}
              className="text-[#607B96] text-[10px] font-mono uppercase tracking-[0.3em] hover:text-[#FEA55F] transition-colors flex items-center justify-center gap-3 mx-auto disabled:opacity-50 group"
            >
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#FEA55F]/10 transition-colors">
                <RefreshCw size={14} className={sending ? "animate-spin" : ""} />
              </div>
              Request New Sequence
            </button>

            <div className="pt-8 border-t border-white/5">
              <div className="flex items-center justify-center gap-3 text-[#607B96]/40 text-[9px] font-mono tracking-[0.2em] uppercase">
                <Mail size={12} className="opacity-70" /> Encryption: TLS_AES_GCM_256
              </div>
            </div>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default Verify2FAPage;
