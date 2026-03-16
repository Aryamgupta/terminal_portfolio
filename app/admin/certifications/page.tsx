"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Award,
  ExternalLink,
  Calendar,
  ShieldCheck,
  X
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import Button from "@/components/UI/Button";
import InputField from "@/components/UI/InputField";
import { motion, AnimatePresence } from "framer-motion";

export default function CertificationsAdminPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    link: "",
    img: "",
    date: "",
  });

  const certsQuery = trpc.certification.getAll.useQuery();
  
  const upsertMutation = trpc.certification.upsert.useMutation({
    onSuccess: () => {
      resetForm();
      certsQuery.refetch();
    }
  });

  const deleteMutation = trpc.certification.delete.useMutation({
    onSuccess: () => {
      certsQuery.refetch();
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      issuer: "",
      link: "",
      img: "",
      date: "",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (cert: {
    id: string;
    name: string;
    issuer: string;
    link?: string | null;
    img?: string | null;
    date?: string | null;
  }) => {
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      link: cert.link || "",
      img: cert.img || "",
      date: cert.date || "",
    });
    setEditingId(cert.id);
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate({
      id: editingId || undefined,
      ...formData
    });
  };

  if (certsQuery.isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        color: '#607B96',
        fontFamily: 'monospace'
      }}>
        <Award style={{ animation: 'bounce 1s infinite', marginRight: '12px', color: '#FEA55F' }} size={24} />
        Verifying credentials...
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            letterSpacing: '-1px',
            margin: '0'
          }}>
            Credential <span style={{ color: '#FEA55F' }}>Vault</span>
          </h1>
          <p style={{
            color: '#607B96',
            fontFamily: 'monospace',
            fontSize: '14px',
            marginTop: '12px',
            margin: '12px 0 0 0'
          }}>
            // manage your verified achievements
          </p>
        </div>

        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: 'fit-content'
            }}
          >
            <Plus size={18} />
            Authorize New Certificate
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              backgroundColor: 'rgba(1, 18, 33, 0.8)',
              border: '1px solid rgba(30, 45, 61, 0.8)',
              borderRadius: '24px',
              padding: '32px',
              backdropFilter: 'blur(16px)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '256px',
              height: '256px',
              backgroundColor: 'rgba(67, 217, 173, 0.05)',
              borderRadius: '50%',
              filter: 'blur(100px)',
              zIndex: -10
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '40px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '0'
              }}>
                <Award color="#FEA55F" size={24} />
                {editingId ? "Update Credential Data" : "New Achievement Identified"}
              </h2>
              <button 
                onClick={resetForm}
                style={{
                  color: '#607B96',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  transition: 'color 0.3s ease',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#607B96'}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}>
                  <InputField
                    label="Certificate Name"
                    placeholder="e.g. Meta Front-End Developer"
                    value={formData.name}
                    onChange={(v) => setFormData({ ...formData, name: v })}
                  />
                  <InputField
                    label="Issuing Organization"
                    placeholder="e.g. Coursera / Google"
                    value={formData.issuer}
                    onChange={(v) => setFormData({ ...formData, issuer: v })}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}>
                  <InputField
                    label="Verification Link"
                    placeholder="https://coursera.org/verify/..."
                    value={formData.link}
                    onChange={(v) => setFormData({ ...formData, link: v })}
                  />
                  <InputField
                    label="Badge / Thumbnail URL"
                    placeholder="https://example.com/badge.png"
                    value={formData.img}
                    onChange={(v) => setFormData({ ...formData, img: v })}
                  />
                </div>
              </div>

              <div>
                <InputField
                  label="Issue Date"
                  placeholder="e.g. December 2023"
                  value={formData.date}
                  onChange={(v) => setFormData({ ...formData, date: v })}
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: '16px'
              }}>
                <Button 
                  loading={upsertMutation.isPending} 
                  type="submit"
                  style={{
                    paddingLeft: '32px',
                    paddingRight: '32px'
                  }}
                >
                  {editingId ? "Apply Modifications" : "Authenticate Achievement"}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}
          >
            {certsQuery.data?.map((cert) => (
              <div 
                key={cert.id}
                style={{
                  backgroundColor: 'rgba(1, 18, 33, 0.5)',
                  border: '1px solid rgba(30, 45, 61, 0.6)',
                  borderRadius: '20px',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(254, 165, 95, 0.3)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.backgroundColor = 'rgba(1, 18, 33, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(30, 45, 61, 0.6)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = 'rgba(1, 18, 33, 0.5)';
                }}
              >
                {/* Accent Blob */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '80px',
                  height: '80px',
                  backgroundColor: 'rgba(254, 165, 95, 0.05)',
                  borderRadius: '50%',
                  filter: 'blur(48px)',
                  pointerEvents: 'none',
                  zIndex: -10,
                  transition: 'background-color 0.3s ease'
                }} />

                {/* Header with Badge and Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#1C2B3A',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    flexShrink: 0,
                    position: 'relative'
                  }}>
                    {cert.img ? (
                      <Image 
                        src={cert.img} 
                        alt={cert.issuer}
                        width={64}
                        height={64}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '8px'
                        }}
                      />
                    ) : (
                      <Award style={{ color: 'rgba(96, 123, 150, 0.4)' }} size={24} />
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexShrink: 0
                  }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(cert);
                      }}
                      style={{
                        padding: '8px',
                        color: '#607B96',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#FEA55F';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#607B96';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(cert.id);
                      }}
                      style={{
                        padding: '8px',
                        color: '#607B96',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#ef4444';
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#607B96';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Certificate Info */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    transition: 'color 0.3s ease',
                    lineHeight: '1.4',
                    margin: '0'
                  }}>
                    {cert.name}
                  </h3>
                  <p style={{
                    color: '#607B96',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    margin: '0'
                  }}>
                    {cert.issuer}
                  </p>
                </div>

                {/* Footer with Date and Link */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  marginTop: 'auto'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    color: '#43D9AD',
                    fontFamily: 'monospace'
                  }}>
                    <Calendar size={12} />
                    {cert.date}
                  </div>

                  {cert.link && (
                    <a 
                      href={cert.link} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        color: '#FEA55F',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        letterSpacing: '0.05em',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      VERIFY_KEY <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {certsQuery.data?.length === 0 && (
              <div style={{
                gridColumn: '1 / -1',
                padding: '80px 32px',
                border: '2px dashed rgba(30, 45, 61, 0.6)',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#607B96',
                gap: '16px'
              }}>
                <ShieldCheck size={48} style={{ opacity: 0.1 }} />
                <p style={{
                  fontSize: '14px',
                  margin: '0'
                }}>
                  No verified achievements found in the ledger.
                </p>
                <button 
                  onClick={() => setIsAdding(true)}
                  style={{
                    color: '#FEA55F',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    transition: 'color 0.3s ease',
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#FEA55F'}
                >
                  Initiate sync sequence
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}