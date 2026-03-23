// components/sections/EditorPane.tsx
import React, { lazy, Suspense } from "react";
import { EditorPaneProps } from "@/types/types-about";
import { TabBar } from "../editor/TabBar";
import { CodeViewer } from "../editor/CodeViewer";
import { LoadingPlaceholder } from "../common/LoadingPlaceholder";
import styles from "./EditorPane.module.css";

const GitHubPanel = lazy(() => import("../GitHubPanel"));

const SPECIAL_TABS = new Set(["github-activity"]);

export function EditorPane({
  initialContent,
  openTabs,
  activeTab,
  onCloseTab,
  onSetActiveTab,
  techIcons,
}: EditorPaneProps) {
  const activeLines =
    openTabs.length === 0 || SPECIAL_TABS.has(activeTab)
      ? []
      : (initialContent[activeTab]?.lines ?? ["// (empty)"]);


  return (
    <main className={styles.editorPane} role="main">
      <TabBar
        openTabs={openTabs}
        activeTab={activeTab}
        initialContent={initialContent}
        onSetActiveTab={onSetActiveTab}
        onCloseTab={onCloseTab}
      />

      <div className={styles.contentArea}>
        {activeTab === "github-activity" ? (
          <Suspense
            fallback={<LoadingPlaceholder message="Loading GitHub stats..." />}
          >
            <GitHubPanel />
          </Suspense>
        ) : openTabs.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{'// open a file from the sidebar'}</p>
          </div>
        ) : (
          <CodeViewer lines={activeLines} techIcons={techIcons} />
        )}
      </div>
    </main>
  );
}
