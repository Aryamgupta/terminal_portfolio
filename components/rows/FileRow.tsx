// components/rows/FileRow.tsx
import React from "react";
import styles from "./FileRow.module.css";

interface FileRowProps {
  id: string;
  label: string;
  indent: number;
  activeTab: string;
  onOpen: (id: string) => void;
  onSetActiveTab: (id: string) => void;
  openTabs: string[];
}

/**
 * FileRow - Single file item in sidebar
 * 
 * Accessibility features:
 * - Keyboard navigable (Enter/Space to open)
 * - Proper ARIA labels
 * - Focus visible states
 */
export function FileRow({
  id,
  label,
  indent,
  activeTab,
  onOpen,
  onSetActiveTab,
  openTabs,
}: FileRowProps) {
  const isActive = activeTab === id;
  const isOpen = openTabs.includes(id);

  const handleClick = () => {
    if (!isOpen) {
      onOpen(id);
    } else {
      onSetActiveTab(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`${styles.fileRow} ${isActive ? styles.active : ""}`}
      style={{ paddingLeft: `${indent * 16}px` } as React.CSSProperties}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="treeitem"
      tabIndex={isActive ? 0 : -1}
      aria-selected={isActive}
      aria-label={`File: ${label}`}
    >
      <span className={styles.icon}>📄</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
