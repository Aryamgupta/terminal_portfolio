"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { 
  Projector, 
  MessageSquare, 
  Activity, 
  ArrowUpRight,
  FileCode,
  Globe,
  Loader2,
  Terminal,
  ShieldCheck,
  TrendingUp,
  Clock,
  Cpu,
  Award,
  Calendar,
  Zap,
  GitBranch,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { trpc } from "@/utils/trpc";

const SyncControls = () => {
  const syncMutation = trpc.system.generateModuleJson.useMutation({
    onSuccess: (data) => {
      // Could add a toast here
    }
  });

  const modules = [
    { id: "projects", label: "Projects", icon: Projector, color: "#FEA55F" },
    { id: "skills", label: "Skills & Icons", icon: Cpu, color: "#E99287" },
    { id: "experience", label: "Experience", icon: Calendar, color: "#4D5BCE" },
    { id: "education", label: "Education", icon: Award, color: "#43D9AD" },
    { id: "personal-info", label: "Personal", icon: Activity, color: "#C98BDF" },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      backgroundColor: 'rgba(1, 18, 33, 0.4)',
      padding: '24px',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Terminal size={18} color="#FEA55F" />
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Modular Data Sync Console
        </h2>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px'
      }}>
        {modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => syncMutation.mutate({ module: mod.id })}
            disabled={syncMutation.isPending && syncMutation.variables?.module === mod.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              color: '#E5E9F0',
              fontSize: '12px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: syncMutation.isPending && syncMutation.variables?.module === mod.id ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = mod.color + '44';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            {syncMutation.isPending && syncMutation.variables?.module === mod.id ? (
              <RefreshCw size={14} style={{ animation: 'spin 2s linear infinite' }} />
            ) : (
              <mod.icon size={14} color={mod.color} />
            )}
            {mod.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { data: session } = useSession();
  const { data: statsData, isLoading } = trpc.analytics.getStats.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const stats = [
    { 
      label: "Engineered Nodes", 
      value: statsData?.totalProjects ?? "-", 
      icon: Projector, 
      color: "#FEA55F",
      bgColor: "rgba(254, 165, 95, 0.1)",
      sub: "Total Projects"
    },
    { 
      label: "Neural Certs", 
      value: statsData?.totalCertifications ?? "-", 
      icon: Award, 
      color: "#43D9AD",
      bgColor: "rgba(67, 217, 173, 0.1)",
      sub: "Professional Validation"
    },
    { 
      label: "Sync Experience", 
      value: `${statsData?.yearsOfExperience ?? "-"}Y`, 
      icon: Calendar, 
      color: "#4D5BCE",
      bgColor: "rgba(77, 91, 206, 0.1)",
      sub: "Years of Industry Coding"
    },
    { 
      label: "Tech Matrix", 
      value: statsData?.totalTechs ?? "-", 
      icon: Cpu, 
      color: "#E99287",
      bgColor: "rgba(233, 146, 135, 0.1)",
      sub: "Mapped Technologies"
    },
  ];

  const quickActions = [
    { label: "Projects Console", icon: Projector, href: "/admin/projects", desc: "Manage terminal projects" },
    { label: "Inbound Comms", icon: MessageSquare, href: "/admin/messages", desc: "View incoming data" },
    { label: "Snippet Vault", icon: FileCode, href: "/admin/snippets", desc: "Code snippet repository" },
    { label: "Live Uplink", icon: Globe, href: "/", external: true, desc: "Visit production site" },
  ];

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        minHeight: '60vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Loader2 style={{ animation: 'spin 2s linear infinite', color: '#FEA55F', opacity: 0.2 }} size={64} />
          <span style={{ marginTop: '24px', fontFamily: 'monospace', fontSize: '10px', color: '#607B96', textTransform: 'uppercase', letterSpacing: '0.4em', animation: 'pulse 2s infinite' }}>
            Syncing_Analytics_Engine...
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
      }}
    >
      {/* Sync State Management */}
      <SyncControls />

      {/* Header Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-1px',
              margin: '0'
            }}>
              System <span style={{ color: '#FEA55F' }}>Overview</span>
            </h1>
            <p style={{
              color: '#607B96',
              fontSize: '12px',
              fontFamily: 'monospace',
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#43D9AD',
                borderRadius: '50%',
                display: 'inline-block',
                boxShadow: '0 0 10px #43D9AD'
              }} />
              node_active: <span style={{ color: '#E5E9F0' }}>{session?.user?.name?.toLowerCase().replace(/\s+/g, '_') || "commander"}@aryam_portfolio</span>
            </p>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#FEA55F',
              fontSize: '11px',
              fontFamily: 'monospace'
            }}>
              <Clock size={12} /> Session Active: 04:20:00
            </div>
            <div style={{
              color: '#607B96',
              fontSize: '11px',
              fontFamily: 'monospace'
            }}>
              Last Sync: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i}
              style={{
                backgroundColor: 'rgba(1, 18, 33, 0.7)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(254, 165, 95, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 10
              }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: stat.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Icon size={20} color={stat.color} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '-1px'
                  }}>
                    {stat.value}
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px',
                    color: '#43D9AD',
                    fontFamily: 'monospace',
                    marginTop: '8px'
                  }}>
                    <TrendingUp size={10} /> +{((i+2)*3)%12}%
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                position: 'relative',
                zIndex: 10
              }}>
                <p style={{
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  margin: '0'
                }}>
                  {stat.label}
                </p>
                <p style={{
                  color: '#607B96',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  margin: '0'
                }}>
                  {stat.sub}
                </p>
              </div>

              <div style={{
                height: '4px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 10
              }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                  style={{
                    height: '100%',
                    backgroundColor: stat.color,
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '32px'
      }}>
        
        {/* Left Column - 2 cols span */}
        <div style={{
          gridColumn: 'span 2',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>

          {/* Latest Project Blueprint Card */}
          <div style={{
            backgroundColor: 'rgba(1, 18, 33, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '32px',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px'
            }}>
              <div style={{
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: 'rgba(254, 165, 95, 0.1)',
                color: '#FEA55F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={20} />
              </div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                margin: '0'
              }}>
                Latest Project Blueprint
              </h2>
            </div>

            {statsData?.latestProject ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <span style={{
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    color: '#FEA55F',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em'
                  }}>
                    Project_ID: {statsData.latestProject.title.toLowerCase().replace(/\s+/g, '_')}
                  </span>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    marginTop: '12px',
                    margin: '12px 0 0 0'
                  }}>
                    {statsData.latestProject.title}
                  </h3>
                  <p style={{
                    color: '#607B96',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    marginTop: '12px',
                    maxWidth: '500px',
                    margin: '12px 0 0 0'
                  }}>
                    Latest deployment synchronized with main production cluster.
                  </p>
                </div>

                {/* Tech Stack */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  {statsData.latestProject.techIcons?.length > 0 ? (
                    statsData.latestProject.techIcons.map((tech: any) => (
                      <div key={tech.id} style={{ position: 'relative' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px',
                          backgroundColor: '#011221',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          cursor: 'help',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(254, 165, 95, 0.5)';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        title={tech.name}>
                          <div dangerouslySetInnerHTML={{ __html: tech.icon }} style={{
                            width: '100%',
                            height: '100%',
                            color: '#FFFFFF'
                          }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    statsData.latestProject.techStack.map((tech: string) => (
                      <span key={tech} style={{
                        padding: '6px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        color: '#607B96',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '6px'
                      }}>
                        {tech}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div style={{
                padding: '32px',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.01)',
                borderRadius: '12px',
                border: '1px dashed rgba(255, 255, 255, 0.1)'
              }}>
                <p style={{
                  color: '#607B96',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  margin: '0'
                }}>
                  No active project blueprints detected.
                </p>
              </div>
            )}
          </div>

          {/* Command Center Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: 'rgba(254, 165, 95, 0.1)',
                color: '#FEA55F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Terminal size={20} />
              </div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                margin: '0'
              }}>
                Command Center
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px'
            }}>
              {quickActions.map((action, i) => {
                const ActionIcon = action.icon;
                return (
                  <a
                    key={i}
                    href={action.href}
                    target={action.external ? "_blank" : "_self"}
                    style={{
                      backgroundColor: 'rgba(1, 18, 33, 0.7)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(1, 18, 33, 0.7)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      minWidth: '0',
                      flex: 1
                    }}>
                      <div style={{
                        padding: '10px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#607B96',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        flexShrink: 0
                      }}>
                        <ActionIcon size={18} />
                      </div>
                      <div style={{ minWidth: '0' }}>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: '#FFFFFF',
                          display: 'block'
                        }}>
                          {action.label}
                        </span>
                        <p style={{
                          fontSize: '10px',
                          color: '#607B96',
                          fontFamily: 'monospace',
                          marginTop: '4px',
                          margin: '4px 0 0 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {action.desc}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight size={16} style={{
                      color: '#607B96',
                      flexShrink: 0,
                      marginLeft: '8px'
                    }} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar - 1 col */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>

          {/* Repository Info Card */}
          <div style={{
            backgroundColor: 'rgba(1, 18, 33, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: 'rgba(254, 165, 95, 0.1)',
                color: '#FEA55F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GitBranch size={20} />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                margin: '0'
              }}>
                Repository Info
              </h3>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* Last Update */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <RefreshCw size={16} style={{ color: '#43D9AD', marginTop: '4px', flexShrink: 0 }} />
                <div style={{ minWidth: '0' }}>
                  <p style={{
                    fontSize: '9px',
                    color: '#607B96',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    margin: '0'
                  }}>
                    Git_Last_Update
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    marginTop: '8px',
                    margin: '8px 0 0 0'
                  }}>
                    {statsData?.lastCommitDate || "Unresolved"}
                  </p>
                </div>
              </div>

              {/* Active Inquiries */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <Activity size={16} style={{ color: '#4D5BCE', marginTop: '4px', flexShrink: 0 }} />
                <div style={{ minWidth: '0' }}>
                  <p style={{
                    fontSize: '9px',
                    color: '#607B96',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    margin: '0'
                  }}>
                    Active_Inquiries
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    marginTop: '8px',
                    margin: '8px 0 0 0'
                  }}>
                    {statsData?.totalMessages ?? 0} Messages
                  </p>
                </div>
              </div>

              {/* Deployment Status */}
              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(67, 217, 173, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(67, 217, 173, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    color: '#607B96',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em'
                  }}>
                    Vercel Deployment
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: 'rgba(67, 217, 173, 0.2)',
                    color: '#43D9AD',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    borderRadius: '4px',
                    border: '1px solid rgba(67, 217, 173, 0.3)',
                    textTransform: 'uppercase'
                  }}>
                    Live
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#E5E9F0'
                }}>
                  <Globe size={14} style={{ color: '#607B96', flexShrink: 0 }} />
                  <span style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {statsData?.vercelStatus || "Production_Authorized"}
                  </span>
                </div>
              </div>
            </div>

            <button style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              color: '#607B96',
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = 'rgba(254, 165, 95, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#607B96';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            }}>
              View Diagnostics
            </button>
          </div>

          {/* Security Protocols Card */}
          <div style={{
            backgroundColor: 'rgba(1, 18, 33, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: 'rgba(67, 217, 173, 0.1)',
                color: '#43D9AD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                margin: '0'
              }}>
                Security Protocols
              </h3>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {[
                "Encryption Matrix Active",
                "2FA Session Authorized",
                "API Rate Limiter Standing By"
              ].map((protocol, i) => (
                <div 
                  key={i} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(67, 217, 173, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(67, 217, 173, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#43D9AD',
                    animation: 'pulse 2s infinite',
                    flexShrink: 0
                  }} />
                  <span style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#607B96'
                  }}>
                    {protocol}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
};

export default DashboardPage;