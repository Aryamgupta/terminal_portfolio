import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const ProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  imageLink: z.string().optional().nullable(),
  description: z.string(),
  techStack: z.array(z.string()),
  link: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  techIds: z.array(z.string()).optional(),
});

export const projectRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
  }),
  
  upsert: protectedProcedure
    .input(ProjectSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      
      if (id) {
        return await prisma.project.update({
          where: { id },
          data,
        });
      } else {
        return await prisma.project.create({
          data,
        });
      }
    }),
    
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await prisma.project.delete({
        where: { id: input },
      });
    }),
});
