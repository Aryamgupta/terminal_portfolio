import { useMemo } from "react";
import { TerminalCard,AboutPageProps } from "@/types/types-about";

export function useTerminalCards(
  activeTab: string,
  personalInfo: AboutPageProps["personalInfo"],
  education: AboutPageProps["education"],
  certificates: AboutPageProps["certificates"],
  skillCategories: AboutPageProps["skillCategories"],
  experiences: AboutPageProps["experiences"],
): TerminalCard[] {
  return useMemo(() => {
    // ---------------- GitHub Activity ----------------
    if (activeTab === "github-activity") {
      return [
        {
          id: "git-fetch",
          title: "git-fetch.sh",
          lines: [
            { prompt: "$", cmd: "git remote update", color: "#43D9AD" },
            {
              prompt: ">",
              cmd: "fetching latest activity...",
              color: "#607B96",
            },
            { prompt: "$", cmd: "git log --oneline -n 5", color: "#43D9AD" },
            { prompt: ">", cmd: "Latest commits displayed", color: "#FFFFFF" },
          ],
        },
      ];
    }

    // ---------------- Education ----------------
    if (activeTab.startsWith("edu-")) {
      const idx = parseInt(activeTab.split("-")[1], 10) || 0;
      const edu = education?.[idx];

      return [
        {
          id: "ls-edu",
          title: "ls-education.sh",
          lines: [
            { prompt: "$", cmd: "ls education/degrees", color: "#43D9AD" },
            {
              prompt: ">",
              cmd: `${(edu?.name || "unknown")
                .toLowerCase()
                .replace(/\s+/g, "_")}.pdf`,
              color: "#4D5BCE",
            },
            { prompt: "$", cmd: "cat institution.txt", color: "#43D9AD" },
            {
              prompt: ">",
              cmd: `${edu?.institution || "N/A"}`,
              color: "#FFFFFF",
            },
            { prompt: "$", cmd: "echo $YEAR", color: "#43D9AD" },
            { prompt: ">", cmd: `${edu?.year || "N/A"}`, color: "#27C840" },
          ],
        },
      ];
    }

    // ---------------- Certificates ----------------
    if (activeTab.startsWith("cert-")) {
      const id = activeTab.split("-")[1];
      const cert = certificates?.find((c) => c.id === id);

      return [
        {
          id: "verify-cert",
          title: "verify-cert.sh",
          lines: [
            {
              prompt: "$",
              cmd: "verify-credential --check validity",
              color: "#43D9AD",
            },
            { prompt: ">", cmd: "Status: VALID ✓", color: "#27C840" },
            { prompt: "$", cmd: "cat issuer.txt", color: "#43D9AD" },
            {
              prompt: ">",
              cmd: `${cert?.issuer || "Verified Issuer"}`,
              color: "#FFFFFF",
            },
            { prompt: "$", cmd: "curl --verify-link", color: "#43D9AD" },
            {
              prompt: ">",
              cmd: `${cert?.link || "No link available"}`,
              color: "#4D5BCE",
            },
          ],
        },
      ];
    }

    // ---------------- Experience ----------------
    if (activeTab.startsWith("exp-")) {
      const id = activeTab.split("-")[1];
      const exp = experiences?.find((e) => e.id === id);

      return [
        {
          id: "exp-status",
          title: "work-history.sh",
          lines: [
            { prompt: "$", cmd: "cat current_role.json", color: "#43D9AD" },
            {
              prompt: ">",
              cmd: `{ "company": "${exp?.company || "N/A"}", "role": "${
                exp?.role || "N/A"
              }" }`,
              color: "#FFFFFF",
            },
            { prompt: "$", cmd: "get --duration", color: "#43D9AD" },
            {
              prompt: ">",
              cmd: `"${exp?.duration || "N/A"}"`,
              color: "#27C840",
            },
            { prompt: "$", cmd: "echo $LOCATION", color: "#43D9AD" },
            {
              prompt: ">",
              cmd: `${exp?.location || "Remote"}`,
              color: "#FFFFFF",
            },
          ],
        },
      ];
    }

    // ---------------- Contact ----------------
    if (["email", "phone", "location"].includes(activeTab)) {
      return [
        {
          id: "ping-net",
          title: "ping-connectivity.sh",
          lines: [
            {
              prompt: "$",
              cmd: `ping ${activeTab}.server`,
              color: "#43D9AD",
            },
            {
              prompt: ">",
              cmd: `64 bytes from ${activeTab}: icmp_seq=1 ttl=56`,
              color: "#607B96",
            },
            { prompt: ">", cmd: "connection stable.", color: "#27C840" },
          ],
        },
      ];
    }

    // ---------------- Default (Bio + Skills) ----------------
    return [
      {
        id: "whoami",
        title: "whoami.sh",
        lines: [
          { prompt: "$", cmd: "whoami", color: "#43D9AD" },
          {
            prompt: ">",
            cmd: `${personalInfo?.name || "Developer"}`,
            color: "#FFFFFF",
          },
          { prompt: "$", cmd: "cat role.txt", color: "#43D9AD" },
          {
            prompt: ">",
            cmd: `${personalInfo?.role?.[0] || "Full Stack Developer"}`,
            color: "#FFFFFF",
          },
          { prompt: "$", cmd: "echo $BIO", color: "#43D9AD" },
          {
            prompt: ">",
            cmd: `${personalInfo?.bio?.[0] || "Building great software"}`,
            color: "#607B96",
          },
        ],
      },
      {
        id: "skills",
        title: "ls-skills.sh",
        lines: [
          { prompt: "$", cmd: "ls skills/", color: "#43D9AD" },
          {
            prompt: ">",
            cmd:
              (skillCategories?.[0]?.skills || [])
                .slice(0, 3)
                .map((s) => s.toLowerCase() + "/")
                .join(" ") || "javascript/ react/ node.js/",
            color: "#4D5BCE",
          },
          {
            prompt: " ",
            cmd:
              (skillCategories?.[1]?.skills || [])
                .slice(0, 3)
                .map((s) => s.toLowerCase() + "/")
                .join(" ") || "mongodb/ express/ typescript/",
            color: "#4D5BCE",
          },
        ],
      },
    ];
  }, [
    activeTab,
    personalInfo,
    education,
    certificates,
    skillCategories,
    experiences,
  ]);
}
