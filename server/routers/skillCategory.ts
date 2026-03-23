import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const SkillCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  skills: z.array(z.object({
    name: z.string(),
    iconId: z.string().optional().nullable(),
  })),
});

export const skillCategoryRouter = router({
  getAll: protectedProcedure.query(async () => {
    const rawCategories = await prisma.skillCategory.findMany();
    return rawCategories.map((cat) => ({
      ...cat,
      skills: ((cat.skills as unknown[]) || []).map((s) => {
        if (typeof s === "string") return { name: s, iconId: null };
        const skill = s as { name?: string; iconId?: string | null };
        return {
          name: skill.name || "",
          iconId: skill.iconId || null,
        };
      }),
    }));
  }),

  upsert: protectedProcedure
    .input(SkillCategorySchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      if (id) {
        return await prisma.skillCategory.update({
          where: { id },
          data: {
            name: data.name,
            skills: data.skills,
          },
        });
      } else {
        return await prisma.skillCategory.create({
          data: {
            name: data.name,
            skills: data.skills,
          },
        });
      }
    }),
    
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await prisma.skillCategory.delete({
        where: { id: input },
      });
    }),
});
