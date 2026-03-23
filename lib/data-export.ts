import { prisma } from "./prisma";
import { kv } from "@vercel/kv";

type KVModule<T> = {
  data: T;
  exportedAt: string;
};

export async function generatePortfolioJson(module?: string) {
  try {
    const exportModule = async <T>(name: string, data: T) => {
      const payload: KVModule<T> = {
        data,
        exportedAt: new Date().toISOString(),
      };

      await kv.set(name, payload);
      return { name };
    };

    const results: { name: string }[] = [];

    if (!module || module === "personal-info") {
      const data = await prisma.personalInfo.findFirst();
      results.push(await exportModule("personal-info", data));
    }

    if (!module || module === "projects") {
      const data = await prisma.project.findMany({
        orderBy: { order: "asc" },
      });
      results.push(await exportModule("projects", data));
    }

    if (!module || module === "education") {
      const data = await prisma.education.findMany();
      results.push(await exportModule("education", data));
    }

    if (!module || module === "certificates") {
      const data = await prisma.certificate.findMany();
      results.push(await exportModule("certificates", data));
    }

    if (!module || module === "skills") {
      const [categories, icons] = await Promise.all([
        prisma.skillCategory.findMany(),
        prisma.techIcon.findMany(),
      ]);

      results.push(
        await exportModule("skills", {
          categories,
          icons,
        }),
      );
    }

    if (!module || module === "experience") {
      const data = await prisma.experience.findMany({
        orderBy: { order: "asc" },
      });
      results.push(await exportModule("experience", data));
    }

    if (!module || module === "social-links") {
      const data = await prisma.socialLinks.findMany({
        orderBy: { platform: "asc" },
      });
      results.push(await exportModule("social-links", data));
    }

    return {
      success: true,
      modules: results,
    };
  } catch (error) {
    console.error("Error exporting modular data:", error);
    throw error;
  }
}
