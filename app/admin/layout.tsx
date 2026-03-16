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
  X,
  PlusCircle,
  MessageSquare,
  GraduationCap,
  Award,
  Terminal,
  Cpu,
  LucideProps,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarLink {
  id: string;
  label: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  href: string;
}

const SidebarContent = ({
  isSidebarOpen,
  pathname,
  router,
  sidebarLinks,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  pathname: string;
  router: ReturnType<typeof useRouter>;
  sidebarLinks: SidebarLink[];
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  return (
    <>
      {/* Sidebar Header */}
      <div
        style={{
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -20 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "44px",
              height: "44px",
              borderRadius: "18px",
              backgroundColor: "#011221",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FEA55F",
              flexShrink: 0,
              boxShadow: "0 0 20px rgba(254, 165, 95, 0.1)",
            }}
          >
            <ShieldCheck size={26} />
          </div>

          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  color: "#FFFFFF",
                  fontWeight: 900,
                  fontSize: "18px",
                  letterSpacing: "-0.5px",
                }}
              >
                Admin <span style={{ color: "#FEA55F" }}>OS</span>
              </span>
              <span
                style={{
                  fontSize: "9px",
                  fontFamily: "monospace",
                  color: "#607B96",
                  textTransform: "uppercase",
                  letterSpacing: "0.3em",
                  marginTop: "4px",
                }}
              >
                Root Access
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation Links */}
      <nav
        style={{
          flex: 1,
          paddingLeft: "16px",
          paddingRight: "16px",
          marginTop: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          overflowY: "auto",
        }}
      >
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <button
              key={link.id}
              onClick={() => {
                router.push(link.href);
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "16px",
                fontSize: "13px",
                fontWeight: 700,
                transition: "all 0.3s ease",
                border: "none",
                outline: "none",
                cursor: "pointer",
                position: "relative",
                backgroundColor: isActive
                  ? "rgba(254, 165, 95, 0.05)"
                  : "transparent",
                color: isActive ? "#FFFFFF" : "#607B96",
                boxShadow: isActive
                  ? "0 0 20px rgba(254, 165, 95, 0.05)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "#FFFFFF";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.03)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "#607B96";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {/* Icon */}
              <Icon
                size={20}
                style={{
                  flexShrink: 0,
                  color: isActive ? "#FEA55F" : "inherit",
                  transition: "all 0.3s ease",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                  filter: isActive
                    ? "drop-shadow(0 0 8px rgba(254, 165, 95, 0.5))"
                    : "none",
                }}
              />

              {/* Label */}
              {isSidebarOpen && (
                <span
                  style={{
                    whiteSpace: "nowrap",
                    zIndex: 10,
                  }}
                >
                  {link.label}
                </span>
              )}

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  style={{
                    position: "absolute",
                    left: 0,
                    width: "4px",
                    height: "24px",
                    backgroundColor: "#FEA55F",
                    borderRadius: "0 8px 8px 0",
                    boxShadow: "0 0 15px rgba(254, 165, 95, 0.8)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Chevron for Active */}
              {isActive && isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    marginLeft: "auto",
                    zIndex: 10,
                  }}
                >
                  <ChevronRight size={14} color="#FEA55F" />
                </motion.div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div
        style={{
          padding: "16px",
          marginTop: "auto",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          backgroundColor: "rgba(1, 18, 33, 0.2)",
        }}
      >
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 14px",
            borderRadius: "16px",
            fontSize: "13px",
            fontWeight: 900,
            color: "#607B96",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            justifyContent: isSidebarOpen ? "flex-start" : "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.1)";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#607B96";
          }}
        >
          <LogOut size={20} style={{ flexShrink: 0 }} />
          {isSidebarOpen && <span>SIGNOUT_SESSION</span>}
        </button>
      </div>
    </>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    if (
      status === "unauthenticated" &&
      pathname !== "/admin/login" &&
      pathname !== "/admin/verify-2fa"
    ) {
      router.push("/admin/login");
    } else if (
      status === "authenticated" &&
      (pathname === "/admin/login" || pathname === "/admin/verify-2fa")
    ) {
      router.push("/admin/dashboard");
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#01080E",
          color: "#FEA55F",
        }}
      >
        <div style={{ position: "relative" }}>
          <RefreshCw
            style={{
              animation: "spin 2s linear infinite",
              opacity: 0.2,
            }}
            size={64}
          />
          <RefreshCw
            style={{
              position: "absolute",
              inset: 0,
              animation: "spin 2s linear infinite reverse",
            }}
            size={64}
          />
        </div>
      </div>
    );
  }

  const sidebarLinks: SidebarLink[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      id: "projects",
      label: "Projects",
      icon: PlusCircle,
      href: "/admin/projects",
    },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
      href: "/admin/education",
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: Award,
      href: "/admin/certifications",
    },
    { id: "skills", label: "Skills", icon: Terminal, href: "/admin/skills" },
    {
      id: "tech-icons",
      label: "TechIcons",
      icon: Cpu,
      href: "/admin/tech-icons",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      href: "/admin/messages",
    },
    { id: "profile", label: "Profile", icon: User, href: "/admin/profile" },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  const isLoginPage =
    pathname === "/admin/login" || pathname === "/admin/verify-2fa";

  if (isLoginPage) return <>{children}</>;

  const sidebarWidth = isSidebarOpen ? "18rem" : "6rem";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#01080E",
        color: "#607B96",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: "none",
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(12px)",
              zIndex: 40,
            }}
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: sidebarWidth,
          backgroundColor: "rgba(1, 18, 33, 0.7)",
          backdropFilter: "blur(16px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          height: "100vh",
          overflow: "hidden",
          transition: "all 0.5s ease",
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <SidebarContent
          isSidebarOpen={isSidebarOpen}
          pathname={pathname}
          router={router}
          sidebarLinks={sidebarLinks}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </aside>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
          backgroundColor: "#01080E",
          position: "relative",
          transition: "all 0.5s ease",
          marginLeft:
            typeof window !== "undefined" && window.innerWidth >= 768
              ? sidebarWidth
              : "0",
        }}
      >
        {/* Header */}
        <header
          style={{
            height: "64px",
            backgroundColor: "rgba(1, 8, 14, 0.8)",
            backdropFilter: "blur(32px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "24px",
            paddingRight: "40px",
            zIndex: 30,
            flexShrink: 0,
          }}
        >
          {/* Left Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                padding: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
                color: "#FEA55F",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.05)";
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSidebarOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>

            <div
              style={{
                display: "none",
                flexDirection: "column",
                minWidth: 0,
              }}
              className="sidebar-title"
            >
              <h2
                style={{
                  fontSize: "8px",
                  fontFamily: "monospace",
                  color: "rgba(254, 165, 95, 0.6)",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  margin: 0,
                }}
              >
                System Node
              </h2>
              <span
                style={{
                  color: "#FFFFFF",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: "bold",
                  fontSize: "16px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: 0,
                }}
              >
                <span style={{ opacity: 0.4, fontWeight: 300 }}>/</span>
                {pathname.split("/").pop() || "dashboard"}
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
            className="sidebar-user"
              style={{
                display: "none",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  letterSpacing: "-0.5px",
                }}
              >
                {session?.user?.name || "Aryam Gupta"}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  color: "#43D9AD",
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  backgroundColor: "rgba(67, 217, 173, 0.05)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid rgba(67, 217, 173, 0.1)",
                  marginTop: "4px",
                }}
              >
                Administrator
              </span>
            </div>

            <div
              style={{
                position: "relative",
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#1C2B3A",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: "14px",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                AG
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "#01080E",
            position: "relative",
          }}
        >
          <div
            style={{
              padding: "24px 24px",
            }}
          >
            <div
              style={{
                maxWidth: "1280px",
                marginLeft: "auto",
                marginRight: "auto",
                width: "100%",
              }}
            >
              {children}
            </div>
          </div>

          {/* Background Gradients */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "500px",
              height: "500px",
              backgroundColor: "rgba(254, 165, 95, 0.05)",
              borderRadius: "50%",
              filter: "blur(120px)",
              pointerEvents: "none",
              zIndex: -10,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "500px",
              height: "500px",
              backgroundColor: "rgba(77, 91, 206, 0.05)",
              borderRadius: "50%",
              filter: "blur(120px)",
              pointerEvents: "none",
              zIndex: -10,
            }}
          />
        </main>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        *::-webkit-scrollbar-thumb {
          background: #1E2D3D;
          border-radius: 4px;
        }
        *::-webkit-scrollbar-thumb:hover {
          background: #2B3D4F;
        }
      `}</style>
    </div>
  );
}
