"use client";

import React, { useState } from "react";

interface Project {
  _id: string;
  title: string;
  des: string;
  imageLink?: string;
  link?: string;
  techStack?: string[];
}

interface Props {
  projects: Project[];
}

/* tech icons map */
const TECH_ICONS: Record<string, string> = {
  React: "⚛",
  "Next.js": "△",
  "Node.js": "⬡",
  MongoDB: "🍃",
  TypeScript: "TS",
  Vue: "∨",
  HTML: "📄",
  CSS: "🎨",
  Angular: "🅐",
  Gatsby: "💜",
  Flutter: "🐦",
  Express: "⬡",
  JavaScript: "JS",
};

const FILTERS = [
  "React",
  "Next.js",
  "Node.js",
  "MongoDB",
  "TypeScript",
  "Vue",
  "HTML",
  "CSS",
];

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProjectsContent({ projects }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

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

        <div style={{ padding: "8px 0" }}>
          {FILTERS.map((f) => (
            <label
              key={f}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 16px 8px 20px",
                cursor: "pointer",
                color: selected.has(f) ? "#FFFFFF" : "#607B96",
                fontSize: "13px",
                fontFamily: "'Fira Code', monospace",
                transition: "color 0.15s",
              }}
            >
              <input
                type="checkbox"
                checked={selected.has(f)}
                onChange={() => toggleFilter(f)}
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
                  width: "20px",
                  textAlign: "center",
                  fontSize: "13px",
                  color: selected.has(f) ? "#FFFFFF" : "#4D5BCE",
                }}
              >
                {TECH_ICONS[f] || "◆"}
              </span>
              {f}
            </label>
          ))}
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────── */}
      <main
        style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}
      >
        {/* Active filter chips bar */}
        {selected.size > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
              padding: "10px 28px",
              borderBottom: "1px solid #1E2D3D",
              flexShrink: 0,
            }}
          >
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
        )}

        {/* Grid */}
        <div
          style={{
            flex: 1,
            padding: "28px 28px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "24px",
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
              <ProjectCard key={project._id} project={project} count={idx + 1} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function ProjectCard({ project, count }: { project: Project; count: number }) {
  const tech = Array.isArray(project.techStack) ? project.techStack[0] : null;
  const techIcon = tech ? TECH_ICONS[tech] ?? "◆" : null;
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
      {/* Image */}
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
        {/* Tech icon badge */}
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

      {/* Body */}
      <div
        style={{
          padding: "16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Title line */}
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

        {/* Description */}
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

        {/* view-project button */}
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
