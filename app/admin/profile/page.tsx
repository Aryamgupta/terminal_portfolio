"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  User, 
  Mail, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter, 
  FileText, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const ProfilePage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    interests: "",
    githubLink: "",
    linkedinLink: "",
    twitterLink: "",
    resumeLink: "",
    role: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      if (res.ok && data) {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio?.join("\n") || "",
          interests: data.interests?.join("\n") || "",
          githubLink: data.githubLink || "",
          linkedinLink: data.linkedinLink || "",
          twitterLink: data.twitterLink || "",
          resumeLink: data.resumeLink || "",
          role: data.role?.join(", ") || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Prepare data (convert roles, bio, interests back to arrays)
      const submitData = {
        ...formData,
        role: formData.role.split(",").map(r => r.trim()).filter(Boolean),
        bio: formData.bio.split("\n").filter(Boolean),
        interests: formData.interests.split("\n").filter(Boolean),
      };

      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      
      setMessage({ type: "success", text: "Profile updated successfully! Trigger a rebuild to reflect changes publicly." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64 text-[#607B96] font-mono animate-pulse">
        {"// initializing_profile_data..."}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Identity Settings</h1>
          <p className="text-[#607B96] text-sm font-mono mt-1">// update your personal information and presence</p>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FEA55F] text-[#011627] font-bold rounded-xl hover:bg-[#FFB77F] transition-all disabled:opacity-50 shadow-glow-sm"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          SAVE CHANGES
        </button>
      </div>

      {message.text && (
        <div className={cn(
          "p-4 rounded-xl flex items-center gap-3 border animate-in zoom-in-95 duration-300",
          message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
        )}>
          {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info Section */}
        <section className="space-y-6 bg-[#011221] p-8 rounded-2xl border border-[#1E2D3D] shadow-2xl">
           <h3 className="text-white font-semibold flex items-center gap-2 mb-6">
              <User size={18} className="text-[#FEA55F]" /> Basic Information
           </h3>
           
           <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#607B96] uppercase tracking-wider ml-1">full_name</label>
                <input 
                  className="w-full bg-black/30 border border-[#1E2D3D] rounded-xl px-4 py-3 text-white focus:border-[#FEA55F] outline-none transition-all text-sm"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[#607B96] uppercase tracking-wider ml-1">professional_roles (comma separated)</label>
                <input 
                  className="w-full bg-black/30 border border-[#1E2D3D] rounded-xl px-4 py-3 text-white focus:border-[#FEA55F] outline-none transition-all text-sm"
                  placeholder="Full Stack Developer, UI/UX Designer"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[#607B96] uppercase tracking-wider ml-1">geographic_location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607B96]" />
                  <input 
                    className="w-full bg-black/30 border border-[#1E2D3D] rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#FEA55F] outline-none transition-all text-sm"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
           </div>
        </section>

        {/* Contact & Professional Section */}
        <section className="space-y-6 bg-[#011221] p-8 rounded-2xl border border-[#1E2D3D] shadow-2xl">
           <h3 className="text-white font-semibold flex items-center gap-2 mb-6">
              <ExternalLink size={18} className="text-[#FEA55F]" /> Professional Presence
           </h3>
           
           <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#607B96] uppercase tracking-wider ml-1">github_handle_url</label>
                <div className="relative">
                  <Github size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607B96]" />
                  <input 
                    className="w-full bg-black/30 border border-[#1E2D3D] rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#FEA55F] outline-none transition-all text-sm"
                    value={formData.githubLink}
                    onChange={e => setFormData({...formData, githubLink: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[#607B96] uppercase tracking-wider ml-1">linkedin_profile_url</label>
                <div className="relative">
                  <Linkedin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607B96]" />
                  <input 
                    className="w-full bg-black/30 border border-[#1E2D3D] rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#FEA55F] outline-none transition-all text-sm"
                    value={formData.linkedinLink}
                    onChange={e => setFormData({...formData, linkedinLink: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[#607B96] uppercase tracking-wider ml-1">resume_document_link</label>
                <div className="relative">
                  <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607B96]" />
                  <input 
                    className="w-full bg-black/30 border border-[#1E2D3D] rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#FEA55F] outline-none transition-all text-sm"
                    value={formData.resumeLink}
                    onChange={e => setFormData({...formData, resumeLink: e.target.value})}
                  />
                </div>
              </div>
           </div>
        </section>

        {/* Narrative Section */}
        <section className="md:col-span-2 space-y-6 bg-[#011221] p-8 rounded-2xl border border-[#1E2D3D] shadow-2xl">
           <h3 className="text-white font-semibold flex items-center gap-2 mb-6">
              <FileText size={18} className="text-[#FEA55F]" /> Narrative & Bio
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#607B96] uppercase tracking-wider ml-1">professional_bio (line by line)</label>
                <textarea 
                  rows={8}
                  className="w-full bg-black/30 border border-[#1E2D3D] rounded-xl px-4 py-4 text-white focus:border-[#FEA55F] outline-none transition-all text-sm font-mono custom-scrollbar resize-none"
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[#607B96] uppercase tracking-wider ml-1">interests_&_passions</label>
                <textarea 
                  rows={8}
                  className="w-full bg-black/30 border border-[#1E2D3D] rounded-xl px-4 py-4 text-white focus:border-[#FEA55F] outline-none transition-all text-sm font-mono custom-scrollbar resize-none"
                  value={formData.interests}
                  onChange={e => setFormData({...formData, interests: e.target.value})}
                />
              </div>
           </div>
        </section>
      </form>
    </div>
  );
};

export default ProfilePage;
