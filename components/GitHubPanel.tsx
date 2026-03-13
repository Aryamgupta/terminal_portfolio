"use client";

import React, { useEffect, useState } from "react";

const GITHUB_USERNAME = "Aryamgupta";

interface GHUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface GHRepo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  pushed_at: string;
}

interface GHEvent {
  id: string;
  type: string;
  repo: { name: string };
  payload: {
    commits?: Array<{ message: string }>;
    action?: string;
    ref?: string;
    ref_type?: string;
  };
  created_at: string;
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
};

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function eventLabel(e: GHEvent): string {
  switch (e.type) {
    case "PushEvent":
      return `Pushed to ${e.repo.name.split("/")[1]}`;
    case "CreateEvent":
      return `Created ${e.payload.ref_type} in ${e.repo.name.split("/")[1]}`;
    case "WatchEvent":
      return `Starred ${e.repo.name}`;
    case "ForkEvent":
      return `Forked ${e.repo.name}`;
    case "PullRequestEvent":
      return `PR ${e.payload.action} on ${e.repo.name.split("/")[1]}`;
    case "IssuesEvent":
      return `Issue ${e.payload.action} on ${e.repo.name.split("/")[1]}`;
    default:
      return `${e.type.replace("Event", "")} on ${e.repo.name.split("/")[1]}`;
  }
}

function eventCommitMsg(e: GHEvent): string | null {
  const msg = e.payload.commits?.[0]?.message;
  if (!msg) return null;
  return msg.length > 56 ? msg.slice(0, 56) + "..." : msg;
}

