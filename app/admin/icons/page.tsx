"use client";

import { useState, useRef, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Upload,
  X,
  Code,
  Eye,
  Grid,
  List as ListIcon,
  Link as LinkIcon,
  Star,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import Button from "@/components/UI/Button";
import InputField from "@/components/UI/InputField";
import { motion, AnimatePresence } from "framer-motion";
import TextAreaField from "@/components/UI/TextAreaField";

const GlobalIconStyles = () => (
  <style jsx global>{`
    .icon-preview svg {
      width: 100% !important;
      height: 100% !important;
      fill: currentColor !important;
    }
    .icon-preview path {
      fill: currentColor !important;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(30, 45, 61, 0.8);
      border-radius: 4px;
    }
  `}</style>
);

interface IconData {
  id: string;
  name: string;
  category?: string | null;
  svg: string;
}

export default function CustomIconAdminPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"upload" | "editor">("upload");
  
  const [formData, setFormData] = useState<{ name: string; category: string; svg: string }>({
    name: "",
    category: "",
    svg: "",
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [convertColor, setConvertColor] = useState("#FEA55F");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const iconsQuery = trpc.customIcon.getAll.useQuery();
  const personalInfoQuery = trpc.personalInfo.get.useQuery();
  const utils = trpc.useUtils();

  const upsertMutation = trpc.customIcon.upsert.useMutation({
    onSuccess: () => {
      resetForm();
      iconsQuery.refetch();
    },
  });

  const convertMutation = trpc.customIcon.convertAndSave.useMutation({
    onSuccess: () => {
      resetForm();
      iconsQuery.refetch();
    },
  });

  const deleteMutation = trpc.customIcon.delete.useMutation({
    onSuccess: () => {
      iconsQuery.refetch();
    },
  });
  
  const setFaviconMutation = trpc.personalInfo.updateFavicon.useMutation({
    onSuccess: () => {
      personalInfoQuery.refetch();
    },
  });

  const resetForm = () => {
    setFormData({ name: "", category: "", svg: "" });
    setPreviewImage(null);
    setEditingId(null);
    setIsAdding(false);
    setActiveTab("upload");
  };

  const handleEdit = (icon: IconData) => {
    setFormData({
      name: icon.name,
      category: icon.category || "",
      svg: icon.svg,
    });
    setEditingId(icon.id);
    setIsAdding(true);
    setActiveTab("editor");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "upload" && previewImage && !editingId) {
      convertMutation.mutate({
        name: formData.name,
        imageBase64: previewImage,
        category: formData.category,
        color: convertColor,
      });
    } else {
      upsertMutation.mutate({
        id: editingId || undefined,
        ...formData,
      });
    }
  };

  const filteredIcons = useMemo(() => {
    return iconsQuery.data?.filter(icon => {
      const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || icon.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [iconsQuery.data, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set<string>(["All"]);
    iconsQuery.data?.forEach(icon => {
      if (icon.category) cats.add(icon.category);
    });
    return Array.from(cats);
  }, [iconsQuery.data]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <GlobalIconStyles />
      
      {/* Header & Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "20px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#FFFFFF", margin: 0 }}>
            Icon <span style={{ color: "#FEA55F" }}>Library</span>
          </h1>
          <p style={{ color: "#607B96", marginTop: "8px", fontFamily: "monospace" }}>
            {"// design system asset management"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={18} /> Add Icon
            </Button>
          )}
          <div style={{ display: "flex", backgroundColor: "rgba(1, 18, 33, 0.5)", borderRadius: "12px", padding: "4px", border: "1px solid rgba(30, 45, 61, 0.6)" }}>
            <button 
              onClick={() => setViewMode("grid")}
              style={{ padding: "8px", borderRadius: "8px", border: "none", backgroundColor: viewMode === "grid" ? "#1E2D3D" : "transparent", color: viewMode === "grid" ? "#FFFFFF" : "#607B96", cursor: "pointer", transition: "all 0.2s" }}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              style={{ padding: "8px", borderRadius: "8px", border: "none", backgroundColor: viewMode === "list" ? "#1E2D3D" : "transparent", color: viewMode === "list" ? "#FFFFFF" : "#607B96", cursor: "pointer", transition: "all 0.2s" }}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      {!isAdding && (
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "240px" }}>
            <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#607B96" }} />
            <input 
              placeholder="Search icons by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "12px 12px 12px 42px", backgroundColor: "rgba(1, 18, 33, 0.5)", border: "1px solid rgba(30, 45, 61, 0.6)", borderRadius: "14px", color: "#FFFFFF", outline: "none" }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }} className="custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  border: `1px solid ${selectedCategory === cat ? "#FEA55F" : "rgba(30, 45, 61, 0.6)"}`,
                  backgroundColor: selectedCategory === cat ? "rgba(254, 165, 95, 0.1)" : "transparent",
                  color: selectedCategory === cat ? "#FFFFFF" : "#607B96",
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            style={{ backgroundColor: "rgba(1, 18, 33, 0.8)", border: "1px solid rgba(30, 45, 61, 0.8)", borderRadius: "24px", padding: "32px", backdropFilter: "blur(20px)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <button 
                  onClick={() => setActiveTab("upload")}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "12px", border: "none", backgroundColor: activeTab === "upload" ? "#FEA55F" : "transparent", color: activeTab === "upload" ? "#01080E" : "#607B96", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <Upload size={18} /> Ingest Asset
                </button>
                <button 
                  onClick={() => setActiveTab("editor")}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "12px", border: "none", backgroundColor: activeTab === "editor" ? "#FEA55F" : "transparent", color: activeTab === "editor" ? "#01080E" : "#607B96", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <Code size={18} /> SVG Source
                </button>
              </div>
              <button 
                onClick={resetForm}
                style={{ backgroundColor: "transparent", border: "none", color: "#607B96", cursor: "pointer" }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <InputField label="Asset Label" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="e.g. Next.js Dark" />
                <InputField label="Categorization" value={formData.category} onChange={v => setFormData({ ...formData, category: v })} placeholder="e.g. Frameworks, Tools..." />
                
                {activeTab === "upload" && !editingId && (
                  <div style={{ padding: "20px", backgroundColor: "rgba(254, 165, 95, 0.05)", border: "1px solid rgba(254, 165, 95, 0.2)", borderRadius: "16px", marginTop: "12px" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
                      <label style={{ fontSize: "11px", color: "#FEA55F", fontWeight: "bold", textTransform: "uppercase" }}>Trace Color</label>
                      <input type="color" value={convertColor} onChange={e => setConvertColor(e.target.value)} style={{ padding: 0, border: "none", width: "32px", height: "32px", cursor: "pointer", background: "none" }} />
                    </div>
                    <p style={{ fontSize: "12px", color: "#607B96", margin: 0, lineHeight: 1.5 }}>
                      Assets will be silhouette-traced into SVGs. High contrast images work best.
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {activeTab === "upload" && !editingId ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ aspectRatio: "1", borderRadius: "20px", border: "2px dashed rgba(30, 45, 61, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", overflow: "hidden", backgroundColor: "rgba(0,0,0,0.2)" }}
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Icon Trace Pattern Preview"
                        style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }} 
                      />
                    ) : (
                      <div style={{ textAlign: "center", color: "#607B96" }}>
                        <Upload size={48} style={{ opacity: 0.3, marginBottom: "16px" }} />
                        <p style={{ margin: 0 }}>Drop pattern or click to select</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
                    <label style={{ fontSize: "12px", color: "#607B96", fontFamily: "monospace" }}>{"// RAW_SVG_STREAM"}</label>
                    <TextAreaField 
                      label="SVG Source Code"
                      rows={12} 
                      value={formData.svg} 
                      onChange={v => setFormData({ ...formData, svg: v })} 
                      placeholder='<svg ...>...</svg>'
                    />
                    {formData.svg && (
                      <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(30, 45, 61, 0.4)", minHeight: "120px" }}>
                        <div className="icon-preview" style={{ width: "64px", height: "64px", color: "#FFFFFF" }} dangerouslySetInnerHTML={{ __html: formData.svg }} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: "16px", paddingTop: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <Button onClick={resetForm}>Cancel</Button>
                <Button loading={upsertMutation.isPending || convertMutation.isPending} type="submit">
                  {editingId ? "Update Definition" : activeTab === "upload" ? "Convert & Save" : "Push to Vault"}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div style={{
            display: viewMode === "grid" ? "grid" : "flex",
            flexDirection: "column",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "20px"
          }}>
            {filteredIcons?.map((icon: IconData) => (
              <div 
                key={icon.id}
                style={{ 
                  backgroundColor: "rgba(1, 18, 33, 0.4)", 
                  border: "1px solid rgba(30, 45, 61, 0.6)", 
                  borderRadius: "20px", 
                  padding: "24px", 
                  display: "flex", 
                  flexDirection: viewMode === "grid" ? "column" : "row",
                  alignItems: "center",
                  gap: "16px",
                  transition: "all 0.3s ease",
                  position: "relative",
                  cursor: "default"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(254, 165, 95, 0.3)";
                  e.currentTarget.style.backgroundColor = "rgba(1, 18, 33, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(30, 45, 61, 0.6)";
                  e.currentTarget.style.backgroundColor = "rgba(1, 18, 33, 0.4)";
                }}
              >
                <div style={{ 
                  width: viewMode === "grid" ? "64px" : "32px", 
                  height: viewMode === "grid" ? "64px" : "32px", 
                  color: "#FFFFFF",
                  flexShrink: 0
                }} className="icon-preview" dangerouslySetInnerHTML={{ __html: icon.svg }} />
                
                <div style={{ flex: 1, textAlign: viewMode === "grid" ? "center" : "left", minWidth: 0 }}>
                  <h3 style={{ color: "#FFFFFF", fontSize: "14px", margin: "0 0 4px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{icon.name}</h3>
                  <span style={{ fontSize: "10px", color: "#607B96", textTransform: "uppercase", backgroundColor: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "10px" }}>
                    {icon.category || "General"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    onClick={() => setFaviconMutation.mutate(icon.id)}
                    title={(personalInfoQuery.data as any)?.faviconId === icon.id ? "Current Favicon" : "Set as Favicon"}
                    style={{ 
                      padding: "8px", 
                      borderRadius: "10px", 
                      backgroundColor: (personalInfoQuery.data as any)?.faviconId === icon.id ? "rgba(254, 165, 95, 0.2)" : "rgba(255,255,255,0.05)", 
                      border: "none", 
                      color: (personalInfoQuery.data as any)?.faviconId === icon.id ? "#FEA55F" : "#607B96", 
                      cursor: "pointer", 
                      transition: "all 0.2s" 
                    }} 
                  >
                    <Star size={16} fill={(personalInfoQuery.data as any)?.faviconId === icon.id ? "#FEA55F" : "none"} />
                  </button>
                  <button 
                    onClick={() => {
                      const url = `${window.location.origin}/api/icon/${icon.id}`;
                      navigator.clipboard.writeText(url);
                      alert("Favicon URL copied to clipboard!");
                    }}
                    title="Copy Favicon URL"
                    style={{ padding: "8px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "none", color: "#607B96", cursor: "pointer", transition: "all 0.2s" }} 
                    onMouseEnter={e => e.currentTarget.style.color = "#43D9AD"}
                  >
                    <LinkIcon size={16} />
                  </button>
                  <button onClick={() => handleEdit(icon)} style={{ padding: "8px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "none", color: "#607B96", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#FEA55F"}>
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => deleteMutation.mutate(icon.id)} style={{ padding: "8px", borderRadius: "10px", backgroundColor: "rgba(239, 68, 68, 0.05)", border: "none", color: "#ef4444", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {filteredIcons?.length === 0 && (
              <div style={{ gridColumn: "1 / -1", padding: "80px", textAlign: "center", color: "#607B96", border: "2px dashed rgba(30, 45, 61, 0.4)", borderRadius: "32px" }}>
                <Eye size={48} style={{ opacity: 0.2, marginBottom: "16px" }} />
                <p>No matches found in currently indexed assets.</p>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
