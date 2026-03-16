"use client";

import { useState } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit3,
  School,
  Calendar,
  Award,
  X,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import Button from "@/components/UI/Button";
import InputField from "@/components/UI/InputField";
import { motion, AnimatePresence } from "framer-motion";

export default function EducationPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    institution: "",
    year: "",
    percentage: "",
    type: "university",
  });

  const educationQuery = trpc.education.getAll.useQuery();

  const upsertMutation = trpc.education.upsert.useMutation({
    onSuccess: () => {
      resetForm();
      educationQuery.refetch();
    },
  });

  const deleteMutation = trpc.education.delete.useMutation({
    onSuccess: () => {
      educationQuery.refetch();
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      institution: "",
      year: "",
      percentage: "",
      type: "university",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (edu: any) => {
    setFormData({
      name: edu.name,
      institution: edu.institution,
      year: edu.year || "",
      percentage: edu.percentage || "",
      type: edu.type || "university",
    });
    setEditingId(edu.id);
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate({
      id: editingId || undefined,
      ...formData,
    });
  };

  if (educationQuery.isLoading) {
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
        <GraduationCap
          style={{ animation: "bounce 1s infinite", marginRight: "12px" }}
          size={24}
        />
        Synchronizing academic data...
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
            Academic <span style={{ color: "#FEA55F" }}>Archives</span>
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
            // manage your educational journey
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
            Add Education
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
              backgroundColor: "rgba(1, 18, 33, 0.5)",
              border: "1px solid rgba(30, 45, 61, 0.8)",
              borderRadius: "24px",
              padding: "32px",
              backdropFilter: "blur(8px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
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
                <School color="#FEA55F" size={24} />
                {editingId ? "Modify Qualification" : "New Qualification"}
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
                  gap: "24px",
                }}
              >
                <InputField
                  label="Degree / Certificate Name"
                  placeholder="e.g. Bachelor of Technology"
                  value={formData.name}
                  onChange={(v) => setFormData({ ...formData, name: v })}
                />
                <InputField
                  label="Institution"
                  placeholder="e.g. Stanford University"
                  value={formData.institution}
                  onChange={(v) => setFormData({ ...formData, institution: v })}
                />
                <InputField
                  label="Year"
                  placeholder="e.g. 2020 - 2024"
                  value={formData.year}
                  onChange={(v) => setFormData({ ...formData, year: v })}
                />
                <InputField
                  label="Percentage / CGPA"
                  placeholder="e.g. 9.5 CGPA"
                  value={formData.percentage}
                  onChange={(v) => setFormData({ ...formData, percentage: v })}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingTop: "16px",
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
                  {editingId ? "Update Qualification" : "Verify & Save"}
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
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "24px",
            }}
          >
            {educationQuery.data?.map((edu) => (
              <div
                key={edu.id}
                style={{
                  backgroundColor: "rgba(1, 18, 33, 0.5)",
                  border: "1px solid rgba(30, 45, 61, 0.6)",
                  borderRadius: "20px",
                  padding: "28px",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(254, 165, 95, 0.3)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0, 0, 0, 0.3)";
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
                {/* Accent Blob */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "96px",
                    height: "96px",
                    backgroundColor: "rgba(254, 165, 95, 0.05)",
                    borderRadius: "50%",
                    marginRight: "-48px",
                    marginTop: "-48px",
                    filter: "blur(48px)",
                    zIndex: -10,
                    transition: "background-color 0.3s ease",
                  }}
                />

                {/* Header with Icon and Actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "rgba(254, 165, 95, 0.1)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FEA55F",
                      flexShrink: 0,
                    }}
                  >
                    <GraduationCap size={24} />
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(edu);
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
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(edu.id);
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
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Degree Name */}
                <div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#FFFFFF",
                      transition: "color 0.3s ease",
                      margin: "0",
                      lineHeight: "1.4",
                    }}
                  >
                    {edu.name}
                  </h3>
                  <p
                    style={{
                      color: "#607B96",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "8px",
                      fontSize: "14px",
                      margin: "8px 0 0 0",
                    }}
                  >
                    <School size={14} />
                    {edu.institution}
                  </p>
                </div>

                {/* Timeline and Score */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    paddingTop: "8px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                      color: "#43D9AD",
                      fontFamily: "monospace",
                    }}
                  >
                    <Calendar size={14} />
                    {edu.year}
                  </div>

                  {edu.percentage && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: "#E99287",
                        fontFamily: "monospace",
                      }}
                    >
                      <Award size={14} />
                      {edu.percentage}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {educationQuery.data?.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: "80px 32px",
                  border: "2px dashed rgba(30, 45, 61, 0.6)",
                  borderRadius: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#607B96",
                  gap: "16px",
                }}
              >
                <GraduationCap size={48} style={{ opacity: 0.2 }} />
                <p
                  style={{
                    fontSize: "16px",
                    margin: "0",
                  }}
                >
                  No educational records identified.
                </p>
                <button
                  onClick={() => setIsAdding(true)}
                  style={{
                    color: "#FEA55F",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                    transition: "color 0.3s ease",
                    marginTop: "8px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#FFFFFF")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#FEA55F")
                  }
                >
                  Initiate record entry
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
