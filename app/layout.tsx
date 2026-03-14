import fs from "fs";
import path from "path";
import "./globals.css";
import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export const metadata = {
  title: "Aryam Gupta | Developer Portfolio",
  description: "Full Stack Developer | Next.js, React, TypeScript",
};

async function getSiteData() {
  try {
    const dataPath = path.join(process.cwd(), "public/data/portfolio-data.json");
    if (!fs.existsSync(dataPath)) {
      return {
        name: "Aryam Gupta",
        githubLink: "https://github.com/aryam-gupta",
        linkedinLink: "https://linkedin.com/in/aryam-gupta",
        twitterLink: "https://twitter.com/aryam_gupta"
      };
    }
    const jsonData = fs.readFileSync(dataPath, "utf8");
    const data = JSON.parse(jsonData);
    return {
      name: data.personalInfo?.name || "Aryam Gupta",
      githubLink: data.personalInfo?.githubLink,
      linkedinLink: data.personalInfo?.linkedinLink,
      twitterLink: data.personalInfo?.twitterLink,
    };
  } catch (e) {
    console.error("Error loading site data", e);
    return {
      name: "Aryam Gupta",
      githubLink: "https://github.com/aryam-gupta",
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteData = await getSiteData();

  return (
    <html lang="en">
      <body>
        {/* Outer IDE Frame — responsive wrapper */}
        <div className="ide-frame">
          {/* Header always at top */}
          <div style={{ flexShrink: 0 }}>
            <Header {...siteData} />
          </div>

          {/* Page content fills middle */}
          <main className="ide-main">
            {children}
          </main>

          {/* Footer always at bottom */}
          <div style={{ flexShrink: 0 }}>
            <Footer {...siteData} />
          </div>
        </div>

        <style>{`
          body {
            margin: 0;
            padding: 32px;
            background: #01080E;
            display: flex;
            align-items: center;
            justifyContent: center;
            box-sizing: border-box;
            min-height: 100vh;
            height: 100%;
            overflow-x: hidden;
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
            body {
              padding: 0 !important;
              margin: 0 !important;
              height: auto;
              min-height: 100vh;
              width: 100vw;
              align-items: stretch;
              justify-content: flex-start;
              overflow-y: auto;
              overflow-x: hidden;
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