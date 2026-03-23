import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const CustomIconSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  svg: z.string(),
  category: z.string().optional().nullable(),
});

const ConversionSchema = z.object({
  name: z.string(),
  imageBase64: z.string(), // data:image/...;base64,...
  category: z.string().optional().nullable(),
  color: z.string().default("#FEA55F"),
});

export const customIconRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await prisma.customIcon.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await prisma.customIcon.findUnique({
        where: { id: input },
      });
    }),

  upsert: protectedProcedure
    .input(CustomIconSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      if (id) {
        return await prisma.customIcon.update({
          where: { id },
          data,
        });
      } else {
        return await prisma.customIcon.create({
          data,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await prisma.customIcon.delete({
        where: { id: input },
      });
    }),

  convertAndSave: protectedProcedure
    .input(ConversionSchema)
    .mutation(async ({ input }) => {
      try {
        const { default: Jimp } = await import("jimp");
        const { Potrace } = await import("potrace");
        
        // Use type-safe dynamic imports for potrace internal types if available
        // Copied from techIcon logic but adapted for CustomIcon
        const Bitmap = (await import("potrace/lib/types/Bitmap" as string)).default;
        const potraceUtils = (await import("potrace/lib/utils" as string)).default;

        const JimpConstructor = Jimp as any;
        const base64Data = input.imageBase64.split(",")[1] || input.imageBase64;
        const buffer = Buffer.from(base64Data, "base64");

        const image = await JimpConstructor.read(buffer);
        const { width, height } = image.bitmap;

        const bitmap = new Bitmap(width, height);
        const pixels = image.bitmap.data;

        image.scan(0, 0, width, height, function(x: number, y: number, idx: number) {
          const opacity = pixels[idx + 3] / 255;
          const r = 255 + (pixels[idx + 0] - 255) * opacity;
          const g = 255 + (pixels[idx + 1] - 255) * opacity;
          const b = 255 + (pixels[idx + 2] - 255) * opacity;
          bitmap.data[idx / 4] = potraceUtils.luminance(r, g, b);
        });

        const potraceInstance = new Potrace({
          color: input.color,
          background: "transparent",
        });

        (potraceInstance as any)._luminanceData = bitmap;
        (potraceInstance as any)._imageLoaded = true;

        let svg = potraceInstance.getSVG();
        
        // Basic optimization: Remove XML declaration if present
        svg = svg.replace(/<\?xml.*\?>/g, "").trim();

        const customIcon = await prisma.customIcon.create({
          data: {
            name: input.name,
            svg: svg,
            category: input.category,
          },
        });

        return customIcon;
      } catch (error: any) {
        console.error("Conversion error details:", error);
        throw new Error(`Conversion Sequence Failed: ${error.message}`);
      }
    }),
});
