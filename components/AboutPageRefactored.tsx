"use client";

import React from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAboutPageState } from "@/hooks/useAboutPageState";
import { useAboutPageContent } from "@/hooks/useAboutPageContent";

// Components
import { LayoutDesktop } from "./layout/LayoutDesktop";
import { LayoutMobile } from "./layout/LayoutMobile";

// Types
import { AboutPageProps } from "@/types/types-about";

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
  techIcons,
}: AboutPageProps) {
  const isMobile = useIsMobile();
  
  // State management
  const { openTabs, activeTab, openFolders, actions } = useAboutPageState();
  
  // Content initialization with memoization
  const initialContent = useAboutPageContent(
    personalInfo,
    education,
    certificates,
    experiences,
    skillCategories,
    techIcons
  );

  // Choose appropriate layout based on device
  const LayoutComponent = isMobile ? LayoutMobile : LayoutDesktop;

  return (
    <LayoutComponent
      personalInfo={personalInfo}
      education={education}
      certificates={certificates}
      skillCategories={skillCategories}
      experiences={experiences}
      techIcons={techIcons}
      initialContent={initialContent}
      openTabs={openTabs}
      activeTab={activeTab}
      openFolders={openFolders}
      actions={actions}
    />
  );
}
