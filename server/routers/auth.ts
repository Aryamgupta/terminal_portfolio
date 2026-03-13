import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ pin: z.string() }))
    .mutation(async ({ input }) => {
      // Direct migration of original logic (checking against env or simple pin)
      // Original frontned used localStorage.setItem("pin", ...)
      const correctPin = process.env.ADMIN_PIN || "1234"; // Default for now
      if (input.pin === correctPin) {
        return { success: true, token: "admin-token" }; // Simplified
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid PIN",
      });
    }),
});
