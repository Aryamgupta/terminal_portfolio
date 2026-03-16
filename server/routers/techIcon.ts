import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const TechIconSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  icon: z.string(), // This will store the final SVG string
});

const ConversionSchema = z.object({
  name: z.string(),
  imageBase64: z.string(), // e.g., "data:image/png;base64,..."
  color: z.string().default("#FEA55F"),
});

export const techIconRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await prisma.techIcon.findMany();
  }),

  upsert: protectedProcedure
    .input(TechIconSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      if (id) {
        return await prisma.techIcon.update({
          where: { id },
          data,
        });
      } else {
        return await prisma.techIcon.create({
          data,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await prisma.techIcon.delete({
        where: { id: input },
      });
    }),

  convertAndSave: protectedProcedure
    .input(ConversionSchema)
    .mutation(async ({ input }) => {
      try {
        const { default: Jimp } = await import("jimp");
        const { Potrace } = await import("potrace");
        // Use type-safe dynamic imports
        const Bitmap = (await import("potrace/lib/types/Bitmap" as string)).default;
        const potraceUtils = (await import("potrace/lib/utils" as string)).default;

        const JimpConstructor = Jimp;
        const base64Data = input.imageBase64.split(",")[1] || input.imageBase64;
        const buffer = Buffer.from(base64Data, "base64");

        // Use Jimp to read the image
        const image = await JimpConstructor.read(buffer);
        const { width, height } = image.bitmap;

        // Manually create a Potrace Bitmap from Jimp data
        const bitmap = new Bitmap(width, height);
        const pixels = image.bitmap.data;

        image.scan(0, 0, width, height, function(x: number, y: number, idx: number) {
          // Logic from potrace's _processLoadedImage: background underneath non-opaque regions to be white
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

        // Manually set the luminance data to skip internal loadImage/Jimp check
        (potraceInstance as unknown as { _luminanceData: unknown; _imageLoaded: boolean })._luminanceData = bitmap;
        (potraceInstance as unknown as { _luminanceData: unknown; _imageLoaded: boolean })._imageLoaded = true;

        const svg = potraceInstance.getSVG();

        // Save to database
        const techIcon = await prisma.techIcon.create({
          data: {
            name: input.name,
            icon: svg,
          },
        });

        return techIcon;
      } catch (error: unknown) {
        console.error("Conversion error details:", error);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Conversion Sequence Failed: ${message}`);
      }
    }),
});
