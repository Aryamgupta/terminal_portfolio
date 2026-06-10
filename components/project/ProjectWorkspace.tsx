"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  Folder,
  FileCode,
  FileText,
  Terminal,
  Settings,
  Play,
  Github,
  ExternalLink,
  X,
  ChevronDown,
  ChevronRight,
  Shield,
  Gauge,
  Layers,
  Cpu,
  CheckCircle,
  HelpCircle,
  Menu,
} from "lucide-react";

interface Props {
  project: {
    id: string;
    title: string;
    description: string;
    imageLink?: string | null;
    imageSvg?: string | null;
    techStack: string[];
    link?: string | null;
    date?: string | null;
    featured: boolean;
    order: number;
    techIds: string[];
    caseStudy?: string | null;
  };
  techIconMap: Record<string, string>;
}

type TabType = 
  | "readme" 
  | "architecture" 
  | "package" 
  | "features" 
  | "challenges" 
  | "performance" 
  | "security" 
  | "lessons";

export default function ProjectWorkspace({ project, techIconMap }: Props) {
  const isMobile = useIsMobile();
  // Parse caseStudy with memoization to keep reference stable across renders
  const data = React.useMemo(() => {
    if (!project.caseStudy) return null;
    try {
      return JSON.parse(project.caseStudy);
    } catch (e) {
      console.error("Failed to parse case study data", e);
      return null;
    }
  }, [project.caseStudy]);

  // Active files / Tabs State
  const [activeTab, setActiveTab] = useState<TabType>("readme");
  const [openTabs, setOpenTabs] = useState<TabType[]>(["readme"]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileExplorerOpen, setIsMobileExplorerOpen] = useState(false);

  // Selected tech stack dependency detail
  const [selectedTech, setSelectedTech] = useState<any>(null);

  useEffect(() => {
    if (data?.techStackDetails?.length > 0) {
      setSelectedTech(data.techStackDetails[0]);
    } else {
      setSelectedTech(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  // Tab Details Map
  const tabConfig: Record<TabType, { name: string; icon: React.ReactNode; color: string }> = {
    readme: { name: "README.md", icon: <FileText size={14} />, color: "#43D9AD" },
    architecture: { name: "ARCHITECTURE.md", icon: <Layers size={14} />, color: "#FEA55F" },
    package: { name: "package.json", icon: <FileCode size={14} />, color: "#5F98FF" },
    features: { name: "features.json", icon: <FileCode size={14} />, color: "#C98BDF" },
    challenges: { name: "challenges.json", icon: <FileCode size={14} />, color: "#E991A5" },
    performance: { name: "performance.json", icon: <Gauge size={14} />, color: "#3B82F6" },
    security: { name: "security.md", icon: <Shield size={14} />, color: "#EF4444" },
    lessons: { name: "lessons.md", icon: <FileText size={14} />, color: "#A855F7" },
  };

  const handleTabClick = (tab: TabType) => {
    if (!openTabs.includes(tab)) {
      setOpenTabs([...openTabs, tab]);
    }
    setActiveTab(tab);
    setIsMobileExplorerOpen(false);
  };

  const handleCloseTab = (e: React.MouseEvent, tab: TabType) => {
    e.stopPropagation();
    const newTabs = openTabs.filter((t) => t !== tab);
    setOpenTabs(newTabs);

    if (activeTab === tab && newTabs.length > 0) {
      // Set the last tab active
      setActiveTab(newTabs[newTabs.length - 1]);
    }
  };

  // Custom regex markdown parser
  function renderMarkdown(markdown: string) {
    if (!markdown) return <p style={{ color: "#607B96" }}>No content available.</p>;
    const lines = markdown.split("\n");
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    return lines.map((line, idx) => {
      // Code block check
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const code = codeBlockContent.join("\n");
          codeBlockContent = [];
          return (
            <pre key={idx} style={{
              background: "#01080E",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #1E2D3D",
              fontFamily: "'Fira Code', monospace",
              fontSize: "12px",
              color: "#FEA55F",
              overflowX: "auto",
              margin: "16px 0",
              lineHeight: "1.5"
            }}>
              <code>{code}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return null;
      }

      // Headers
      if (line.startsWith("# ")) {
        return <h1 key={idx} style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: "bold", margin: "28px 0 14px", borderBottom: "1px solid #1E2D3D", paddingBottom: "8px" }}>{line.slice(2)}</h1>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: "bold", margin: "24px 0 12px", borderBottom: "1px solid #1E2D3D", paddingBottom: "6px" }}>{line.slice(3)}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={idx} style={{ color: "#FFFFFF", fontSize: "15px", fontWeight: "bold", margin: "18px 0 8px" }}>{line.slice(4)}</h3>;
      }

      // List items
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const text = line.trim().slice(2);
        return (
          <li key={idx} style={{ color: "#607B96", fontSize: "13px", fontFamily: "'Fira Code', monospace", marginLeft: "20px", marginBottom: "6px", lineHeight: "1.7" }}>
            {parseInlineMarkdown(text)}
          </li>
        );
      }

      // Horizontal Rule
      if (line.trim() === "---") {
        return <hr key={idx} style={{ border: "none", borderTop: "1px solid #1E2D3D", margin: "20px 0" }} />;
      }

      // Paragraph
      if (line.trim() === "") return <div key={idx} style={{ height: "8px" }} />;

      return (
        <p key={idx} style={{ color: "#607B96", fontSize: "13px", fontFamily: "'Fira Code', monospace", lineHeight: "1.7", margin: "10px 0" }}>
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  }

  function parseInlineMarkdown(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
    const splitParts = text.split(regex);
    
    return splitParts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: "#FFFFFF" }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i} style={{ color: "#FEA55F", background: "rgba(254,165,95,0.1)", padding: "2px 5px", borderRadius: "4px", fontSize: "11px", fontFamily: "monospace" }}>{part.slice(1, -1)}</code>;
      }
      if (part.startsWith("[") && part.includes("](")) {
        const label = part.slice(1, part.indexOf("]("));
        const url = part.slice(part.indexOf("](") + 2, -1);
        return (
          <a key={i} href={url} target="_blank" rel="noreferrer" style={{ color: "#43D9AD", textDecoration: "underline" }}>
            {label}
          </a>
        );
      }
      return part;
    });
  }

  const renderLighthouseCircle = (score: number, label: string) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 90 ? "#43D9AD" : score >= 50 ? "#FEA55F" : "#EF4444";

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <div style={{ position: "relative", width: "60px", height: "60px" }}>
          <svg style={{ transform: "rotate(-90deg)", width: "60px", height: "60px" }}>
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="transparent"
              stroke="rgba(30, 45, 61, 0.4)"
              strokeWidth="4"
            />
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="transparent"
              stroke={color}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#FFFFFF",
            fontFamily: "monospace"
          }}>
            {score}
          </div>
        </div>
        <span style={{ fontSize: "10px", color: "#607B96", fontFamily: "monospace" }}>{label}</span>
      </div>
    );
  };

  const renderTabContent = () => {
    if (!data) {
      // Fallback details if case study JSON is absent
      return (
        <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ borderBottom: "1px solid #1E2D3D", paddingBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", color: "#FFFFFF", fontWeight: "bold", margin: 0 }}>
              {project.title}
            </h2>
            <p style={{ color: "#607B96", fontSize: "14px", fontFamily: "monospace", margin: "8px 0 0 0" }}>
              {"// database description"}
            </p>
          </div>
          <p style={{ color: "#E2E8F0", fontSize: "14px", lineHeight: "1.7", fontFamily: "monospace" }}>
            {project.description}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 style={{ fontSize: "14px", color: "#43D9AD", fontWeight: "bold", margin: 0, fontFamily: "monospace" }}>
              {"// technologiesUsed.json"}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    backgroundColor: "rgba(67, 217, 173, 0.1)",
                    border: "1px solid rgba(67, 217, 173, 0.2)",
                    borderRadius: "6px",
                    color: "#43D9AD",
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontFamily: "monospace"
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "readme":
        return (
          <div style={{ padding: "32px", maxWidth: "800px" }}>
            <div style={{
              backgroundColor: "rgba(1, 22, 39, 0.6)",
              border: "1px solid #1E2D3D",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              fontFamily: "monospace",
              fontSize: "12px"
            }}>
              <div><span style={{ color: "#FEA55F" }}>status:</span> <span style={{ color: "#43D9AD" }}>"{data.status}"</span></div>
              <div><span style={{ color: "#FEA55F" }}>type:</span> <span style={{ color: "#43D9AD" }}>"{data.type}"</span></div>
              <div><span style={{ color: "#FEA55F" }}>visibility:</span> <span style={{ color: "#43D9AD" }}>"{data.visibility}"</span></div>
              <div><span style={{ color: "#FEA55F" }}>role:</span> <span style={{ color: "#FFFFFF" }}>"{data.role}"</span></div>
              <div><span style={{ color: "#FEA55F" }}>duration:</span> <span style={{ color: "#FFFFFF" }}>"{data.duration}"</span></div>
              {data.client && <div><span style={{ color: "#FEA55F" }}>client:</span> <span style={{ color: "#FFFFFF" }}>"{data.client}"</span></div>}
              {data.version && <div><span style={{ color: "#FEA55F" }}>version:</span> <span style={{ color: "#FFFFFF" }}>"{data.version}"</span></div>}
            </div>
            
            {data.overview && (
              <div style={{ borderBottom: "1px solid #1E2D3D", paddingBottom: "24px", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "18px", color: "#FFFFFF", fontWeight: "bold", marginBottom: "16px" }}>Overview</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "#607B96", lineHeight: "1.6", fontFamily: "monospace" }}>
                  <p>🎯 <strong style={{ color: "#FFFFFF" }}>Mission:</strong> {data.overview.mission}</p>
                  <p>⚠️ <strong style={{ color: "#FFFFFF" }}>Problem:</strong> {data.overview.businessProblem}</p>
                  <p>👥 <strong style={{ color: "#FFFFFF" }}>Target Audience:</strong> {data.overview.targetUsers}</p>
                  {data.overview.metrics && <p>📈 <strong style={{ color: "#43D9AD" }}>Impact Metrics:</strong> {data.overview.metrics}</p>}
                </div>
              </div>
            )}

            {renderMarkdown(data.readme)}

            {data.responsibilities?.length > 0 && (
              <div style={{ marginTop: "32px", borderTop: "1px solid #1E2D3D", paddingTop: "24px" }}>
                <h2 style={{ fontSize: "18px", color: "#FFFFFF", fontWeight: "bold", marginBottom: "16px" }}>Responsibilities</h2>
                <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {data.responsibilities.map((resp: string, i: number) => (
                    <li key={i} style={{ color: "#607B96", fontSize: "13px", fontFamily: "monospace", marginLeft: "20px" }}>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "architecture":
        return (
          <div style={{ padding: "32px" }}>
            <h2 style={{ fontSize: "20px", color: "#FFFFFF", fontWeight: "bold", marginBottom: "16px", borderBottom: "1px solid #1E2D3D", paddingBottom: "8px" }}>
              System Architecture Diagram
            </h2>

            {data.architecture?.diagram ? (
              <div 
                style={{
                  backgroundColor: "#01080E",
                  border: "1px solid #1E2D3D",
                  borderRadius: "12px",
                  padding: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflowX: "auto",
                  marginBottom: "24px",
                }}
                dangerouslySetInnerHTML={{ __html: data.architecture.diagram }}
              />
            ) : (
              <div style={{
                height: "200px",
                backgroundColor: "rgba(0,0,0,0.2)",
                border: "1px dashed #1E2D3D",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#607B96",
                fontSize: "12px",
                fontFamily: "monospace",
                marginBottom: "24px"
              }}>
                [System Diagram Stream Offline]
              </div>
            )}

            {data.architecture?.explanation && (
              <div style={{ maxWidth: "800px" }}>
                <h3 style={{ fontSize: "15px", color: "#FFFFFF", fontWeight: "bold", marginBottom: "12px" }}>
                  Architecture Walkthrough
                </h3>
                <p style={{ color: "#607B96", fontSize: "13px", fontFamily: "monospace", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                  {data.architecture.explanation}
                </p>
              </div>
            )}
          </div>
        );

      case "package":
        return (
          <div style={{ padding: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            {/* Dependencies list */}
            <div>
              <h2 style={{ fontSize: "18px", color: "#FFFFFF", fontWeight: "bold", marginBottom: "16px" }}>
                Project Stack Overview
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {data.techStackDetails?.map((tech: any, i: number) => {
                  const isSelected = selectedTech?.name === tech.name;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedTech(tech)}
                      style={{
                        textAlign: "left",
                        width: "100%",
                        padding: "16px",
                        backgroundColor: isSelected ? "rgba(67, 217, 173, 0.1)" : "rgba(1, 22, 39, 0.4)",
                        border: `1px solid ${isSelected ? "#43D9AD" : "#1E2D3D"}`,
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <div style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: "bold", fontFamily: "monospace" }}>
                          {tech.name}
                        </div>
                        <span style={{ fontSize: "11px", color: "#607B96", fontFamily: "monospace" }}>
                          Category: {tech.category}
                        </span>
                      </div>
                      <ChevronRight size={16} style={{ color: isSelected ? "#43D9AD" : "#607B96" }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Dependency Detail Card */}
            <div>
              <h2 style={{ fontSize: "18px", color: "#FFFFFF", fontWeight: "bold", marginBottom: "16px" }}>
                Dependency Specification
              </h2>
              {selectedTech ? (
                <div style={{
                  backgroundColor: "rgba(1, 22, 39, 0.6)",
                  border: "1px solid #1E2D3D",
                  borderRadius: "12px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  fontFamily: "monospace",
                  fontSize: "12px"
                }}>
                  <div>
                    <span style={{ color: "#43D9AD", fontWeight: "bold", fontSize: "16px" }}>{selectedTech.name}</span>
                    <span style={{ color: "#607B96", display: "block", fontSize: "11px", marginTop: "2px" }}>({selectedTech.category})</span>
                  </div>
                  <div>
                    <span style={{ color: "#FEA55F", fontWeight: "bold" }}>Purpose:</span>
                    <p style={{ color: "#E2E8F0", margin: "4px 0 0 0" }}>{selectedTech.purpose}</p>
                  </div>
                  <div>
                    <span style={{ color: "#FEA55F", fontWeight: "bold" }}>Selection Rationale:</span>
                    <p style={{ color: "#E2E8F0", margin: "4px 0 0 0" }}>{selectedTech.reason}</p>
                  </div>
                  {selectedTech.alternative && (
                    <div>
                      <span style={{ color: "#FEA55F", fontWeight: "bold" }}>Alternatives Evaluated:</span>
                      <p style={{ color: "#E2E8F0", margin: "4px 0 0 0" }}>{selectedTech.alternative}</p>
                    </div>
                  )}
                  {selectedTech.benefits && (
                    <div>
                      <span style={{ color: "#43D9AD", fontWeight: "bold" }}>Production Benefits:</span>
                      <p style={{ color: "#E2E8F0", margin: "4px 0 0 0" }}>{selectedTech.benefits}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  height: "200px",
                  backgroundColor: "rgba(0,0,0,0.1)",
                  border: "1px dashed #1E2D3D",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#607B96",
                  fontSize: "12px",
                  fontFamily: "monospace"
                }}>
                  Select a stack dependency to view details
                </div>
              )}
            </div>
          </div>
        );

      case "features":
        return (
          <div style={{ padding: "32px" }}>
            <h2 style={{ fontSize: "18px", color: "#FFFFFF", fontWeight: "bold", marginBottom: "20px", borderBottom: "1px solid #1E2D3D", paddingBottom: "8px" }}>
              Key System Modules
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {data.features?.map((feat: any, i: number) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "rgba(1, 22, 39, 0.4)",
                    border: "1px solid #1E2D3D",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    fontFamily: "monospace",
                    fontSize: "12px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #1E2D3D", paddingBottom: "8px" }}>
                    <CheckCircle size={14} style={{ color: "#43D9AD" }} />
                    <span style={{ color: "#FFFFFF", fontWeight: "bold" }}>{feat.name}</span>
                  </div>
                  <div>
                    <span style={{ color: "#607B96" }}>Description:</span>
                    <p style={{ color: "#E2E8F0", margin: "4px 0 0 0" }}>{feat.description}</p>
                  </div>
                  <div>
                    <span style={{ color: "#FEA55F" }}>Implementation Spec:</span>
                    <p style={{ color: "#E2E8F0", margin: "4px 0 0 0" }}>{feat.implementation}</p>
                  </div>
                  {feat.value && (
                    <div>
                      <span style={{ color: "#43D9AD" }}>Value Delivered:</span>
                      <p style={{ color: "#E2E8F0", margin: "4px 0 0 0" }}>{feat.value}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "challenges":
        return (
          <div style={{ padding: "32px", maxWidth: "800px" }}>
            <h2 style={{ fontSize: "18px", color: "#FFFFFF", fontWeight: "bold", marginBottom: "20px", borderBottom: "1px solid #1E2D3D", paddingBottom: "8px" }}>
              Challenges & Technical Solutions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {data.challenges?.map((chal: any, i: number) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "rgba(1, 22, 39, 0.4)",
                    border: "1px solid #1E2D3D",
                    borderRadius: "12px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    fontFamily: "monospace",
                    fontSize: "12px"
                  }}
                >
                  <div style={{ color: "#E991A5", fontWeight: "bold", borderBottom: "1px solid #1E2D3D", paddingBottom: "8px", fontSize: "13px" }}>
                    Challenge #{i + 1}: {chal.problem}
                  </div>
                  <div>
                    <span style={{ color: "#607B96", fontWeight: "bold" }}>Root Cause:</span>
                    <p style={{ color: "#E2E8F0", margin: "4px 0 0 0" }}>{chal.cause}</p>
                  </div>
                  <div>
                    <span style={{ color: "#43D9AD", fontWeight: "bold" }}>Solution Implemented:</span>
                    <p style={{ color: "#E2E8F0", margin: "4px 0 0 0" }}>{chal.solution}</p>
                  </div>
                  <div>
                    <span style={{ color: "#FEA55F", fontWeight: "bold" }}>Outcome:</span>
                    <p style={{ color: "#FFFFFF", margin: "4px 0 0 0" }}>{chal.outcome}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "performance":
        return (
          <div style={{ padding: "32px" }}>
            <h2 style={{ fontSize: "18px", color: "#FFFFFF", fontWeight: "bold", marginBottom: "24px", borderBottom: "1px solid #1E2D3D", paddingBottom: "8px" }}>
              Lighthouse Performance Audits
            </h2>
            
            {data.performance?.lighthouse && (
              <div style={{
                display: "flex",
                gap: "40px",
                flexWrap: "wrap",
                marginBottom: "36px",
                backgroundColor: "rgba(1, 22, 39, 0.4)",
                padding: "28px",
                borderRadius: "12px",
                border: "1px solid #1E2D3D"
              }}>
                {renderLighthouseCircle(data.performance.lighthouse.performance, "Performance")}
                {renderLighthouseCircle(data.performance.lighthouse.accessibility, "Accessibility")}
                {renderLighthouseCircle(data.performance.lighthouse.bestPractices, "Best Practices")}
                {renderLighthouseCircle(data.performance.lighthouse.seo, "SEO")}
              </div>
            )}

            {data.performance?.metrics && (
              <div style={{ maxWidth: "600px" }}>
                <h3 style={{ fontSize: "14px", color: "#FFFFFF", fontWeight: "bold", marginBottom: "16px" }}>
                  Core Web Vitals & Metrics
                </h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  fontFamily: "monospace",
                  fontSize: "12px"
                }}>
                  <div style={{ backgroundColor: "#01080E", border: "1px solid #1E2D3D", padding: "12px", borderRadius: "8px" }}>
                    <span style={{ color: "#607B96" }}>Load Time:</span>
                    <div style={{ fontSize: "16px", color: "#FFFFFF", marginTop: "4px", fontWeight: "bold" }}>{data.performance.metrics.loadTime}</div>
                  </div>
                  <div style={{ backgroundColor: "#01080E", border: "1px solid #1E2D3D", padding: "12px", borderRadius: "8px" }}>
                    <span style={{ color: "#607B96" }}>JS Bundle Size:</span>
                    <div style={{ fontSize: "16px", color: "#FFFFFF", marginTop: "4px", fontWeight: "bold" }}>{data.performance.metrics.bundleSize}</div>
                  </div>
                  <div style={{ backgroundColor: "#01080E", border: "1px solid #1E2D3D", padding: "12px", borderRadius: "8px" }}>
                    <span style={{ color: "#607B96" }}>API Response Latency:</span>
                    <div style={{ fontSize: "16px", color: "#FFFFFF", marginTop: "4px", fontWeight: "bold" }}>{data.performance.metrics.apiLatency}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "security":
        return (
          <div style={{ padding: "32px", maxWidth: "800px" }}>
            <h2 style={{ fontSize: "18px", color: "#FFFFFF", fontWeight: "bold", marginBottom: "20px", borderBottom: "1px solid #1E2D3D", paddingBottom: "8px" }}>
              Security Architecture
            </h2>
            <div style={{
              backgroundColor: "rgba(1, 22, 39, 0.4)",
              border: "1px solid #1E2D3D",
              borderRadius: "12px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#EF4444", fontSize: "14px", fontWeight: "bold", fontFamily: "monospace" }}>
                <Shield size={16} />
                <span>{"// security-parameters.log"}</span>
              </div>
              <p style={{ color: "#607B96", fontSize: "13px", fontFamily: "monospace", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                {data.security}
              </p>
            </div>
          </div>
        );

      case "lessons":
        return (
          <div style={{ padding: "32px", maxWidth: "800px" }}>
            <h2 style={{ fontSize: "18px", color: "#FFFFFF", fontWeight: "bold", marginBottom: "20px", borderBottom: "1px solid #1E2D3D", paddingBottom: "8px" }}>
              Lessons Learned & Takeaways
            </h2>
            <div style={{
              backgroundColor: "rgba(1, 22, 39, 0.4)",
              border: "1px solid #1E2D3D",
              borderRadius: "12px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#A855F7", fontSize: "14px", fontWeight: "bold", fontFamily: "monospace" }}>
                <HelpCircle size={16} />
                <span>{"// retrospective.md"}</span>
              </div>
              <p style={{ color: "#607B96", fontSize: "13px", fontFamily: "monospace", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                {data.lessonsLearned}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentRepoName = data?.repoStyleIdentifier || `aryam/${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", backgroundColor: "#011627" }}>
      {/* Translucent Backdrop overlay for Mobile Explorer Drawer */}
      {isMobile && isMobileExplorerOpen && (
        <div 
          onClick={() => setIsMobileExplorerOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden"
        />
      )}

      {/* File Explorer Sidebar */}
      <aside
        style={{
          backgroundColor: "#011221",
          flexDirection: "column",
          flexShrink: 0,
          overflow: "hidden",
          transition: "transform 0.3s ease, width 0.25s ease",
          ...(!isMobile ? {
            width: isSidebarOpen ? "250px" : "0",
            borderRight: isSidebarOpen ? "1px solid #1E2D3D" : "none",
            display: "flex",
          } : {
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: 50,
            width: "240px",
            height: "100%",
            display: "flex",
            borderRight: isMobileExplorerOpen ? "1px solid #1E2D3D" : "none",
            transform: isMobileExplorerOpen ? "translateX(0)" : "translateX(-100%)",
          })
        }}
        className={isMobile ? "transition-transform" : ""}
      >
        <div style={{
          padding: "10px 16px",
          color: "#607B96",
          fontSize: "11px",
          fontFamily: "monospace",
          textTransform: "uppercase",
          borderBottom: "1px solid #1E2D3D",
          letterSpacing: "1px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <span>Explorer</span>
          {isMobile && (
            <button 
              onClick={() => setIsMobileExplorerOpen(false)}
              style={{ background: "none", border: "none", color: "#607B96", cursor: "pointer", fontSize: "14px" }}
              aria-label="Close explorer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Directory Structure */}
        <div style={{ padding: "12px 0", display: "flex", flexDirection: "column", gap: "4px" }}>
          {/* Root Directory */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 16px",
            color: "#FFFFFF",
            fontSize: "13px",
            fontFamily: "monospace"
          }}>
            <ChevronDown size={14} style={{ color: "#607B96" }} />
            <Folder size={14} style={{ color: "#FEA55F" }} />
            <span style={{ fontWeight: "bold" }}>{currentRepoName.split("/")[1] || currentRepoName}</span>
          </div>

          {/* Children Files */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {(Object.keys(tabConfig) as TabType[]).map((tab) => {
              // Only render if data exists or it is package/readme (which work as fallbacks)
              if (!data && tab !== "readme" && tab !== "package") return null;

              const config = tabConfig[tab];
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 32px",
                    width: "100%",
                    textAlign: "left",
                    backgroundColor: isActive ? "rgba(30, 45, 61, 0.4)" : "transparent",
                    border: "none",
                    color: isActive ? "#FFFFFF" : "#607B96",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#607B96";
                  }}
                >
                  <span style={{ color: config.color }}>{config.icon}</span>
                  <span>{config.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, backgroundColor: "#011627" }}>
        
        {/* Mobile File Explorer Trigger Header */}
        {isMobile && (
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 16px",
              backgroundColor: "#011221",
              borderBottom: "1px solid #1E2D3D"
            }}
          >
            <button 
              onClick={() => setIsMobileExplorerOpen(!isMobileExplorerOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                color: "#43D9AD",
                fontFamily: "monospace",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              <Menu size={16} />
              <span>explorer</span>
            </button>
            <span style={{ color: "#607B96", fontSize: "11px", fontFamily: "monospace" }}>
              _{activeTab}
            </span>
          </div>
        )}

        {/* Tab Headers bar */}
        <div 
          style={{
            display: "flex",
            backgroundColor: "#010C15",
            borderBottom: "1px solid #1E2D3D",
            overflowX: "auto",
            scrollbarWidth: "none"
          }}
          className="hidden md:flex"
        >
          {openTabs.map((tab) => {
            const config = tabConfig[tab];
            const isActive = activeTab === tab;

            return (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderRight: "1px solid #1E2D3D",
                  backgroundColor: isActive ? "#011627" : "transparent",
                  color: isActive ? "#FFFFFF" : "#607B96",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  transition: "background-color 0.15s, color 0.15s",
                  borderTop: isActive ? "2px solid #FEA55F" : "2px solid transparent"
                }}
              >
                <span style={{ color: config.color }}>{config.icon}</span>
                <span>{config.name}</span>
                <button
                  onClick={(e) => handleCloseTab(e, tab)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#607B96",
                    cursor: "pointer",
                    padding: "2px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#607B96";
                  }}
                >
                  <X size={10} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Workspace Code Editor Panel */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex" }}>
          


          {/* Actual tab content rendering panel */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {renderTabContent()}
          </div>
        </div>

        {/* Editor Terminal-Like Status Bar */}
        <footer style={{
          height: "24px",
          backgroundColor: "#000B14",
          borderTop: "1px solid #1E2D3D",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          fontSize: "11px",
          color: "#607B96",
          fontFamily: "monospace"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#FEA55F", color: "#000000", padding: "0 6px", fontWeight: "bold" }}>
              <Terminal size={10} />
              <span>TERMINAL</span>
            </div>
            <span>src/projects/{activeTab === "readme" ? "README.md" : activeTab === "package" ? "package.json" : activeTab + ".json"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span className="hidden sm:inline">UTF-8</span>
            <span className="hidden md:inline">TypeScript JSX</span>
            <span className="hidden lg:inline">Ln 1, Col 1</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
