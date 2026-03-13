import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string().optional(),
  imageLink: z.string().optional(),
  des: z.string().optional(),
  techStack: z.string().optional(),
  link: z.string().optional(),
  date: z.string().optional(),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;
