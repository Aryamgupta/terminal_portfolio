"use client";

import React, { useState } from "react";
import { 
  Settings, 
  RefreshCw, 
  Zap, 
  Database,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ShieldCheck,
  Server
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { trpc } from "@/utils/trpc";

const SettingsPage = () => {
  const [message, setMessage] = useState({ type: "", text: "" });

  const generateJson = trpc.system.generateJson.useMutation({
    onSuccess: (data) => {
      setMessage({ 
        type: "success", 
        text: `Data source generated successfully at ${new Date(data.exportedAt).toLocaleTimeString()}.` 
      });
    },
    onError: (err) => {
      setMessage({ type: "error", text: err.message });
    }
  });

  const redeploy = trpc.system.redeploy.useMutation({
    onSuccess: () => {
      setMessage({ 
        type: "success", 
        text: "Production rebuild sequence initiated. Monitor deployment terminal for progress." 
      });
    },
    onError: (err) => {
      setMessage({ type: "error", text: err.message });
    }
  });

  const handleGenerateData = async () => {
    setMessage({ type: "", text: "" });
    generateJson.mutate();
  };

  const handleTriggerRebuild = async () => {
    setMessage({ type: "", text: "" });
    redeploy.mutate();
  };

  return (
    <div style={{
      maxWidth: '1280px',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '48px',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        paddingBottom: '16px'
      }}>
        <h1 style={{
          fontSize: '40px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          letterSpacing: '-1px',
          margin: '0'
        }}>
          System <span style={{ color: '#FEA55F' }}>Config</span>
        </h1>
        <p style={{
          color: '#607B96',
          fontSize: '14px',
          fontFamily: 'monospace',
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '12px 0 0 0'
        }}>
          <Settings size={14} color="#FEA55F" />
          {"// kernel_mode: administrator"}
        </p>
      </div>

      {/* Message Alert */}
      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              padding: '24px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              border: message.type === "success" 
                ? '1px solid rgba(34, 197, 94, 0.2)' 
                : '1px solid rgba(239, 68, 68, 0.2)',
              backgroundColor: message.type === "success" 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              color: message.type === "success" ? '#22c55e' : '#ef4444',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
            }}
          >
            {message.type === "success" ? 
              <CheckCircle2 size={24} /> : 
              <AlertCircle size={24} />
            }
            <span style={{
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '-0.5px'
            }}>
              {message.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px'
      }}>
        {/* Production Sync Section */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            backgroundColor: 'rgba(1, 18, 33, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '40px 56px',
            borderRadius: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '40px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)'
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom right, rgba(254, 165, 95, 0.05), transparent)',
            pointerEvents: 'none'
          }} />

          {/* Icon with Badge */}
          <div style={{
            position: 'relative',
            zIndex: 10
          }}>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '24px',
              backgroundColor: 'rgba(254, 165, 95, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FEA55F',
              border: '1px solid rgba(254, 165, 95, 0.2)',
              boxShadow: '0 0 20px rgba(254, 165, 95, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
              transition: 'transform 0.5s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Zap size={48} />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              right: '-8px',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#01080E',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RefreshCw 
                size={14} 
                color="#FEA55F"
                style={{
                  animation: redeploy.isPending ? 'spin 1s linear infinite' : 'none'
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
            zIndex: 10
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              letterSpacing: '-0.5px',
              margin: '0'
            }}>
              Production Sync
            </h3>
            <p style={{
              color: '#607B96',
              fontSize: '14px',
              maxWidth: '280px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6',
              fontWeight: '500',
              margin: '0'
            }}>
              Trigger a manual synchronization sequence on Vercel to align platform state with the master database.
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleTriggerRebuild}
            disabled={redeploy.isPending}
            style={{
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#FEA55F',
              color: '#011627',
              fontWeight: 'bold',
              padding: '20px 40px',
              borderRadius: '16px',
              border: 'none',
              cursor: redeploy.isPending ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 20px rgba(254, 165, 95, 0.15), 0 0 40px rgba(254, 165, 95, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              opacity: redeploy.isPending ? 0.5 : 1,
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              if (!redeploy.isPending) {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {redeploy.isPending ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={22} /> : <Zap size={22} />}
            <span style={{
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontSize: '13px'
            }}>
              Deploy to production
            </span>
          </button>
        </motion.section>

        {/* Kernel Sync Section */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            backgroundColor: 'rgba(1, 18, 33, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '40px 56px',
            borderRadius: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '40px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)'
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom right, rgba(67, 217, 173, 0.05), transparent)',
            pointerEvents: 'none'
          }} />

          {/* Icon with Badge */}
          <div style={{
            position: 'relative',
            zIndex: 10
          }}>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '24px',
              backgroundColor: 'rgba(67, 217, 173, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#43D9AD',
              border: '1px solid rgba(67, 217, 173, 0.2)',
              boxShadow: '0 0 20px rgba(67, 217, 173, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
              transition: 'transform 0.5s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Database size={48} />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              right: '-8px',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#01080E',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RefreshCw 
                size={14} 
                color="#43D9AD"
                style={{
                  animation: generateJson.isPending ? 'spin 1s linear infinite' : 'none'
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
            zIndex: 10
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              letterSpacing: '-0.5px',
              margin: '0'
            }}>
              Kernel Sync
            </h3>
            <p style={{
              color: '#607B96',
              fontSize: '14px',
              maxWidth: '280px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6',
              fontWeight: '500',
              margin: '0'
            }}>
              Manually regenerate the portfolio data source. This updates the JSON core used by the public website.
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleGenerateData}
            disabled={generateJson.isPending}
            style={{
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#43D9AD',
              color: '#011627',
              fontWeight: 'bold',
              padding: '20px 40px',
              borderRadius: '16px',
              border: 'none',
              cursor: generateJson.isPending ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 20px rgba(67, 217, 173, 0.15), 0 0 40px rgba(67, 217, 173, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              opacity: generateJson.isPending ? 0.5 : 1,
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              if (!generateJson.isPending) {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {generateJson.isPending ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={22} /> : <Database size={22} />}
            <span style={{
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontSize: '13px'
            }}>
              Update data source
            </span>
          </button>
        </motion.section>

        {/* Environment Core Section */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            backgroundColor: 'rgba(1, 18, 33, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '40px 56px',
            borderRadius: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)'
          }}
        >
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            margin: '0'
          }}>
            <div style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(67, 217, 173, 0.1)',
              color: '#43D9AD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={20} />
            </div>
            Environment Core
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {[
              { label: "Operation Platform", value: "VERCEL / NEXT.JS", icon: Server, color: "#4D5BCE" },
              { label: "Database Cluster", value: "MONGODB_CLOUD", icon: Database, color: "#43D9AD" },
              { label: "Security Protocol", value: "2FA_ENFORCED", icon: ShieldCheck, color: "#FEA55F" },
              { label: "Kernel Status", value: "STABLE_V2.5", icon: Cpu, color: "#FFFFFF" }
            ].map((item, i) => (
              <div 
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(254, 165, 95, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <item.icon 
                    size={18} 
                    style={{
                      opacity: 0.4,
                      color: item.color
                    }}
                  />
                  <span style={{
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    color: '#607B96',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {item.label}
                  </span>
                </div>
                <span style={{
                  fontSize: '11px',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  letterSpacing: '-0.5px'
                }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Note */}
          <div style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <p style={{
              fontSize: '10px',
              color: 'rgba(96, 123, 150, 0.6)',
              fontFamily: 'monospace',
              lineHeight: '1.6',
              backgroundColor: 'rgba(1, 8, 14, 0.4)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              margin: '0'
            }}>
              <span style={{ color: '#FEA55F', fontWeight: 'bold' }}>{"// Deployment Note:"}</span> <br/>
              Ensure <span style={{ color: '#E5E9F0' }}>VERCEL_DEPLOY_HOOK</span> is correctly configured in your secure environment variables for master uplink.
            </p>
          </div>
        </motion.section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default SettingsPage;