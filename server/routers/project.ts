import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import Project from "@/lib/models/Project";
import dbConnect from "@/lib/db";
import { ProjectSchema } from "@/lib/schemas/project.schema";

export const projectRouter = router({
  getAll: publicProcedure.query(async () => {
    await dbConnect();
    const projects = await Project.find({}).sort({ _id: -1 });
    return projects;
  }),
  create: publicProcedure
    .input(ProjectSchema)
    .mutation(async ({ input }) => {
      await dbConnect();
      const project = await Project.create(input);
      return project;
    }),
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await dbConnect();
      await Project.findByIdAndDelete(input);
      return { success: true };
    }),
});
