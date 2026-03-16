import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.isTwoFactorVerified) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.personalInfo.findFirst();
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.isTwoFactorVerified) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const existing = await prisma.personalInfo.findFirst();

    let profile;
    if (existing) {
      profile = await prisma.personalInfo.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          location: data.location,
          bio: data.bio,
          interests: data.interests,
          githubLink: data.githubLink,
          linkedinLink: data.linkedinLink,
          twitterLink: data.twitterLink,
          resumeLink: data.resumeLink,
          role: data.role,
        },
      });
    } else {
      profile = await prisma.personalInfo.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          location: data.location,
          bio: data.bio,
          interests: data.interests,
          githubLink: data.githubLink,
          linkedinLink: data.linkedinLink,
          twitterLink: data.twitterLink,
          resumeLink: data.resumeLink,
          role: data.role,
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
