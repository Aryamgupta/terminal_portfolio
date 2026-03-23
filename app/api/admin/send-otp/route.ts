import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOTP } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || email !== "aryamgupta4@gmail.com") {
      return NextResponse.json(
        { error: "Unauthorized access request" },
        { status: 401 },
      );
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database for the fixed admin user
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        await prisma.user.update({
          where: { email },
          data: {
            otp,
            otpExpires,
          },
        });

      } else {
        await prisma.user.create({
          data: {
            email,
            name: "Aryam Gupta",
            otp,
            otpExpires,
          },
        });

      }
    } catch (prismaError) {
      console.error("[SEND-OTP] Prisma upsert FAILED:", prismaError);
      throw prismaError;
    }

    try {
      await sendOTP(email, otp);
    } catch (mailError) {
      console.error("[SEND-OTP] Nodemailer dispatch FAILED:", mailError);
      throw mailError;
    }

    return NextResponse.json({ message: "Access key dispatched to terminal" });
  } catch (error) {
    console.error("[SEND-OTP] Global failure:", error);
    return NextResponse.json(
      { error: "Failed to dispatch access key" },
      { status: 500 },
    );
  }
}
