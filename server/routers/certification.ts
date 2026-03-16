import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const CertificationSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  issuer: z.string(),
  link: z.string().optional().nullable(),
  img: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
});

export const certificationRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await prisma.certificate.findMany({
      orderBy: { date: "desc" },
    });
  }),
  
  upsert: protectedProcedure
    .input(CertificationSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      
      if (id) {
        return await prisma.certificate.update({
          where: { id },
          data,
        });
      } else {
        return await prisma.certificate.create({
          data,
        });
      }
    }),
    
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await prisma.certificate.delete({
        where: { id: input },
      });
    }),
});
