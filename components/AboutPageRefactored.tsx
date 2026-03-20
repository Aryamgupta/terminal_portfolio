"use client";

import React, { useMemo } from "react";
import Head from "next/head";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAboutPageState } from "@/hooks/useAboutPageState";
import { useAboutPageContent } from "@/hooks/useAboutPageContent";

// Components
import { LayoutDesktop } from "./layout/LayoutDesktop";
import { LayoutMobile } from "./layout/LayoutMobile";

// Types
import { AboutPageProps, AboutPageMetadata } from "@/types/types-about";

// Utilities
import { generateMetadata } from "@/utils/utils-seo";

/**
 * AboutPageContent - Main About page component
 * 
 * Refactored for:
 * - Semantic HTML and SEO
 * - Accessibility (WCAG 2.1)
 * - Modular architecture
 * - Clean separation of concerns
 * - Production-grade performance
 */
export default function AboutPageContent({
  personalInfo,
  education,
  certificates,
  skillCategories,
  experiences,
}: AboutPageProps) {
  const isMobile = useIsMobile();
  
  // State management
  const { openTabs, activeTab, openFolders, actions } = useAboutPageState();
  
  // Content initialization with memoization
  const initialContent = useAboutPageContent(
    personalInfo,
    education,
    certificates,
    experiences
  );

  // SEO Metadata
  const metadata: AboutPageMetadata = useMemo(
    () => ({
      title: `About ${personalInfo?.name || "Developer"}`,
      description: personalInfo?.bio?.[0] || "Professional portfolio",
      keywords: [
        ...(skillCategories.flatMap((cat) => cat.skills) || []),
        "Software Developer",
        "Full Stack",
      ],
      author: personalInfo?.name,
      location: personalInfo?.location,
    }),
    [personalInfo, skillCategories]
  );

  const seoMeta = generateMetadata(metadata);

  // Choose appropriate layout based on device
  const LayoutComponent = isMobile ? LayoutMobile : LayoutDesktop;

  return (
    <>
      <Head>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        <meta name="author" content={seoMeta.author} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoMeta.title} />
        <meta property="og:description" content={seoMeta.description} />
        <meta property="og:type" content="website" />
        
        {/* Schema.org - Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: personalInfo?.name,
              url: typeof window !== "undefined" ? window.location.href : "",
              jobTitle: personalInfo?.role?.[0],
              location: personalInfo?.location,
              email: personalInfo?.email,
              telephone: personalInfo?.phone,
            }),
          }}
        />
      </Head>

      <LayoutComponent
        personalInfo={personalInfo}
        education={education}
        certificates={certificates}
        skillCategories={skillCategories}
        experiences={experiences}
        initialContent={initialContent}
        openTabs={openTabs}
        activeTab={activeTab}
        openFolders={openFolders}
        actions={actions}
      />
    </>
  );
}
