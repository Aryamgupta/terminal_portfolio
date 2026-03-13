"use client";

import React, { useState, lazy, Suspense } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const GitHubPanel = lazy(() => import("./GitHubPanel"));

/* Tabs that render a custom panel instead of line-numbered text */
const SPECIAL_TABS = new Set(["github-activity"]);

interface Props {
  personalInfo: { personalInfo?: string; aboutMe?: string } | null;
  education: Array<{ degree: string; institution: string; year?: string }>;
  certificates: Array<{ name: string; issuer?: string; year?: string }>;
  technologies: string[];
}

/* ── File content registry ─────────────────────────────────────── */
const FILE_CONTENT: Record<string, { label: string; lines: string[] }> = {
  bio: {
    label: "bio",
    lines: [
      "/**",
      " * About me",
      " *",
      " * I am a full-stack developer with a passion for",
      " * building beautiful and performant web apps.",
      " * I have hands-on experience with modern JavaScript",
      " * frameworks, RESTful APIs, and NoSQL databases.",
      " *",
      " * I love clean code, thoughtful architecture, and",
      " * turning complex problems into elegant solutions.",
      " * When I'm not coding, I'm exploring open-source,",
      " * gaming, or learning something new.",
      " */",
    ],
  },
  interests: {
    label: "interests",
    lines: [
      "/**",
      " * Interests",
      " *",
      " * - Full-stack web development",
      " * - Open-source contribution",
      " * - CLI tooling & automation",
      " * - AI / ML integrations",
      " * - Gaming & indie dev",
      " */",
    ],
  },
  "high-school": {
    label: "high-school",
    lines: [
      "/**",
      " * High School",
      " *",
      " * Completed secondary education with focus on",
      " * Mathematics, Physics, and Computer Science.",
      " */",
    ],
  },
  university: {
    label: "university",
    lines: [
      "/**",
      " * University",
      " *",
      " * B.Tech — Computer Science & Engineering.",
      " * Worked on web development, data structures,",
      " * algorithms, and operating systems.",
      " */",
    ],
  },
  email: {
    label: "email",
    lines: ["// aryamgupta8750@gmail.com"],
  },
  phone: {
    label: "phone",
    lines: ["// +91 8750XXXXXX"],
  },
  "github-activity": {
    label: "github-activity",
    lines: [], // rendered by GitHubPanel
  },
  "job-1": {
    label: "frontend-intern",
    lines: [
      "/**",
      " * @role    Frontend Developer Intern",
      " * @company XYZ Tech Solutions",
      " * @period  Jun 2023 — Sep 2023  (4 months)",
      " * @type    Internship · Remote",
      " *",
      " * Responsibilities:",
      " *  - Built responsive UI components with React.js",
      " *    and Tailwind CSS",
      " *  - Integrated REST APIs and handled async state",
      " *    with React Query",
      " *  - Collaborated with the backend team to design",
      " *    API contracts",
      " *  - Reduced page load time by 30% through code",
      " *    splitting and lazy loading",
      " *",
      " * Tech: React · Tailwind · REST · Git",
      " */",
    ],
  },
  "job-2": {
    label: "fullstack-dev",
    lines: [
      "/**",
      " * @role    Full Stack Developer",
      " * @company Freelance / Contract",
      " * @period  Oct 2023 — Present",
      " * @type    Contract · Remote",
      " *",
      " * Responsibilities:",
      " *  - Designed and built full-stack web apps using",
      " *    Next.js, Node.js, and MongoDB",
      " *  - Implemented auth systems (JWT, sessions)",
      " *  - Managed deployments on Vercel & Railway",
      " *  - Worked directly with clients to gather",
      " *    requirements and iterate on feedback",
      " *",
      " * Tech: Next.js · Node · MongoDB · Vercel",
      " */",
    ],
  },
};

const TERMINAL_CARDS = [
  {
    id: "whoami",
    title: "whoami.sh",
    lines: [
      { prompt: "$", cmd: " whoami", color: "#43D9AD" },
      { prompt: ">", cmd: " Aryam Gupta", color: "#FFFFFF" },
      { prompt: "$", cmd: " cat role.txt", color: "#43D9AD" },
      { prompt: ">", cmd: " Full Stack Developer", color: "#FFFFFF" },
      { prompt: "$", cmd: " echo $LOCATION", color: "#43D9AD" },
      { prompt: ">", cmd: " New Delhi, India 🇮🇳", color: "#FFFFFF" },
    ],
  },
  {
    id: "skills",
    title: "ls-skills.sh",
    lines: [
      { prompt: "$", cmd: " ls skills/", color: "#43D9AD" },
      { prompt: ">", cmd: " react/ next.js/ node.js/", color: "#4D5BCE" },
      { prompt: " ", cmd: "  mongodb/ express/ typescript/", color: "#4D5BCE" },
      { prompt: " ", cmd: "  tailwind/ git/ restapi/", color: "#4D5BCE" },
      { prompt: "$", cmd: " ls currently-learning/", color: "#43D9AD" },
      { prompt: ">", cmd: " tRPC/ Prisma/", color: "#FEA55F" },
    ],
  },
];

