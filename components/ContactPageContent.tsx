"use client";

import React, { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { trpc } from "@/utils/trpc";
import { ContactPageProps } from "@/types/types-contact";
import CodeLine from "./UI/MessgeSnippet";
import MailIcon from "./icons/MailIcon";
import PhoneIcon from "./icons/PhoneIcon";
import SocialLink from "./icons/SocialLinkIcon";

export default function ContactPageContent({
  personalInfo,
  socialLinks,
}: ContactPageProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState<Record<string, boolean>>({
    contacts: true,
    socials: false,
  });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const sendMutation = trpc.message.send.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const toggleSection = (k: string) =>
    setSidebarOpen((p) => ({ ...p, [k]: !p[k] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate({
      name: form.name,
      email: form.email,
      message: form.message,
    });
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

  const email = personalInfo?.email || "[EMAIL_ADDRESS]";
  const phone = personalInfo?.phone || "[PHONE NUMBER]";

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
          _contact-me
        </div>

        {/* Contacts accordion */}
        <div
          style={{ background: "#011221", borderBottom: "1px solid #1E2D3D" }}
        >
          <button
            onClick={() => toggleSection("contacts")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              background: "#1E2D3D",
              border: "none",
              color: "#FFFFFF",
              cursor: "pointer",
              fontFamily: "'Fira Code', monospace",
              fontSize: "13px",
            }}
          >
            <span style={{ fontSize: "9px", color: "#FFFFFF" }}>
              {sidebarOpen.contacts ? "▼" : "▶"}
            </span>{" "}
            contacts
          </button>
          {sidebarOpen.contacts && (
            <div style={{ padding: "8px 0 12px" }}>
              <a
                href={`mailto:${email}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 20px",
                  color: "#607B96",
                  fontSize: "12px",
                  fontFamily: "'Fira Code', monospace",
                  textDecoration: "none",
                }}
              >
                <MailIcon /> {email}
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 20px",
                  color: "#607B96",
                  fontSize: "12px",
                  fontFamily: "'Fira Code', monospace",
                  textDecoration: "none",
                }}
              >
                {phone}
              </a>
            </div>
          )}
          <button
            onClick={() => toggleSection("socials")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              background: "#1E2D3D",
              border: "none",
              borderTop: "1px solid #01080E",
              color: "#FFFFFF",
              cursor: "pointer",
              fontFamily: "'Fira Code', monospace",
              fontSize: "13px",
            }}
          >
            <span style={{ fontSize: "9px", color: "#FFFFFF" }}>
              {sidebarOpen.socials ? "▼" : "▶"}
            </span>{" "}
            find-me-also-in
          </button>
          {sidebarOpen.socials && (
            <div style={{ padding: "8px 0 12px" }}>
              {socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 20px",
                    color: "#607B96",
                    fontSize: "12px",
                    fontFamily: "'Fira Code', monospace",
                    textDecoration: "none",
                  }}
                >
                  ⌥ {s.platform}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Form Breadcrumb */}
        <div
          style={{
            padding: "14px 16px",
            color: "#FFFFFF",
            fontSize: "14px",
            fontFamily: "'Fira Code', monospace",
          }}
        >
          {"// contact "}
          <span style={{ color: "#607B96" }}>/ contact-form</span>
        </div>

        {/* Form */}
        <main style={{ flex: 1, padding: "0 16px 40px", overflowY: "auto" }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div>
              <label style={labelStyle}>_name:</label>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>_email:</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>_message:</label>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={6}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#1E2D3D",
                border: "1px solid #1E2D3D",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontFamily: "'Fira Code', monospace",
                fontSize: "13px",
                cursor: "pointer",
                alignSelf: "flex-start",
              }}
            >
              submit-message
            </button>
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
            href={`mailto:${email}`}
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
            <MailIcon /> {email}
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
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
            <PhoneIcon /> {phone}
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
          {socialLinks.map((s) => (
            <a
              key={s.id}
              href={s.url}
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
              <SocialLink/>
              {s.platform}
            </a>
          ))}
        </div>
      </aside>

      {/* ── Center: tab + form ───────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
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
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "400px",
            }}
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
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "#607B96")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "#1E2D3D")
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
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "#607B96")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "#1E2D3D")
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
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "#607B96")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "#1E2D3D")
                }
              />
            </div>

            <button
              type="submit"
              disabled={sendMutation.isPending}
              style={{
                alignSelf: "flex-start",
                padding: "8px 18px",
                background: "transparent",
                border: `1px solid ${sendMutation.isPending ? "#2B3D4F" : "#1E2D3D"}`,
                borderRadius: "6px",
                color: sendMutation.isPending ? "#607B96" : "#FFFFFF",
                fontFamily: "'Fira Code', monospace",
                fontSize: "13px",
                cursor: sendMutation.isPending ? "not-allowed" : "pointer",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseOver={(e) => {
                if (sendMutation.isPending) return;
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#43D9AD";
                el.style.color = "#43D9AD";
              }}
              onMouseOut={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = sendMutation.isPending
                  ? "#2B3D4F"
                  : "#1E2D3D";
                el.style.color = sendMutation.isPending ? "#607B96" : "#FFFFFF";
              }}
            >
              {sendMutation.isPending ? "sending..." : "submit-message"}
            </button>
          </form>
        </div>
      </main>

      {/* ── Right: reactive line-numbered code preview ────────────── */}
      <aside
        style={{
          width: "440px",
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
            <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
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
              <CodeLine line={line} formData={form} />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
