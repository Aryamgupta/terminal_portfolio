import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const icon = await prisma.customIcon.findUnique({
      where: { id },
    });

    if (!icon) {
      return new NextResponse("Icon not found", { status: 404 });
    }

    // Return the SVG with the correct content type
    return new NextResponse(icon.svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving icon:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