/* ── Sub-components (declared outside to fix lint) ─────────────── */
function FolderRow({
  id,
  openFolders,
  onToggle,
  label,
}: {
  id: string;
  openFolders: Record<string, boolean>;
  onToggle: (k: string) => void;
  label: string;
}) {
  return (
    <button
      onClick={() => onToggle(id)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "9px 16px",
        background: "none",
        border: "none",
        color: "#FFFFFF",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "13px",
        fontFamily: "'Fira Code', monospace",
      }}
    >
      <span style={{ fontSize: "9px", color: "#607B96" }}>
        {openFolders[id] ? "▼" : "▶"}
      </span>
      <span style={{ marginRight: "4px" }}>
        {openFolders[id] ? "📂" : "📁"}
      </span>
      {label}
    </button>
  );
}

function FileRow({
  id,
  label,
  indent = 2,
  openTabs,
  activeTab,
  onOpen,
}: {
  id: string;
  label: string;
  indent?: number;
  openTabs: string[];
  activeTab: string;
  onOpen: (id: string) => void;
}) {
  const isOpen = openTabs.includes(id);
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => onOpen(id)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: `7px 16px 7px ${indent * 14}px`,
        background: isActive
          ? "rgba(67,217,173,0.07)"
          : isOpen
          ? "rgba(255,255,255,0.02)"
          : "none",
        border: "none",
        borderLeft: isActive ? "2px solid #43D9AD" : "2px solid transparent",
        color: isActive ? "#FFFFFF" : isOpen ? "#C8D3E0" : "#607B96",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "12px",
        fontFamily: "'Fira Code', monospace",
        transition: "all 0.15s",
      }}
    >
      <span style={{ opacity: 0.6, fontSize: "12px" }}>📄</span>
      {label}
    </button>
  );
}

function ContactRow({
  icon,
  label,
  id,
  openTabs,
  activeTab,
  onOpen,
}: {
  icon: string;
  label: string;
  id: string;
  openTabs: string[];
  activeTab: string;
  onOpen: (id: string) => void;
}) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => onOpen(id)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "7px 16px 7px 28px",
        background: isActive ? "rgba(67,217,173,0.07)" : "none",
        border: "none",
        borderLeft: isActive ? "2px solid #43D9AD" : "2px solid transparent",
        color: isActive ? "#FFFFFF" : openTabs.includes(id) ? "#C8D3E0" : "#607B96",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "12px",
        fontFamily: "'Fira Code', monospace",
        transition: "all 0.15s",
      }}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

