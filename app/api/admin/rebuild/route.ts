import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.isTwoFactorVerified) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deployHook = process.env.VERCEL_DEPLOY_HOOK;

  if (!deployHook) {
    return NextResponse.json(
      { error: "Vercel deploy hook is not configured in environment variables." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(deployHook, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Vercel API responded with an error");
    }

    return NextResponse.json({ message: "Rebuild triggered successfully" });
  } catch (error) {
    console.error("Error triggering Vercel rebuild:", error);
    return NextResponse.json(
      { error: "Failed to trigger Vercel rebuild" },
      { status: 500 }
    );
  }
}
