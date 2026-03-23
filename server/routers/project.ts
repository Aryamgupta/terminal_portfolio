import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const ProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  imageLink: z.string().optional().nullable(),
  imageSvg: z.string().optional().nullable(),
  description: z.string(),
  techStack: z.array(z.string()),
  link: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  techIds: z.array(z.string()).optional(),
});

const ConversionSchema = z.object({
  imageBase64: z.string(), // data:image/...;base64,...
  color: z.string().default("#43D9AD"), // Default green for project icons
});

export const projectRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
  }),
  
  upsert: protectedProcedure
    .input(ProjectSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      
      if (id) {
        return await prisma.project.update({
          where: { id },
          data,
        });
      } else {
        return await prisma.project.create({
          data,
        });
      }
    }),

  convertImage: protectedProcedure
    .input(ConversionSchema)
    .mutation(async ({ input }) => {
      try {
        const { default: Jimp } = await import("jimp");
        const JimpConstructor = Jimp as any;
        const base64Data = input.imageBase64.split(",")[1] || input.imageBase64;
        const buffer = Buffer.from(base64Data, "base64");

        const image = await JimpConstructor.read(buffer);
        const { width, height } = image.bitmap;

        // Wrap the original base64 image in an SVG container 
        // to satisfy "exactly same image" and "no color change"
        // Added preserveAspectRatio="xMidYMid slice" to act like object-fit: cover
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
  <image href="${input.imageBase64}" width="${width}" height="${height}"/>
</svg>`;

        return { svg };
      } catch (error: any) {
        console.error("Project image conversion error:", error);
        throw new Error(`Project image conversion failed: ${error.message}`);
      }
    }),
    
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await prisma.project.delete({
        where: { id: input },
      });
    }),
});