/* ── Main component ────────────────────────────────────────────── */
export default function AboutPageContent({ technologies }: Props) {
  const isMobile = useIsMobile();
  const [openTabs, setOpenTabs] = useState<string[]>(["bio"]);
  const [activeTab, setActiveTab] = useState<string>("bio");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    "personal-info": true,
    education: true,
    contacts: false,
    "professional-experience": false,
  });

  const toggleFolder = (k: string) =>
    setOpenFolders((p) => ({ ...p, [k]: !p[k] }));

  const openFile = (id: string) => {
    if (!openTabs.includes(id)) setOpenTabs((p) => [...p, id]);
    setActiveTab(id);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const idx = openTabs.indexOf(id);
    const next = openTabs.filter((t) => t !== id);
    setOpenTabs(next);
    if (activeTab === id && next.length > 0)
      setActiveTab(next[Math.max(0, idx - 1)]);
  };

  const activeLines =
    openTabs.length === 0 || SPECIAL_TABS.has(activeTab)
      ? []
      : FILE_CONTENT[activeTab]?.lines ?? ["// (empty)"];

  const sharedRowProps = { openTabs, activeTab, onOpen: openFile };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside
        style={{
          width: "220px",
          flexShrink: 0,
          borderRight: "1px solid #1E2D3D",
          background: "#011221",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1 }}>
          {/* personal-info */}
          <FolderRow id="personal-info" label="personal-info" openFolders={openFolders} onToggle={toggleFolder} />
          {openFolders["personal-info"] && (
            <>
              <FileRow id="bio" label="bio" indent={3} {...sharedRowProps} />
              <FileRow id="interests" label="interests" indent={3} {...sharedRowProps} />
              <FolderRow id="education" label="education" openFolders={openFolders} onToggle={toggleFolder} />
              {openFolders["education"] && (
                <>
                  <FileRow id="high-school" label="high-school" indent={4} {...sharedRowProps} />
                  <FileRow id="university" label="university" indent={4} {...sharedRowProps} />
                </>
              )}
            </>
          )}

          {/* github-activity — special panel */}
          <FileRow
            id="github-activity"
            label="🐙 github-activity"
            indent={2}
            {...sharedRowProps}
          />

          {/* professional-experience */}
          <FolderRow id="professional-experience" label="professional-experience" openFolders={openFolders} onToggle={toggleFolder} />
          {openFolders["professional-experience"] && (
            <>
              <FileRow id="job-1" label="frontend-intern" indent={3} {...sharedRowProps} />
              <FileRow id="job-2" label="fullstack-dev" indent={3} {...sharedRowProps} />
            </>
          )}

          {/* contacts */}
          <FolderRow id="contacts" label="contacts" openFolders={openFolders} onToggle={toggleFolder} />
          {openFolders["contacts"] && (
            <>
              <ContactRow icon="✉" label="aryamgupta8750@gmail.com" id="email" {...sharedRowProps} />
              <ContactRow icon="📞" label="+91 8750XXXXXX" id="phone" {...sharedRowProps} />
            </>
          )}
        </div>

        {/* ── Pinned: Download Resume ───────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid #1E2D3D",
            padding: "14px 16px",
            flexShrink: 0,
          }}
        >
          <a
            href="/resume.pdf"
            download="Aryam_Gupta_Resume.pdf"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              padding: "8px 0",
              background: "linear-gradient(135deg,rgba(67,217,173,0.15),rgba(77,91,206,0.15))",
              border: "1px solid rgba(67,217,173,0.3)",
              borderRadius: "6px",
              color: "#43D9AD",
              fontFamily: "'Fira Code', monospace",
              fontSize: "12px",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background =
                "linear-gradient(135deg,rgba(67,217,173,0.25),rgba(77,91,206,0.25))";
              el.style.borderColor = "rgba(67,217,173,0.6)";
              el.style.boxShadow = "0 0 12px rgba(67,217,173,0.2)";
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background =
                "linear-gradient(135deg,rgba(67,217,173,0.15),rgba(77,91,206,0.15))";
              el.style.borderColor = "rgba(67,217,173,0.3)";
              el.style.boxShadow = "none";
            }}
          >
            <span>⬇</span> download-resume
          </a>
          <p
            style={{
              color: "#2B3D4F",
              fontSize: "10px",
              fontFamily: "'Fira Code', monospace",
              textAlign: "center",
              marginTop: "6px",
            }}
          >
            {"// place resume.pdf in /public"}
          </p>
        </div>
      </aside>

      {/* ── Editor ───────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            borderBottom: "1px solid #1E2D3D",
            background: "#010C15",
            flexShrink: 0,
            overflowX: "auto",
            minHeight: "38px",
          }}
        >
          {openTabs.length === 0 ? (
            <span
              style={{
                padding: "10px 16px",
                color: "#2B3D4F",
                fontFamily: "'Fira Code', monospace",
                fontSize: "12px",
                fontStyle: "italic",
              }}
            >
              {"// open a file from the sidebar"}
            </span>
          ) : (
            openTabs.map((tabId) => {
              const isActive = tabId === activeTab;
              const label = FILE_CONTENT[tabId]?.label ?? tabId;
              return (
                <div
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0 14px",
                    cursor: "pointer",
                    borderRight: "1px solid #1E2D3D",
                    borderTop: isActive ? "1px solid #43D9AD" : "1px solid transparent",
                    borderBottom: isActive ? "1px solid #011627" : "1px solid transparent",
                    background: isActive ? "#011627" : "#010C15",
                    color: isActive ? "#FFFFFF" : "#607B96",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "12px",
                    flexShrink: 0,
                    transition: "color 0.15s, background 0.15s",
                    minWidth: "90px",
                    userSelect: "none",
                  }}
                  onMouseOver={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                  }}
                  onMouseOut={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.color = "#607B96";
                  }}
                >
                  <span style={{ opacity: 0.5, fontSize: "11px" }}>📄</span>
                  {label}
                  <button
                    onClick={(e) => closeTab(e, tabId)}
                    style={{
                      marginLeft: "4px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "3px",
                      border: "none",
                      background: "transparent",
                      color: "#607B96",
                      fontSize: "13px",
                      lineHeight: 1,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      flexShrink: 0,
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseOver={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(255,255,255,0.1)";
                      el.style.color = "#FFFFFF";
                    }}
                    onMouseOut={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "transparent";
                      el.style.color = "#607B96";
                    }}
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Content area: special panels OR line-numbered text */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {openTabs.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2B3D4F",
                fontFamily: "'Fira Code', monospace",
                fontSize: "13px",
              }}
            >
              {"// Select a file from the sidebar"}
            </div>
          ) : SPECIAL_TABS.has(activeTab) ? (
            /* ── GitHub Panel ── */
            <div style={{ flex: 1, overflowY: "auto" }}>
              <Suspense
                fallback={
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#607B96",
                      fontFamily: "'Fira Code', monospace",
                      fontSize: "12px",
                    }}
                  >
                    {"// loading..."}
                  </div>
                }
              >
                <GitHubPanel />
              </Suspense>
            </div>
          ) : (
            /* ── Line-numbered text ── */
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 0" }}>
              {activeLines.map((line, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "flex-start", padding: "1px 0" }}
                >
                  <span
                    style={{
                      width: "50px",
                      textAlign: "right",
                      paddingRight: "24px",
                      color: "#2B3D4F",
                      fontSize: "13px",
                      fontFamily: "'Fira Code', monospace",
                      flexShrink: 0,
                      lineHeight: "22px",
                      userSelect: "none",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      color:
                        line.startsWith(" *") || line === "/**" || line === " */"
                          ? "#43D9AD"
                          : line.startsWith(" * @")
                          ? "#E99287"
                          : "#607B96",
                      fontSize: "13px",
                      fontFamily: "'Fira Code', monospace",
                      lineHeight: "22px",
                      whiteSpace: "pre",
                    }}
                  >
                    {line}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Right: terminal cards + stats ────────────────────────── */}
      <aside
        style={{
          width: "300px",
          flexShrink: 0,
          borderLeft: "1px solid #1E2D3D",
          background: "#011627",
          overflowY: "auto",
          padding: "20px 16px",
        }}
      >
        <p
          style={{
            color: "#607B96",
            fontSize: "11px",
            fontFamily: "'Fira Code', monospace",
            marginBottom: "16px",
          }}
        >
          {"// terminal showcase:"}
        </p>

        {TERMINAL_CARDS.map((card) => (
          <div
            key={card.id}
            style={{
              background: "#010C15",
              border: "1px solid #1E2D3D",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                borderBottom: "1px solid #1E2D3D",
              }}
            >
              {["#FF5F57", "#FEBC2E", "#27C840"].map((c, i) => (
                <div
                  key={i}
                  style={{ width: "9px", height: "9px", borderRadius: "50%", background: c }}
                />
              ))}
              <span
                style={{
                  color: "#607B96",
                  fontSize: "11px",
                  fontFamily: "'Fira Code', monospace",
                  marginLeft: "8px",
                }}
              >
                {card.title}
              </span>
            </div>
            <div style={{ padding: "12px 14px" }}>
              {card.lines.map((l, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "11px",
                    lineHeight: "1.9",
                  }}
                >
                  <span style={{ color: "#43D9AD", width: "14px", flexShrink: 0 }}>
                    {l.prompt}
                  </span>
                  <span style={{ color: l.color }}>{l.cmd}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p
          style={{
            color: "#607B96",
            fontSize: "11px",
            fontFamily: "'Fira Code', monospace",
            margin: "8px 0 12px",
          }}
        >
          {"// quick stats:"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[
            { label: "Projects", value: "10+" },
            { label: "Technologies", value: technologies.length.toString() },
            { label: "Experience", value: "2 yrs" },
            { label: "Commits", value: "500+" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#010C15",
                border: "1px solid #1E2D3D",
                borderRadius: "6px",
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  color: "#43D9AD",
                  fontSize: "18px",
                  fontFamily: "'Fira Code', monospace",
                  fontWeight: 700,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  color: "#607B96",
                  fontSize: "10px",
                  fontFamily: "'Fira Code', monospace",
                  marginTop: "2px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
