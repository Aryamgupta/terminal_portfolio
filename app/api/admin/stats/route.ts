import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalProjects = await prisma.project.count();
    const newMessages = await prisma.message.count();
    // Assuming site visits aren't trackable via Prisma yet, let's return a mock or placeholder
    const siteVisits = "1.2k"; 

    // Fetch the 5 most recent activities based on some DB logs, 
    // or just return mock data for now since we don't have an ActivityLog model yet.

    const recentActivity = [
      { time: "2m ago", event: "Admin session authorized", icon: "🟢" },
      { time: "15m ago", event: "Profile update synchronized", icon: "🔵" },
    ];

    return NextResponse.json({
      totalProjects,
      newMessages,
      siteVisits,
      recentActivity,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
