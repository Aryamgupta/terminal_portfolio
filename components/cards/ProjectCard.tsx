import { useState } from "react";
import { Project } from "@prisma/client";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProjectCard({
  project,
  count,
  techIconMap,
}: {
  project: Project;
  count: number;
  techIconMap: Record<string, string>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const slug = slugify(project.title);
  const techIds = (project as Project & { techIds?: string[] }).techIds || [];
  const techStack = project.techStack || [];

  const renderCardTechIcon = (iconId: string, iconMap: Record<string, string>) => {
    const icon = iconMap[iconId];
    if (!icon) return <span style={{ fontSize: "12px" }}>◆</span>;
    if (icon.trim().startsWith("<svg")) {
      return (
        <span
          className="inline-flex items-center justify-center w-3 h-3 [&>svg]:w-full [&>svg]:h-full"
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      );
    }
    return <span style={{ fontSize: "10px" }}>{icon}</span>;
  };

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
        ((e.currentTarget as HTMLElement).style.borderColor =
          "rgba(67,217,173,0.3)")
      }
      onMouseOut={(e) =>
        ((e.currentTarget as HTMLElement).style.borderColor = "#1E2D3D")
      }
    >
      <div
        style={{
          height: "150px",
          background: (project as Project & { imageSvg?: string | null }).imageSvg
            ? "transparent"
            : project.imageLink
              ? `url(${project.imageLink}) center/cover no-repeat`
              : "linear-gradient(135deg, #010C15, #01182a)",
          position: "relative",
          borderBottom: "1px solid #1E2D3D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0",
        }}
      >
        {(project as Project & { imageSvg?: string | null }).imageSvg ? (
          <div
            dangerouslySetInnerHTML={{ __html: (project as Project & { imageSvg?: string | null }).imageSvg || "" }}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="[&>svg]:w-full [&>svg]:h-full"
          />
        ) : !project.imageLink && (
          <span style={{ color: "#1E2D3D", fontSize: "36px" }}>{"</>"}</span>
        )}
        {/* Tech Icons Overlay - Top Right */}
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          gap: "4px",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          maxWidth: "70%"
        }}>
          {techIds.length > 0 ? (
            techIds.map((id: string) => (
              <div key={id} style={{
                width: "24px",
                height: "24px",
                background: "rgba(1,22,39,0.85)",
                border: "1px solid #1E2D3D",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
                color: "#607B96"
              }}>
                {renderCardTechIcon(id, techIconMap)}
              </div>
            ))
          ) : (
            techStack.slice(0, 3).map((t: string, i: number) => (
               <div key={i} style={{
                padding: "2px 6px",
                background: "rgba(1,22,39,0.85)",
                border: "1px solid #1E2D3D",
                borderRadius: "4px",
                fontSize: "9px",
                color: "#43D9AD",
                fontFamily: "'Fira Code', monospace",
                backdropFilter: "blur(4px)",
              }}>
                {t}
              </div>
            ))
          )}
        </div>
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

        <div
          style={{
            margin: 0,
            color: "#607B96",
            fontSize: "12px",
            fontFamily: "'Fira Code', monospace",
            lineHeight: "1.7",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p style={{ margin: 0 }}>
            {isExpanded || project.description.length <= 160
              ? project.description
              : `${project.description.substring(0, 160)}...`}
          </p>
          {project.description.length > 160 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                background: "none",
                border: "none",
                color: "#43D9AD",
                padding: 0,
                marginTop: "4px",
                cursor: "pointer",
                fontFamily: "'Fira Code', monospace",
                fontSize: "11px",
                textAlign: "left",
                width: "fit-content"
              }}
            >
              {isExpanded ? "// read-less" : "// read-more"}
            </button>
          )}
        </div>

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
