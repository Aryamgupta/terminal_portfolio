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
      setError(
        err instanceof Error ? err.message : "Failed to dispatch access key.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#01080E",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Dynamic Background Mesh */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "60%",
            height: "60%",
            backgroundColor: "rgba(254, 165, 95, 0.2)",
            borderRadius: "50%",
            filter: "blur(160px)",
            animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "60%",
            height: "60%",
            backgroundColor: "rgba(77, 91, 206, 0.2)",
            borderRadius: "50%",
            filter: "blur(160px)",
            animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 2s",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          zIndex: 10,
          padding: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(1, 18, 33, 0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "32px",
            padding: "48px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
          }}
        >
          {/* Accent Glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "4px",
              background:
                "linear-gradient(to right, transparent, rgba(254, 165, 95, 0.4), transparent)",
            }}
          />

          {/* Header Section */}
          <div
            style={{
              textAlign: "center",
              position: "relative",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "96px",
                height: "96px",
                borderRadius: "24px",
                background:
                  "linear-gradient(to bottom right, #1C2B3A, #010C15)",
                color: "#FEA55F",
                marginBottom: "40px",
                position: "relative",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow:
                  "inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 20px rgba(254, 165, 95, 0.1)",
              }}
            >
              <ShieldCheck
                size={44}
                style={{ position: "relative", zIndex: 10 }}
              />
            </motion.div>

            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#FFFFFF",
                letterSpacing: "-1px",
                marginBottom: "12px",
                margin: "0 0 12px 0",
              }}
            >
              Admin <span style={{ color: "#FEA55F" }}>OS</span>
            </h1>
            <p
              style={{
                color: "#607B96",
                fontSize: "10px",
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: "0.4em",
                marginBottom: "16px",
                opacity: 0.8,
                margin: "0 0 16px 0",
              }}
            >
              {"// security_checkpoint_v2"}
            </p>
          </div>

          <form
            onSubmit={handleSendOTP}
            style={{
              marginTop: "48px",
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            }}
          >
            {/* Info Box */}
            <div
              style={{
                position: "relative",
              }}
              onMouseEnter={(e) => {
                const blur = e.currentTarget.querySelector(
                  "div:first-child",
                ) as HTMLElement | null;
                if (blur) blur.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                const blur = e.currentTarget.querySelector(
                  "div:first-child",
                ) as HTMLElement | null;
                if (blur) blur.style.opacity = "0";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "-4px",
                  background:
                    "linear-gradient(to right, rgba(254, 165, 95, 0.2), transparent)",
                  borderRadius: "16px",
                  filter: "blur(8px)",
                  opacity: 0,
                  transition: "opacity 0.5s ease",
                }}
              />
              <div
                style={{
                  position: "relative",
                  padding: "40px 32px",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "rgba(254, 165, 95, 0.05)",
                    borderRadius: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    marginBottom: "8px",
                  }}
                >
                  <Mail size={28} color="#FEA55F" style={{ opacity: 0.9 }} />
                </div>
                <p
                  style={{
                    color: "rgba(229, 233, 240, 0.8)",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    fontWeight: "500",
                    margin: "0",
                  }}
                >
                  Enter the restricted zone. An encrypted access key will be
                  dispatched to your registered terminal.
                </p>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    borderRadius: "16px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    color: "#ef4444",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                >
                  <Cpu
                    size={16}
                    style={{
                      animation:
                        "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                      flexShrink: 0,
                    }}
                  />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                position: "relative",
                overflow: "hidden",
                padding: "20px 32px",
                backgroundColor: "#FEA55F",
                color: "#011627",
                fontWeight: "bold",
                borderRadius: "16px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                opacity: loading ? 0.5 : 1,
                boxShadow: "0 0 20px rgba(254, 165, 95, 0.15)",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transform: "translateX(-100%)",
                  transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateX(100%)";
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = "translateX(-100%)";
                }}
              />
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                {loading ? (
                  <>
                    <Loader2
                      style={{ animation: "spin 1s linear infinite" }}
                      size={22}
                    />
                    <span
                      style={{
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      Dispatching...
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      DISPATCH ACCESS KEY
                    </span>
                    <ArrowRight
                      size={22}
                      style={{ transition: "transform 0.3s ease" }}
                    />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer */}
          <footer
            style={{
              marginTop: "48px",
              paddingTop: "32px",
              borderTop: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#607B96",
                fontSize: "10px",
                fontFamily: "monospace",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  display: "flex",
                  height: "8px",
                  width: "8px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                    position: "absolute",
                    display: "inline-flex",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                    backgroundColor: "#43D9AD",
                    opacity: 0.75,
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    borderRadius: "50%",
                    height: "8px",
                    width: "8px",
                    backgroundColor: "#43D9AD",
                  }}
                />
              </span>
              Core Status: encrypted_stable
            </div>
            <p
              style={{
                color: "rgba(96, 123, 150, 0.3)",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                margin: "0",
              }}
            >
              © 2026 Admin Management System
            </p>
          </footer>
        </div>
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;
