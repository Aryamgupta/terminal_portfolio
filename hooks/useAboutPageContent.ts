// hooks/useAboutPageContent.ts
import { useMemo } from "react";
import { AboutPageProps } from "@/types/types-about";
import { formatContentLines } from "@/utils/utils-formatting";
import { Experience } from "@prisma/client";

interface ContentBlock {
  label: string;
  lines: string[];
}

type ContentRecord = Record<string, ContentBlock>;

/**
 * useAboutPageContent - Initializes and memoizes all content
 * 
 * Formats data into displayable content blocks.
 * Memoized to prevent unnecessary recalculations.
 */
export function useAboutPageContent(
  personalInfo: AboutPageProps["personalInfo"],
  education: AboutPageProps["education"],
  certificates: AboutPageProps["certificates"],
  experiences: AboutPageProps["experiences"],
  skillCategories: AboutPageProps["skillCategories"],
  techIcons: AboutPageProps["techIcons"]
): ContentRecord {
  return useMemo(() => {
    const content: ContentRecord = {
      bio: {
        label: "bio",
        lines: personalInfo?.bio || [],
      },
      interests: {
        label: "interests",
        lines: personalInfo?.interests || [],
      },
      email: {
        label: "email",
        lines: [`// ${personalInfo?.email || ""}`],
      },
      phone: {
        label: "phone",
        lines: [`// ${personalInfo?.phone || ""}`],
      },
      location: {
        label: "location",
        lines: [`// ${personalInfo?.location || ""}`],
      },
    };

    // Add education blocks
    education.forEach((edu, idx) => {
      const key = `edu-${idx}`;
      content[key] = {
        label: formatContentLines(edu.name),
        lines: [
          "/**",
          ` * ${edu.name}`,
          " *",
          ` * Institution: ${edu.institution}`,
          ` * Year: ${edu.year || "N/A"}`,
          ` * Type: ${edu.type}`,
          " */",
        ],
      };
    });

    // Add certificate blocks
    certificates.forEach((cert) => {
      const key = `cert-${cert.id}`;
      content[key] = {
        label: formatContentLines(cert.name),
        lines: [
          "/**",
          ` * @name    ${cert.name}`,
          ` * @issuer  ${cert.issuer || "Not Specified"}`,
          ` * @link    ${cert.link || "N/A"}`,
          " *",
          " * Click the link to verify this credential.",
          " */",
          "",
          cert.link ? `// Verify: ${cert.link}` : "// No verification link",
        ],
      };
    });


    // Add experience blocks
    experiences.forEach((exp) => {
      const key = `exp-${exp.id}`;
      content[key] = {
        label: formatContentLines(exp.company),
        lines: [
          "/**",
          ` * @company  ${exp.company}`,
          ` * @role     ${exp.role}`,
          ` * @location ${exp.location || "Remote"}`,
          ` * @duration ${exp.duration}`,
          " *",
          " * Technologies:",
          ...(() => {
            const ids = (exp as Experience).techIds || [];
            const techNames = ids.map(id => {
              const icon = techIcons.find(t => t.id === id);
              return icon?.name || "";
            }).filter(Boolean);
            
            if (techNames.length === 0) return [];
            return [` *   ${techNames.join(",  ")}`];
          })(),
          " *",
          " * Key Achievements:",
          ...exp.description.map((line) => ` * ${line}`),
          " */",
        ],
      };
    });

    // Add skill blocks
    skillCategories.forEach((cat, idx) => {
      const key = `skill-${cat.id || idx}`;
      content[key] = {
        label: formatContentLines(cat.name),
        lines: [
          "/**",
          ` * @category ${cat.name}`,
          " *",
          " * Technical Skills Matrix:",
          ...cat.skills.map((s) => {
            const name = typeof s === "string" ? s : s.name;
            const iconId =
              typeof s === "object" && s !== null ? s.iconId : null;
            return ` * • ${name}${iconId ? ` [icon:${iconId}]` : ""}`;
          }),
          " */",
        ],
      };
    });

    return content;
  }, [personalInfo, education, certificates, experiences, skillCategories, techIcons]);
}
