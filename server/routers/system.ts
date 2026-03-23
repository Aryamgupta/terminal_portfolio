import { router, protectedProcedure } from "../trpc";
import { generatePortfolioJson } from "@/lib/data-export";
import { TRPCError } from "@trpc/server";

import { z } from "zod";

export const systemRouter = router({
  generateJson: protectedProcedure.mutation(async () => {
    try {
      return await generatePortfolioJson();
    } catch (error) {
      console.error("Failed to generate portfolio JSON:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Kernel failure during JSON generation sequence.",
      });
    }
  }),

  generateModuleJson: protectedProcedure
    .input(z.object({ module: z.string() }))
    .mutation(async ({ input }) => {
      try {
        return await generatePortfolioJson(input.module);
      } catch (error) {
        console.error(`Failed to generate ${input.module} JSON:`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Modular sync failed for domain: ${input.module}`,
        });
      }
    }),

  redeploy: protectedProcedure.mutation(async () => {
    const deployHook = process.env.VERCEL_DEPLOY_HOOK;

    if (!deployHook) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Vercel deploy hook is not configured in environment variables.",
      });
    }

    try {
      const res = await fetch(deployHook, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Vercel API responded with an error");
      }

      return { success: true, message: "Production redeploy sequence initiated." };
    } catch (error) {
      console.error("Error triggering redeploy:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to transmit redeploy signal to Vercel.",
      });
    }
  }),
});
