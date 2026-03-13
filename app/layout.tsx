import "./globals.css";
import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export const metadata = {
  title: "Aryam Gupta | Developer Portfolio",
  description: "Full Stack Developer | Next.js, React, TypeScript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Outer IDE Frame — responsive wrapper */}
        <div className="ide-frame">
          {/* Header always at top */}
          <div style={{ flexShrink: 0 }}>
            <Header />
          </div>

          {/* Page content fills middle */}
          <main className="ide-main">
            {children}
          </main>

          {/* Footer always at bottom */}
          <div style={{ flexShrink: 0 }}>
            <Footer />
          </div>
        </div>

        <style>{`
          body {
            margin: 0;
            padding: 32px;
            background: #01080E;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            min-height: 100vh;
            height: 100%;
          }

          .ide-frame {
            width: 100%;
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
              padding: 0;
              height: auto;
              min-height: 100vh;
              align-items: stretch;
              overflow: auto;
            }

            .ide-frame {
              height: auto;
              min-height: 100vh;
              border: none;
              border-radius: 0;
              box-shadow: none;
              overflow: visible;
            }

            .ide-main {
              overflow: visible;
              flex: none;
            }
          }
        `}</style>
      </body>
    </html>
  );
}