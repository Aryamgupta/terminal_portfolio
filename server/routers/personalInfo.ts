import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const PersonalInfoSchema = z.object({
  name: z.string(),
  role: z.array(z.string()),
  bio: z.array(z.string()),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  githubLink: z.string().optional().nullable(),
  linkedinLink: z.string().optional().nullable(),
  twitterLink: z.string().optional().nullable(),
  resumeLink: z.string().optional().nullable(),
  interests: z.array(z.string()),
});

export const personalInfoRouter = router({
  get: publicProcedure.query(async () => {
    return await prisma.personalInfo.findFirst();
  }),
  update: publicProcedure
    .input(PersonalInfoSchema)
    .mutation(async ({ input }) => {
      const existing = await prisma.personalInfo.findFirst();

      if (existing) {
        return await prisma.personalInfo.update({
          where: { id: existing.id },
          data: input,
        });
      } else {
        return await prisma.personalInfo.create({
          data: input,
        });
      }
    }),
});
