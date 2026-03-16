"use client";

import { useEffect, useState } from "react";
import {
  User,
  Github,
  FileText,
} from "lucide-react";

import InputField from "@/components/UI/InputField";
import TextAreaField from "@/components/UI/TextAreaField";
import Button from "@/components/UI/Button";
import { trpc } from "@/utils/trpc";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  
  const profileQuery = trpc.personalInfo.get.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  
  const updateMutation = trpc.personalInfo.update.useMutation({
    onSuccess: () => {
      setLoading(false);
      profileQuery.refetch();
    },
    onError: (err) => {
      setLoading(false);
      console.error("Failed to update profile", err);
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    location: "",
    githubLink: "",
    linkedinLink: "",
    twitterLink: "",
    resumeLink: "",
    bio: "",
    interests: "",
  });

  useEffect(() => {
    if (profileQuery.data) {
      const data = profileQuery.data;
      setFormData(prev => {
        const newData = {
          name: data.name || "",
          role: data.role?.join(", ") || "",
          location: data.location || "",
          githubLink: data.githubLink || "",
          linkedinLink: data.linkedinLink || "",
          twitterLink: data.twitterLink || "",
          resumeLink: data.resumeLink || "",
          bio: data.bio?.join("\n") || "",
          interests: data.interests?.join("\n") || "",
        };
        // Simple optimization to prevent infinite loops (though [profileQuery.data] handles most)
        if (JSON.stringify(prev) === JSON.stringify(newData)) return prev;
        return newData;
      });
    }
  }, [profileQuery.data]);

  const handleSubmit = async () => {
    setLoading(true);

    const submitData = {
      name: formData.name,
      role: formData.role.split(",").map(r => r.trim()).filter(Boolean),
      bio: formData.bio.split("\n").filter(Boolean),
      interests: formData.interests.split("\n").filter(Boolean),
      location: formData.location,
      githubLink: formData.githubLink,
      linkedinLink: formData.linkedinLink,
      twitterLink: formData.twitterLink,
      resumeLink: formData.resumeLink,
      email: profileQuery.data?.email || null, // Preserve email if not in form
      phone: profileQuery.data?.phone || null,
    };

    updateMutation.mutate(submitData);
  };

  if (profileQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px] text-[#607B96]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Page Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Identity <span className="text-[#FEA55F]">Manifest</span>
          </h1>
          <p className="text-[#607B96] font-mono text-xs md:text-sm mt-2">
            {"// synchronize your professional core data"}
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto" style={{padding:'10px',maxWidth:'400px',gap:"20px"}}>
          <Button
            className="flex-1 sm:flex-none bg-transparent border border-[#1E2D3D] text-[#607B96] hover:bg-white/5 text-sm"
            onClick={() => profileQuery.refetch()}
          >
            Reset
          </Button>
          <Button
            loading={loading}
            onClick={handleSubmit}
            className="flex-1 sm:flex-none text-sm"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Form Sections */}
      <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {/* Core Information Card */}
        <section style={{padding:'20px'}} className="bg-[#011221]/50 border border-[#1E2D3D] rounded-2xl p-8 md:p-10 backdrop-blur-sm shadow-xl">
          <div className="flex items-start gap-3 mb-10">
            <div className="p-3 bg-[#FEA55F]/10 rounded-lg flex-shrink-0 mt-0.5">
              <User className="text-[#FEA55F]" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white">Core Information</h2>
              <p className="text-xs text-[#607B96] mt-1 tracking-wide uppercase">
                Primary identification parameters
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            <div className="flex-1 min-w-[260px]">
              <InputField
                label="Full Name"
                placeholder="e.g. Aryam Gupta"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
              />
            </div>

            <div className="flex-1 min-w-[260px]">
              <InputField
                label="Professional Role"
                placeholder="e.g. Full Stack Developer, UI Designer"
                value={formData.role}
                onChange={(v) => setFormData({ ...formData, role: v })}
              />
            </div>

            <div className="w-full">
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
        <section style={{padding:'20px'}}  className="bg-[#011221]/50 border border-[#1E2D3D] rounded-2xl p-8 md:p-10 backdrop-blur-sm shadow-xl">
          <div className="flex items-start gap-3 mb-10">
            <div className="p-3 bg-[#43D9AD]/10 rounded-lg flex-shrink-0 mt-0.5">
              <Github className="text-[#43D9AD]" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white">Global Presence</h2>
              <p className="text-xs text-[#607B96] mt-1 tracking-wide uppercase">
                External link synchronization
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            <div className="flex-1 min-w-[260px]">
              <InputField
                label="Github Handle"
                placeholder="github.com/aryam-gupta"
                value={formData.githubLink}
                onChange={(v) => setFormData({ ...formData, githubLink: v })}
              />
            </div>

            <div className="flex-1 min-w-[260px]">
              <InputField
                label="LinkedIn Profile"
                placeholder="linkedin.com/in/aryam-gupta"
                value={formData.linkedinLink}
                onChange={(v) => setFormData({ ...formData, linkedinLink: v })}
              />
            </div>

            <div className="flex-1 min-w-[260px]">
              <InputField
                label="Twitter / X"
                placeholder="twitter.com/aryam_gupta"
                value={formData.twitterLink}
                onChange={(v) => setFormData({ ...formData, twitterLink: v })}
              />
            </div>

            <div className="flex-1 min-w-[260px]">
              <InputField
                label="Resume Link"
                placeholder="gdrive.com/resume.pdf"
                value={formData.resumeLink}
                onChange={(v) => setFormData({ ...formData, resumeLink: v })}
              />
            </div>
          </div>
        </section>

        {/* Narrative Card */}
        <section style={{padding:'20px'}}  className="bg-[#011221]/50 border border-[#1E2D3D] rounded-2xl p-8 md:p-10 backdrop-blur-sm shadow-xl">
          <div className="flex items-start gap-3 mb-10">
            <div className="p-3 bg-[#E99287]/10 rounded-lg flex-shrink-0 mt-0.5">
              <FileText className="text-[#E99287]" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white">Narrative & Bio</h2>
              <p className="text-xs text-[#607B96] mt-1 tracking-wide uppercase">
                Deep profile synchronization
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            <div className="flex-1 min-w-[300px]">
              <TextAreaField
                label="Professional Bio"
                rows={8}
                value={formData.bio}
                onChange={(v) => setFormData({ ...formData, bio: v })}
              />
            </div>

            <div className="flex-1 min-w-[300px]">
              <TextAreaField
                label="Interests & Passions"
                rows={8}
                value={formData.interests}
                onChange={(v) => setFormData({ ...formData, interests: v })}
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
