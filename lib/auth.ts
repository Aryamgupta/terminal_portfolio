import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
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
        // Since we verify OTP during authorize, the user is already 2FA verified
        token.isTwoFactorVerified = true;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.isTwoFactorVerified = true; // Always verified for OTP-only flow
      }
      return session;
    },
  },
};
