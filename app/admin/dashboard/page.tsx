"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Projector, 
  MessageSquare, 
  Activity, 
  ArrowUpRight,
  FileCode,
  Globe,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalProjects: number;
  newMessages: number;
  siteVisits: string;
  recentActivity: Array<{ time: string, event: string, icon: string }>;
}

const DashboardPage = () => {
  const { data: session } = useSession();
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStatsData(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Total Projects", value: statsData?.totalProjects ?? "-", icon: Projector, color: "text-blue-400" },
    { label: "New Messages", value: statsData?.newMessages ?? "-", icon: MessageSquare, color: "text-green-400" },
    { label: "Site Visits", value: statsData?.siteVisits ?? "-", icon: Activity, color: "text-purple-400" },
  ];

  const quickActions = [
    { label: "Edit Projects", icon: Projector, href: "/admin/projects" },
    { label: "View Messages", icon: MessageSquare, href: "/admin/messages" },
    { label: "Edit Snippets", icon: FileCode, href: "/admin/snippets" },
    { label: "Visit Site", icon: Globe, href: "/", external: true },
  ];

  if (loading) {
    return (
      <div className="flex w-full h-full min-h-[50vh] items-center justify-center text-[#FEA55F]">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-[#607B96] text-sm font-mono mt-1">{"// welcome back, "}{session?.user?.name || "commander"}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#011221] border border-[#1E2D3D] p-6 rounded-2xl shadow-xl space-y-4 hover:border-[#FEA55F]/30 transition-all group">
            <div className="flex items-center justify-between">
               <div className={cn("p-3 rounded-xl bg-black/40", stat.color)}>
                  <stat.icon size={24} />
               </div>
               <span className="text-2xl font-bold text-white tracking-tighter">{stat.value}</span>
            </div>
            <p className="text-[#607B96] text-xs font-mono uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Activity size={18} className="text-[#FEA55F]" /> Quick Access Terminal
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => (
              <a
                key={i}
                href={action.href}
                target={action.external ? "_blank" : "_self"}
                className="bg-[#011221] border border-[#1E2D3D] p-6 rounded-2xl flex items-center justify-between hover:bg-[#1C2B3A] transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-black/20 text-[#607B96] group-hover:text-[#FEA55F] transition-colors">
                    <action.icon size={20} />
                  </div>
                  <span className="text-sm font-medium text-[#607B96] group-hover:text-white transition-colors">{action.label}</span>
                </div>
                <ArrowUpRight size={16} className="text-[#1E2D3D] group-hover:text-[#FEA55F] transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* System Activity Log */}
        <div className="bg-[#011221] border border-[#1E2D3D] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col">
           <h3 className="text-white font-semibold flex items-center justify-between mb-8">
              <span>Security Event Log</span>
              <span className="text-[10px] text-green-500 font-mono animate-pulse">LIVE</span>
           </h3>
           <div className="flex-1 border-l border-[#1E2D3D] ml-2 pl-6 space-y-6 relative">
              {statsData?.recentActivity?.map((log, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[31px] top-1 w-2 h-2 rounded-full bg-[#1E2D3D] border border-[#011221]" />
                  <p className="text-xs text-white font-medium">{log.event}</p>
                  <p className="text-[10px] text-[#607B96] font-mono mt-1 uppercase tracking-tighter">{log.time}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
