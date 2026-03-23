import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const SocialLinksSchema = z.object({
  id: z.string().optional(),
  platform: z.string(),
  url: z.string(),
  iconId: z.string().optional().nullable(),
});

export const socialLinksRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await prisma.socialLinks.findMany({
      orderBy: { platform: "asc" },
    });
  }),

  upsert: protectedProcedure
    .input(SocialLinksSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      if (id) {
        return await prisma.socialLinks.update({
          where: { id },
          data,
        });
      } else {
        return await prisma.socialLinks.create({
          data,
        });
      }
    }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return await prisma.socialLinks.delete({
      where: { id: input },
    });
  }),
});
