"use client";

import { useState } from "react";
import {
  Code2,
  Plus,
  Trash2,
  Edit3,
  Terminal,
  Cpu,
  Server,
  Database,
  Globe,
  Layout as LayoutIcon,
  Search,
  X,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import { SkillItem } from "@/types/types-about";
import Button from "@/components/UI/Button";
import InputField from "@/components/UI/InputField";
import { motion, AnimatePresence } from "framer-motion";

export default function SkillsAdminPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    skills: [] as { name: string; iconId: string | null }[],
  });
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillIconId, setNewSkillIconId] = useState<string | null>(null);

  const skillsQuery = trpc.skillCategory.getAll.useQuery();
  const iconsQuery = trpc.techIcon.getAll.useQuery();

  const upsertMutation = trpc.skillCategory.upsert.useMutation({
    onSuccess: () => {
      resetForm();
      skillsQuery.refetch();
    },
  });

  const deleteMutation = trpc.skillCategory.delete.useMutation({
    onSuccess: () => {
      skillsQuery.refetch();
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      skills: [],
    });
    setNewSkillName("");
    setNewSkillIconId(null);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (category: unknown) => {
    const cat = category as { id: string; name: string; skills: (SkillItem | string)[] };
    setFormData({
      name: cat.name,
      skills: cat.skills.map((s) => {
        if (typeof s === "string") return { name: s, iconId: null };
        return {
          name: s.name,
          iconId: s.iconId || null,
        };
      }),
    });
    setEditingId(cat.id);
    setIsAdding(true);
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: newSkillName.trim(), iconId: newSkillIconId }],
    });
    setNewSkillName("");
    setNewSkillIconId(null);
  };

  const removeSkill = (index: number) => {
    const newSkills = [...formData.skills];
    newSkills.splice(index, 1);
    setFormData({ ...formData, skills: newSkills });
  };

  const updateSkillIcon = (index: number, iconId: string | null) => {
    const newSkills = [...formData.skills];
    const skill = newSkills[index];
    if (typeof skill === "string") {
      newSkills[index] = { name: skill, iconId };
    } else {
      newSkills[index] = { ...skill, iconId };
    }
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate({
      id: editingId || undefined,
      name: formData.name,
      skills: formData.skills,
    });
  };

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("frontend") || n.includes("ui"))
      return <LayoutIcon size={24} />;
    if (n.includes("backend") || n.includes("server"))
      return <Server size={24} />;
    if (n.includes("database")) return <Database size={24} />;
    if (n.includes("devops") || n.includes("terminal"))
      return <Terminal size={24} />;
    if (n.includes("hardware") || n.includes("embedded"))
      return <Cpu size={24} />;
    if (n.includes("web")) return <Globe size={24} />;
    return <Code2 size={24} />;
  };

  if (skillsQuery.isLoading) {
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
        <Terminal
          style={{
            animation: "pulse 2s infinite",
            marginRight: "12px",
            color: "#FEA55F",
          }}
          size={24}
        />
        Initializing skill sub-routines...
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
            Skill <span style={{ color: "#FEA55F" }}>Matrix</span>
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
            {"// configure your technical proficiency"}
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
            Initialize Category
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
                <Code2 color="#FEA55F" size={24} />
                {editingId ? "Reconfigure Category" : "Establish New Category"}
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
                  display: "flex",
                  flexDirection: "column",
                  gap: "32px",
                }}
              >
                <InputField
                  label="Category Name"
                  placeholder="e.g. Backend Development"
                  value={formData.name}
                  onChange={(v) => setFormData({ ...formData, name: v })}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <label style={{ fontSize: "14px", color: "#607B96", fontFamily: "monospace" }}>{"// skills inventory"}</label>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                    <div style={{ flex: 1, display: "flex", gap: "12px", alignItems: "flex-end" }}>
                      <div style={{ flex: 1 }}>
                        <InputField
                          label=""
                          placeholder="Skill name (e.g. React)"
                          value={newSkillName}
                          onChange={(v) => setNewSkillName(v)}
                        />
                      </div>
                      <div style={{ width: "160px" }}>
                        <select
                          value={newSkillIconId || ""}
                          onChange={(e) => setNewSkillIconId(e.target.value || null)}
                          style={{
                            width: "100%",
                            backgroundColor: "#010C15",
                            color: "#607B96",
                            border: "1px solid #1E2D3D",
                            borderRadius: "8px",
                            padding: "12px",
                            fontSize: "14px",
                            outline: "none",
                            appearance: "none",
                            height: "46px",
                            marginBottom: "4px"
                          }}
                        >
                          <option value="">Select Icon</option>
                          {iconsQuery.data?.map(icon => (
                            <option key={icon.id} value={icon.id}>{icon.name}</option>
                          ))}
                        </select>
                      </div>
                      {newSkillIconId && (
                        <div 
                          style={{ 
                            width: "46px", 
                            height: "46px", 
                            backgroundColor: "rgba(30, 45, 61, 0.4)",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#FEA55F",
                            marginBottom: "4px"
                          }}
                          dangerouslySetInnerHTML={{ 
                            __html: iconsQuery.data?.find(i => i.id === newSkillIconId)?.icon || "" 
                          }}
                        />
                      )}
                    </div>
                    <Button type="button" onClick={addSkill} style={{ height: "46px", marginBottom: "4px" }}>
                      <Plus size={18} /> Add
                    </Button>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
                    {(formData.skills as unknown as (SkillItem | string)[]).map((skill, idx) => {
                      const name = typeof skill === "string" ? skill : (skill as SkillItem).name;
                      const iconId = typeof skill === "string" ? null : (skill as SkillItem).iconId;
                      const icon = iconsQuery.data?.find((i) => i.id === iconId);
                      
                      return (
                        <div key={idx} style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "12px", 
                          backgroundColor: "rgba(30, 45, 61, 0.4)", 
                          padding: "12px", 
                          borderRadius: "12px",
                          border: "1px solid rgba(30, 45, 61, 0.6)"
                        }}>
                          {icon && (
                            <div 
                              style={{ width: "18px", height: "18px", color: "#FEA55F", display: "flex", alignItems: "center" }}
                              dangerouslySetInnerHTML={{ __html: icon.icon }}
                            />
                          )}
                          <span style={{ color: "#FFFFFF", flex: 1, fontSize: "14px" }}>{name}</span>
                          
                          <select
                            value={iconId || ""}
                            onChange={(e) => updateSkillIcon(idx, e.target.value || null)}
                            style={{
                              backgroundColor: "#010C15",
                              color: "#607B96",
                              border: "1px solid #1E2D3D",
                              borderRadius: "8px",
                              padding: "6px 10px",
                              fontSize: "12px",
                              outline: "none"
                            }}
                          >
                            <option value="">No Icon</option>
                            {iconsQuery.data?.map(icon => (
                              <option key={icon.id} value={icon.id}>{icon.name}</option>
                            ))}
                          </select>
                          
                          <button
                            type="button"
                            onClick={() => removeSkill(idx)}
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              padding: "4px"
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
                  {editingId ? "Update Matrix" : "Synchronize Database"}
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
            {skillsQuery.data?.map((category) => (
              <div
                key={category.id}
                style={{
                  backgroundColor: "rgba(1, 18, 33, 0.5)",
                  border: "1px solid rgba(30, 45, 61, 0.6)",
                  borderRadius: "24px",
                  padding: "28px",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
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
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "128px",
                    height: "128px",
                    backgroundColor: "rgba(254, 165, 95, 0.05)",
                    borderRadius: "50%",
                    filter: "blur(48px)",
                    zIndex: -10,
                    transition: "background-color 0.3s ease",
                  }}
                />

                {/* Card Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "28px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        padding: "14px",
                        backgroundColor: "#1C2B3A",
                        borderRadius: "16px",
                        color: "#FEA55F",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.3)",
                        transition: "transform 0.3s ease",
                        flexShrink: 0,
                      }}
                    >
                      {getIcon(category.name)}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        minWidth: 0,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#FFFFFF",
                          transition: "color 0.3s ease",
                          margin: "0",
                        }}
                      >
                        {category.name}
                      </h3>
                      <p
                        style={{
                          color: "#607B96",
                          fontSize: "10px",
                          fontFamily: "monospace",
                          textTransform: "uppercase",
                          letterSpacing: "0.2em",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          margin: "0",
                        }}
                      >
                        <Search size={10} /> {category.skills.length} modules
                        identified
                      </p>
                    </div>
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
                      onClick={() => handleEdit(category)}
                      style={{
                        padding: "12px",
                        color: "#607B96",
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "10px",
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
                      onClick={() => deleteMutation.mutate(category.id)}
                      style={{
                        padding: "12px",
                        color: "#607B96",
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "10px",
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

                {/* Skills Tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {(category.skills as (SkillItem | string)[]).map((skill, i) => {
                    const name = typeof skill === "string" ? skill : skill.name;
                    const iconId = typeof skill === "string" ? null : skill.iconId;
                    const icon = iconsQuery.data?.find((ic) => ic.id === iconId);
                    
                    return (
                      <span
                        key={i}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "rgba(30, 45, 61, 0.5)",
                          border: "1px solid rgba(30, 45, 61, 0.8)",
                          color: "#43D9AD",
                          fontSize: "12px",
                          fontFamily: "monospace",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "all 0.3s ease",
                          cursor: "default",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(67, 217, 173, 0.3)";
                          e.currentTarget.style.backgroundColor =
                            "rgba(67, 217, 173, 0.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(30, 45, 61, 0.8)";
                          e.currentTarget.style.backgroundColor =
                            "rgba(30, 45, 61, 0.5)";
                        }}
                      >
                        {icon && (
                          <div 
                            style={{ width: "14px", height: "14px", color: "#43D9AD", display: "flex", alignItems: "center" }}
                            dangerouslySetInnerHTML={{ __html: icon.icon }} 
                          />
                        )}
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}

            {skillsQuery.data?.length === 0 && (
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
                <Code2 size={64} style={{ opacity: 0.1 }} />
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "rgba(255, 255, 255, 0.25)",
                    margin: "0",
                  }}
                >
                  Technical matrix is currently void.
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
                  <Plus size={18} /> Initialize Data Load
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
