"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

const LINKS = [
  { href: "/", label: "_hello" },
  { href: "/about", label: "_about-me" },
  { href: "/projects", label: "_projects" },
  { href: "/contact", label: "_contact-me" },
];

interface Props {
  name: string;
  githubLink?: string;
  linkedinLink?: string;
  twitterLink?: string;
}

const Header = ({ name, githubLink, linkedinLink, twitterLink }: Props) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const SOCIALS = [
    {
      href: twitterLink || "https://twitter.com",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      href: linkedinLink || "https://linkedin.com",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
        </svg>
      ),
    },
    {
      href: githubLink || "https://github.com/Aryamgupta",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      ),
    },
  ];

  /* ── Desktop header ───────────────────────────────────────── */
  if (!isMobile) {
    return (
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px",
          borderBottom: "1px solid #1E2D3D",
          background: "#011627",
          flexShrink: 0,
          fontFamily: "'Fira Code', monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <div
            style={{
              padding: "0 24px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              borderRight: "1px solid #1E2D3D",
              color: "#607B96",
              fontSize: "14px",
              minWidth: "160px",
            }}
          >
            {name.toLowerCase().replace(/\s+/g, "-")}
          </div>
          <nav style={{ display: "flex", alignItems: "center", height: "100%" }}>
            {LINKS.slice(0, 3).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    height: "100%",
                    padding: "0 28px",
                    display: "flex",
                    alignItems: "center",
                    borderRight: "1px solid #1E2D3D",
                    fontSize: "14px",
                    color: isActive ? "#FFFFFF" : "#607B96",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    borderBottom: isActive ? "2px solid #FEA55F" : "2px solid transparent",
                    boxSizing: "border-box",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <Link
          href="/contact"
          style={{
            height: "100%",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            borderLeft: "1px solid #1E2D3D",
            fontSize: "14px",
            color: pathname === "/contact" ? "#FFFFFF" : "#607B96",
            textDecoration: "none",
            transition: "color 0.2s",
            borderBottom: pathname === "/contact" ? "2px solid #FEA55F" : "2px solid transparent",
            boxSizing: "border-box",
          }}
        >
          _contact-me
        </Link>
      </header>
    );
  }

  /* ── Mobile header ────────────────────────────────────────── */
  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "52px",
          borderBottom: "1px solid #1E2D3D",
          background: "#011627",
          flexShrink: 0,
          fontFamily: "'Fira Code', monospace",
          padding: "0 20px",
        }}
      >
        <span style={{ color: "#607B96", fontSize: "14px" }}>{name.toLowerCase().replace(/\s+/g, "-")}</span>

        {/* Hamburger button */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "#607B96",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <span style={{ display: "block", width: "20px", height: "2px", background: "#607B96", borderRadius: "2px" }} />
          <span style={{ display: "block", width: "20px", height: "2px", background: "#607B96", borderRadius: "2px" }} />
          <span style={{ display: "block", width: "20px", height: "2px", background: "#607B96", borderRadius: "2px" }} />
        </button>
      </header>

      {/* ── Full-screen nav drawer ─────────────────────────────── */}
      {drawerOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#011627",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Fira Code', monospace",
          }}
        >
          {/* Drawer header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              height: "52px",
              borderBottom: "1px solid #1E2D3D",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#607B96", fontSize: "14px" }}>{name.toLowerCase().replace(/\s+/g, "-")}</span>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#607B96",
                fontSize: "22px",
                lineHeight: 1,
                padding: "4px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ flex: 1 }}>
            {LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    display: "block",
                    padding: "18px 24px",
                    borderBottom: "1px solid #1E2D3D",
                    fontSize: "14px",
                    color: isActive ? "#FFFFFF" : "#607B96",
                    textDecoration: "none",
                    borderLeft: isActive ? "2px solid #FEA55F" : "2px solid transparent",
                    transition: "color 0.15s",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Social icons at bottom */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "52px",
              borderTop: "1px solid #1E2D3D",
              flexShrink: 0,
              padding: "0 20px",
              gap: "4px",
            }}
          >
            <span style={{ color: "#607B96", fontSize: "12px", marginRight: "12px" }}>
              find me in:
            </span>
            {SOCIALS.map((s, i) => (
              <Link
                key={i}
                href={s.href}
                target="_blank"
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #1E2D3D",
                  borderRadius: "6px",
                  color: "#607B96",
                  textDecoration: "none",
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                {s.icon}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;