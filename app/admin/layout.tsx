"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  RefreshCw, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  // Protection logic: ensure user is logged in for protected routes
  React.useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login" && pathname !== "/admin/verify-2fa") {
      router.push("/admin/login");
    } else if (status === "authenticated" && (pathname === "/admin/login" || pathname === "/admin/verify-2fa")) {
      router.push("/admin/dashboard");
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#010C15] text-[#FEA55F]">
        <RefreshCw className="animate-spin" size={48} />
      </div>
    );
  }

  const sidebarLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { id: "profile", label: "Profile", icon: User, href: "/admin/profile" },
    { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/verify-2fa";

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex h-screen bg-[#01080E] text-[#607B96] font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Dynamic Sidebar */}
      <aside className={cn(
        "bg-[#011221] border-r border-[#1E2D3D] transition-all duration-300 flex flex-col absolute md:static z-50 h-full",
        isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-[#1E2D3D]">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#FEA55F] flex items-center justify-center text-[#010C15] shrink-0">
                <ShieldCheck size={20} />
              </div>
              <span className="text-white font-bold tracking-tight whitespace-nowrap">Admin OS</span>
            </div>
          ) : (
            <ShieldCheck size={28} className="mx-auto text-[#FEA55F] shrink-0" />
          )}
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <button
                key={link.id}
                onClick={() => {
                  router.push(link.href);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all relative group",
                  isActive ? "bg-[#1C2B3A] text-white" : "hover:bg-white/5 text-[#607B96]"
                )}
              >
                <link.icon size={20} className={cn("shrink-0", isActive ? "text-[#FEA55F]" : "group-hover:text-white")} />
                {isSidebarOpen && <span className="whitespace-nowrap">{link.label}</span>}
                {isActive && (
                   <div className="absolute left-0 w-1 h-6 bg-[#FEA55F] rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1E2D3D]">
           <button
             onClick={() => signOut({ callbackUrl: "/admin/login" })}
             className={cn(
               "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#607B96] hover:bg-red-500/10 hover:text-red-400 transition-all",
               !isSidebarOpen && "justify-center"
             )}
           >
             <LogOut size={20} className="shrink-0" />
             {isSidebarOpen && <span>Logout</span>}
           </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 border-b border-[#1E2D3D] bg-[#011221]/50 backdrop-blur-xl flex items-center justify-between px-4 md:px-8">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-[#607B96]">
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h2 className="text-sm font-mono text-[#FEA55F] truncate max-w-[150px] md:max-w-xs">
                {"// root > admin > "}{pathname.split("/").pop()}
              </h2>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-xs text-white font-medium">{session?.user?.name || "Admin User"}</span>
                <span className="text-[10px] text-[#607B96] uppercase tracking-widest">Super Admin</span>
              </div>
              <div className="w-10 h-10 shrink-0 rounded-full border border-[#FEA55F]/30 p-1">
                <div className="w-full h-full rounded-full bg-[#1C2B3A] flex items-center justify-center text-white text-xs font-bold font-mono">
                  AG
                </div>
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#01080E] custom-scrollbar">
           {children}
        </main>
      </div>
    </div>
  );
}
