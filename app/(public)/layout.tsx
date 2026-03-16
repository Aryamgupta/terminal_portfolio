import React from "react";
import fs from "fs";
import path from "path";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

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

        <main className="ide-main">
          {children}
        </main>

        <div style={{ flexShrink: 0 }}>
          <Footer {...siteData} />
        </div>
      </div>
    </div>
  );
}
