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
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import Button from "@/components/UI/Button";
import InputField from "@/components/UI/InputField";
import TextAreaField from "@/components/UI/TextAreaField";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsAdminPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageLink: "",
    techStack: "",
    link: "",
    date: "",
    featured: false,
    order: 0,
  });

  const projectsQuery = trpc.project.getAll.useQuery();

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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageLink: "",
      techStack: "",
      link: "",
      date: "",
      featured: false,
      order: 0,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (project: {
    id: string;
    title: string;
    description: string;
    imageLink?: string | null;
    techStack?: string[];
    link?: string | null;
    date?: string | null;
    featured?: boolean;
    order?: number;
  }) => {
    setFormData({
      title: project.title,
      description: project.description,
      imageLink: project.imageLink || "",
      techStack: project.techStack?.join(", ") || "",
      link: project.link || "",
      date: project.date || "",
      featured: project.featured || false,
      order: project.order || 0,
    });
    setEditingId(project.id);
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate({
      id: editingId || undefined,
      ...formData,
      techStack: formData.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
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
            // manage your professional portfolio
          </p>
        </div>

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
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
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
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
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
                    value={formData.imageLink}
                    onChange={(v) => setFormData({ ...formData, imageLink: v })}
                  />
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
                  <InputField
                    label="Tech Stack (comma separated tokens)"
                    placeholder="Next.js, Tailwind, tRPC, PostgreSQL"
                    value={formData.techStack}
                    onChange={(v) => setFormData({ ...formData, techStack: v })}
                  />

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {projectsQuery.data?.map((project) => (
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
                  cursor: "pointer",
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
                  {project.imageLink ? (
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
                      {project.techStack.map((tech: string, i: number) => (
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
                      {project.techStack && project.techStack.length > 4 && (
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#607B96",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          +{project.techStack.length - 4}
                        </span>
                      )}
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
            ))}

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
