import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../lib/prisma";
import { sendInquiryEmail } from "../../lib/mail";

export const messageRouter = router({
  getAll: protectedProcedure.query(async () => {
    return prisma.message.findMany({
      orderBy: { time: "desc" },
    });
  }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string(), read: z.boolean() }))
    .mutation(async ({ input }: { input: { id: string; read: boolean } }) => {
      return prisma.message.update({
        where: { id: input.id },
        data: { read: input.read },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }: { input: string }) => {
      return prisma.message.delete({
        where: { id: input },
      });
    }),

  send: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }: { input: { name: string; email: string; message: string } }) => {
      const newMessage = await prisma.message.create({
        data: {
          senderName: input.name,
          senderEmail: input.email,
          message: input.message,
        },
      });

      // Fire and forget email notification to avoid blocking the user
      sendInquiryEmail(input.name, input.email, input.message).catch((err: unknown) => {
        console.error("Failed to send inquiry email:", err);
      });

      return newMessage;
    }),
});
