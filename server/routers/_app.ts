import { router } from "../trpc";
import { projectRouter } from "./project";
import { personalInfoRouter } from "./personalInfo";
import { portfolioRouter } from "./portfolio";
import { educationRouter } from "./education";
import { certificationRouter } from "./certification";
import { skillCategoryRouter } from "./skillCategory";
import { techIconRouter } from "./techIcon";
import { analyticsRouter } from "./analytics";
import { authRouter } from "./auth";
import { messageRouter } from "./message";
import { systemRouter } from "./system";
import { experienceRouter } from "./experience";

export const appRouter = router({
  project: projectRouter,
  personalInfo: personalInfoRouter,
  portfolio: portfolioRouter,
  education: educationRouter,
  certification: certificationRouter,
  skillCategory: skillCategoryRouter,
  techIcon: techIconRouter,
  analytics: analyticsRouter,
  auth: authRouter,
  message: messageRouter,
  system: systemRouter,
  experience: experienceRouter,
});

export type AppRouter = typeof appRouter;
