import ProjectsContent from "@/components/ProjectsContent";
import { Project, SkillCategory, TechIcon } from "@prisma/client";
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

export default async function ProjectsPage() {
  const data = await getProjectsData();
  return <ProjectsContent {...data} />;
}
