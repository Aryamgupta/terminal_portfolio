import AboutPageContent from "@/components/AboutPageRefactored";
import fs from "fs";
import path from "path";
// import AboutPageContent from "@/components/AboutPageContent";

async function getAboutData() {
  const dataPath = path.join(process.cwd(), "public/data/portfolio-data.json");
  const jsonData = fs.readFileSync(dataPath, "utf8");
  const data = JSON.parse(jsonData);

  return {
    personalInfo: data.personalInfo,
    education: data.education,
    certificates: data.certificates,
    skillCategories: data.skillCategories,
    experiences: data.experiences || [],
  };
}

export default async function AboutPage() {
  const data = await getAboutData();
  return <AboutPageContent {...data} />;
}