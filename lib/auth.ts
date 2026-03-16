import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day (Refresh Token lifetime)
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error("Missing credentials");
        }

        // Strict check for the author's email
        if (credentials.email !== "aryamgupta4@gmail.com") {
          throw new Error("Access denied: Unauthorized operator");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.otp || !user.otpExpires) {
          throw new Error("Unauthorized access request");
        }

        // Verify OTP and Expiration
        if (user.otp !== credentials.otp) {
          throw new Error("Invalid access key");
        }

        if (new Date() > user.otpExpires) {
          throw new Error("Access key expired");
        }

        // Clear OTP after successful use
        await prisma.user.update({
          where: { id: user.id },
          data: { otp: null, otpExpires: null },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isTwoFactorVerified = true;
        // Set initial access token expiry (30 minutes)p
        token.accessTokenExpires = Date.now() + 30 * 60 * 1000;
      }

      // If the access token has expired, but the refresh window (session maxAge) is still valid,
      // NextAuth's session handling will naturally allow us to rotate it if we want,
      // but here we simply ensure the token carries the expiry for tRPC to check.
      
      // If we are within the 1-day refresh window, we can allow tRPC to proceed if we "refresh" it.
      // However, to follow the pattern strictly: tRPC will check the token.
      // If tRPC sees it's expired, it will error. The client then needs to refresh the session.
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.isTwoFactorVerified = true;
        session.user.accessTokenExpires = token.accessTokenExpires as number;
      }
      return session;
    },
  },
};
