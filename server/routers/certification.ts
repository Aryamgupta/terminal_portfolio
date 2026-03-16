import { z } from "zod";
import { router, publicProcedure } from "../trpc";
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
  getAll: publicProcedure.query(async () => {
    return await prisma.certificate.findMany({
      orderBy: { date: "desc" },
    });
  }),
  
  upsert: publicProcedure
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
    
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await prisma.certificate.delete({
        where: { id: input },
      });
    }),
});
