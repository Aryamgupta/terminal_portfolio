"use client";
import React from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  githubLink?: string;
  linkedinLink?: string;
  twitterLink?: string;
}

const Footer = ({ githubLink, linkedinLink, twitterLink }: Props) => {
  const isMobile = useIsMobile();
  const githubUser = githubLink?.split("/").pop() || "aryam-gupta";
  
  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "48px",
        borderTop: "1px solid #1E2D3D",
        background: "#011627",
        flexShrink: 0,
        fontSize: "13px",
        fontFamily: "'Fira Code', monospace",
        width: "100%",
      }}
    >
      {/* Left: find me in + social links */}
      <div style={{ display: "flex", alignItems: "center", height: "100%", flex: 1 }}>
        <span
          style={{
            padding: isMobile ? "0 12px" : "0 20px",
            color: "#607B96",
            borderRight: "1px solid #1E2D3D",
            height: "100%",
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {isMobile ? "find me in: " : "find me in:"}
        </span>

        <div style={{ display: "flex", alignItems: "center", height: "100%", flex: 1 }}>
          {/* Twitter */}
          <Link
            href={twitterLink || "https://twitter.com"}
            target="_blank"
            title="Twitter"
            style={{
              flex: isMobile ? 1 : "none",
              padding: "0 14px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "1px solid #1E2D3D",
              color: "#607B96",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#607B96")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </Link>

          {/* LinkedIn */}
          <Link
            href={linkedinLink || "https://linkedin.com"}
            target="_blank"
            title="LinkedIn"
            style={{
              flex: isMobile ? 1 : "none",
              padding: "0 14px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "1px solid #1E2D3D",
              color: "#607B96",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#607B96")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
            </svg>
          </Link>

          {/* Mobile GitHub icon */}
          {isMobile && (
            <Link
              href={githubLink || "https://github.com"}
              target="_blank"
              style={{
                flex: 1,
                padding: "0 14px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: "1px solid #1E2D3D",
                color: "#607B96",
                textDecoration: "none",
                marginRight: "48px", // Push away from developer badge
              }}
            >
              <Github size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Right: @username github (Desktop only) */}
      {!isMobile && (
        <Link
          href={githubLink || "https://github.com"}
          target="_blank"
          style={{
            padding: "0 20px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderLeft: "1px solid #1E2D3D",
            color: "#607B96",
            textDecoration: "none",
            transition: "color 0.2s",
            whiteSpace: "nowrap",
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#607B96")}
        >
          @{githubUser}
          <Github size={16} />
        </Link>
      )}
    </footer>
  );
};

export default Footer;
