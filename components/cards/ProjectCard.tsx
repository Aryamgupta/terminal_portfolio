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
  const tech = Array.isArray(project.techStack) ? project.techStack[0] : null;
  const slug = slugify(project.title);

  const renderCardTechIcon = (icon: string | null) => {
    if (!icon) return null;
    if (icon.trim().startsWith("<svg")) {
      return (
        <span
          className="inline-flex items-center justify-center w-4 h-4 [&>svg]:w-full [&>svg]:h-full"
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      );
    }
    return <span>{icon}</span>;
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
        {tech && (
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
            {renderCardTechIcon(tech ? (techIconMap[tech] ?? "◆") : null)}
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
          {project.description}
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
