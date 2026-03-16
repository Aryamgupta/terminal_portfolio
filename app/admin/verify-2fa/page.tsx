"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
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
  const { data: session, status } = useSession();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/admin/login");
  //   } else if (status === "authenticated" && session?.user?.isTwoFactorVerified) {
  //     router.push("/admin/dashboard");
  //   } else if (status === "authenticated") {
  //     handleSendOTP();
  //   }
  // }, [status, session, router]);

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
    <div className="fixed inset-0 flex items-center justify-center bg-[#01080E] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FEA55F] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#43D9AD] rounded-full blur-[120px]" />
        <div className="h-full w-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[450px] z-10"
      >
        <div className="bg-[#011221]/80 backdrop-blur-xl border border-[#1E2D3D] rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden text-center">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#43D9AD] to-transparent opacity-50" />

          <div className="space-y-4 relative">
            <motion.div
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[#FEA55F]/10 text-[#FEA55F] mb-6 border border-[#FEA55F]/20 shadow-[0_0_30px_rgba(254,165,95,0.1)]"
            >
              <ShieldAlert size={48} />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Security Protocol
            </h1>
            <p className="text-[#607B96] text-sm leading-relaxed px-4">
              A temporary access key has been dispatched to <br />
              <span className="text-white font-mono text-xs bg-white/5 px-2 py-1 rounded inline-block mt-1">
                {session?.user?.email}
              </span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="mt-10 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-[#607B96] uppercase tracking-[0.2em]">
                _enter_6_digit_key
              </label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="w-full bg-[#010C15] border border-[#1E2D3D] rounded-2xl px-4 py-5 text-white text-center text-4xl tracking-[0.5em] outline-none focus:border-[#FEA55F] transition-all font-mono shadow-inner group-hover:border-[#1E2D3D]/80"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
                <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none" />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-400 text-xs font-mono"
                  >
                    <Cpu size={14} className="animate-pulse" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full relative overflow-hidden group py-4 px-6 bg-[#FEA55F] text-[#011627] font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-glow-sm"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span className="tracking-widest">VALIDATE ACCESS</span>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 space-y-6">
            <button
              onClick={handleSendOTP}
              disabled={sending}
              className="text-[#607B96] text-[10px] font-mono uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              <RefreshCw size={14} className={sending ? "animate-spin" : ""} />
              Request New Key
            </button>

            <div className="pt-6 border-t border-[#1E2D3D]/50">
              <div className="flex items-center justify-center gap-2 text-[#607B96] text-[9px] font-mono tracking-[0.2em] uppercase opacity-50">
                <Mail size={12} className="opacity-70" /> Encryption: AES-256
                Enabled
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Verify2FAPage;
