import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

// Load .env.local
config({ path: path.join(process.cwd(), ".env.local") });

async function exportData() {
  // Fix the DATABASE_LINK to include the database name if necessary
  let dbUrl = process.env.DATABASE_LINK || "";
  if (dbUrl.includes(".net/?")) {
    dbUrl = dbUrl.replace(".net/?", ".net/test?");
  }

  // Set the variable explicitly
  process.env.DATABASE_LINK = dbUrl;

  const prisma = new PrismaClient();

  try {
    console.log("Fetching portfolio data from MongoDB...");

    const [
      personalInfo,
      projects,
      education,
      certificates,
      skillCategories,
      techIcons
    ] = await Promise.all([
      prisma.personalInfo.findFirst(),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.education.findMany(),
      prisma.certificate.findMany(),
      prisma.skillCategory.findMany(),
      prisma.techIcon.findMany()
    ]);

    const portfolioData = {
      personalInfo,
      projects,
      education,
      certificates,
      skillCategories,
      techIcons,
      exportedAt: new Date().toISOString()
    };

    const dataDir = path.join(process.cwd(), "public", "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, "portfolio-data.json");
    fs.writeFileSync(filePath, JSON.stringify(portfolioData, null, 2));

    console.log(`Successfully exported data to ${filePath}`);
  } catch (error) {
    console.error("Error exporting data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
