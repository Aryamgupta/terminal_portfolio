"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Briefcase,
  MapPin,
  Calendar,
  X,
  PlusCircle,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import Button from "@/components/UI/Button";
import InputField from "@/components/UI/InputField";
import TextAreaField from "@/components/UI/TextAreaField";
import { motion, AnimatePresence } from "framer-motion";

export default function ExperienceAdminPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    duration: "",
    description: "", // Will be split by newlines
    order: 0,
  });

  const experienceQuery = trpc.experience.getAll.useQuery();

  const upsertMutation = trpc.experience.upsert.useMutation({
    onSuccess: () => {
      resetForm();
      experienceQuery.refetch();
    },
  });

  const deleteMutation = trpc.experience.delete.useMutation({
    onSuccess: () => {
      experienceQuery.refetch();
    },
  });

  const resetForm = () => {
    setFormData({
      company: "",
      role: "",
      location: "",
      duration: "",
      description: "",
      order: 0,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (exp: any) => {
    setFormData({
      company: exp.company,
      role: exp.role,
      location: exp.location || "",
      duration: exp.duration,
      description: exp.description.join("\n"),
      order: exp.order || 0,
    });
    setEditingId(exp.id);
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate({
      id: editingId || undefined,
      ...formData,
      description: formData.description
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  if (experienceQuery.isLoading) {
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
        <Briefcase
          style={{
            animation: "spin 2s linear infinite",
            marginRight: "12px",
            color: "#FEA55F",
          }}
          size={24}
        />
        Loading professional records...
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
            Experience <span style={{ color: "#FEA55F" }}>Timeline</span>
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
            {"// document your career progression"}
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
            Record New Position
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
                <Briefcase color="#FEA55F" size={24} />
                {editingId ? "Update Position Details" : "New Career entry"}
              </h2>
              <button
                onClick={resetForm}
                style={{
                  color: "#607B96",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                  }}
                >
                  <InputField
                    label="Company / Organization"
                    placeholder="e.g. Google"
                    value={formData.company}
                    onChange={(v) => setFormData({ ...formData, company: v })}
                  />
                  <InputField
                    label="Role / Title"
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.role}
                    onChange={(v) => setFormData({ ...formData, role: v })}
                  />
                  <InputField
                    label="Location"
                    placeholder="e.g. Mountain View, CA (Remote)"
                    value={formData.location}
                    onChange={(v) => setFormData({ ...formData, location: v })}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                  }}
                >
                  <InputField
                    label="Duration"
                    placeholder="e.g. Jan 2023 - Present"
                    value={formData.duration}
                    onChange={(v) => setFormData({ ...formData, duration: v })}
                  />
                  <InputField
                    label="Display Priority"
                    type="number"
                    value={formData.order.toString()}
                    onChange={(v) =>
                      setFormData({ ...formData, order: parseInt(v) || 0 })
                    }
                  />
                </div>
              </div>

              <TextAreaField
                label="Achievements (One per line)"
                rows={8}
                placeholder="Introduced microservices architecture...&#10;Mentored 5 junior developers..."
                value={formData.description}
                onChange={(v) => setFormData({ ...formData, description: v })}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button loading={upsertMutation.isPending} type="submit">
                  {editingId ? "Update entry" : "Commit to Timeline"}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {experienceQuery.data?.map((exp) => (
              <motion.div
                key={exp.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  backgroundColor: "rgba(1, 18, 33, 0.5)",
                  border: "1px solid rgba(30, 45, 61, 0.6)",
                  borderRadius: "24px",
                  padding: "32px",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "24px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#FFFFFF",
                        margin: 0,
                      }}
                    >
                      {exp.role}
                    </h3>
                    <span
                      style={{
                        color: "#FEA55F",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      @ {exp.company}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "24px",
                      color: "#607B96",
                      fontSize: "14px",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={14} />
                      {exp.duration}
                    </div>
                    {exp.location && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <MapPin size={14} />
                        {exp.location}
                      </div>
                    )}
                  </div>

                  <ul
                    style={{
                      paddingLeft: "20px",
                      color: "#607B96",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    {exp.description.map((item: string, i: number) => (
                      <li key={i} style={{ marginBottom: "8px" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => handleEdit(exp)}
                    style={{
                      padding: "10px",
                      color: "#607B96",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(exp.id)}
                    style={{
                      padding: "10px",
                      color: "#ef4444",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}

            {experienceQuery.data?.length === 0 && (
              <div
                style={{
                  padding: "60px",
                  textAlign: "center",
                  border: "2px dashed rgba(30, 45, 61, 0.4)",
                  borderRadius: "24px",
                  color: "#607B96",
                }}
              >
                No professional experience recorded yet.
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
