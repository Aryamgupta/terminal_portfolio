import fs from "fs";
import path from "path";
import SnakeGame from "@/components/SnakeGame";
import TypeWritterRole from "@/components/TypeWritterRole";

async function getHomeData() {
  const dataPath = path.join(process.cwd(), "public/data/personal-info.json");
  if (!fs.existsSync(dataPath)) return { name: "Aryam Gupta", role: "Front-end developer", githubLink: "https://github.com/aryam-gupta" };
  
  const jsonData = fs.readFileSync(dataPath, "utf8");
  const { data: personalInfo } = JSON.parse(jsonData);

  return {
    name: personalInfo?.name || "Aryam Gupta",
    role: personalInfo?.role || "Front-end developer",
    githubLink: personalInfo?.githubLink || "https://github.com/aryam-gupta",
  };
}

export default async function HomePage() {
  const { name, role, githubLink } = await getHomeData();


  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #011627 0%, #01080E 60%)",
      }}
    >
      {/* Teal top-right glow */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "0px",
          width: "420px",
          height: "420px",
          background:
            "radial-gradient(circle, rgba(67,217,173,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Blue bottom-left glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "0px",
          width: "380px",
          height: "380px",
          background:
            "radial-gradient(circle, rgba(77,91,206,0.14) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Two-column layout */}
      <div className="home-layout">
        {/* LEFT: Hero Text */}
        <div style={{ flex: "1 1 0", minWidth: 0, maxWidth: "420px" }}>
          <p
            style={{
              color: "#E5E9F0",
              fontSize: "16px",
              marginBottom: "8px",
              fontFamily: "'Fira Code', monospace",
            }}
          >
            Hi all. I am
          </p>
          <h1
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: "12px",
              fontFamily: "'Fira Code', monospace",
            }}
          >
            {name}
          </h1>
          <TypeWritterRole roles={role} />

          <div
            style={{
              marginTop: "48px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <p
              style={{
                color: "#607B96",
                fontSize: "13px",
                fontFamily: "'Fira Code', monospace",
              }}
            >
              {"// complete the game to continue"}
            </p>

            <p
              style={{
                color: "#607B96",
                fontSize: "13px",
                fontFamily: "'Fira Code', monospace",
              }}
            >
              {"// you can also see it on my Github page"}
            </p>
            <p
              style={{
                fontSize: "13px",
                marginTop: "8px",
                fontFamily: "'Fira Code', monospace",
              }}
            >
              <span style={{ color: "#4D5BCE" }}>const</span>{" "}
              <span style={{ color: "#43D9AD" }}>githubLink</span>
              {" = "}
              <a
                href={githubLink}
                target="_blank"
                rel="noreferrer"
                className="github-link"
                style={{ color: "#E99287", textDecoration: "none" }}
              >
                &quot;{githubLink}&quot;
              </a>
            </p>
          </div>
        </div>

        {/* RIGHT: Snake Game */}
        <div style={{ flexShrink: 0 }}>
          <SnakeGame />
        </div>
      </div>

      <style>{`
        .home-layout {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-evenly;
          gap: 60px;
          width: 100%;
          padding: 0 60px;
        }
        @media (max-width: 768px) {
          .home-layout {
            flex-direction: column;
            gap: 40px;
            padding: 40px 24px;
            align-items: center;
            text-align: center;
          }
          .home-layout > div {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
