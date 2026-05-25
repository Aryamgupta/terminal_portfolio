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
import { kv } from "@vercel/kv";

export type KVResponse<T> = {
  data: T;
  exportedAt: string;
};

async function getAboutData() {
  const [
    personalInfoData,
    educationData,
    certificatesData,
    skillsData,
    experienceData,
  ] = await Promise.all([
    kv.get("personal-info"),
    kv.get("education"),
    kv.get("certificates"),
    kv.get("skills"),
    kv.get("experience"),
  ]);

  const personalInfo =
    (personalInfoData as KVResponse<PersonalInfo | null>)?.data || null;

  const education = (educationData as KVResponse<Education[]>)?.data || [];

  const certificates =
    (certificatesData as KVResponse<Certificate[]>)?.data || [];

  const skills = (
    skillsData as KVResponse<{
      categories: SkillCategory[];
      icons: TechIcon[];
    }>
  )?.data || { categories: [], icons: [] };

  const experiences = (experienceData as KVResponse<Experience[]>)?.data || [];

  return {
    personalInfo,
    education,
    certificates,
    skillCategories: skills.categories,
    techIcons: skills.icons,
    experiences,
  };
}

export async function generateMetadata() {
  let personalInfo: PersonalInfo | null = null;
  let skills: { categories: SkillCategory[] } = { categories: [] };
  try {
    const [personalInfoData, skillsData] = await Promise.all([
      kv.get("personal-info"),
      kv.get("skills"),
    ]);
    personalInfo = (personalInfoData as KVResponse<PersonalInfo | null>)?.data || null;
    skills = (
      skillsData as KVResponse<{
        categories: SkillCategory[];
        icons: TechIcon[];
      }>
    )?.data || { categories: [], icons: [] };
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
