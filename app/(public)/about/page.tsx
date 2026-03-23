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

export const revalidate = 5000;

export default async function AboutPage() {
  const data = await getAboutData();
  return <AboutPageContent {...(data as unknown as AboutPageProps)} />;
}
