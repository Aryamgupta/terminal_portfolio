"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, MessageSquare, LogOut, Plus, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("projects");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("admin-auth");
    if (!isAuth) {
      router.push("/admin");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    router.push("/admin");
  };

  if (!authorized) return null;

  const sidebarLinks = [
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="flex h-full bg-[#010C15]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1E2D3D] flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-3 text-white font-bold tracking-tight">
          <div className="w-8 h-8 rounded bg-[#FEA55F] flex items-center justify-center text-[#010C15]">
            <LayoutDashboard size={20} />
          </div>
          Dashboard
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-[#607B96]",
                activeTab === link.id ? "bg-[#1C2B3A] text-white font-medium" : "hover:bg-white/5"
              )}
            >
              <link.icon size={18} className={activeTab === link.id ? "text-[#FEA55F]" : ""} />
              {link.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm text-[#607B96] hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-10">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-medium text-white capitalize">{activeTab}</h1>
            <p className="text-[#607B96] text-sm font-mono mt-1">// manage your {activeTab} data</p>
          </div>
          
          {activeTab === "projects" && (
            <button className="flex items-center gap-2 px-6 py-2 bg-[#FEA55F] text-[#011627] font-bold rounded-lg hover:bg-[#FFB77F] transition-all">
              <Plus size={18} /> Add Project
            </button>
          )}
        </header>

        {/* Content Table/List Area */}
        <div className="bg-[#011221] border border-[#1E2D3D] rounded-xl overflow-hidden shadow-2xl">
           {activeTab === "projects" ? (
             <div className="p-8 text-center space-y-4 py-20">
               <FolderKanban size={48} className="mx-auto text-[#607B96] opacity-30" />
               <p className="text-[#607B96] italic font-mono">// Ready to fetch projects via tRPC...</p>
               <p className="text-white/50 text-sm">Real-time mutation logic will be integrated next.</p>
             </div>
           ) : (
             <div className="p-8 text-center space-y-4 py-20">
               <MessageSquare size={48} className="mx-auto text-[#607B96] opacity-30" />
               <p className="text-[#607B96] italic font-mono">// No messages retrieved yet.</p>
             </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
