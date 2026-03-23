// components/rows/FolderRow.tsx
import React from "react";
import styles from "./FolderRow.module.css";

interface FolderRowProps {
  id: string;
  label: string;
  openFolders: Record<string, boolean>;
  onToggle: (id: string) => void;
  indent?: number;
  adminActions?: React.ReactNode;
}

export function FolderRow({
  id,
  label,
  openFolders,
  onToggle,
  indent = 0,
  adminActions,
}: FolderRowProps) {
  const isOpen = openFolders[id] || false;

  const handleClick = () => {
    onToggle(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    } else if (e.key === "ArrowRight" && !isOpen) {
      e.preventDefault();
      onToggle(id);
    } else if (e.key === "ArrowLeft" && isOpen) {
      e.preventDefault();
      onToggle(id);
    }
  };

  return (
    <div
      className={`${styles.folderRow} ${isOpen ? styles.open : ""}`}
      style={{ paddingLeft: `${indent * 16}px` } as React.CSSProperties}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="treeitem"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-selected={false}
      aria-label={`Folder: ${label}`}
    >
      <span className={styles.icon} aria-hidden="true">
        {isOpen ? "▼" : "▶"}
      </span>
      <span className={styles.label}>{label}</span>
      {adminActions && <div className={styles.adminActions}>{adminActions}</div>}
    </div>
  );
}
