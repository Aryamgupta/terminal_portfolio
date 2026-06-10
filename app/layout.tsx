import "./globals.css";
import React from "react";
import { Providers } from "./providers";
import { PersonalInfo } from "@prisma/client";
import { getCachedData } from "@/lib/cache";
import { prisma } from "@/lib/prisma";

export async function generateMetadata() {
  let personalInfo: PersonalInfo | null = null;
  try {
    personalInfo = await getCachedData<PersonalInfo | null>("personal-info", () =>
      prisma.personalInfo.findFirst()
    );
  } catch (e) {
    console.error("Failed to load personal info for metadata", e);
  }

  const faviconUrl = personalInfo?.faviconId
    ? `/api/icon/${personalInfo.faviconId}`
    : "/favicon.ico";

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const name = personalInfo?.name || "Aryam Gupta";
  const bioLines = personalInfo?.bio || [];
  const cleanedBio = bioLines
    .map(line => line.trim())
    .filter(line => line !== "/**" && line !== "*/" && line !== "/*" && line !== "*")
    .map(line => line.startsWith("*") ? line.replace(/^\*\s*/, "") : line)
    .filter(Boolean)
    .join(" ");

  const description =
    cleanedBio ||
    "Full Stack Developer | Next.js, React, TypeScript";

  const roles = personalInfo?.role || ["Front-end developer"];
  const keywords = [
    "developer",
    "portfolio",
    "software engineer",
    "web development",
    "full stack",
    ...roles,
  ];

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${name} | Developer Portfolio`,
      template: `%s | ${name}`,
    },
    description,
    keywords,
    authors: [{ name }],
    creator: name,
    icons: {
      icon: faviconUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      title: `${name} | Developer Portfolio`,
      description,
      siteName: `${name} Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Developer Portfolio`,
      description,
      creator: personalInfo?.twitterLink ? `@${personalInfo.twitterLink.split("/").pop()}` : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let personalInfo: PersonalInfo | null = null;
  try {
    personalInfo = await getCachedData<PersonalInfo | null>("personal-info", () =>
      prisma.personalInfo.findFirst()
    );
  } catch (e) {
    console.error("Failed to load personal info for JSON-LD structured data", e);
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personalInfo?.name || "Aryam Gupta",
    url: baseUrl,
    jobTitle: personalInfo?.role?.[0] || "Software Developer",
    location: personalInfo?.location ? {
      "@type": "Place",
      name: personalInfo.location,
    } : undefined,
    email: personalInfo?.email || undefined,
    telephone: personalInfo?.phone || undefined,
    sameAs: [
      personalInfo?.githubLink,
      personalInfo?.linkedinLink,
      personalInfo?.twitterLink,
    ].filter(Boolean),
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>

        <style>{`
          body {
            margin: 0;
            background: #01080E;
            min-height: 100vh;
            overflow-x: hidden;
          }

          .portfolio-wrapper {
            padding: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            min-height: 100vh;
            height: 100%;
          }

          .ide-frame {
            width: 100%;
            max-width: 100%;
            height: calc(100vh - 64px);
            border: 1px solid #1E2D3D;
            border-radius: 8px;
            background: #011627;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 30px 80px rgba(0,0,0,0.8);
          }

          .ide-main {
            flex: 1;
            overflow: hidden;
            position: relative;
          }

          /* ── Mobile ──────────────────────────────────────────── */
          @media (max-width: 768px) {
            .portfolio-wrapper {
              padding: 0 !important;
              height: auto;
              align-items: stretch;
              justify-content: flex-start;
            }

            .ide-frame {
              height: auto;
              min-height: 100vh;
              width: 100%;
              max-width: 100vw;
              border: none;
              border-radius: 0;
              box-shadow: none;
              overflow: visible;
              display: flex;
              flex-direction: column;
            }

            .ide-main {
              overflow: visible;
              flex: 1;
              width: 100%;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
