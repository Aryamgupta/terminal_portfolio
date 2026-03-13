"use client";

import React, { useState } from "react";
import { Lock, Server, Terminal, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const AdminLoginPage = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mocking the PIN logic from original project
    if (pin === "1234") {
      localStorage.setItem("admin-auth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid PIN. Use '1234' for now.");
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 bg-[#011221] border border-[#1E2D3D] rounded-lg p-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1C2B3A] text-[#FEA55F] mb-4">
             <Lock size={32} />
          </div>
          <h1 className="text-2xl font-medium text-white">Admin Access</h1>
          <p className="text-[#607B96] text-sm font-mono">{"// restricted area"}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#607B96] text-xs font-mono uppercase tracking-wider">
               <Terminal size={14} /> _enter_access_pin:
            </div>
            <input
              type="password"
              className="w-full bg-black/20 border border-[#1E2D3D] rounded-lg px-4 py-3 text-white text-center text-2xl tracking-[0.5em] outline-none focus:border-[#FEA55F] transition-colors"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
            />
            {error && <p className="text-red-400 text-xs font-mono text-center">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FEA55F] text-[#010C15] font-bold rounded-lg hover:bg-[#FFB77F] transition-all group"
          >
            AUTHORIZE
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#1E2D3D] text-center">
           <div className="flex items-center justify-center gap-2 text-[#607B96] text-[10px] font-mono">
              <Server size={10} /> STATUS: ONLINE
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
