import { router } from "../trpc";
import { projectRouter } from "./project";
import { personalInfoRouter } from "./personalInfo";
import { portfolioRouter } from "./portfolio";
import { authRouter } from "./auth";

export const appRouter = router({
  project: projectRouter,
  personalInfo: personalInfoRouter,
  portfolio: portfolioRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
