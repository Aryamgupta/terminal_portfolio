import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { execSync } from "child_process";

export const analyticsRouter = router({
  getStats: publicProcedure.query(async () => {
    try {
      const [
        totalProjects,
        totalCertifications,
        totalMessages,
        totalTechs,
        earliestEducation,
        latestProject,
      ] = await Promise.all([
        prisma.project.count(),
        prisma.certificate.count(),
        prisma.message.count(),
        prisma.techIcon.count(),
        prisma.education.findFirst({
          orderBy: { year: "asc" },
        }),
        prisma.project.findFirst({
          orderBy: { order: "desc" }, // Assuming order or date is best
        }),
      ]);

      // Calculate years of experience
      let yearsOfExperience = 0;
      if (earliestEducation?.year) {
        const startYear = parseInt(earliestEducation.year.split("-")[0]);
        if (!isNaN(startYear)) {
          yearsOfExperience = new Date().getFullYear() - startYear;
        }
      }

      // Get icons for latest project tech stack
      let latestTechIcons: any[] = [];
      if (latestProject?.techStack) {
        latestTechIcons = await prisma.techIcon.findMany({
          where: {
            name: { in: latestProject.techStack },
          },
        });
      }

      // Git Last Update
      let lastCommitDate = "Unknown";
      try {
        lastCommitDate = execSync('git log -1 --format=%cd --date=relative').toString().trim();
      } catch (e) {
        console.error("Git error:", e);
      }

      return {
        totalProjects,
        totalCertifications,
        totalMessages,
        totalTechs,
        yearsOfExperience,
        lastCommitDate,
        latestProject: latestProject ? {
          title: latestProject.title,
          techStack: latestProject.techStack,
          techIcons: latestTechIcons,
        } : null,
        vercelStatus: "Productionized", // Placeholder as requested
      };
    } catch (error) {
      console.error("Analytics Error:", error);
      throw new Error("Failed to fetch analytics");
    }
  }),
});
