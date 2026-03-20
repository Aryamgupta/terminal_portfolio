import React from "react";
import { TerminalCard } from "@/types/types-about";
import styles from "./TerminalCard.module.css";

interface TerminalCardRendererProps {
  card: TerminalCard;
}

/**
 * TerminalCardRenderer - Renders a single terminal-style card
 *
 * Features:
 * - macOS-style window chrome
 * - Terminal line rendering
 * - Syntax highlighting support
 */
export function TerminalCardRenderer({ card }: TerminalCardRendererProps) {
  return (
    <div className={styles.card}>
      {/* Window Chrome */}
      <div className={styles.header}>
        <div className={styles.buttons}>
          {["#FF5F57", "#FEBC2E", "#27C840"].map((color) => (
            <div
              key={color}
              className={styles.button}
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
          ))}
        </div>
        <span className={styles.title}>{card.title}</span>
      </div>

      {/* Terminal Content */}
      <div className={styles.content}>
        {(card.lines || []).map((line, i) => (
          <div key={`${line.cmd}-${i}`} className={styles.line}>
            <span className={styles.prompt} style={{ color: line.color }}>
              {line.prompt}
            </span>

            <span className={styles.command} style={{ color: line.color }}>
              {line.cmd}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
