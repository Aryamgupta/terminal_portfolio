"use client";

import React, { useState, useEffect } from "react";
import { Folder, FileText, ChevronDown, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Loading() {
  const isMobile = useIsMobile();
  const [logs, setLogs] = useState<string[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);

  const mockFiles = [
    { name: "README.md", color: "#43D9AD" },
    { name: "ARCHITECTURE.md", color: "#FEA55F" },
    { name: "package.json", color: "#5F98FF" },
    { name: "features.json", color: "#C98BDF" },
    { name: "challenges.json", color: "#E991A5" },
    { name: "performance.json", color: "#3B82F6" },
    { name: "security.md", color: "#EF4444" },
    { name: "lessons.md", color: "#A855F7" },
  ];

  const logSteps = [
    "[info] Initializing technical workspace interface...",
    "[info] Loading project files from system cache...",
    "[info] Parsing project metadata and dependency records...",
    "[info] Mounting Markdown rendering core...",
  ];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    // Add logs one by one with a delay
    logSteps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, step]);
      }, (index + 1) * 200);
      timers.push(timer);
    });

    // Show compilation spinner after logs are printed
    const spinnerTimer = setTimeout(() => {
      setShowSpinner(true);
    }, (logSteps.length + 1) * 200);
    timers.push(spinnerTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", backgroundColor: "#011627" }} className="w-full">
      {/* Dynamic Keyframe Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .terminal-line {
          animation: fadeInLine 0.15s ease-out forwards;
        }
        .cursor-blink {
          animation: blink 1s step-end infinite;
        }
        .pulse-skeleton {
          animation: pulseGlow 1.5s ease-in-out infinite;
        }
      `}} />

      {/* File Explorer Sidebar Skeleton */}
      <aside
        style={{
          backgroundColor: "#011221",
          flexDirection: "column",
          flexShrink: 0,
          overflow: "hidden",
          transition: "transform 0.3s ease, width 0.25s ease",
          ...(!isMobile ? {
            width: "250px",
            borderRight: "1px solid #1E2D3D",
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
            borderRight: "1px solid #1E2D3D",
            transform: "translateX(-100%)",
          })
        }}
        className={isMobile ? "transition-transform" : ""}
      >
        <div
          style={{
            padding: "10px 16px",
            color: "#607B96",
            fontSize: "11px",
            fontFamily: "monospace",
            textTransform: "uppercase",
            borderBottom: "1px solid #1E2D3D",
            letterSpacing: "1px",
          }}
        >
          Explorer
        </div>

        {/* Directory Structure */}
        <div style={{ padding: "12px 0", display: "flex", flexDirection: "column", gap: "4px" }}>
          {/* Root Folder Skeleton */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 16px",
              color: "#FFFFFF",
              fontSize: "13px",
              fontFamily: "monospace",
            }}
          >
            <ChevronDown size={14} style={{ color: "#607B96" }} />
            <Folder size={14} style={{ color: "#FEA55F" }} />
            <span 
              className="pulse-skeleton"
              style={{ 
                width: "90px", 
                height: "14px", 
                backgroundColor: "#1E2D3D", 
                borderRadius: "3px" 
              }} 
            />
          </div>

          {/* Files Skeletons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingLeft: "16px" }}>
            {mockFiles.map((file, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 16px",
                  color: "#607B96",
                  fontSize: "13px",
                  fontFamily: "monospace",
                }}
              >
                <FileText size={14} style={{ color: file.color, opacity: 0.6 }} />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Editor Content Area Skeleton */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "#011627" }}>
        
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
            <div 
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#43D9AD",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
            >
              <Menu size={16} />
              <span>explorer</span>
            </div>
            <span style={{ color: "#607B96", fontSize: "11px", fontFamily: "monospace" }}>
              _readme
            </span>
          </div>
        )}

        {/* Editor Tab Bar Skeleton */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#011221",
            borderBottom: "1px solid #1E2D3D",
            height: "35px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
          className="hidden md:flex"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              borderRight: "1px solid #1E2D3D",
              backgroundColor: "#011627",
              color: "#43D9AD",
              fontSize: "13px",
              fontFamily: "monospace",
              height: "100%",
              gap: "8px",
            }}
          >
            <FileText size={12} style={{ color: "#43D9AD" }} />
            <span>README.md</span>
          </div>
        </div>

        {/* Editor Workspace Terminal Progress */}
        <div
          style={{
            flex: 1,
            padding: "24px",
            fontFamily: "monospace",
            fontSize: "14px",
            color: "#607B96",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#43D9AD" }}>$</span>
            <span style={{ color: "#E2E8F0" }}>npm run start:workspace</span>
            <span className="cursor-blink" style={{ color: "#43D9AD", fontWeight: "bold" }}>_</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", color: "#607B96", paddingLeft: "12px" }}>
            {logs.map((log, index) => (
              <div key={index} className="terminal-line">
                {log}
              </div>
            ))}
          </div>

          {/* Compilation Spinner Block */}
          {showSpinner && (
            <div
              className="terminal-line"
              style={{
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#43D9AD",
              }}
            >
              <span className="animate-spin" style={{ display: "inline-block" }}>
                ⚡
              </span>
              <span style={{ fontWeight: "bold" }}>Compiling workspace resources...</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
