import React from "react";
import Project from "@/lib/models/Project";
import dbConnect from "@/lib/db";
import ProjectsContent from "@/components/ProjectsContent";

async function getProjects() {
  await dbConnect();
  const projects = await Project.find({}).sort({ _id: -1 });
  return JSON.parse(JSON.stringify(projects));
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsContent projects={projects} />;
}