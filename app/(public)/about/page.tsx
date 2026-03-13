import React from "react";
import dbConnect from "@/lib/db";
import Project from "@/lib/models/Project";
import PersonalInfo from "@/lib/models/PersonalInfo";
import Degree from "@/lib/models/Degree";
import Certificate from "@/lib/models/Certificate";
import AboutPageContent from "@/components/AboutPageContent";

async function getAboutData() {
  await dbConnect();
  const [personalInfo, education, certificates] = await Promise.all([
    PersonalInfo.findOne({}),
    Degree.find({}),
    Certificate.find({}),
  ]);

  // Mock technologies as they seem to be hardcoded or missing from models list
  const technologies = [
    "JavaScript", "React", "Next.js", "Node.js", 
    "MongoDB", "Express", "Tailwind CSS", "TypeScript"
  ];

  return {
    personalInfo: JSON.parse(JSON.stringify(personalInfo)),
    education: JSON.parse(JSON.stringify(education)),
    certificates: JSON.parse(JSON.stringify(certificates)),
    technologies,
  };
}

export default async function AboutPage() {
  const data = await getAboutData();

  return <AboutPageContent {...data} />;
}