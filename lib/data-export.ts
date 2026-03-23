import { prisma } from "./prisma";
import fs from "fs";
import path from "path";

/**
 * Generates modular JSON files based on database content.
 * Can export all data or a specific module.
 */
export async function generatePortfolioJson(module?: string) {
  try {
    const dataDir = path.join(process.cwd(), "public", "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const exportModule = async (name: string, data: Record<string, unknown>) => {
      const filePath = path.join(dataDir, `${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return { name, path: filePath };
    };

    const results: { name: string; path: string }[] = [];
    const exportedAt = new Date().toISOString();

    if (!module || module === "personal-info") {
      const data = await prisma.personalInfo.findFirst();
      results.push(await exportModule("personal-info", { data, exportedAt }));
    }

    if (!module || module === "projects") {
      const data = await prisma.project.findMany({ orderBy: { order: "asc" } });
      results.push(await exportModule("projects", { data, exportedAt }));
    }

    if (!module || module === "education") {
      const data = await prisma.education.findMany();
      results.push(await exportModule("education", { data, exportedAt }));
    }

    if (!module || module === "certificates") {
      const data = await prisma.certificate.findMany();
      results.push(await exportModule("certificates", { data, exportedAt }));
    }

    if (!module || module === "skills") {
      const [categories, icons] = await Promise.all([
        prisma.skillCategory.findMany(),
        prisma.techIcon.findMany(),
      ]);
      results.push(await exportModule("skills", { categories, icons, exportedAt }));
    }

    if (!module || module === "experience") {
      const data = await prisma.experience.findMany({ orderBy: { order: "asc" } });
      results.push(await exportModule("experience", { data, exportedAt }));
    }

    // Also maintain the legacy combined file for backward compatibility during transition
    if (!module) {
      const [
        personalInfo,
        projects,
        education,
        certificates,
        skillCategories,
        techIcons,
        experiences
      ] = await Promise.all([
        prisma.personalInfo.findFirst(),
        prisma.project.findMany({ orderBy: { order: "asc" } }),
        prisma.education.findMany(),
        prisma.certificate.findMany(),
        prisma.skillCategory.findMany(),
        prisma.techIcon.findMany(),
        prisma.experience.findMany({ orderBy: { order: "asc" } })
      ]);

      const portfolioData = {
        personalInfo,
        projects,
        education,
        certificates,
        skillCategories,
        techIcons,
        experiences,
        exportedAt
      };
      const legacyPath = path.join(dataDir, "portfolio-data.json");
      fs.writeFileSync(legacyPath, JSON.stringify(portfolioData, null, 2));
      results.push({ name: "portfolio-data", path: legacyPath });
    }

    return { 
      success: true, 
      modules: results,
      exportedAt 
    };
  } catch (error) {
    console.error("Error exporting modular data:", error);
    throw error;
  }
}
