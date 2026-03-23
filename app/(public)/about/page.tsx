import AboutPageContent from "@/components/AboutPageRefactored";
import { prisma } from "@/lib/prisma";

async function getAboutData() {
  const [
    personalInfo,
    education,
    certificates,
    skillCategories,
    experiences,
    techIcons,
  ] = await Promise.all([
    prisma.personalInfo.findFirst(),
    prisma.education.findMany(),
    prisma.certificate.findMany(),
    prisma.skillCategory.findMany(),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.techIcon.findMany(),
  ]);

  return {
    personalInfo: personalInfo || null,
    education: education || [],
    certificates: certificates || [],
    skillCategories: skillCategories || [],
    experiences: experiences || [],
    techIcons: techIcons || [],
  };
}

import { AboutPageProps } from "@/types/types-about";

export default async function AboutPage() {
  const data = await getAboutData();
  return <AboutPageContent {...(data as unknown as AboutPageProps)} />;
}