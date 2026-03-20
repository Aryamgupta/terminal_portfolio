// components/rows/ContactRow.tsx
import React from "react";
import styles from "./ContactRow.module.css";

interface ContactRowProps {
  icon: string;
  label?: string;
  id: string;
  activeTab: string;
  onOpen: (id: string) => void;
  onSetActiveTab: (id: string) => void;
  openTabs: string[];
}

export function ContactRow({
  icon,
  label,
  id,
  activeTab,
  onOpen,
  onSetActiveTab,
  openTabs,
}: ContactRowProps) {
  const isActive = activeTab === id;
  const isOpen = openTabs.includes(id);

  const handleClick = () => {
    if (!isOpen) {
      onOpen(id);
    } else {
      onSetActiveTab(id);
    }
  };

  return (
    <div
      className={`${styles.contactRow} ${isActive ? styles.active : ""}`}
      onClick={handleClick}
      role="treeitem"
      tabIndex={isActive ? 0 : -1}
      aria-selected={isActive}
      aria-label={`Contact: ${label}`}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.label}>{label || "Not provided"}</span>
    </div>
  );
}
