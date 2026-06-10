import AboutPageContent from "@/components/AboutPageRefactored";
import { AboutPageProps } from "@/types/types-about";
import {
  Certificate,
  Education,
  Experience,
  PersonalInfo,
  SkillCategory,
  TechIcon,
} from "@prisma/client";
import { getCachedData } from "@/lib/cache";
import { prisma } from "@/lib/prisma";

async function getAboutData() {
  const [
    personalInfo,
    education,
    certificates,
    skills,
    experiences,
  ] = await Promise.all([
    getCachedData<PersonalInfo | null>("personal-info", () =>
      prisma.personalInfo.findFirst()
    ),
    getCachedData<Education[]>("education", () =>
      prisma.education.findMany({ orderBy: { year: "asc" } })
    ),
    getCachedData<Certificate[]>("certificates", () =>
      prisma.certificate.findMany()
    ),
    getCachedData<{ categories: SkillCategory[]; icons: TechIcon[] }>("skills", async () => {
      const [categories, icons] = await Promise.all([
        prisma.skillCategory.findMany(),
        prisma.techIcon.findMany(),
      ]);
      return { categories, icons };
    }),
    getCachedData<Experience[]>("experience", () =>
      prisma.experience.findMany({ orderBy: { order: "asc" } })
    ),
  ]);

  return {
    personalInfo,
    education,
    certificates,
    skillCategories: skills?.categories || [],
    techIcons: skills?.icons || [],
    experiences,
  };
}

export async function generateMetadata() {
  let personalInfo: PersonalInfo | null = null;
  let skills: { categories: SkillCategory[] } = { categories: [] };
  try {
    const [personalInfoVal, skillsVal] = await Promise.all([
      getCachedData<PersonalInfo | null>("personal-info", () =>
        prisma.personalInfo.findFirst()
      ),
      getCachedData<{ categories: SkillCategory[]; icons: TechIcon[] }>("skills", async () => {
        const [categories, icons] = await Promise.all([
          prisma.skillCategory.findMany(),
          prisma.techIcon.findMany(),
        ]);
        return { categories, icons };
      }),
    ]);
    personalInfo = personalInfoVal;
    skills = skillsVal || { categories: [], icons: [] };
  } catch (e) {
    console.error("Failed to load about page metadata", e);
  }

  const name = personalInfo?.name || "Aryam Gupta";
  const bioLines = personalInfo?.bio || [];
  const cleanedBio = bioLines
    .map(line => line.trim())
    .filter(line => line !== "/**" && line !== "*/" && line !== "/*" && line !== "*")
    .map(line => line.startsWith("*") ? line.replace(/^\*\s*/, "") : line)
    .filter(Boolean)
    .join(" ");

  const skillsList = skills.categories.flatMap((cat) => cat.skills.map((s) => s.name));

  const description =
    cleanedBio ||
    `Learn more about ${name}, education, certificates, experience, and skill set.`;

  return {
    title: "About Me",
    description,
    keywords: [
      "About Me",
      "Developer Background",
      "Skills",
      "Experience",
      "Education",
      ...skillsList,
    ],
    openGraph: {
      title: `About Me | ${name}`,
      description,
      url: "/about",
    },
    twitter: {
      title: `About Me | ${name}`,
      description,
    },
  };
}

export const revalidate = 5000;

export default async function AboutPage() {
  const data = await getAboutData();
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About",
        "item": `${baseUrl}/about`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <AboutPageContent {...(data as unknown as AboutPageProps)} />
    </>
  );
}
