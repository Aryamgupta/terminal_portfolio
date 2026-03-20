// components/editor/TabBar.tsx
import React from "react";
import styles from "./TabBar.module.css";

interface TabBarProps {
  openTabs: string[];
  activeTab: string;
  initialContent: Record<string, { label: string; lines: string[] }>;
  onSetActiveTab: (id: string) => void;
  onCloseTab: (id: string) => void;
}

export function TabBar({
  openTabs,
  activeTab,
  initialContent,
  onSetActiveTab,
  onCloseTab,
}: TabBarProps) {
  const handleCloseClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onCloseTab(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    // Ctrl/Cmd + W to close tab
    if ((e.ctrlKey || e.metaKey) && e.key === "w") {
      e.preventDefault();
      onCloseTab(id);
    }
  };

  return (
    <div className={styles.tabBar} role="tablist">
      {openTabs.length === 0 ? (
        <div className={styles.emptyMessage}>
          {/* open a file from the sidebar */}
        </div>
      ) : (
        openTabs.map((tabId) => {
          const isActive = tabId === activeTab;
          const label = initialContent[tabId]?.label ?? tabId;

          return (
            <div
              key={tabId}
              className={`${styles.tab} ${isActive ? styles.active : ""}`}
              onClick={() => onSetActiveTab(tabId)}
              onKeyDown={(e) => handleKeyDown(e, tabId)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tabId}`}
              tabIndex={isActive ? 0 : -1}
              title={`${label} (Ctrl+W to close)`}
            >
              <span className={styles.icon}>📄</span>
              <span className={styles.label}>{label}</span>
              <button
                className={styles.closeBtn}
                onClick={(e) => handleCloseClick(e, tabId)}
                aria-label={`Close ${label}`}
                title="Close tab"
              >
                ✕
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
