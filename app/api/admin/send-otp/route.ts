import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOTP } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log("[SEND-OTP] Dispatch request for:", email);

    if (!email || email !== "aryamgupta4@gmail.com") {
      console.log("[SEND-OTP] Unauthorized email attempt:", email);
      return NextResponse.json(
        { error: "Unauthorized access request" },
        { status: 401 },
      );
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    console.log("-----------------------------------------");
    console.log("[DEBUG] GENERATED OTP:", otp);
    console.log("-----------------------------------------");
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log({ otpExpires });
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

        console.log("[SEND-OTP] OTP updated for existing user");
      } else {
        await prisma.user.create({
          data: {
            email,
            name: "Aryam Gupta",
            otp,
            otpExpires,
          },
        });

        console.log("[SEND-OTP] New user created with OTP");
      }
    } catch (prismaError) {
      console.error("[SEND-OTP] Prisma upsert FAILED:", prismaError);
      throw prismaError;
    }

    console.log("[SEND-OTP] Dispatching email via nodemailer...");
    try {
      await sendOTP(email, otp);
      console.log("[SEND-OTP] Email dispatched successfully.");
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
