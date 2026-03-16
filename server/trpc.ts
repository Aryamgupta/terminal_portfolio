import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";

export const t = initTRPC.context<{ session: Session | null }>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(async ({ ctx, next }) => {
  // Use session from context if available, otherwise fallback to getServerSession
  const session = ctx.session || await getServerSession(authOptions);
  
  console.log("--------------------------------------------------");
  console.log("[TRPC-AUTH-DEBUG]");
  console.log("Context Session:", !!ctx.session);
  console.log("fallback Session:", !!session);
  if (session) {
    console.log("User Email:", session.user?.email);
    console.log("Token Expiry:", session.user?.accessTokenExpires);
    console.log("Current Time:", Date.now());
  }
  console.log("--------------------------------------------------");
  
  if (!session || !session.user) {
    console.log("[TRPC-AUTH-CHECK] Rejecting: No session found.");
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Check if the access token window (30 minutes) has expired.
  if (session.user.accessTokenExpires && Date.now() > session.user.accessTokenExpires) {
    console.log("[TRPC-AUTH-CHECK] Rejecting: Token Expired");
    throw new TRPCError({ 
      code: "UNAUTHORIZED", 
      message: "Access token expired. Please refresh your session." 
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      session,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
