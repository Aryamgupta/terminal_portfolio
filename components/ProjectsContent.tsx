"use client";

import React, { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Project, SkillCategory, TechIcon } from "@prisma/client";
import ProjectCard from "./cards/ProjectCard";


interface Props {
  projects: Project[];
  techIcons: TechIcon[];
  skillCategories: SkillCategory[];
}

export default function ProjectsContent({
  projects,
  techIcons,
  skillCategories,
}: Props) {
  const isMobile = useIsMobile();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Create lookup for icons
  const techIconMap: Record<string, string> = {};
  techIcons.forEach((ti) => {
    techIconMap[ti.id] = ti.icon;
  });

  const renderTechIcon = (iconid: string) => {
    if (!iconid) return "";
    const icon = techIconMap[iconid];
    if (!icon)
      return (
        <span style={{ width: "20px", textAlign: "center", fontSize: "13px" }}>
          ◆
        </span>
      );

    if (icon.trim().startsWith("<svg")) {
      return (
        <span
          style={{
            width: "20px",
            height: "20px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="[&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-current"
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      );
    }
    return (
      <span style={{ width: "20px", textAlign: "center", fontSize: "13px" }}>
        {icon}
      </span>
    );
  };

  // Flatten all skills for filters and ensure uniqueness by name
  const allFilters = skillCategories.flatMap((sc) => sc.skills);
  const uniqueFilters = Array.from(new Map(allFilters.map(f => [f.name, f])).values());

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
          (p) => {
            const project = p as Project & { techIds?: string[] };
            const hasTechInStack = Array.isArray(project.techStack) &&
              project.techStack.some((t) => selected.has(t));
            
            const hasTechInIds = project.techIds?.some((id: string) => {
              const icon = techIcons.find(ti => ti.id === id);
              return icon && selected.has(icon.name);
            });

            return hasTechInStack || hasTechInIds;
          }
        );

  const grid = (
    <div
      style={{
        flex: 1,
        padding: isMobile ? "0" : "28px",
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : "repeat(auto-fill, minmax(260px, 1fr))",
        gap: isMobile ? "32px" : "24px",
        alignContent: "start",
      }}
    >
      {filtered.length === 0 ? (
        <div
          style={{
            gridColumn: "1 / -1",
            color: "#607B96",
            fontFamily: "'Fira Code', monospace",
            fontSize: "13px",
            paddingTop: "40px",
          }}
        >
          {"// No projects match the selected filters"}
        </div>
      ) : (
        filtered.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            count={idx + 1}
            techIconMap={techIconMap}
          />
        ))
      )}
    </div>
  );

  const chipsBar = selected.size > 0 && (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        padding: "10px 16px",
        borderBottom: "1px solid #1E2D3D",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          color: "#607B96",
          fontFamily: "'Fira Code', monospace",
          fontSize: "11px",
        }}
      >
        {"// projects /"}
      </span>
      {Array.from(selected).map((f, i) => (
        <React.Fragment key={f}>
          {i > 0 && (
            <span
              style={{
                color: "#607B96",
                fontFamily: "'Fira Code', monospace",
                fontSize: "12px",
              }}
            >
              ;
            </span>
          )}
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "'Fira Code', monospace",
              fontSize: "12px",
            }}
          >
            {f}
          </span>
        </React.Fragment>
      ))}
      <button
        onClick={() => setSelected(new Set())}
        style={{
          background: "none",
          border: "none",
          color: "#607B96",
          cursor: "pointer",
          fontSize: "16px",
          lineHeight: 1,
          padding: "0 4px",
        }}
      >
        ×
      </button>
    </div>
  );

  const filterList = (
    <div style={{ padding: "8px 0" }}>
      {uniqueFilters.map((f) => (
        <label
          key={f.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 16px 8px 20px",
            cursor: "pointer",
            color: selected.has(f.name) ? "#FFFFFF" : "#607B96",
            fontSize: "13px",
            fontFamily: "'Fira Code', monospace",
            transition: "color 0.15s",
          }}
        >
          <input
            type="checkbox"
            checked={selected.has(f.name)}
            onChange={() => toggleFilter(f.name)}
            style={{
              width: "14px",
              height: "14px",
              accentColor: "#43D9AD",
              cursor: "pointer",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: selected.has(f.name) ? "#FFFFFF" : "#4D5BCE",
            }}
          >
            {f.iconId && renderTechIcon(f.iconId)}
          </span>
          {f.name}
        </label>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          background: "#011627",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            color: "#FFFFFF",
            fontSize: "14px",
            fontFamily: "'Fira Code', monospace",
          }}
        >
          _projects
        </div>
        <div
          style={{
            background: "#011221",
            borderBottom: "1px solid #1E2D3D",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setFilterOpen((o) => !o)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "#1E2D3D",
              border: "none",
              color: "#FFFFFF",
              cursor: "pointer",
              fontFamily: "'Fira Code', monospace",
              fontSize: "13px",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "9px", color: "#FFFFFF" }}>
                {filterOpen ? "▼" : "▶"}
              </span>
              projects
            </span>
          </button>
          {filterOpen && filterList}
        </div>
        <div
          style={{
            padding: "14px 16px",
            color: "#FFFFFF",
            fontSize: "14px",
            fontFamily: "'Fira Code', monospace",
          }}
        >
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
      <aside
        style={{
          width: "220px",
          flexShrink: 0,
          borderRight: "1px solid #1E2D3D",
          background: "#011221",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            color: "#FFFFFF",
            fontSize: "13px",
            fontFamily: "'Fira Code', monospace",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderBottom: "1px solid #1E2D3D",
          }}
        >
          <span style={{ fontSize: "9px", color: "#607B96" }}>▼</span>
          projects
        </div>
        {filterList}
      </aside>
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {chipsBar}
        {grid}
      </main>
    </div>
  );
}

