// hooks/useAboutPageState.ts
import { useState, useCallback } from "react";

interface TabActions {
  openFile: (id: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  toggleFolder: (folderId: string) => void;
}

interface PageState {
  openTabs: string[];
  activeTab: string;
  openFolders: Record<string, boolean>;
  actions: TabActions;
}

const INITIAL_OPEN_TABS = ["bio"];
const INITIAL_ACTIVE_TAB = "bio";
const INITIAL_OPEN_FOLDERS = {
  "personal-info": true,
  "professional-experience": true,
  education: true,
  certificates: false,
  contacts: false,
};

/**
 * useAboutPageState - Manages all state for the About page
 * 
 * Separates state logic from rendering logic for better testability
 * and reusability.
 */
export function useAboutPageState(): PageState {
  const [openTabs, setOpenTabs] = useState<string[]>(INITIAL_OPEN_TABS);
  const [activeTab, setActiveTab] = useState<string>(INITIAL_ACTIVE_TAB);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(
    INITIAL_OPEN_FOLDERS
  );

  const openFile = useCallback((id: string) => {
    setOpenTabs((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
    setActiveTab(id);
  }, []);

  const closeTab = useCallback((id: string) => {
    setOpenTabs((prev) => {
      const next = prev.filter((t) => t !== id);
      if (activeTab === id && next.length > 0) {
        setActiveTab(next[next.length - 1]);
      } else if (activeTab === id) {
        setActiveTab("");
      }
      return next;
    });
  }, [activeTab]);

  const toggleFolder = useCallback((folderId: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  }, []);

  return {
    openTabs,
    activeTab,
    openFolders,
    actions: {
      openFile,
      closeTab,
      setActiveTab,
      toggleFolder,
    },
  };
}
