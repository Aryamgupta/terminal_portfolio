'use client';
import React from "react";
import Link from "next/link";
import { Github } from "lucide-react";

const Footer = () => {
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
      }}
    >
      {/* Left: find me in + social links */}
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <span
          style={{
            padding: "0 20px",
            color: "#607B96",
            borderRight: "1px solid #1E2D3D",
            height: "100%",
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          find me in:
        </span>

        {/* Twitter */}
        <Link
          href="https://twitter.com"
          target="_blank"
          title="Twitter"
          style={{
            padding: "0 18px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            borderRight: "1px solid #1E2D3D",
            color: "#607B96",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#607B96")}
        >
          {/* Twitter (X) SVG */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Link>

        {/* LinkedIn */}
        <Link
          href="https://linkedin.com"
          target="_blank"
          title="LinkedIn"
          style={{
            padding: "0 18px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            borderRight: "1px solid #1E2D3D",
            color: "#607B96",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#607B96")}
        >
          {/* LinkedIn SVG */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
          </svg>
        </Link>
      </div>

      {/* Right: @username github */}
      <Link
        href="https://github.com/aryam-gupta"
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
        @aryam-gupta
        <Github size={16} />
      </Link>
    </footer>
  );
};

export default Footer;