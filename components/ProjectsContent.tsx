"use client";

import React, { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Project {
  id: string;
  title: string;
  des: string;
  imageLink?: string;
  link?: string;
  techStack?: string[];
}

interface Props {
  projects: Project[];
  techIcons: Array<{ name: string; icon: string }>;
  skillCategories: Array<{ name: string; skills: string[] }>;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProjectsContent({ projects, techIcons, skillCategories }: Props) {
  const isMobile = useIsMobile();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Create lookup for icons
  const techIconMap: Record<string, string> = {};
  techIcons.forEach(ti => {
    techIconMap[ti.name] = ti.icon;
  });

  // Flatten all skills for filters or use skillCategories
  const allFilters = skillCategories.flatMap(sc => sc.skills);
  const uniqueFilters = Array.from(new Set(allFilters));

  const toggleFilter = (f: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });

  const filtered =
    selected.size === 0
      ? projects
      : projects.filter(
          (p) =>
            Array.isArray(p.techStack) &&
            p.techStack.some((t) => selected.has(t))
        );

  const grid = (
    <div
      style={{
        flex: 1,
        padding: isMobile ? "0" : "28px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))",
        gap: isMobile ? "32px" : "24px",
        alignContent: "start",
      }}
    >
      {filtered.length === 0 ? (
        <div style={{ gridColumn: "1 / -1", color: "#607B96", fontFamily: "'Fira Code', monospace", fontSize: "13px", paddingTop: "40px" }}>
          {"// No projects match the selected filters"}
        </div>
      ) : (
        filtered.map((project, idx) => (
          <ProjectCard key={project.id} project={project} count={idx + 1} techIconMap={techIconMap} />
        ))
      )}
    </div>
  );

  const chipsBar = selected.size > 0 && (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", padding: "10px 16px", borderBottom: "1px solid #1E2D3D", flexShrink: 0 }}>
      <span style={{ color: "#607B96", fontFamily: "'Fira Code', monospace", fontSize: "11px" }}>
        {"// projects /"}
      </span>
      {Array.from(selected).map((f, i) => (
        <React.Fragment key={f}>
          {i > 0 && <span style={{ color: "#607B96", fontFamily: "'Fira Code', monospace", fontSize: "12px" }}>;</span>}
          <span style={{ color: "#FFFFFF", fontFamily: "'Fira Code', monospace", fontSize: "12px" }}>{f}</span>
        </React.Fragment>
      ))}
      <button onClick={() => setSelected(new Set())} style={{ background: "none", border: "none", color: "#607B96", cursor: "pointer", fontSize: "16px", lineHeight: 1, padding: "0 4px" }}>×</button>
    </div>
  );

  const filterList = (
    <div style={{ padding: "8px 0" }}>
      {uniqueFilters.map((f) => (
        <label key={f} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 20px", cursor: "pointer", color: selected.has(f) ? "#FFFFFF" : "#607B96", fontSize: "13px", fontFamily: "'Fira Code', monospace", transition: "color 0.15s" }}>
          <input type="checkbox" checked={selected.has(f)} onChange={() => toggleFilter(f)} style={{ width: "14px", height: "14px", accentColor: "#43D9AD", cursor: "pointer", flexShrink: 0 }} />
          <span style={{ width: "20px", textAlign: "center", fontSize: "13px", color: selected.has(f) ? "#FFFFFF" : "#4D5BCE" }}>{techIconMap[f] || "◆"}</span>
          {f}
        </label>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: "#011627" }}>
        <div style={{ padding: "14px 16px", color: "#FFFFFF", fontSize: "14px", fontFamily: "'Fira Code', monospace" }}>
          _projects
        </div>
        <div style={{ background: "#011221", borderBottom: "1px solid #1E2D3D", flexShrink: 0 }}>
          <button
            onClick={() => setFilterOpen((o) => !o)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#1E2D3D", border: "none", color: "#FFFFFF", cursor: "pointer", fontFamily: "'Fira Code', monospace", fontSize: "13px" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "9px", color: "#FFFFFF" }}>{filterOpen ? "▼" : "▶"}</span>
              projects
            </span>
          </button>
          {filterOpen && filterList}
        </div>
        <div style={{ padding: "14px 16px", color: "#FFFFFF", fontSize: "14px", fontFamily: "'Fira Code', monospace" }}>
           {"// projects "}
           <span style={{ color: "#607B96" }}>
             / {selected.size === 0 ? "all" : Array.from(selected).join("; ")}
           </span>
        </div>
        <main style={{ flex: 1, overflowY: "auto", padding: "0 16px 40px" }}>
          {grid}
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <aside style={{ width: "220px", flexShrink: 0, borderRight: "1px solid #1E2D3D", background: "#011221", overflowY: "auto" }}>
        <div style={{ padding: "12px 16px", color: "#FFFFFF", fontSize: "13px", fontFamily: "'Fira Code', monospace", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #1E2D3D" }}>
          <span style={{ fontSize: "9px", color: "#607B96" }}>▼</span>
          projects
        </div>
        {filterList}
      </aside>
      <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {chipsBar}
        {grid}
      </main>
    </div>
  );
}

function ProjectCard({ project, count, techIconMap }: { project: Project; count: number; techIconMap: Record<string, string> }) {
  const tech = Array.isArray(project.techStack) ? project.techStack[0] : null;
  const techIcon = tech ? techIconMap[tech] ?? "◆" : null;
  const slug = slugify(project.title);

  return (
    <div
      style={{
        background: "#011221",
        border: "1px solid #1E2D3D",
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s",
      }}
      onMouseOver={(e) =>
        ((e.currentTarget as HTMLElement).style.borderColor = "rgba(67,217,173,0.3)")
      }
      onMouseOut={(e) =>
        ((e.currentTarget as HTMLElement).style.borderColor = "#1E2D3D")
      }
    >
      <div
        style={{
          height: "150px",
          background: project.imageLink
            ? `url(${project.imageLink}) center/cover no-repeat`
            : "linear-gradient(135deg, #010C15, #01182a)",
          position: "relative",
          borderBottom: "1px solid #1E2D3D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!project.imageLink && (
          <span style={{ color: "#1E2D3D", fontSize: "36px" }}>{"</>"}</span>
        )}
        {techIcon && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              width: "28px",
              height: "28px",
              background: "rgba(1,22,39,0.85)",
              border: "1px solid #1E2D3D",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              backdropFilter: "blur(4px)",
            }}
          >
            {techIcon}
          </div>
        )}
      </div>

      <div
        style={{
          padding: "16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'Fira Code', monospace",
            fontSize: "12px",
            color: "#607B96",
          }}
        >
          <span style={{ color: "#C98BDF" }}>
            Project {String(count).padStart(2, "0")}
          </span>
          {" // "}
          <span style={{ color: "#607B96" }}>_{slug}</span>
        </p>

        <p
          style={{
            margin: 0,
            color: "#607B96",
            fontSize: "12px",
            fontFamily: "'Fira Code', monospace",
            lineHeight: "1.7",
            flex: 1,
          }}
        >
          {project.des}
        </p>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "5px 12px",
              background: "transparent",
              border: "1px solid #1E2D3D",
              borderRadius: "6px",
              color: "#607B96",
              fontSize: "11px",
              fontFamily: "'Fira Code', monospace",
              textDecoration: "none",
              transition: "all 0.2s",
              alignSelf: "flex-start",
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "#43D9AD";
              el.style.color = "#43D9AD";
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "#1E2D3D";
              el.style.color = "#607B96";
            }}
          >
            view-project
          </a>
        )}
      </div>
    </div>
  );
}
