"use client";
import React, { useState, lazy, Suspense, useMemo } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const GitHubPanel = lazy(() => import("./GitHubPanel"));

const SPECIAL_TABS = new Set(["github-activity"]);

interface Props {
  personalInfo: {
    name: string;
    role: string[];
    bio: string[];
    interests: string[];
    email?: string;
    phone?: string;
    location?: string;
    githubLink?: string;
    linkedinLink?: string;
    twitterLink?: string;
    resumeLink?: string;
  } | null;
  education: Array<{ name: string; institution: string; year?: string; type: string }>;
  certificates: Array<{ name: string; issuer?: string; link?: string; img?: string; id: string }>;
  skillCategories: Array<{ name: string; skills: string[] }>;
}

function ContactRow({ icon, label, id, activeTab, onOpen }: any) {
  const isActive = activeTab === id;
  return (
    <div
      onClick={() => onOpen(id)}
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "6px 20px", cursor: "pointer",
        color: isActive ? "#FFFFFF" : "#607B96", fontSize: "14px",
        transition: "color 0.1s",
      }}
    >
      <span style={{ fontSize: "14px" }}>{icon}</span>
      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
    </div>
  );
}

function FileRow({ id, label, indent, activeTab, onOpen }: any) {
  const isActive = activeTab === id;
  return (
    <div
      onClick={() => onOpen(id)}
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "6px 0", paddingLeft: `${indent * 8}px`, cursor: "pointer",
        color: isActive ? "#FFFFFF" : "#607B96", fontSize: "14px",
        transition: "color 0.1s",
      }}
    >
      <span style={{ opacity: 0.5, fontSize: "12px" }}>📄</span>
      {label}
    </div>
  );
}

function FolderRow({ id, label, openFolders, onToggle, indent = 2 }: any) {
  const isOpen = openFolders[id];
  return (
    <button
      onClick={() => onToggle(id)}
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        width: "100%", padding: "8px 0", paddingLeft: `${indent * 8}px`,
        background: "none", border: "none", cursor: "pointer",
        color: isOpen ? "#FFFFFF" : "#607B96", fontSize: "14px",
        textAlign: "left", transition: "color 0.1s",
      }}
    >
      <span style={{
        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.2s", fontSize: "10px", opacity: 0.5
      }}>▶</span>
      <span style={{ fontSize: "14px" }}>{isOpen ? "📂" : "📁"}</span>
      {label}
    </button>
  );
}

