"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit3,
  Layout,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
  Star,
  X,
  RefreshCw,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import Button from "@/components/UI/Button";
import InputField from "@/components/UI/InputField";
import TextAreaField from "@/components/UI/TextAreaField";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@prisma/client";

const GlobalAdminStyles = () => (
  <style jsx global>{`
    .tech-icon-wrapper svg {
      width: 100% !important;
      height: 100% !important;
      fill: currentColor !important;
    }
    .tech-icon-wrapper path {
      fill: currentColor !important;
    }
  `}</style>
);

const SyncModuleButton = ({ module }: { module: string }) => {
  const syncMutation = trpc.system.generateModuleJson.useMutation();

  return (
    <Button
      onClick={() => syncMutation.mutate({ module })}
      loading={syncMutation.isPending}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "fit-content",
        backgroundColor: "rgba(67, 217, 173, 0.1)",
        border: "1px solid rgba(67, 217, 173, 0.3)",
        color: "#43D9AD",
        padding: "8px 16px",
      }}
    >
      <RefreshCw size={16} className={syncMutation.isPending ? "animate-spin" : ""} />
      Sync Module
    </Button>
  );
};

export default function ProjectsAdminPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageLink: "",
    imageSvg: "",
    link: "",
    date: "",
    featured: false,
    order: 0,
    techIds: [] as string[],
    caseStudy: "",
    githubUrl: "",
    githubRepoType: "PUBLIC",
    customReadme: "",
  });

  const [githubToken, setGithubToken] = useState("");
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const projectsQuery = trpc.project.getAll.useQuery();
  const techIconsQuery = trpc.techIcon.getAll.useQuery();
  const apiStatusQuery = trpc.project.checkApiKeyStatus.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const upsertMutation = trpc.project.upsert.useMutation({
    onSuccess: () => {
      resetForm();
      projectsQuery.refetch();
    },
  });

  const deleteMutation = trpc.project.delete.useMutation({
    onSuccess: () => {
      projectsQuery.refetch();
    },
  });

  const convertMutation = trpc.project.convertImage.useMutation();
  const generateCaseStudyMutation = trpc.project.generateCaseStudy.useMutation();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      convertMutation.mutate({ imageBase64: base64 }, {
        onSuccess: (data) => {
          setFormData(prev => ({ ...prev, imageSvg: data.svg }));
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateCaseStudy = () => {
    if (!formData.title) {
      alert("Please provide a project title first.");
      return;
    }
    setIsGenerating(true);
    setGenerationError(null);
    const time = () => new Date().toLocaleTimeString();
    setGenerationLogs([
      `[${time()}] [SYSTEM] Initializing Technical Case Study generation pipeline...`,
      `[${time()}] [SYSTEM] Target Model: gemini-2.5-flash`,
    ]);

    const addLog = (msg: string) => {
      setGenerationLogs(prev => [...prev, `[${time()}] ${msg}`]);
    };

    const techStack = (formData.techIds || [])
      .map(id => techIconsQuery.data?.find(icon => icon.id === id)?.name)
      .filter((name): name is string => !!name);

    setTimeout(() => {
      if (formData.githubUrl && formData.githubRepoType !== "EXTERNAL") {
        addLog(`[GITHUB] Ingesting repository README context: ${formData.githubUrl}`);
        addLog(`[GITHUB] Access mode: ${formData.githubRepoType}`);
        if (formData.githubRepoType === "PRIVATE") {
          addLog(`[GITHUB] Authenticating via token...`);
        }
      } else if (formData.githubRepoType === "EXTERNAL" && formData.customReadme) {
        addLog(`[CONTEXT] Ingesting custom copy-pasted README content...`);
      } else {
        addLog(`[WARNING] No repository context provided. Case study will be generated using project metadata only.`);
      }

      setTimeout(() => {
        addLog(`[GEMINI] Dispatching generation request to gemini-2.5-flash...`);
        
        generateCaseStudyMutation.mutate(
          {
            title: formData.title,
            description: formData.description || "No description provided.",
            techStack,
            githubUrl: formData.githubUrl,
            githubRepoType: formData.githubRepoType,
            githubToken: formData.githubRepoType === "PRIVATE" ? githubToken : undefined,
            customReadme: formData.githubRepoType === "EXTERNAL" ? formData.customReadme : undefined,
          },
          {
            onSuccess: (data) => {
              addLog(`[GEMINI] Response stream received successfully.`);
              try {
                const parsed = JSON.parse(data.caseStudy);
                const formatted = JSON.stringify(parsed, null, 2);
                setFormData(prev => ({ ...prev, caseStudy: formatted }));
                setJsonError(null);
                addLog(`[SUCCESS] Case study JSON generated and validated!`);
                setIsGenerating(false);
              } catch (e) {
                console.error("Generated case study is not valid JSON:", data.caseStudy);
                setFormData(prev => ({ ...prev, caseStudy: data.caseStudy }));
                setJsonError("Generated content contains syntax issues. Please review and fix.");
                addLog(`[WARNING] Response received, but contains JSON formatting issues.`);
                setIsGenerating(false);
              }
            },
            onError: (err) => {
              addLog(`[ERROR] Gemini generation failed: ${err.message}`);
              setGenerationError(err.message);
              setIsGenerating(false);
            }
          }
        );
      }, 800);
    }, 600);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageLink: "",
      imageSvg: "",
      link: "",
      date: "",
      featured: false,
      order: 0,
      techIds: [],
      caseStudy: "",
      githubUrl: "",
      githubRepoType: "PUBLIC",
      customReadme: "",
    });
    setGithubToken("");
    setGenerationLogs([]);
    setGenerationError(null);
    setIsGenerating(false);
    setJsonError(null);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (project: {
    id: string;
    title: string;
    description: string;
    imageLink?: string | null;
    imageSvg?: string | null;
    techStack?: string[];
    link?: string | null;
    date?: string | null;
    featured?: boolean;
    order?: number;
    techIds?: string[];
    caseStudy?: string | null;
    githubUrl?: string | null;
    githubRepoType?: string | null;
    customReadme?: string | null;
  }) => {
    setFormData({
      title: project.title,
      description: project.description,
      imageLink: project.imageLink || "",
      imageSvg: project.imageSvg || "",
      link: project.link || "",
      date: project.date || "",
      featured: project.featured || false,
      order: project.order || 0,
      techIds: project.techIds || [],
      caseStudy: project.caseStudy || "",
      githubUrl: project.githubUrl || "",
      githubRepoType: project.githubRepoType || "PUBLIC",
      customReadme: project.customReadme || "",
    });
    setGithubToken("");
    setGenerationLogs([]);
    setGenerationError(null);
    setIsGenerating(false);
    setJsonError(null);
    setEditingId(project.id);
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Derive tech names from techIds for the techStack array field
    const techStack = (formData.techIds || [])
      .map(id => techIconsQuery.data?.find(icon => icon.id === id)?.name)
      .filter((name): name is string => !!name);

    upsertMutation.mutate({
      id: editingId || undefined,
      ...formData,
      techStack,
    });
  };

  if (projectsQuery.isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          color: "#607B96",
          fontFamily: "monospace",
        }}
      >
        <Layout
          style={{
            animation: "spin 2s linear infinite",
            marginRight: "12px",
            color: "#FEA55F",
          }}
          size={24}
        />
        Compiling project repository...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        paddingBottom: "80px",
      }}
    >
      <GlobalAdminStyles />
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#FFFFFF",
              letterSpacing: "-1px",
              margin: "0",
            }}
          >
            Project <span style={{ color: "#FEA55F" }}>Vault</span>
          </h1>
          <p
            style={{
              color: "#607B96",
              fontFamily: "monospace",
              fontSize: "14px",
              marginTop: "12px",
              margin: "12px 0 0 0",
            }}
          >
            {`// manage your professional portfolio`}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "fit-content",
              }}
            >
              <Plus size={18} />
              Deploy New Project
            </Button>
          )}
          <SyncModuleButton module="projects" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              backgroundColor: "rgba(1, 18, 33, 0.8)",
              border: "1px solid rgba(30, 45, 61, 0.8)",
              borderRadius: "24px",
              padding: "32px",
              backdropFilter: "blur(16px)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Layout Content */}
            <div
              style={{
                position: "absolute",
                top: 0,
                width: "256px",
                height: "256px",
                backgroundColor: "rgba(254, 165, 95, 0.05)",
                borderRadius: "50%",
                filter: "blur(100px)",
                zIndex: -10,
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "40px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  margin: "0",
                }}
              >
                <Layout color="#FEA55F" size={24} />
                {editingId
                  ? "Update Project Spec"
                  : "Establish New Project Connection"}
              </h2>
              <button
                onClick={resetForm}
                style={{
                  color: "#607B96",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  transition: "color 0.3s ease",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#607B96")}
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "32px",
                }}
              >
                {/* Left Column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                  }}
                >
                  <InputField
                    label="Project Title"
                    placeholder="e.g. Neural Portfolio OS"
                    value={formData.title}
                    onChange={(v) => setFormData({ ...formData, title: v })}
                  />
                  <InputField
                    label="Hero Image Link"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageLink || ""}
                    onChange={(v) => setFormData({ ...formData, imageLink: v })}
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <label style={{ fontSize: "14px", color: "#607B96", fontFamily: "monospace" }}>{"// upload project image (converts to SVG)"}</label>
                    <div style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "center"
                    }}>
                      <div style={{
                        flex: 1,
                        position: "relative",
                        height: "45px",
                        backgroundColor: "rgba(0,0,0,0.2)",
                        border: "1px solid #1E2D3D",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 12px",
                        cursor: "pointer"
                      }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{
                            position: "absolute",
                            inset: 0,
                            opacity: 0,
                            cursor: "pointer",
                            width: "100%"
                          }}
                        />
                        <span style={{ color: "#607B96", fontSize: "13px" }}>
                          {convertMutation.isPending ? "Converting..." : "Select image file..."}
                        </span>
                      </div>
                      
                      {formData.imageSvg && (
                        <div style={{
                          width: "45px",
                          height: "45px",
                          backgroundColor: "rgba(67, 217, 173, 0.1)",
                          border: "1px solid #43D9AD",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "6px",
                          color: "#43D9AD"
                        }}>
                          <div 
                            dangerouslySetInnerHTML={{ __html: formData.imageSvg }}
                            style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                            className="[&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <InputField
                    label="deployment.url"
                    placeholder="https://mycoolproject.com"
                    value={formData.link}
                    onChange={(v) => setFormData({ ...formData, link: v })}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <InputField
                      label="Timeline"
                      placeholder="e.g. 2024"
                      value={formData.date}
                      onChange={(v) => setFormData({ ...formData, date: v })}
                    />
                    <InputField
                      label="Priority Rank"
                      type="number"
                      placeholder="0"
                      value={formData.order.toString()}
                      onChange={(v) =>
                        setFormData({ ...formData, order: parseInt(v) || 0 })
                      }
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                  }}
                >
                  <TextAreaField
                    label="Mission Parameters (Description)"
                    rows={6}
                    placeholder="Detail the project's objectives and outcomes..."
                    value={formData.description}
                    onChange={(v) =>
                      setFormData({ ...formData, description: v })
                    }
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: 0 }}>
                    <label style={{ fontSize: "14px", color: "#607B96", fontFamily: "monospace" }}>{"// select project technologies"}</label>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", 
                      gap: "8px",
                      maxHeight: "180px",
                      overflowY: "auto",
                      padding: "12px",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      borderRadius: "16px",
                      border: "1px solid rgba(30, 45, 61, 0.4)",
                      scrollbarWidth: "thin",
                      scrollbarColor: "#1E2D3D transparent"
                    }}>
                      {techIconsQuery.data?.map((icon) => {
                        const isSelected = formData.techIds?.includes(icon.id);
                        return (
                          <button
                            key={icon.id}
                            type="button"
                            onClick={() => {
                              const currentIds = formData.techIds || [];
                              const nextIds = isSelected 
                                ? currentIds.filter(id => id !== icon.id)
                                : [...currentIds, icon.id];
                              setFormData({ ...formData, techIds: nextIds });
                            }}
                            style={{
                              padding: "8px",
                              backgroundColor: isSelected ? "rgba(254, 165, 95, 0.15)" : "transparent",
                              border: `1px solid ${isSelected ? "#FEA55F" : "rgba(30, 45, 61, 0.4)"}`,
                              borderRadius: "10px",
                              color: isSelected ? "#FFFFFF" : "#607B96",
                              fontSize: "11px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              transition: "all 0.2s ease"
                            }}
                          >
                            <span 
                              className="tech-icon-wrapper"
                              dangerouslySetInnerHTML={{ __html: icon.icon }} 
                              style={{ 
                                width: "18px", 
                                height: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                color: isSelected ? "#FEA55F" : "#607B96"
                              }} 
                            />
                            <span style={{ 
                              overflow: "hidden", 
                              textOverflow: "ellipsis", 
                              whiteSpace: "nowrap" 
                            }}>
                              {icon.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Featured Checkbox */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "16px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        accentColor: "#FEA55F",
                      }}
                    />
                    <label
                      htmlFor="featured"
                      style={{
                        color: "#FFFFFF",
                        fontSize: "14px",
                        fontWeight: "bold",
                        userSelect: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        margin: 0,
                      }}
                    >
                      Featured on Primary Interface
                      <Star
                        size={14}
                        style={{
                          color: formData.featured ? "#FEA55F" : "#607B96",
                          fill: formData.featured ? "#FEA55F" : "none",
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* GitHub Repository Association */}
              <div
                style={{
                  borderTop: "1px solid rgba(30, 45, 61, 0.6)",
                  paddingTop: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  width: "100%",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "16px", color: "#FFFFFF", fontWeight: "bold", margin: 0 }}>
                    GitHub Codebase Integration
                  </h3>
                  <p style={{ fontSize: "12px", color: "#607B96", fontFamily: "monospace", margin: "4px 0 0 0" }}>
                    {"// ingest repository README context to build detailed system architecture and specs"}
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <InputField
                    label="Repository URL"
                    placeholder="https://github.com/owner/repo"
                    value={formData.githubUrl || ""}
                    onChange={(val) => setFormData({ ...formData, githubUrl: val })}
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ color: "#607B96", fontSize: "12px", fontFamily: "monospace" }}>
                      Access Mode
                    </label>
                    <div style={{ display: "flex", gap: "8px", height: "38px" }}>
                      {["PUBLIC", "PRIVATE", "EXTERNAL"].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setFormData({ ...formData, githubRepoType: mode })}
                          style={{
                            flex: 1,
                            backgroundColor: formData.githubRepoType === mode ? "rgba(67, 217, 173, 0.15)" : "rgba(0, 0, 0, 0.2)",
                            border: `1px solid ${formData.githubRepoType === mode ? "#43D9AD" : "rgba(30, 45, 61, 0.8)"}`,
                            borderRadius: "8px",
                            color: formData.githubRepoType === mode ? "#43D9AD" : "#607B96",
                            fontSize: "11px",
                            fontWeight: "bold",
                            fontFamily: "monospace",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {formData.githubRepoType === "PRIVATE" && (
                  <InputField
                    label="Personal Access Token (PAT)"
                    placeholder="ghp_..."
                    type="password"
                    value={githubToken}
                    onChange={(val) => setGithubToken(val)}
                  />
                )}

                {formData.githubRepoType === "EXTERNAL" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ color: "#607B96", fontSize: "12px", fontFamily: "monospace" }}>
                      Copy-Paste README.md Content
                    </label>
                    <textarea
                      rows={6}
                      value={formData.customReadme || ""}
                      onChange={(e) => setFormData({ ...formData, customReadme: e.target.value })}
                      placeholder="# Overview&#10;## Setup..."
                      style={{
                        width: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.25)",
                        border: "1px solid rgba(30, 45, 61, 0.8)",
                        borderRadius: "8px",
                        padding: "12px",
                        color: "#E2E8F0",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        outline: "none"
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Technical Case Study Block */}
              <div
                style={{
                  borderTop: "1px solid rgba(30, 45, 61, 0.6)",
                  paddingTop: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "16px", color: "#FFFFFF", fontWeight: "bold", margin: 0 }}>
                      Technical Case Study (JSON Config)
                    </h3>
                    <p style={{ fontSize: "12px", color: "#607B96", fontFamily: "monospace", margin: "4px 0 0 0" }}>
                      {"// stores detailed repository information and architecture"}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", fontFamily: "monospace", fontSize: "11px" }}>
                      {apiStatusQuery.isLoading ? (
                        <span style={{ color: "#FEA55F" }}>● API Status: Verifying...</span>
                      ) : apiStatusQuery.data?.status === "ACTIVE" ? (
                        <span style={{ color: "#43D9AD" }}>● API Status: Active (gemini-2.5-flash)</span>
                      ) : apiStatusQuery.data?.status === "EXHAUSTED" ? (
                        <span style={{ color: "#ef4444" }}>● API Status: Quota Exhausted</span>
                      ) : (
                        <span style={{ color: "#ef4444" }}>● API Status: Inactive ({apiStatusQuery.data?.message || "Check .env"})</span>
                      )}
                      <button
                        type="button"
                        onClick={() => apiStatusQuery.refetch()}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#607B96",
                          cursor: "pointer",
                          fontSize: "10px",
                          padding: "2px 6px",
                          borderLeft: "1px solid rgba(255,255,255,0.15)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <RefreshCw size={10} className={apiStatusQuery.isFetching ? "animate-spin" : ""} />
                        Test Key
                      </button>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleGenerateCaseStudy}
                    loading={isGenerating}
                    style={{
                      backgroundColor: "rgba(254, 165, 95, 0.1)",
                      border: "1px solid rgba(254, 165, 95, 0.3)",
                      color: "#FEA55F",
                      padding: "6px 12px",
                      fontSize: "12px",
                      width: "auto"
                    }}
                  >
                    Generate with Gemini AI
                  </Button>
                </div>

                {/* Terminal progress / logs */}
                {(isGenerating || generationLogs.length > 0) && (
                  <div
                    style={{
                      backgroundColor: "#01080E",
                      border: "1px solid rgba(30, 45, 61, 0.9)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      width: "100%",
                      marginTop: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    {/* Terminal Header */}
                    <div
                      style={{
                        backgroundColor: "rgba(30, 45, 61, 0.3)",
                        borderBottom: "1px solid rgba(30, 45, 61, 0.6)",
                        padding: "8px 12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#eab308" }} />
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
                      </div>
                      <span style={{ color: "#607B96", fontSize: "10px", fontFamily: "monospace" }}>
                        bash - gemini-case-study
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setGenerationLogs([]);
                          setGenerationError(null);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#607B96",
                          cursor: "pointer",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                    {/* Terminal body */}
                    <div
                      style={{
                        padding: "12px 16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        maxHeight: "220px",
                        overflowY: "auto",
                        fontFamily: "'Fira Code', monospace",
                        fontSize: "11px",
                      }}
                    >
                      {generationLogs.map((log, idx) => {
                        let color = "#43D9AD"; // Teal
                        if (log.includes("[ERROR]")) color = "#ef4444"; // Red
                        if (log.includes("[SUCCESS]")) color = "#22c55e"; // Green
                        if (log.includes("[WARNING]")) color = "#eab308"; // Orange/Yellow
                        return (
                          <div key={idx} style={{ color, whiteSpace: "pre-wrap" }}>
                            {log}
                          </div>
                        );
                      })}
                      {isGenerating && (
                        <div style={{ color: "#FEA55F", display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ display: "inline-block", animation: "spin 1.5s linear infinite" }}>⚙</span>
                          <span>Generating case study via Gemini AI...</span>
                        </div>
                      )}
                      {generationError && (
                        <div style={{ marginTop: "8px", display: "flex", gap: "12px" }}>
                          <button
                            type="button"
                            onClick={handleGenerateCaseStudy}
                            style={{
                              backgroundColor: "rgba(239, 68, 68, 0.15)",
                              border: "1px solid rgba(239, 68, 68, 0.4)",
                              borderRadius: "4px",
                              color: "#ef4444",
                              padding: "4px 8px",
                              fontSize: "10px",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                          >
                            Retry generation
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ position: "relative" }}>
                  <textarea
                    rows={15}
                    value={formData.caseStudy}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, caseStudy: val });
                      try {
                        if (val.trim()) {
                          JSON.parse(val);
                          setJsonError(null);
                        }
                      } catch (err: any) {
                        setJsonError(`Invalid JSON: ${err.message}`);
                      }
                    }}
                    placeholder={`{\n  "repoStyleIdentifier": "owner/repo",\n  "status": "Production",\n  ...\n}`}
                    style={{
                      width: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.25)",
                      border: `1px solid ${jsonError ? "#ef4444" : "rgba(30, 45, 61, 0.8)"}`,
                      borderRadius: "12px",
                      padding: "16px",
                      color: "#E2E8F0",
                      fontFamily: "'Fira Code', monospace",
                      fontSize: "12px",
                      lineHeight: "1.6",
                      resize: "vertical",
                      outline: "none"
                    }}
                  />
                  {jsonError && (
                    <div style={{ color: "#ef4444", fontSize: "11px", fontFamily: "monospace", marginTop: "4px" }}>
                      ⚠️ {jsonError}
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingTop: "24px",
                }}
              >
                <Button
                  loading={upsertMutation.isPending}
                  type="submit"
                  style={{
                    paddingLeft: "40px",
                    paddingRight: "40px",
                  }}
                >
                  {editingId ? "Update Prototype" : "Synchronize Repository"}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {projectsQuery.data?.map((p) => {
              const project = p as Project & { techIds?: string[] };
              return (
                <div
                  key={project.id}
                  style={{
                    backgroundColor: "rgba(1, 18, 33, 0.5)",
                    border: "1px solid rgba(30, 45, 61, 0.6)",
                    borderRadius: "24px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(254, 165, 95, 0.3)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0, 0, 0, 0.4)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(1, 18, 33, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(30, 45, 61, 0.6)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.backgroundColor =
                      "rgba(1, 18, 33, 0.5)";
                  }}
                >
                  {/* Image Container */}
                  <div
                    style={{
                      height: "192px",
                      backgroundColor: "#1C2B3A",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {(project as Project & { imageSvg?: string | null }).imageSvg ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: (project as Project & { imageSvg?: string | null }).imageSvg || "" }}
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                        }}
                        className="[&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                      />
                    ) : project.imageLink ? (
                      <Image
                        src={project.imageLink}
                        alt={project.title}
                        width={400}
                        height={192}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.7s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "rgba(96, 123, 150, 0.3)",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <ImageIcon size={48} />
                        <span
                          style={{
                            fontSize: "10px",
                            fontFamily: "monospace",
                            marginTop: "8px",
                          }}
                        >
                          NO_IMAGE_STREAM
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      padding: "28px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    {/* Title Section */}
                    <div
                      style={{
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          marginBottom: "16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              color: "#FFFFFF",
                              transition: "color 0.3s ease",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              margin: 0,
                            }}
                          >
                            {project.title}
                          </h3>
                          <span
                            style={{
                              fontSize: "10px",
                              fontFamily: "monospace",
                              color: "rgba(254, 165, 95, 0.6)",
                              padding: "4px 8px",
                              border: "1px solid rgba(254, 165, 95, 0.2)",
                              borderRadius: "6px",
                              backgroundColor: "rgba(254, 165, 95, 0.05)",
                              flexShrink: 0,
                            }}
                          >
                            #{project.order}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexShrink: 0,
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(project);
                            }}
                            style={{
                              padding: "8px",
                              color: "#607B96",
                              backgroundColor: "transparent",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "#FEA55F";
                              e.currentTarget.style.backgroundColor =
                                "rgba(255, 255, 255, 0.05)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "#607B96";
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMutation.mutate(project.id);
                            }}
                            style={{
                              padding: "8px",
                              color: "#607B96",
                              backgroundColor: "transparent",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "#ef4444";
                              e.currentTarget.style.backgroundColor =
                                "rgba(239, 68, 68, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "#607B96";
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        style={{
                          color: "#607B96",
                          fontSize: "14px",
                          lineHeight: "1.6",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "4.5rem",
                          margin: "0",
                        }}
                      >
                        {project.description}
                      </p>
                    </div>

                    {/* Footer Section */}
                    <div
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                      }}
                    >
                      {/* Tech Stack */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          minHeight: "40px",
                        }}
                      >
                        {project.techIds?.map((techId: string) => {
                          const icon = techIconsQuery.data?.find(i => i.id === techId);
                          if (!icon) return null;
                          return (
                            <div
                              key={techId}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: "rgba(67, 217, 173, 0.1)",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                border: "1px solid rgba(67, 217, 173, 0.2)",
                              }}
                            >
                              <span 
                                className="tech-icon-wrapper"
                                dangerouslySetInnerHTML={{ __html: icon.icon }} 
                                style={{ width: "12px", height: "12px", color: "#43D9AD" }} 
                              />
                              <span style={{ fontSize: "10px", color: "#43D9AD", fontWeight: "bold", textTransform: "uppercase" }}>
                                {icon.name}
                              </span>
                            </div>
                          );
                        })}
                        {(!project.techIds || project.techIds.length === 0) && project.techStack.map((tech: string, i: number) => (
                          <span
                            key={i}
                            style={{
                              fontSize: "10px",
                              fontFamily: "monospace",
                              color: "#43D9AD",
                              backgroundColor: "rgba(67, 217, 173, 0.1)",
                              padding: "6px 12px",
                              borderRadius: "16px",
                              border: "1px solid rgba(67, 217, 173, 0.2)",
                              textTransform: "uppercase",
                              fontWeight: "bold",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Info */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingTop: "24px",
                          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "12px",
                            color: "#607B96",
                            fontFamily: "monospace",
                          }}
                        >
                          <Calendar size={12} />
                          {project.date}
                        </div>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: "#FEA55F",
                              textDecoration: "none",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              transition: "color 0.3s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.textDecoration = "underline")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.textDecoration = "none")
                            }
                          >
                            LIVE_DEMO <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {projectsQuery.data?.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: "80px 32px",
                  border: "2px dashed rgba(30, 45, 61, 0.6)",
                  borderRadius: "48px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#607B96",
                  gap: "24px",
                }}
              >
                <Layout size={64} style={{ opacity: 0.1 }} />
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "rgba(255, 255, 255, 0.25)",
                    margin: "0",
                  }}
                >
                  No projects discovered in current repository.
                </p>
                <button
                  onClick={() => setIsAdding(true)}
                  style={{
                    color: "#FEA55F",
                    fontWeight: "bold",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#FFFFFF")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#FEA55F")
                  }
                >
                  <Plus size={18} /> Deployment Sequence Initiated
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
