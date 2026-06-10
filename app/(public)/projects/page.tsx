import ProjectsContent from "@/components/ProjectsContent";
import { Project, SkillCategory, TechIcon, PersonalInfo } from "@prisma/client";
import { getCachedData } from "@/lib/cache";
import { prisma } from "@/lib/prisma";

async function getProjectsData() {
  const [projects, skills] = await Promise.all([
    getCachedData<Project[]>("projects", () =>
      prisma.project.findMany({
        orderBy: { order: "asc" },
      })
    ),
    getCachedData<{ categories: SkillCategory[]; icons: TechIcon[] }>("skills", async () => {
      const [categories, icons] = await Promise.all([
        prisma.skillCategory.findMany(),
        prisma.techIcon.findMany(),
      ]);
      return { categories, icons };
    }),
  ]);

  return {
    projects,
    techIcons: skills?.icons || [],
    skillCategories: skills?.categories || [],
  };
}

export async function generateMetadata() {
  let personalInfo: PersonalInfo | null = null;
  let projects: Project[] = [];
  try {
    const [personalInfoVal, projectsVal] = await Promise.all([
      getCachedData<PersonalInfo | null>("personal-info", () =>
        prisma.personalInfo.findFirst()
      ),
      getCachedData<Project[]>("projects", () =>
        prisma.project.findMany({
          orderBy: { order: "asc" },
        })
      ),
    ]);
    personalInfo = personalInfoVal;
    projects = projectsVal || [];
  } catch (e) {
    console.error("Failed to load projects page metadata", e);
  }

  const name = personalInfo?.name || "Aryam Gupta";
  const projectTech = Array.from(new Set(projects.flatMap((p) => p.techStack || [])));

  return {
    title: "Projects",
    description: `Browse developer projects built by ${name}. Features applications built with modern web technologies.`,
    keywords: [
      "Projects",
      "Portfolio",
      "Software Projects",
      "Web Apps",
      ...projectTech,
    ],
    openGraph: {
      title: `Projects | ${name}`,
      description: `Explore the portfolio projects of ${name}.`,
      url: "/projects",
    },
    twitter: {
      title: `Projects | ${name}`,
      description: `Explore the portfolio projects of ${name}.`,
    },
  };
}

export default async function ProjectsPage() {
  const data = await getProjectsData();
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
        "name": "Projects",
        "item": `${baseUrl}/projects`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProjectsContent {...data} />
    </>
  );
}