export default function AboutPageContent({
  personalInfo,
  education,
  certificates,
  skillCategories,
}: Props) {
  const isMobile = useIsMobile();

  // ── Initialize dynamic content from props ───────────────────────
  const initialContent: Record<string, { label: string; lines: string[] }> = {
    bio: { label: "bio", lines: personalInfo?.bio || [] },
    interests: { label: "interests", lines: personalInfo?.interests || [] },
    email: { label: "email", lines: [`// ${personalInfo?.email || ""}`] },
    phone: { label: "phone", lines: [`// ${personalInfo?.phone || ""}`] },
    location: { label: "location", lines: [`// ${personalInfo?.location || ""}`] },
  };

  // Add education
  education.forEach((edu, idx) => {
    const key = `edu-${idx}`;
    initialContent[key] = {
      label: edu.name.toLowerCase().replace(/\s+/g, "-"),
      lines: [
        "/**",
        ` * ${edu.name}`,
        " *",
        ` * ${edu.institution}`,
        ` * Period: ${edu.year || "N/A"}`,
        " */",
      ],
    };
  });

  // Add certificates
  certificates.forEach((cert) => {
    const key = `cert-${cert.id}`;
    initialContent[key] = {
      label: cert.name.toLowerCase().replace(/\s+/g, "-"),
      lines: [
        "/**",
        ` * @name    ${cert.name}`,
        ` * @issuer  ${cert.issuer || "Not Specified"}`,
        ` * @link    ${cert.link || "N/A"}`,
        " *",
        " * Click the link below to verify this certificate.",
        " */",
        "",
        cert.link ? `// [Verify](${cert.link})` : "// No verification link available",
      ],
    };
  });

  const [openTabs, setOpenTabs] = useState<string[]>(["bio"]);
  const [activeTab, setActiveTab] = useState<string>("bio");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    "personal-info": true,
    education: true,
    certificates: false,
    contacts: false,
  });

  const toggleFolder = (k: string) => setOpenFolders((p) => ({ ...p, [k]: !p[k] }));

  const openFile = (id: string) => {
    if (!openTabs.includes(id)) setOpenTabs((p) => [...p, id]);
    setActiveTab(id);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = openTabs.filter((t) => t !== id);
    setOpenTabs(next);
    if (activeTab === id && next.length > 0) setActiveTab(next[next.length - 1]);
  };

  const activeLines =
    openTabs.length === 0 || SPECIAL_TABS.has(activeTab)
      ? []
      : initialContent[activeTab]?.lines ?? ["// (empty)"];

  const sharedRowProps = { openTabs, activeTab, onOpen: openFile };

  const sidebarTree = (
    <div style={{ flex: 1 }}>
      <FolderRow id="personal-info" label="personal-info" openFolders={openFolders} onToggle={toggleFolder} />
      {openFolders["personal-info"] && (
        <>
          <FileRow id="bio" label="bio" indent={3} {...sharedRowProps} />
          <FileRow id="interests" label="interests" indent={3} {...sharedRowProps} />
        </>
      )}

      {/* Moved Education and Certificates to root */}
      <FolderRow id="education" label="education" openFolders={openFolders} onToggle={toggleFolder} indent={2} />
      {openFolders["education"] && (
        <>
          {education.map((edu, idx) => (
            <FileRow key={`edu-${idx}`} id={`edu-${idx}`} label={edu.name.toLowerCase().replace(/\s+/g, "-")} indent={3} {...sharedRowProps} />
          ))}
        </>
      )}

      <FolderRow id="certificates" label="certificates" openFolders={openFolders} onToggle={toggleFolder} indent={2} />
      {openFolders["certificates"] && (
        <>
          {certificates.map((cert) => (
            <FileRow key={cert.id} id={`cert-${cert.id}`} label={cert.name.toLowerCase().replace(/\s+/g, "-")} indent={3} {...sharedRowProps} />
          ))}
        </>
      )}
      
      <FileRow id="github-activity" label="🐙 github-activity" indent={2} {...sharedRowProps} />

      <FolderRow id="contacts" label="contacts" openFolders={openFolders} onToggle={toggleFolder} />
      {openFolders["contacts"] && (
        <>
          <ContactRow icon="✉" label={personalInfo?.email} id="email" {...sharedRowProps} />
          <ContactRow icon="📞" label={personalInfo?.phone} id="phone" {...sharedRowProps} />
          <ContactRow icon="📍" label={personalInfo?.location} id="location" {...sharedRowProps} />
        </>
      )}
    </div>
  );

  const resumeBtn = (
    <div style={{ borderTop: "1px solid #1E2D3D", padding: "12px 16px" }}>
      <a
        href={personalInfo?.resumeLink || "#"}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          width: "100%", padding: "8px 0",
          background: "linear-gradient(135deg,rgba(67,217,173,0.15),rgba(77,91,206,0.15))",
          border: "1px solid rgba(67,217,173,0.3)", borderRadius: "6px",
          color: "#43D9AD", fontFamily: "'Fira Code', monospace", fontSize: "12px",
          textDecoration: "none", cursor: "pointer", transition: "all 0.2s",
        }}
      >
        <span>⬇</span> download-resume
      </a>
    </div>
  );

  const editorPane = (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: isMobile ? "50vh" : undefined }}>
      <div style={{
        display: "flex", alignItems: "stretch",
        borderBottom: "1px solid #1E2D3D", background: "#010C15",
        flexShrink: 0, overflowX: "auto", minHeight: "38px",
      }}>
        {openTabs.length === 0 ? (
          <span style={{ padding: "10px 16px", color: "#2B3D4F", fontFamily: "'Fira Code', monospace", fontSize: "12px", fontStyle: "italic" }}>
            {"// open a file from the sidebar"}
          </span>
        ) : (
          openTabs.map((tabId) => {
            const isActive = tabId === activeTab;
            const label = initialContent[tabId]?.label ?? tabId;
            return (
              <div
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "0 14px",
                  cursor: "pointer", borderRight: "1px solid #1E2D3D",
                  borderTop: isActive ? "1px solid #43D9AD" : "1px solid transparent",
                  borderBottom: isActive ? "1px solid #011627" : "1px solid transparent",
                  background: isActive ? "#011627" : "#010C15",
                  color: isActive ? "#FFFFFF" : "#607B96",
                  fontFamily: "'Fira Code', monospace", fontSize: "12px",
                  flexShrink: 0, transition: "color 0.15s, background 0.15s",
                  minWidth: "80px", userSelect: "none",
                }}
              >
                <span style={{ opacity: 0.5, fontSize: "11px" }}>📄</span>
                {label}
                <button
                  onClick={(e) => closeTab(e, tabId)}
                  style={{
                    background: "none", border: "none", color: "#607B96", cursor: "pointer",
                    fontSize: "14px", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>

      <div style={{ flex: 1, overflow: "auto", background: "#011627", position: "relative" }}>
        {activeTab === "github-activity" ? (
          <Suspense fallback={<div style={{ padding: "20px", color: "#607B96" }}>Loading GitHub stats...</div>}>
            <GitHubPanel />
          </Suspense>
        ) : (
          <div style={{ display: "flex", padding: "16px", minWidth: "fit-content" }}>
            <div style={{ paddingRight: "24px", textAlign: "right", color: "#2B3D4F", userSelect: "none", borderRight: "1px solid #1E2D3D", marginRight: "16px" }}>
              {activeLines.map((_, i) => (
                <div key={i} style={{ fontSize: "13px", lineHeight: "1.6", fontFamily: "'Fira Code', monospace" }}>
                  {i + 1}
                </div>
              ))}
            </div>
            <div style={{ flex: 1, color: "#607B96", fontFamily: "'Fira Code', monospace", fontSize: "13px", lineHeight: "1.6" }}>
              {activeLines.map((line, i) => (
                <div key={i} style={{ whiteSpace: "pre" }}>{line}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );

  // ── Context-Aware Terminal Cards ────────────────────────────────
  const terminalCards = useMemo(() => {
    if (activeTab === "github-activity") {
      return [
        {
          id: "git-fetch",
          title: "git-fetch.sh",
          lines: [
            { prompt: "$", cmd: " git remote update", color: "#43D9AD" },
            { prompt: ">", cmd: " fetching latest activity...", color: "#607B96" },
            { prompt: "$", cmd: " git log --oneline -n 5", color: "#43D9AD" },
            { prompt: ">", cmd: " dc26e12 build: add frontend project...", color: "#FFFFFF" },
            { prompt: ">", cmd: " a3b8d1b refactor: use prisma models...", color: "#FFFFFF" },
          ],
        }
      ];
    }

    if (activeTab.startsWith("edu-")) {
      const idx = parseInt(activeTab.split("-")[1]);
      const edu = education[idx];
      return [
        {
          id: "ls-edu",
          title: "ls-education.sh",
          lines: [
            { prompt: "$", cmd: " ls education/degrees", color: "#43D9AD" },
            { prompt: ">", cmd: ` ${edu?.name.toLowerCase().replace(/\s+/g, "_")}.pdf`, color: "#4D5BCE" },
            { prompt: "$", cmd: " cat institution.txt", color: "#43D9AD" },
            { prompt: ">", cmd: ` ${edu?.institution}`, color: "#FFFFFF" },
          ],
        }
      ];
    }

    if (activeTab.startsWith("cert-")) {
      const id = activeTab.split("-")[1];
      const cert = certificates.find(c => c.id === id);
      return [
        {
          id: "verify-cert",
          title: "verify-cert.sh",
          lines: [
            { prompt: "$", cmd: " check-validity credential.json", color: "#43D9AD" },
            { prompt: ">", cmd: " Status: VALID", color: "#27C840" },
            { prompt: "$", cmd: " cat issuer.txt", color: "#43D9AD" },
            { prompt: ">", cmd: ` ${cert?.issuer || "Verified Issuer"}`, color: "#FFFFFF" },
          ],
        }
      ];
    }

    if (["email", "phone", "location"].includes(activeTab)) {
      return [
        {
          id: "ping-net",
          title: "ping-connectivity.sh",
          lines: [
            { prompt: "$", cmd: ` ping ${activeTab}.server`, color: "#43D9AD" },
            { prompt: ">", cmd: ` 64 bytes from ${activeTab}: icmp_seq=1 ttl=56`, color: "#607B96" },
            { prompt: ">", cmd: " connection stable.", color: "#27C840" },
          ],
        }
      ];
    }

    // Default: Identity / Info
    return [
      {
        id: "whoami",
        title: "whoami.sh",
        lines: [
          { prompt: "$", cmd: " whoami", color: "#43D9AD" },
          { prompt: ">", cmd: ` ${personalInfo?.name || "Aryam Gupta"}`, color: "#FFFFFF" },
          { prompt: "$", cmd: " cat role.txt", color: "#43D9AD" },
          { prompt: ">", cmd: ` ${personalInfo?.role?.[0] || "Full Stack Developer"}`, color: "#FFFFFF" },
          { prompt: "$", cmd: " echo $LOCATION", color: "#43D9AD" },
          { prompt: ">", cmd: ` ${personalInfo?.location || "New Delhi, India 🇮🇳"}`, color: "#FFFFFF" },
        ],
      },
      {
        id: "skills",
        title: "ls-skills.sh",
        lines: [
          { prompt: "$", cmd: " ls skills/", color: "#43D9AD" },
          { 
            prompt: ">", 
            cmd: ` ${skillCategories?.[0]?.skills.slice(0, 3).map(s => s.toLowerCase() + '/').join(' ') || "react/ next.js/ node.js/"}`, 
            color: "#4D5BCE" 
          },
          { 
            prompt: " ", 
            cmd: `  ${skillCategories?.[1]?.skills.slice(0, 3).map(s => s.toLowerCase() + '/').join(' ') || "mongodb/ express/ typescript/"}`, 
            color: "#4D5BCE" 
          },
        ],
      },
    ];
  }, [activeTab, personalInfo, education, certificates, skillCategories]);

  const rightPanel = (
    <aside style={{ width: "320px", borderLeft: "1px solid #1E2D3D", overflowY: "auto", background: "#011627", display: isMobile ? "none" : "block", flexShrink: 0 }}>
      <div style={{ padding: "20px", borderBottom: "1px solid #1E2D3D", color: "#FFFFFF", fontSize: "14px", fontFamily: "'Fira Code', monospace" }}>
        {"// snippet-showcase"}
      </div>
      
      <div style={{ padding: "24px 20px" }}>
        {terminalCards.map((card) => (
          <div
            key={card.id}
            style={{
              background: "#010C15",
              border: "1px solid #1E2D3D",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
          >
            {/* Header / Mac Style Dots */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderBottom: "1px solid #1E2D3D",
                background: "#011221"
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                {["#FF5F57", "#FEBC2E", "#27C840"].map((color, i) => (
                  <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: color }} />
                ))}
              </div>
              <span style={{ color: "#607B96", fontSize: "11px", fontFamily: "'Fira Code', monospace" }}>{card.title}</span>
            </div>

            {/* Terminal Content */}
            <div style={{ padding: "16px", fontFamily: "'Fira Code', monospace", fontSize: "12px", lineHeight: "1.5" }}>
              {card.lines.map((ln, i) => (
                <div key={i} style={{ display: "flex", gap: "8px" }}>
                  <span style={{ color: "#607B96", minWidth: "12px" }}>{ln.prompt}</span>
                  <span style={{ color: ln.color }}>{ln.cmd}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#011627", overflowY: "auto" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid #1E2D3D", color: "#FFFFFF", fontSize: "14px" }}>
          _about-me
        </div>
        <div style={{ background: "#011221", borderBottom: "1px solid #1E2D3D", flexShrink: 0 }}>
          {sidebarTree}
          {resumeBtn}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: "400px" }}>
          {editorPane}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <aside style={{ width: "220px", flexShrink: 0, borderRight: "1px solid #1E2D3D", background: "#011221", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {sidebarTree}
        {resumeBtn}
      </aside>
      {editorPane}
      {rightPanel}
    </div>
  );
}
