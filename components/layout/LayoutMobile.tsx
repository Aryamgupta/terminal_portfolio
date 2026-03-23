// components/layout/LayoutMobile.tsx
import React from "react";
import { AboutPageProps } from "@/types/types-about";
import { SidebarTree } from "../sections/SidebarTree";
import { EditorPane } from "../sections/EditorPane";
import styles from "./LayoutMobile.module.css";

interface LayoutMobileProps extends AboutPageProps {
  initialContent: Record<string, { label: string; lines: string[] }>;
  openTabs: string[];
  activeTab: string;
  openFolders: Record<string, boolean>;
  actions: {
    openFile: (id: string) => void;
    closeTab: (id: string) => void;
    setActiveTab: (id: string) => void;
    toggleFolder: (folderId: string) => void;
  };
}

/**
 * LayoutMobile - Mobile view layout
 * 
 * Stacked single-column layout optimized for touch interaction
 */
export function LayoutMobile({
  personalInfo,
  education,
  certificates,
  skillCategories,
  experiences,
  techIcons,
  initialContent,
  openTabs,
  activeTab,
  openFolders,
  actions,
}: LayoutMobileProps) {
  return (
    <div className={styles.layoutContainer}>
      {/* Header */}
      <header className={styles.header} role="banner">
        <h1>_about</h1>
      </header>
 
      {/* File Tree Section */}
      <nav className={styles.fileTreeSection} aria-label="File explorer">
        <SidebarTree
          personalInfo={personalInfo}
          education={education}
          certificates={certificates}
          skillCategories={skillCategories}
          experiences={experiences}
          techIcons={techIcons}
          openFolders={openFolders}
          openTabs={openTabs}
          activeTab={activeTab}
          onToggleFolder={actions.toggleFolder}
          onOpenFile={actions.openFile}
          onSetActiveTab={actions.setActiveTab}
        />
      </nav>
 
      {/* Editor Pane */}
      <main className={styles.editorSection}>
        <EditorPane
          initialContent={initialContent}
          openTabs={openTabs}
          activeTab={activeTab}
          onCloseTab={actions.closeTab}
          onSetActiveTab={actions.setActiveTab}
          isMobile={true}
          skillCategories={skillCategories}
          personalInfo={personalInfo}
          education={education}
          certificates={certificates}
          experiences={experiences}
          techIcons={techIcons}
        />
      </main>
    </div>
  );
}
