import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import Degree from "@/lib/models/Degree";
import Certificate from "@/lib/models/Certificate";
import Link from "@/lib/models/Link";
import Message from "@/lib/models/Message";
import dbConnect from "@/lib/db";

export const portfolioRouter = router({
  getDegrees: publicProcedure.query(async () => {
    await dbConnect();
    return await Degree.find({});
  }),
  getCertificates: publicProcedure.query(async () => {
    await dbConnect();
    return await Certificate.find({});
  }),
  getLinks: publicProcedure.query(async () => {
    await dbConnect();
    return await Link.find({});
  }),
  sendMessage: publicProcedure
    .input(z.object({
      senderName: z.string(),
      senderEmail: z.string().email(),
      message: z.string(),
    }))
    .mutation(async ({ input }) => {
      await dbConnect();
      return await Message.create(input);
    }),
});
