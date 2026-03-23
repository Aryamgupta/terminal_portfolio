import "./globals.css";
import React from "react";
import { Providers } from "./providers";
import { KVResponse } from "./(public)/about/page";
import { PersonalInfo } from "@prisma/client";
import { kv } from "@vercel/kv";

export async function generateMetadata() {
  const personalInfoData = await kv.get("personal-info");
  const personalInfo =
    (personalInfoData as KVResponse<PersonalInfo | null>)?.data || null;
  const faviconUrl = personalInfo?.faviconId
    ? `/api/icon/${personalInfo.faviconId}`
    : "/favicon.ico";

  return {
    title: personalInfo?.name
      ? `${personalInfo.name} | Developer Portfolio`
      : "Aryam Gupta | Developer Portfolio",
    description:
      personalInfo?.bio?.[0] ||
      "Full Stack Developer | Next.js, React, TypeScript",
    icons: {
      icon: faviconUrl,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
