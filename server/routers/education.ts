import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const EducationSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  institution: z.string(),
  percentage: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  type: z.string().default("university"),
});

export const educationRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await prisma.education.findMany({
      orderBy: { year: "desc" },
    });
  }),
  
  upsert: protectedProcedure
    .input(EducationSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      
      if (id) {
        return await prisma.education.update({
          where: { id },
          data,
        });
      } else {
        return await prisma.education.create({
          data,
        });
      }
    }),
    
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await prisma.education.delete({
        where: { id: input },
      });
    }),
});
