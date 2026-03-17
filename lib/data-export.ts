import { prisma } from "./prisma";
import fs from "fs";
import path from "path";

/**
 * Generates the portfolio-data.json file based on current database content.
 * This is now triggered on-demand from the admin panel.
 */
export async function generatePortfolioJson() {
  try {
    console.log("Fetching portfolio data from database...");

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
      exportedAt: new Date().toISOString()
    };

    const dataDir = path.join(process.cwd(), "public", "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, "portfolio-data.json");
    fs.writeFileSync(filePath, JSON.stringify(portfolioData, null, 2));

    console.log(`Successfully exported data to ${filePath}`);
    return { success: true, path: filePath, exportedAt: portfolioData.exportedAt };
  } catch (error) {
    console.error("Error exporting data:", error);
    throw error;
  }
}
