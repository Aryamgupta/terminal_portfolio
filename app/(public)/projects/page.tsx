import fs from "fs";
import path from "path";
import ProjectsContent from "@/components/ProjectsContent";

async function getProjectsData() {
  const projectsPath = path.join(process.cwd(), "public/data/projects.json");
  const skillsPath = path.join(process.cwd(), "public/data/skills.json");
  
  const projectsJson = fs.existsSync(projectsPath) ? fs.readFileSync(projectsPath, "utf8") : '{"data":[]}';
  const skillsJson = fs.existsSync(skillsPath) ? fs.readFileSync(skillsPath, "utf8") : '{"categories":[],"icons":[]}';

  const { data: projects } = JSON.parse(projectsJson);
  const { categories: skillCategories, icons: techIcons } = JSON.parse(skillsJson);

  return {
    projects: projects || [],
    techIcons: techIcons || [],
    skillCategories: skillCategories || [],
  };
}

export default async function ProjectsPage() {
  const data = await getProjectsData();
  return <ProjectsContent {...data} />;
}