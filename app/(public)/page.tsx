import React from "react";
import PersonalInfo from "@/lib/models/PersonalInfo";
import dbConnect from "@/lib/db";
import SnakeGame from "@/components/SnakeGame";

async function getPersonalInfo() {
  await dbConnect();
  const info = await PersonalInfo.findOne({});
  return info?.personalInfo || "Front-end developer";
}

export default async function HomePage() {
  const info = await getPersonalInfo();

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
          background: "radial-gradient(circle, rgba(67,217,173,0.18) 0%, transparent 70%)",
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
          background: "radial-gradient(circle, rgba(77,91,206,0.14) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Two-column layout */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "60px",
          width: "100%",
          padding: "0 60px",
        }}
      >
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
            Aryam Gupta
          </h1>
          <h2
            style={{
              color: "#4D5BCE",
              fontSize: "clamp(18px, 2.5vw, 28px)",
              fontWeight: 400,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "'Fira Code', monospace",
            }}
          >
            <span style={{ color: "#43D9AD" }}>&gt;</span>{" "}
            <span>{info}</span>
          </h2>

          <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{ color: "#607B96", fontSize: "13px", fontFamily: "'Fira Code', monospace" }}>
              {"// complete the game to continue"}
            </p>
            
            <p style={{ color: "#607B96", fontSize: "13px", fontFamily: "'Fira Code', monospace" }}>
              {"// you can also see it on my Github page"}
            </p>
            <p style={{ fontSize: "13px", marginTop: "8px", fontFamily: "'Fira Code', monospace" }}>
              <span style={{ color: "#4D5BCE" }}>const</span>{" "}
              <span style={{ color: "#43D9AD" }}>githubLink</span>
              {" = "}
              <a
                href="https://github.com/aryam-gupta"
                target="_blank"
                rel="noreferrer"
                className="github-link"
                style={{ color: "#E99287", textDecoration: "none" }}
              >
                &quot;https://github.com/aryam-gupta&quot;
              </a>
            </p>
          </div>
        </div>

        {/* RIGHT: Snake Game */}
        <div style={{ flexShrink: 0 }}>
          <SnakeGame />
        </div>
      </div>
    </div>
  );
}