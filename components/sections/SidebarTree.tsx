// components/sections/SidebarTree.tsx
import React from "react";
import { SidebarTreeProps } from "@/types/types-about";
import { FolderRow } from "../rows/FolderRow";
import { FileRow } from "../rows/FileRow";
import { ContactRow } from "../rows/ContactRow";
import styles from "./SidebarTree.module.css";
import { ResumeButton } from "../buttons/ResumeButton";

const GITHUB_ACTIVITY_ID = "github-activity";

/**
 * SidebarTree - File tree navigation
 *
 * Features:
 * - Semantic HTML with proper ARIA attributes
 * - Keyboard navigation support
 * - Accessibility compliant
 */
export function SidebarTree({
  personalInfo,
  education,
  certificates,
  experiences,
  openFolders,
  openTabs,
  activeTab,
  onToggleFolder,
  onOpenFile,
  onSetActiveTab,
}: SidebarTreeProps) {
  const sharedRowProps = {
    openTabs,
    activeTab,
    onOpen: onOpenFile,
    onSetActiveTab,
  };

  return (
    <div className={styles.sidebarTree} role="tree">
      {/* Personal Info Section */}
      <FolderRow
        id="personal-info"
        label="personal-info"
        openFolders={openFolders}
        onToggle={onToggleFolder}
      />
      {openFolders["personal-info"] && (
        <div role="group">
          <FileRow id="bio" label="bio" indent={1} {...sharedRowProps} />
          <FileRow
            id="interests"
            label="interests"
            indent={1}
            {...sharedRowProps}
          />
        </div>
      )}

      {/* Professional Experience Section */}
      <FolderRow
        id="professional-experience"
        label="professional-experience"
        openFolders={openFolders}
        onToggle={onToggleFolder}
      />
      {openFolders["professional-experience"] && (
        <div role="group">
          {experiences.map((exp) => (
            <FileRow
              key={`exp-${exp.id}`}
              id={`exp-${exp.id}`}
              label={exp.company.toLowerCase().replace(/\s+/g, "-")}
              indent={1}
              {...sharedRowProps}
            />
          ))}
        </div>
      )}

      {/* Education Section */}
      <FolderRow
        id="education"
        label="education"
        openFolders={openFolders}
        onToggle={onToggleFolder}
      />
      {openFolders["education"] && (
        <div role="group">
          {education.map((edu, idx) => (
            <FileRow
              key={`edu-${idx}`}
              id={`edu-${idx}`}
              label={edu.name.toLowerCase().replace(/\s+/g, "-")}
              indent={1}
              {...sharedRowProps}
            />
          ))}
        </div>
      )}

      {/* Certificates Section */}
      <FolderRow
        id="certificates"
        label="certificates"
        openFolders={openFolders}
        onToggle={onToggleFolder}
      />
      {openFolders["certificates"] && (
        <div role="group">
          {certificates.map((cert) => (
            <FileRow
              key={cert.id}
              id={`cert-${cert.id}`}
              label={cert.name.toLowerCase().replace(/\s+/g, "-")}
              indent={1}
              {...sharedRowProps}
            />
          ))}
        </div>
      )}

      {/* GitHub Activity */}
      <FileRow
        id={GITHUB_ACTIVITY_ID}
        label="🐙 github-activity"
        indent={0}
        {...sharedRowProps}
      />
      <ResumeButton
        resumeLink={
          "https://drive.google.com/file/d/1BOZrLTJCZ5sCpkblaoppslLZAdOb2pmx/view"
        }
      />
    </div>
  );
}
