import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), ".env.local") });

async function seed() {
  const prisma = new PrismaClient();

  try {
    console.log("Seeding database...");

    // 1. Personal Info
    await prisma.personalInfo.deleteMany();
    await prisma.personalInfo.create({
      data: {
        name: "Name",
        role: ["Role1","Role2"],
        bio: [
          "/**",
          " * About me",
          " *",
          " * Aboutline 1",
          " * Aboutline 2",
          " * Aboutline 3",
          " * Aboutline 4",
          " *",
          " * Aboutline 5",
          " */"
        ],
        interests: [
          "/**",
          " * Interests",
          " *",
          " * - Intrest1",
          " * - Intrest2",
          " * - Intrest3",
          " * - Intrest4",
          " * - Intrest5",
          " */"
        ],
        email: "[EMAIL_ADDRESS]",
        phone: "[Phone]",
        location: "[Location]",
        githubLink: "[Github]",
        linkedinLink: "[LinkedIn]",
        twitterLink: "[Twitter]"
      }
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
