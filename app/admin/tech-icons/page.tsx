"use client";

import { useState, useRef } from "react";
import { 
  Plus, 
  Trash2, 
  RefreshCw,
  Upload,
  Palette,
  FileBadge,
  Check,
  AlertCircle,
  Command,
  X
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import Button from "@/components/UI/Button";
import InputField from "@/components/UI/InputField";
import { motion, AnimatePresence } from "framer-motion";

export default function TechIconsAdminPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("#FEA55F");
  const [iconName, setIconName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const iconsQuery = trpc.techIcon.getAll.useQuery();
  
  const convertMutation = trpc.techIcon.convertAndSave.useMutation({
    onSuccess: () => {
      resetForm();
      iconsQuery.refetch();
    }
  });

  const deleteMutation = trpc.techIcon.delete.useMutation({
    onSuccess: () => {
      iconsQuery.refetch();
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const resetForm = () => {
    setPreview(null);
    setIconName("");
    setIsAdding(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview || !iconName) return;

    convertMutation.mutate({
      name: iconName,
      imageBase64: preview,
      color: selectedColor,
    });
  };

  const colors = [
    { name: "Orange", value: "#FEA55F" },
    { name: "Green", value: "#43D9AD" },
    { name: "Blue", value: "#4D5BCE" },
    { name: "Red", value: "#E99287" },
    { name: "White", value: "#FFFFFF" },
  ];

  if (iconsQuery.isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        color: '#607B96',
        fontFamily: 'monospace'
      }}>
        <RefreshCw style={{ animation: 'spin 2s linear infinite', marginRight: '12px', color: '#FEA55F' }} size={24} />
        Tracing vector patterns...
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
            Icon <span style={{ color: '#FEA55F' }}>Vault</span>
          </h1>
          <p style={{
            color: '#607B96',
            fontFamily: 'monospace',
            fontSize: '14px',
            marginTop: '12px',
            margin: '12px 0 0 0'
          }}>
            // manage and convert technology assets
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
            <Upload size={18} />
            Ingest New Icon
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            style={{
              backgroundColor: 'rgba(1, 18, 33, 0.8)',
              border: '1px solid rgba(30, 45, 61, 0.8)',
              borderRadius: '24px',
              padding: '40px',
              backdropFilter: 'blur(16px)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '320px',
              height: '320px',
              backgroundColor: 'rgba(254, 165, 95, 0.05)',
              borderRadius: '50%',
              filter: 'blur(120px)',
              zIndex: -10
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '48px'
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                margin: '0'
              }}>
                <FileBadge color="#FEA55F" size={28} />
                Icon Conversion Sequence
              </h2>
              <button 
                onClick={resetForm}
                style={{
                  color: '#607B96',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#607B96'}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpload} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px'
            }}>
              {/* Left Column - Upload */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '40px'
              }}>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    aspectRatio: '16/9',
                    borderRadius: '24px',
                    border: `2px dashed ${preview ? 'rgba(254, 165, 95, 0.5)' : 'rgba(30, 45, 61, 0.6)'}`,
                    backgroundColor: preview ? 'rgba(254, 165, 95, 0.05)' : 'rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!preview) {
                      e.currentTarget.style.borderColor = 'rgba(96, 123, 150, 0.8)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!preview) {
                      e.currentTarget.style.borderColor = 'rgba(30, 45, 61, 0.6)';
                    }
                  }}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png,image/jpeg"
                    style={{ display: 'none' }}
                  />
                  
                  {preview ? (
                    <img 
                      src={preview} 
                      alt="Upload Preview" 
                      style={{
                        maxHeight: '80%',
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  ) : (
                    <>
                      <div style={{
                        padding: '24px',
                        backgroundColor: '#1C2B3A',
                        borderRadius: '16px',
                        color: '#607B96',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px'
                      }}>
                        <Upload size={32} />
                      </div>
                      <p style={{
                        color: '#FFFFFF',
                        fontWeight: '600',
                        margin: '0'
                      }}>
                        Drop asset or click to browse
                      </p>
                      <p style={{
                        color: '#607B96',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        marginTop: '8px',
                        margin: '8px 0 0 0'
                      }}>
                        PNG / JPEG accepted
                      </p>
                    </>
                  )}
                </div>

                <InputField
                  label="Asset Name"
                  placeholder="e.g. React.js"
                  value={iconName}
                  onChange={setIconName}
                />
              </div>

              {/* Right Column - Settings */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '40px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}>
                  <label style={{
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#607B96',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0'
                  }}>
                    <Palette size={14} /> Theme Calibration
                  </label>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    {colors.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setSelectedColor(c.value)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '16px',
                          border: `1px solid ${selectedColor === c.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(30, 45, 61, 0.8)'}`,
                          backgroundColor: selectedColor === c.value ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedColor !== c.value) {
                            e.currentTarget.style.borderColor = 'rgba(96, 123, 150, 0.8)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedColor !== c.value) {
                            e.currentTarget.style.borderColor = 'rgba(30, 45, 61, 0.8)';
                          }
                        }}
                      >
                        <div 
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: c.value,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                          }}
                        />
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: selectedColor === c.value ? '#FFFFFF' : '#607B96'
                        }}>
                          {c.name}
                        </span>
                        {selectedColor === c.value && (
                          <Check size={14} style={{ color: '#43D9AD', marginLeft: '4px' }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Box */}
                <div style={{
                  padding: '24px',
                  backgroundColor: 'rgba(254, 165, 95, 0.05)',
                  border: '1px solid rgba(254, 165, 95, 0.2)',
                  borderRadius: '16px',
                  display: 'flex',
                  gap: '16px'
                }}>
                  <AlertCircle style={{ color: '#FEA55F', flexShrink: 0 }} size={20} />
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <p style={{
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      margin: '0'
                    }}>
                      Potrace Logic Active
                    </p>
                    <p style={{
                      color: '#607B96',
                      fontSize: '12px',
                      lineHeight: '1.6',
                      margin: '0'
                    }}>
                      Uploaded assets will be automatically traced into production-ready SVGs using the selected theme color. Lossless scaling guaranteed.
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingTop: '24px'
                }}>
                  <Button 
                    loading={convertMutation.isPending} 
                    type="submit"
                    style={{
                      paddingLeft: '32px',
                      paddingRight: '32px'
                    }}
                  >
                    Generate & Sync SVG
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '20px'
            }}
          >
            {iconsQuery.data?.map((icon) => (
              <div 
                key={icon.id}
                style={{
                  aspectRatio: '1',
                  backgroundColor: 'rgba(1, 18, 33, 0.5)',
                  border: '1px solid rgba(30, 45, 61, 0.6)',
                  borderRadius: '24px',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  group: true
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(254, 165, 95, 0.3)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(30, 45, 61, 0.6)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} 
                dangerouslySetInnerHTML={{ __html: icon.icon }} 
                />
                
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => e.parentElement!.querySelector('div:last-child')!.style.opacity = '1'}
                onMouseLeave={(e) => e.parentElement!.querySelector('div:last-child')!.style.opacity = '0'}
                >
                  <p style={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    marginBottom: '16px',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    margin: '0 0 16px 0'
                  }}>
                    {icon.name}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate(icon.id);
                    }}
                    style={{
                      padding: '12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {iconsQuery.data?.length === 0 && (
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
                <Command size={64} style={{ opacity: 0.1 }} />
                <p style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.25)',
                  margin: '0'
                }}>
                  No technical assets indexed.
                </p>
                <button 
                  onClick={() => setIsAdding(true)}
                  style={{
                    color: '#FEA55F',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#FEA55F'}
                >
                  <Plus size={18} /> Initiate Ingestion
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}