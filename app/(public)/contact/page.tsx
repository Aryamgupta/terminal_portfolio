"use client";

import React, { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function ContactPage() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState<Record<string, boolean>>({ contacts: true, socials: false });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const toggleSection = (k: string) => setSidebarOpen((p) => ({ ...p, [k]: !p[k] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const update = (field: keyof typeof form, val: string) =>
    setForm((p) => ({ ...p, [field]: val }));

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#011221",
    border: "1px solid #1E2D3D",
    borderRadius: "6px",
    padding: "8px 12px",
    color: "#FFFFFF",
    fontFamily: "'Fira Code', monospace",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    color: "#607B96",
    fontSize: "12px",
    fontFamily: "'Fira Code', monospace",
    marginBottom: "6px",
    display: "block",
  };

  const socials = [
    { label: "YouTube channel", href: "#" },
    { label: "LinkedIn profile", href: "https://linkedin.com" },
    { label: "Instagram account", href: "#" },
    { label: "GitHub profile", href: "https://github.com/aryam-gupta" },
  ];

  /* ── Live code lines ─────────────────────────────────────────── */
  const codeLines = [
    `const button = document.querySelector('#sendBtn');`,
    ``,
    `const message = {`,
    `  name: "${form.name || ""}",`,
    `  email: "${form.email || ""}",`,
    `  message: "${form.message ? form.message.replace(/\n/g, " ").slice(0, 40) : ""}",`,
    `  date: "${new Date().toDateString()}",`,
    `}`,
    ``,
    `button.addEventListener('click', () => {`,
    `  form.send(message);`,
    `})`,
  ];

  /* ── success state ───────────────────────────────────────────── */
  if (submitted) {
    return (
      <div
        style={{
          height: isMobile ? "auto" : "100%",
          minHeight: isMobile ? "50vh" : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          padding: isMobile ? "40px 24px" : undefined,
        }}
      >
        <div style={{ fontSize: "72px" }}>🤘</div>
        <h2
          style={{
            color: "#FFFFFF",
            fontFamily: "'Fira Code', monospace",
            fontSize: "24px",
            fontWeight: 400,
            margin: 0,
          }}
        >
          Thank you! 🤘
        </h2>
        <p
          style={{
            color: "#607B96",
            fontFamily: "'Fira Code', monospace",
            fontSize: "13px",
            maxWidth: "360px",
            textAlign: "center",
            lineHeight: "1.7",
          }}
        >
          Your message has been sent. I&apos;ll get back to you as soon as
          possible.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", message: "" });
          }}
          style={{
            padding: "8px 20px",
            background: "transparent",
            border: "1px solid #1E2D3D",
            borderRadius: "8px",
            color: "#FFFFFF",
            fontFamily: "'Fira Code', monospace",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          send-new-message
        </button>
      </div>
    );
  }

  /* ── MOBILE layout ─────────────────────────────────────── */
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: "#011627" }}>
        <div style={{ padding: "14px 16px", color: "#FFFFFF", fontSize: "14px", fontFamily: "'Fira Code', monospace" }}>
          _contact-me
        </div>

        {/* Contacts accordion */}
        <div style={{ background: "#011221", borderBottom: "1px solid #1E2D3D" }}>
          <button onClick={() => toggleSection("contacts")} style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", background: "#1E2D3D", border: "none", color: "#FFFFFF", cursor: "pointer", fontFamily: "'Fira Code', monospace", fontSize: "13px" }}>
            <span style={{ fontSize: "9px", color: "#FFFFFF" }}>{sidebarOpen.contacts ? "▼" : "▶"}</span> contacts
          </button>
          {sidebarOpen.contacts && (
            <div style={{ padding: "8px 0 12px" }}>
              <a href="mailto:aryamgupta8750@gmail.com" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 20px", color: "#607B96", fontSize: "12px", fontFamily: "'Fira Code', monospace", textDecoration: "none" }}>✉ aryamgupta8750@gmail.com</a>
              <a href="tel:+918750000000" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 20px", color: "#607B96", fontSize: "12px", fontFamily: "'Fira Code', monospace", textDecoration: "none" }}>📞 +91 8750XXXXXX</a>
            </div>
          )}
          <button onClick={() => toggleSection("socials")} style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", background: "#1E2D3D", border: "none", borderTop: "1px solid #01080E", color: "#FFFFFF", cursor: "pointer", fontFamily: "'Fira Code', monospace", fontSize: "13px" }}>
            <span style={{ fontSize: "9px", color: "#FFFFFF" }}>{sidebarOpen.socials ? "▼" : "▶"}</span> find-me-also-in
          </button>
          {sidebarOpen.socials && (
            <div style={{ padding: "8px 0 12px" }}>
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 20px", color: "#607B96", fontSize: "12px", fontFamily: "'Fira Code', monospace", textDecoration: "none" }}>⌥ {s.label}</a>
              ))}
            </div>
          )}
        </div>

        {/* Form Breadcrumb */}
        <div style={{ padding: "14px 16px", color: "#FFFFFF", fontSize: "14px", fontFamily: "'Fira Code', monospace" }}>
           {"// contact "}
           <span style={{ color: "#607B96" }}>
             / contact-form
           </span>
        </div>

        {/* Form */}
        <main style={{ flex: 1, padding: "0 16px 40px", overflowY: "auto" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div><label style={labelStyle}>_name:</label><input value={form.name} onChange={(e) => update("name", e.target.value)} style={inputStyle} placeholder="Jonathan Davis" /></div>
            <div><label style={labelStyle}>_email:</label><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>_message:</label><textarea value={form.message} onChange={(e) => update("message", e.target.value)} rows={6} style={{ ...inputStyle, resize: "vertical" }} /></div>
            <button type="submit" style={{ padding: "10px 20px", background: "#1E2D3D", border: "1px solid #1E2D3D", borderRadius: "8px", color: "#FFFFFF", fontFamily: "'Fira Code', monospace", fontSize: "13px", cursor: "pointer", alignSelf: "flex-start" }}>submit-message</button>
          </form>
        </main>
      </div>
    );
  }

  /* ── DESKTOP layout ────────────────────────────────────── */
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* ── Left Sidebar ─────────────────────────────────────────── */}
      <aside
        style={{
          width: "220px",
          flexShrink: 0,
          borderRight: "1px solid #1E2D3D",
          background: "#011221",
          overflowY: "auto",
        }}
      >
        {/* contacts header */}
        <div
          style={{
            padding: "10px 16px",
            color: "#FFFFFF",
            fontSize: "13px",
            fontFamily: "'Fira Code', monospace",
            borderBottom: "1px solid #1E2D3D",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ color: "#607B96", fontSize: "9px" }}>▼</span> contacts
        </div>

        <div style={{ padding: "10px 0" }}>
          <a
            href="mailto:aryamgupta8750@gmail.com"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 20px",
              color: "#607B96",
              fontSize: "12px",
              fontFamily: "'Fira Code', monospace",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseOver={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")
            }
            onMouseOut={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#607B96")
            }
          >
            <span>✉</span> aryamgupta8750@gmail.com
          </a>
          <a
            href="tel:+918750000000"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 20px",
              color: "#607B96",
              fontSize: "12px",
              fontFamily: "'Fira Code', monospace",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseOver={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")
            }
            onMouseOut={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#607B96")
            }
          >
            <span>📞</span> +91 8750XXXXXX
          </a>
        </div>

        {/* find-me-also-in */}
        <div
          style={{
            padding: "10px 16px",
            color: "#FFFFFF",
            fontSize: "13px",
            fontFamily: "'Fira Code', monospace",
            borderTop: "1px solid #1E2D3D",
            borderBottom: "1px solid #1E2D3D",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ color: "#607B96", fontSize: "9px" }}>▼</span>{" "}
          find-me-also-in
        </div>

        <div style={{ padding: "8px 0" }}>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 20px",
                color: "#607B96",
                fontSize: "12px",
                fontFamily: "'Fira Code', monospace",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseOver={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")
              }
              onMouseOut={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#607B96")
              }
            >
              <span style={{ fontSize: "10px" }}>🔗</span>
              {s.label}
            </a>
          ))}
        </div>
      </aside>

      {/* ── Center: tab + form ───────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #1E2D3D",
            background: "#011627",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              padding: "10px 20px",
              color: "#607B96",
              fontFamily: "'Fira Code', monospace",
              fontSize: "12px",
              borderRight: "1px solid #1E2D3D",
            }}
          >
            contacts
          </span>
          <span
            style={{
              padding: "10px 10px",
              color: "#607B96",
              fontFamily: "'Fira Code', monospace",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            ✕
          </span>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "400px" }}
          >
            <div>
              <label htmlFor="c-name" style={labelStyle}>
                _name:
              </label>
              <input
                id="c-name"
                type="text"
                required
                placeholder="Jonathan Davis"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                style={inputStyle}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "#607B96")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "#1E2D3D")
                }
              />
            </div>

            <div>
              <label htmlFor="c-email" style={labelStyle}>
                _email:
              </label>
              <input
                id="c-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                style={inputStyle}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "#607B96")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "#1E2D3D")
                }
              />
            </div>

            <div>
              <label htmlFor="c-msg" style={labelStyle}>
                _message:
              </label>
              <textarea
                id="c-msg"
                rows={6}
                required
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                style={{ ...inputStyle, resize: "none" }}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "#607B96")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "#1E2D3D")
                }
              />
            </div>

            <button
              type="submit"
              style={{
                alignSelf: "flex-start",
                padding: "8px 18px",
                background: "transparent",
                border: "1px solid #1E2D3D",
                borderRadius: "6px",
                color: "#FFFFFF",
                fontFamily: "'Fira Code', monospace",
                fontSize: "13px",
                cursor: "pointer",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseOver={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#43D9AD";
                el.style.color = "#43D9AD";
              }}
              onMouseOut={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#1E2D3D";
                el.style.color = "#FFFFFF";
              }}
            >
              submit-message
            </button>
          </form>
        </div>
      </main>

      {/* ── Right: reactive line-numbered code preview ────────────── */}
      <aside
        style={{
          width: "340px",
          flexShrink: 0,
          borderLeft: "1px solid #1E2D3D",
          background: "#011627",
          overflowY: "auto",
          padding: "0",
        }}
      >
        {/* Code view */}
        <div style={{ padding: "24px 0 24px 0", overflowX: "auto" }}>
          {codeLines.map((line, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "flex-start" }}
            >
              {/* Line number */}
              <span
                style={{
                  width: "42px",
                  textAlign: "right",
                  paddingRight: "18px",
                  color: "#2B3D4F",
                  fontSize: "12px",
                  fontFamily: "'Fira Code', monospace",
                  flexShrink: 0,
                  lineHeight: "22px",
                  userSelect: "none",
                }}
              >
                {i + 1}
              </span>
              {/* Code content with syntax colouring */}
              <CodeLine line={line} formData={form} />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

/* Simple syntax highlighter for the live code preview */
function CodeLine({
  line,
  formData,
}: {
  line: string;
  formData: { name: string; email: string; message: string };
}) {
  if (line === "") {
    return (
      <span
        style={{
          lineHeight: "22px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "12px",
        }}
      >
        {" "}
      </span>
    );
  }

  // Colour keywords
  const isKeyword = line.startsWith("const") || line.startsWith("button");
  const isComment = line.startsWith("//");
  const isCloser = line === "}" || line === "})" || line === "})";

  if (isComment)
    return (
      <span
        style={{
          color: "#607B96",
          lineHeight: "22px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "12px",
          whiteSpace: "pre",
        }}
      >
        {line}
      </span>
    );

  // Lines with interpolated form values
  if (line.includes("name:")) {
    return (
      <span
        style={{
          lineHeight: "22px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "12px",
          whiteSpace: "pre",
        }}
      >
        <span style={{ color: "#607B96" }}>{"  "}</span>
        <span style={{ color: "#E99287" }}>name</span>
        <span style={{ color: "#607B96" }}>: </span>
        <span style={{ color: "#FEA55F" }}>&quot;{formData.name}&quot;</span>
        <span style={{ color: "#607B96" }}>,</span>
      </span>
    );
  }
  if (line.includes("email:")) {
    return (
      <span
        style={{
          lineHeight: "22px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "12px",
          whiteSpace: "pre",
        }}
      >
        <span style={{ color: "#607B96" }}>{"  "}</span>
        <span style={{ color: "#E99287" }}>email</span>
        <span style={{ color: "#607B96" }}>: </span>
        <span style={{ color: "#FEA55F" }}>&quot;{formData.email}&quot;</span>
        <span style={{ color: "#607B96" }}>,</span>
      </span>
    );
  }
  if (line.includes("message:")) {
    const truncated = formData.message
      ? formData.message.replace(/\n/g, " ").slice(0, 40)
      : "";
    return (
      <span
        style={{
          lineHeight: "22px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "12px",
          whiteSpace: "pre",
        }}
      >
        <span style={{ color: "#607B96" }}>{"  "}</span>
        <span style={{ color: "#E99287" }}>message</span>
        <span style={{ color: "#607B96" }}>: </span>
        <span style={{ color: "#FEA55F" }}>&quot;{truncated}&quot;</span>
        <span style={{ color: "#607B96" }}>,</span>
      </span>
    );
  }
  if (line.includes("date:")) {
    return (
      <span
        style={{
          lineHeight: "22px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "12px",
          whiteSpace: "pre",
        }}
      >
        <span style={{ color: "#607B96" }}>{"  "}</span>
        <span style={{ color: "#E99287" }}>date</span>
        <span style={{ color: "#607B96" }}>: </span>
        <span style={{ color: "#FEA55F" }}>&quot;{new Date().toDateString()}&quot;</span>
        <span style={{ color: "#607B96" }}>,</span>
      </span>
    );
  }

  return (
    <span
      style={{
        color: isKeyword ? "#4D5BCE" : isCloser ? "#607B96" : "#43D9AD",
        lineHeight: "22px",
        fontFamily: "'Fira Code', monospace",
        fontSize: "12px",
        whiteSpace: "pre",
      }}
    >
      {line}
    </span>
  );
}