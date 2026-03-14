import fs from "fs";
import path from "path";
import ProjectsContent from "@/components/ProjectsContent";

async function getProjectsData() {
  const dataPath = path.join(process.cwd(), "public/data/portfolio-data.json");
  const jsonData = fs.readFileSync(dataPath, "utf8");
  const data = JSON.parse(jsonData);

  return {
    projects: data.projects,
    techIcons: data.techIcons,
    skillCategories: data.skillCategories,
  };
}

export default async function ProjectsPage() {
  const data = await getProjectsData();
  return <ProjectsContent {...data} />;
}