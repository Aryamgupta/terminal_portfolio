import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import Degree from "@/lib/models/Degree";
import Certificate from "@/lib/models/Certificate";
import Link from "@/lib/models/Link";
import Message from "@/lib/models/Message";
import dbConnect from "@/lib/db";

export const portfolioRouter = router({
  getDegrees: protectedProcedure.query(async () => {
    await dbConnect();
    return await Degree.find({});
  }),
  getCertificates: protectedProcedure.query(async () => {
    await dbConnect();
    return await Certificate.find({});
  }),
  getLinks: protectedProcedure.query(async () => {
    await dbConnect();
    return await Link.find({});
  }),
  sendMessage: protectedProcedure
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
