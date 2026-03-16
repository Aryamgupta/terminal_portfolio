import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const SkillCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  skills: z.array(z.string()),
});

export const skillCategoryRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await prisma.skillCategory.findMany();
  }),
  
  upsert: protectedProcedure
    .input(SkillCategorySchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      
      if (id) {
        return await prisma.skillCategory.update({
          where: { id },
          data,
        });
      } else {
        return await prisma.skillCategory.create({
          data,
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
