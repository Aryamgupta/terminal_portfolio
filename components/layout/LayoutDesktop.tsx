// components/layout/LayoutDesktop.tsx
import React from "react";
import { AboutPageProps } from "@/types/types-about";
import { SidebarTree } from "../sections/SidebarTree";
import { EditorPane } from "../sections/EditorPane";
import { RightPanel } from "../sections/RightPanel";
import styles from "./Layout.module.css";

interface LayoutDesktopProps extends AboutPageProps {
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
 * LayoutDesktop - Desktop view layout
 * 
 * Three-column layout:
 * - Left sidebar (file tree)
 * - Center editor pane
 * - Right panel (snippets)
 */
export function LayoutDesktop({
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
}: LayoutDesktopProps) {
  return (
    <div className={styles.layoutContainer}>
      {/* Left Sidebar */}
      <aside className={styles.sidebar} role="navigation" aria-label="File explorer">
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
      </aside>

      {/* Center Editor Pane */}
      <EditorPane
        initialContent={initialContent}
        openTabs={openTabs}
        activeTab={activeTab}
        onCloseTab={actions.closeTab}
        onSetActiveTab={actions.setActiveTab}
        isMobile={false}
        skillCategories={skillCategories}
        personalInfo={personalInfo}
        education={education}
        certificates={certificates}
        experiences={experiences}
        techIcons={techIcons}
      />

      {/* Right Panel */}
      <RightPanel
        activeTab={activeTab}
        personalInfo={personalInfo}
        education={education}
        certificates={certificates}
        skillCategories={skillCategories}
        experiences={experiences}
        techIcons={techIcons}
      />
    </div>
  );
}
