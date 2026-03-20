// components/sections/RightPanel.tsx
import React, { useMemo } from "react";
import { AboutPageProps } from "@/types/types-about";
import { TerminalCard } from "@/types/types-about";
import { useTerminalCards } from "@/hooks/useTerminalCards";
import { TerminalCardRenderer } from "../cards/TerminalCardRenderer";
import styles from "./RightPanel.module.css";

interface RightPanelProps extends Omit<AboutPageProps, "education" | "certificates" | "skillCategories"> {
  activeTab: string;
  education: AboutPageProps["education"];
  certificates: AboutPageProps["certificates"];
  skillCategories: AboutPageProps["skillCategories"];
  experiences: AboutPageProps["experiences"];
}

export function RightPanel({activeTab,
  personalInfo,
  education,
  certificates,
  skillCategories,
  experiences,
}: RightPanelProps) {
  const terminalCards = useTerminalCards(
    activeTab,
    personalInfo,
    education,
    certificates,
    skillCategories,
    experiences
  );

  return (
    <aside className={styles.rightPanel} role="complementary" aria-label="Code snippets">
      <header className={styles.panelHeader}>
        {/* snippet-showcase */}
      </header>

      <div className={styles.cardsContainer}>
        {terminalCards.map((card) => (
          <TerminalCardRenderer key={card.id} card={card} />
        ))}
      </div>
    </aside>
  );
}
