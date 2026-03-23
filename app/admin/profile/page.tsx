"use client";

import { useEffect, useState } from "react";
import {
  User,
  Github,
  FileText,
  Link2,
  Plus,
  Trash2,
  Edit3,
  X,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import InputField from "@/components/UI/InputField";
import TextAreaField from "@/components/UI/TextAreaField";
import Button from "@/components/UI/Button";
import { trpc } from "@/utils/trpc";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [isAddingSocialLink, setIsAddingSocialLink] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [socialFormData, setSocialFormData] = useState({
    platform: "",
    url: "",
    iconId: "",
  });

  const profileQuery = trpc.personalInfo.get.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const socialLinksQuery = trpc.socialLinks.getAll.useQuery();

  const updateMutation = trpc.personalInfo.update.useMutation({
    onSuccess: () => {
      setLoading(false);
      profileQuery.refetch();
    },
    onError: (err) => {
      setLoading(false);
      console.error("Failed to update profile", err);
    },
  });

  const upsertSocialLinkMutation = trpc.socialLinks.upsert.useMutation({
    onSuccess: () => {
      resetSocialForm();
      socialLinksQuery.refetch();
    },
  });

  const deleteSocialLinkMutation = trpc.socialLinks.delete.useMutation({
    onSuccess: () => {
      socialLinksQuery.refetch();
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone:"",
    location: "",
    githubLink: "",
    linkedinLink: "",
    twitterLink: "",
    resumeLink: "",
    bio: "",
    interests: "",
  });

useEffect(() => {
  const data = profileQuery.data;
  if (!data) return;

  setFormData((prev) => {
    const newData = {
      name: data.name ?? "",
      role: Array.isArray(data.role) ? data.role.join(", ") : data.role ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      location: data.location ?? "",
      githubLink: data.githubLink ?? "",
      linkedinLink: data.linkedinLink ?? "",
      twitterLink: data.twitterLink ?? "",
      resumeLink: data.resumeLink ?? "",
      bio: Array.isArray(data.bio) ? data.bio.join("\n") : data.bio ?? "",
      interests: Array.isArray(data.interests)
        ? data.interests.join("\n")
        : data.interests ?? "",
    };

    // shallow compare instead of stringify
    for (const key in newData) {
      if (newData[key as keyof typeof newData] !== prev[key as keyof typeof prev]) {
        return newData;
      }
    }

    return prev;
  });
}, [profileQuery.data]);

  const handleSubmit = async () => {
    setLoading(true);

    const submitData = {
      name: formData.name,
      role: formData.role
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      bio: formData.bio.split("\n").filter(Boolean),
      interests: formData.interests.split("\n").filter(Boolean),
      location: formData.location,
      githubLink: formData.githubLink,
      linkedinLink: formData.linkedinLink,
      twitterLink: formData.twitterLink,
      resumeLink: formData.resumeLink,
      email: formData.email || "",
      phone: formData.phone || "",
    };

    updateMutation.mutate(submitData);
  };

  const resetSocialForm = () => {
    setSocialFormData({ platform: "", url: "", iconId: "" });
    setIsAddingSocialLink(false);
    setEditingSocialId(null);
  };

  // ✅ FIXED: Prevent page reload with stopPropagation
  const handleEditSocialLink = (e: React.MouseEvent, link: any) => {
    e.preventDefault();
    e.stopPropagation();

    setSocialFormData({
      platform: link.platform,
      url: link.url,
      iconId: link.iconId || "",
    });
    setEditingSocialId(link.id);
    setIsAddingSocialLink(true);
  };

  const handleSaveSocialLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!socialFormData.platform.trim() || !socialFormData.url.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    upsertSocialLinkMutation.mutate({
      id: editingSocialId || undefined,
      ...socialFormData,
    });
  };

  // ✅ FIXED: Prevent page reload on delete
  const handleDeleteSocialLink = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("Are you sure you want to delete this social link?")) {
      deleteSocialLinkMutation.mutate(id);
    }
  };

  // ✅ FIXED: Prevent page reload on add button
  const handleAddSocialLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingSocialLink(true);
  };

  // ✅ FIXED: Prevent page reload on cancel
  const handleCancelSocialForm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resetSocialForm();
  };

  if (profileQuery.isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          color: "#607B96",
        }}
      >
        Loading profile...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
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
            Identity <span style={{ color: "#FEA55F" }}>Manifest</span>
          </h1>
          <p
            style={{
              color: "#607B96",
              fontFamily: "monospace",
              fontSize: "12px",
              marginTop: "12px",
              margin: "12px 0 0 0",
            }}
          >
            {" // synchronize your professional core data"}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <Button
            style={{
              flex: 1,
              backgroundColor: "transparent",
              border: "1px solid rgba(30, 45, 61, 0.8)",
              color: "#607B96",
              fontSize: "14px",
              padding: "12px 20px",
            }}
            onClick={() => profileQuery.refetch()}
          >
            Reset
          </Button>
          <Button
            loading={loading}
            onClick={handleSubmit}
            style={{
              flex: 1,
              fontSize: "14px",
              padding: "12px 20px",
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Form Sections */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        {/* Core Information Card */}
        <section
          style={{
            backgroundColor: "rgba(1, 18, 33, 0.5)",
            border: "1px solid rgba(30, 45, 61, 0.6)",
            borderRadius: "20px",
            padding: "32px 40px",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <div
            style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
          >
            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(254, 165, 95, 0.1)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <User color="#FEA55F" size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  margin: "0",
                }}
              >
                Core Information
              </h2>
              <p
                style={{
                  fontSize: "11px",
                  color: "#607B96",
                  marginTop: "4px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  margin: "4px 0 0 0",
                }}
              >
                Primary identification parameters
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            <InputField
              label="Full Name"
              placeholder="e.g. Aryam Gupta"
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
            />

            <InputField
              label="Professional Role"
              placeholder="e.g. Full Stack Developer, UI Designer"
              value={formData.role}
              onChange={(v) => setFormData({ ...formData, role: v })}
            />

            <InputField
              label="Gmail ID"
              placeholder="e.g. [EMAIL_ADDRESS]"
              value={formData.email}
              onChange={(v) => setFormData({ ...formData, email: v })}
            />
            <InputField
              label="Phone Number"
              placeholder="e.g. +91 1234567890"
              value={formData.phone}
              onChange={(v) => setFormData({ ...formData, phone: v })}
            />

            <div
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <InputField
                label="Geographic Location"
                placeholder="e.g. New Delhi, India"
                value={formData.location}
                onChange={(v) => setFormData({ ...formData, location: v })}
              />
            </div>
          </div>
        </section>

        {/* Global Presence Card */}
        <section
          style={{
            backgroundColor: "rgba(1, 18, 33, 0.5)",
            border: "1px solid rgba(30, 45, 61, 0.6)",
            borderRadius: "20px",
            padding: "32px 40px",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <div
            style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
          >
            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(67, 217, 173, 0.1)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Github color="#43D9AD" size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  margin: "0",
                }}
              >
                Global Presence
              </h2>
              <p
                style={{
                  fontSize: "11px",
                  color: "#607B96",
                  marginTop: "4px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  margin: "4px 0 0 0",
                }}
              >
                External link synchronization
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            <InputField
              label="Github Handle"
              placeholder="github.com/aryam-gupta"
              value={formData.githubLink}
              onChange={(v) => setFormData({ ...formData, githubLink: v })}
            />

            <InputField
              label="LinkedIn Profile"
              placeholder="linkedin.com/in/aryam-gupta"
              value={formData.linkedinLink}
              onChange={(v) => setFormData({ ...formData, linkedinLink: v })}
            />

            <InputField
              label="Twitter / X"
              placeholder="twitter.com/aryam_gupta"
              value={formData.twitterLink}
              onChange={(v) => setFormData({ ...formData, twitterLink: v })}
            />

            <InputField
              label="Resume Link"
              placeholder="gdrive.com/resume.pdf"
              value={formData.resumeLink}
              onChange={(v) => setFormData({ ...formData, resumeLink: v })}
            />
          </div>
        </section>

        {/* Social Links Card */}
        <section
          style={{
            backgroundColor: "rgba(1, 18, 33, 0.5)",
            border: "1px solid rgba(30, 45, 61, 0.6)",
            borderRadius: "20px",
            padding: "32px 40px",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                flex: 1,
              }}
            >
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "rgba(77, 91, 206, 0.1)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Link2 color="#4D5BCE" size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    margin: "0",
                  }}
                >
                  Social Links
                </h2>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#607B96",
                    marginTop: "4px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    margin: "4px 0 0 0",
                  }}
                >
                  Custom platform connections
                </p>
              </div>
            </div>

            {!isAddingSocialLink && (
              <button
                type="button"
                onClick={handleAddSocialLinkClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  fontSize: "13px",
                  flexShrink: 0,
                  backgroundColor: "#FEA55F",
                  color: "#011627",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(254, 165, 95, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Plus size={16} />
                Add Link
              </button>
            )}
          </div>

          {/* Add/Edit Social Link Form */}
          <AnimatePresence>
            {isAddingSocialLink && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(77, 91, 206, 0.2)",
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                    alignItems: "flex-end",
                  }}
                >
                  <InputField
                    label="Platform Name"
                    placeholder="e.g. Discord, Twitch"
                    value={socialFormData.platform}
                    onChange={(v) =>
                      setSocialFormData({ ...socialFormData, platform: v })
                    }
                  />

                  <InputField
                    label="URL"
                    placeholder="https://..."
                    value={socialFormData.url}
                    onChange={(v) =>
                      setSocialFormData({ ...socialFormData, url: v })
                    }
                  />

                  <InputField
                    label="Icon ID (Optional)"
                    placeholder="e.g. discord"
                    value={socialFormData.iconId}
                    onChange={(v) =>
                      setSocialFormData({ ...socialFormData, iconId: v })
                    }
                  />

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      gridColumn: "1 / -1",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleSaveSocialLink}
                      disabled={upsertSocialLinkMutation.isPending}
                      style={{
                        flex: 1,
                        padding: "12px 20px",
                        fontSize: "13px",
                        backgroundColor: "#FEA55F",
                        color: "#011627",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: upsertSocialLinkMutation.isPending
                          ? "not-allowed"
                          : "pointer",
                        opacity: upsertSocialLinkMutation.isPending ? 0.5 : 1,
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!upsertSocialLinkMutation.isPending) {
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {editingSocialId ? "Update Link" : "Add Link"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelSocialForm}
                      style={{
                        flex: 1,
                        padding: "12px 20px",
                        fontSize: "13px",
                        backgroundColor: "transparent",
                        border: "1px solid rgba(30, 45, 61, 0.8)",
                        borderRadius: "8px",
                        color: "#607B96",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.color = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#607B96";
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Links List */}
          {socialLinksQuery.data && socialLinksQuery.data.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "16px",
              }}
            >
              {socialLinksQuery.data.map((link) => (
                <div
                  key={link.id}
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(77, 91, 206, 0.2)",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(77, 91, 206, 0.5)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(77, 91, 206, 0.2)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.3)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#FFFFFF",
                        margin: "0",
                        flex: 1,
                      }}
                    >
                      {link.platform}
                    </h3>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={(e) => handleEditSocialLink(e, link)}
                        style={{
                          padding: "6px 10px",
                          backgroundColor: "transparent",
                          border: "1px solid rgba(77, 91, 206, 0.3)",
                          borderRadius: "6px",
                          color: "#4D5BCE",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(77, 91, 206, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSocialLink(e, link.id)}
                        style={{
                          padding: "6px 10px",
                          backgroundColor: "transparent",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          borderRadius: "6px",
                          color: "#ef4444",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(239, 68, 68, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#4D5BCE",
                      fontSize: "12px",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "color 0.3s ease",
                      wordBreak: "break-all",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#43D9AD";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#4D5BCE";
                    }}
                  >
                    {link.url.replace(/^https?:\/\//, "")}
                    <ExternalLink size={12} />
                  </a>

                  {link.iconId && (
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#607B96",
                        fontFamily: "monospace",
                      }}
                    >
                      Icon: {link.iconId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "32px 24px",
                color: "#607B96",
                fontSize: "14px",
              }}
            >
              No social links added yet. Click "Add Link" to get started.
            </div>
          )}
        </section>

        {/* Narrative Card */}
        <section
          style={{
            backgroundColor: "rgba(1, 18, 33, 0.5)",
            border: "1px solid rgba(30, 45, 61, 0.6)",
            borderRadius: "20px",
            padding: "32px 40px",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <div
            style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
          >
            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(233, 146, 135, 0.1)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText color="#E99287" size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  margin: "0",
                }}
              >
                Narrative & Bio
              </h2>
              <p
                style={{
                  fontSize: "11px",
                  color: "#607B96",
                  marginTop: "4px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  margin: "4px 0 0 0",
                }}
              >
                Deep profile synchronization
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            <TextAreaField
              label="Professional Bio"
              rows={8}
              value={formData.bio}
              onChange={(v) => setFormData({ ...formData, bio: v })}
            />

            <TextAreaField
              label="Interests & Passions"
              rows={8}
              value={formData.interests}
              onChange={(v) => setFormData({ ...formData, interests: v })}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
