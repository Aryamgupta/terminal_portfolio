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
    <div style={{
      width: '100%',
      height: '100%',
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#01080E',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Dynamic Background Mesh */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '60%',
          height: '60%',
          backgroundColor: 'rgba(67, 217, 173, 0.1)',
          borderRadius: '50%',
          filter: 'blur(160px)',
          animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '60%',
          height: '60%',
          backgroundColor: 'rgba(254, 165, 95, 0.1)',
          borderRadius: '50%',
          filter: 'blur(160px)',
          animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 2s'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          zIndex: 10,
          padding: '24px'
        }}
      >
        <div style={{
          backgroundColor: 'rgba(1, 18, 33, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '32px',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)'
        }}>
          {/* Accent Glow */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, transparent, rgba(67, 217, 173, 0.4), transparent)'
          }} />

          {/* Header Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}>
            <motion.div
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '96px',
                height: '96px',
                borderRadius: '24px',
                backgroundColor: 'rgba(67, 217, 173, 0.1)',
                color: '#FEA55F',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 20px rgba(67, 217, 173, 0.15)'
              }}
            >
              <ShieldAlert size={44} />
            </motion.div>

            <h1 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              letterSpacing: '-1px',
              margin: '0'
            }}>
              Security <span style={{ color: '#43D9AD' }}>Protocol</span>
            </h1>

            <p style={{
              color: '#607B96',
              fontSize: '14px',
              lineHeight: '1.6',
              paddingLeft: '16px',
              paddingRight: '16px',
              maxWidth: '320px',
              marginLeft: 'auto',
              marginRight: 'auto',
              fontWeight: '500',
              margin: '0'
            }}>
              A temporary access key has been dispatched to your terminal at <br />
              <span style={{
                color: '#43D9AD',
                fontFamily: 'monospace',
                fontSize: '11px',
                backgroundColor: 'rgba(67, 217, 173, 0.1)',
                paddingLeft: '12px',
                paddingRight: '12px',
                paddingTop: '6px',
                paddingBottom: '6px',
                borderRadius: '6px',
                display: 'inline-block',
                marginTop: '12px',
                border: '1px solid rgba(67, 217, 173, 0.2)'
              }}>
                {session?.user?.email || "aryamgupta4@gmail.com"}
              </span>
            </p>
          </div>

          <form onSubmit={handleVerify} style={{
            marginTop: '48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
          }}>
            {/* OTP Input Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <label style={{
                fontSize: '10px',
                fontFamily: 'monospace',
                color: '#607B96',
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                display: 'block',
                margin: '0'
              }}>
                _enter_auth_sequence
              </label>

              <div style={{
                position: 'relative'
              }}>
                <input
                  type="text"
                  required
                  maxLength={6}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    paddingTop: '32px',
                    paddingBottom: '32px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    color: '#FEA55F',
                    textAlign: 'center',
                    fontSize: '48px',
                    letterSpacing: '0.6em',
                    outline: 'none',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)',
                    caretColor: '#FEA55F'
                  }}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(67, 217, 173, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '16px',
                  border: '1px solid rgba(67, 217, 173, 0.05)',
                  pointerEvents: 'none',
                  transition: 'border-color 0.3s ease'
                }} />
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      color: '#ef4444',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                  >
                    <Cpu size={16} style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', flexShrink: 0 }} />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              style={{
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                padding: '20px 32px',
                backgroundColor: '#43D9AD',
                color: '#011627',
                fontWeight: 'bold',
                borderRadius: '16px',
                border: 'none',
                cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                opacity: (loading || otp.length !== 6) ? 0.5 : 1,
                boxShadow: '0 0 20px rgba(67, 217, 173, 0.15)'
              }}
              onMouseEnter={(e) => {
                if (!loading && otp.length === 6) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                if (!loading && otp.length === 6) {
                  e.style.transform = 'translateX(100%)';
                }
              }}
              onMouseLeave={(e) => {
                e.style.transform = 'translateX(-100%)';
              }}
              />
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                {loading ? (
                  <>
                    <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={22} />
                    <span style={{
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}>
                      Verifying...
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}>
                      Validate Access
                    </span>
                    <ArrowRight
                      size={22}
                      style={{
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer */}
          <footer style={{
            marginTop: '48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}>
            <button
              onClick={handleSendOTP}
              disabled={sending}
              style={{
                color: '#607B96',
                fontSize: '10px',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: sending ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '8px',
                opacity: sending ? 0.5 : 1,
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!sending) e.currentTarget.style.color = '#FEA55F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#607B96';
              }}
            >
              <div style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}>
                <RefreshCw 
                  size={14} 
                  style={{
                    animation: sending ? 'spin 1s linear infinite' : 'none'
                  }}
                />
              </div>
              Request New Sequence
            </button>

            <div style={{
              paddingTop: '32px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                color: 'rgba(96, 123, 150, 0.4)',
                fontSize: '9px',
                fontFamily: 'monospace',
                letterSpacing: '0.2em',
                textTransform: 'uppercase'
              }}>
                <Mail size={12} style={{ opacity: 0.7 }} /> Encryption: TLS_AES_GCM_256
              </div>
            </div>
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
      `}</style>
    </div>
  );
};

export default Verify2FAPage;