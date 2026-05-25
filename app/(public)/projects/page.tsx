import ProjectsContent from "@/components/ProjectsContent";
import { Project, SkillCategory, TechIcon, PersonalInfo } from "@prisma/client";
import { kv } from "@vercel/kv";

type KVResponse<T> = {
  data: T;
  exportedAt: string;
};

async function getProjectsData() {
  const [projectsData, skillsData] = await Promise.all([
    kv.get("projects"),
    kv.get("skills"),
  ]);

  const projects = (projectsData as KVResponse<Project[]>)?.data || [];

  const skills = (
    skillsData as KVResponse<{
      categories: SkillCategory[];
      icons: TechIcon[];
    }>
  )?.data || { categories: [], icons: [] };

  return {
    projects,
    techIcons: skills.icons,
    skillCategories: skills.categories,
  };
}

export async function generateMetadata() {
  let personalInfo: PersonalInfo | null = null;
  let projects: Project[] = [];
  try {
    const [personalInfoData, projectsData] = await Promise.all([
      kv.get("personal-info"),
      kv.get("projects"),
    ]);
    personalInfo = (personalInfoData as KVResponse<PersonalInfo | null>)?.data || null;
    projects = (projectsData as KVResponse<Project[]>)?.data || [];
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
