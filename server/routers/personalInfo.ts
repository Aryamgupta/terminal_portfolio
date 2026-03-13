import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import PersonalInfo from "@/lib/models/PersonalInfo";
import dbConnect from "@/lib/db";

const PersonalInfoSchema = z.object({
  personalInfo: z.string(),
});

export const personalInfoRouter = router({
  get: publicProcedure.query(async () => {
    await dbConnect();
    const info = await PersonalInfo.findOne({});
    return info;
  }),
  update: publicProcedure
    .input(PersonalInfoSchema)
    .mutation(async ({ input }) => {
      await dbConnect();
      const info = await PersonalInfo.findOneAndUpdate({}, input, {
        new: true,
        upsert: true,
      });
      return info;
    }),
});