/* ── Stat pill ───────────────────────────────────────────────────── */
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        background: "#010C15",
        border: "1px solid #1E2D3D",
        borderRadius: "8px",
        padding: "12px 16px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "#43D9AD",
          fontSize: "22px",
          fontFamily: "'Fira Code', monospace",
          fontWeight: 700,
        }}
      >
        {value}
      </div>
      <div
        style={{
          color: "#607B96",
          fontSize: "11px",
          fontFamily: "'Fira Code', monospace",
          marginTop: "3px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function GitHubPanel() {
  const [user, setUser] = useState<GHUser | null>(null);
  const [repos, setRepos] = useState<GHRepo[]>([]);
  const [events, setEvents] = useState<GHEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = "https://api.github.com";
    const headers = { Accept: "application/vnd.github.v3+json" };

    Promise.all([
      fetch(`${base}/users/${GITHUB_USERNAME}`, { headers }).then((r) =>
        r.json(),
      ),
      fetch(`${base}/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=6`, {
        headers,
      }).then((r) => r.json()),
      fetch(`${base}/users/${GITHUB_USERNAME}/events/public?per_page=8`, {
        headers,
      }).then((r) => r.json()),
    ])
      .then(([u, r, e]) => {
        if (u.message) throw new Error(u.message);
        setUser(u);
        setRepos(Array.isArray(r) ? r : []);
        setEvents(Array.isArray(e) ? e : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "GitHub API error");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          fontFamily: "'Fira Code', monospace",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "2px solid #1E2D3D",
            borderTop: "2px solid #43D9AD",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ color: "#607B96", fontSize: "12px" }}>
          {"// fetching github stats..."}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          fontFamily: "'Fira Code', monospace",
          color: "#E99287",
        }}
      >
        <span style={{ fontSize: "32px" }}>⚠</span>
        <span style={{ fontSize: "12px" }}>{`// ${error}`}</span>
        <span style={{ color: "#607B96", fontSize: "11px" }}>
          (check GitHub username or API rate limit)
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      {/* ── User Profile ─────────────────────────────────────────── */}
      <section>
        <p
          style={{
            color: "#607B96",
            fontSize: "11px",
            fontFamily: "'Fira Code', monospace",
            marginBottom: "12px",
          }}
        >
          {"// github profile"}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            background: "#010C15",
            border: "1px solid #1E2D3D",
            borderRadius: "10px",
            padding: "16px",
          }}
        >
          {user?.avatar_url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={user.avatar_url}
              alt={user.name}
              width={56}
              height={56}
              style={{ borderRadius: "50%", border: "2px solid #1E2D3D" }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: "#FFFFFF",
                fontFamily: "'Fira Code', monospace",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {user?.name || user?.login}
            </div>
            <div
              style={{
                color: "#43D9AD",
                fontFamily: "'Fira Code', monospace",
                fontSize: "11px",
                marginTop: "2px",
              }}
            >
              @{user?.login}
            </div>
            {user?.bio && (
              <div
                style={{
                  color: "#607B96",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "11px",
                  marginTop: "6px",
                  lineHeight: "1.5",
                }}
              >
                {user.bio}
              </div>
            )}
          </div>
          <a
            href={user?.html_url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              background: "transparent",
              border: "1px solid #1E2D3D",
              borderRadius: "6px",
              color: "#607B96",
              fontFamily: "'Fira Code', monospace",
              fontSize: "11px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#FFFFFF";
              el.style.borderColor = "#43D9AD";
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#607B96";
              el.style.borderColor = "#1E2D3D";
            }}
          >
            ⌥ view-profile ↗
          </a>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            marginTop: "12px",
          }}
        >
          <Stat label="repos" value={user?.public_repos ?? 0} />
          <Stat label="followers" value={user?.followers ?? 0} />
          <Stat label="following" value={user?.following ?? 0} />
        </div>
      </section>

      {/* ── Top Repositories ─────────────────────────────────────── */}
      <section>
        <p
          style={{
            color: "#607B96",
            fontSize: "11px",
            fontFamily: "'Fira Code', monospace",
            marginBottom: "12px",
          }}
        >
          {"// top repositories"}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {repos.slice(0, 6).map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#010C15",
                border: "1px solid #1E2D3D",
                borderRadius: "8px",
                padding: "12px",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                transition: "border-color 0.2s",
              }}
              onMouseOver={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(67,217,173,0.4)")
              }
              onMouseOut={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "#1E2D3D")
              }
            >
              <div
                style={{
                  color: "#4D5BCE",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {repo.name}
              </div>
              {repo.description && (
                <div
                  style={{
                    color: "#607B96",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "10px",
                    lineHeight: "1.5",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {repo.description}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "auto",
                }}
              >
                {repo.language && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "#607B96",
                      fontFamily: "'Fira Code', monospace",
                      fontSize: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: LANG_COLORS[repo.language] ?? "#607B96",
                        flexShrink: 0,
                      }}
                    />
                    {repo.language}
                  </span>
                )}
                <span
                  style={{
                    color: "#607B96",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "10px",
                  }}
                >
                  ⭐ {repo.stargazers_count}
                </span>
                <span
                  style={{
                    color: "#607B96",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "10px",
                  }}
                >
                  🍴 {repo.forks_count}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Recent Activity ───────────────────────────────────────── */}
      <section style={{ paddingBottom: "16px" }}>
        <p
          style={{
            color: "#607B96",
            fontSize: "11px",
            fontFamily: "'Fira Code', monospace",
            marginBottom: "12px",
          }}
        >
          {"// recent activity"}
        </p>
        <div
          style={{
            background: "#010C15",
            border: "1px solid #1E2D3D",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {events.length === 0 ? (
            <div
              style={{
                padding: "20px",
                color: "#607B96",
                fontFamily: "'Fira Code', monospace",
                fontSize: "12px",
              }}
            >
              {"// no public events found"}
            </div>
          ) : (
            events.slice(0, 8).map((ev, i) => {
              const commit = eventCommitMsg(ev);
              return (
                <div
                  key={ev.id}
                  style={{
                    padding: "11px 16px",
                    borderBottom:
                      i < events.length - 1 ? "1px solid #0D1B27" : "none",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  {/* Event type dot */}
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background:
                        ev.type === "PushEvent"
                          ? "#43D9AD"
                          : ev.type === "CreateEvent"
                            ? "#4D5BCE"
                            : ev.type === "WatchEvent"
                              ? "#FEA55F"
                              : "#607B96",
                      flexShrink: 0,
                      marginTop: "5px",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontFamily: "'Fira Code', monospace",
                          fontSize: "12px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {eventLabel(ev)}
                      </span>
                      <span
                        style={{
                          color: "#2B3D4F",
                          fontFamily: "'Fira Code', monospace",
                          fontSize: "10px",
                          flexShrink: 0,
                        }}
                      >
                        {timeAgo(ev.created_at)}
                      </span>
                    </div>
                    {commit && (
                      <div
                        style={{
                          color: "#607B96",
                          fontFamily: "'Fira Code', monospace",
                          fontSize: "11px",
                          marginTop: "3px",
                        }}
                      >
                        {`"${commit}"`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
