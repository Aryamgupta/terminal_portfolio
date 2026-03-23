import fs from "fs";
import path from "path";
import AboutPageContent from "@/components/AboutPageRefactored";
import { AboutPageProps } from "@/types/types-about";
import {
  Education,
  Experience,
  PersonalInfo,
  SkillCategory,
  TechIcon,
} from "@prisma/client";
import { Certificate } from "crypto";

async function getAboutData() {
  const dataDir = path.join(process.cwd(), "public/data");

  const readFile = (name: string, fallback: Record<string, unknown>) => {
    const filePath = path.join(dataDir, `${name}.json`);
    if (!fs.existsSync(filePath)) return fallback;
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
      return fallback;
    }
  };

  const personalInfo = (
    readFile("personal-info", { data: null }) as { data: PersonalInfo }
  ).data;
  const education = (
    readFile("education", { data: [] }) as { data: Education[] }
  ).data;
  const certificates = (
    readFile("certificates", { data: [] }) as { data: Certificate[] }
  ).data;
  const skills = readFile("skills", { categories: [], icons: [] }) as {
    categories: SkillCategory[];
    icons: TechIcon[];
  };
  const experiences = (
    readFile("experience", { data: [] }) as { data: Experience[] }
  ).data;

  return {
    personalInfo: personalInfo,
    education: education,
    certificates: certificates,
    skillCategories: skills.categories,
    experiences: experiences,
    techIcons: skills.icons,
  };
}

export default async function AboutPage() {
  const data = await getAboutData();
  return <AboutPageContent {...(data as unknown as AboutPageProps)} />;
}
