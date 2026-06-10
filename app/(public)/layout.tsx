import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { PersonalInfo } from "@prisma/client";
import { getCachedData } from "@/lib/cache";
import { prisma } from "@/lib/prisma";

async function getSiteData() {
  try {
    const personalInfo = await getCachedData<PersonalInfo | null>("personal-info", () =>
      prisma.personalInfo.findFirst()
    );

    return {
      name: personalInfo?.name || "Aryam Gupta",
      githubLink: personalInfo?.githubLink || "https://github.com/Aryamgupta",
      linkedinLink:
        personalInfo?.linkedinLink || "https://linkedin.com/in/aryam-gupta",
      twitterLink:
        personalInfo?.twitterLink || "https://twitter.com/aryam_gupta",
    };
  } catch (e) {
    console.error("Error loading site data", e);
    return {
      name: "Aryam Gupta",
      githubLink: "https://github.com/Aryamgupta",
      linkedinLink: "https://linkedin.com/in/aryam-gupta",
      twitterLink: "https://twitter.com/aryam_gupta",
    };
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteData = await getSiteData();

  return (
    <div className="portfolio-wrapper">
      <div className="ide-frame">
        <div style={{ flexShrink: 0 }}>
          <Header {...siteData} />
        </div>

        <main className="ide-main">{children}</main>

        <div style={{ flexShrink: 0 }}>
          <Footer {...siteData} />
        </div>
      </div>
    </div>
  );
}
