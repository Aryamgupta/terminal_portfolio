import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const ExperienceSchema = z.object({
  id: z.string().optional(),
  company: z.string(),
  role: z.string(),
  location: z.string().optional().nullable(),
  duration: z.string(),
  description: z.array(z.string()),
  order: z.number().default(0),
});

export const experienceRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });
  }),
  
  upsert: protectedProcedure
    .input(ExperienceSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      
      if (id) {
        return await prisma.experience.update({
          where: { id },
          data,
        });
      } else {
        return await prisma.experience.create({
          data,
        });
      }
    }),
    
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await prisma.experience.delete({
        where: { id: input },
      });
    }),
});
