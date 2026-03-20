// components/editor/CodeViewer.tsx
import React from "react";
import styles from "./CodeViewer.module.css";

interface CodeViewerProps {
  lines: string[];
}

export function CodeViewer({ lines }: CodeViewerProps) {
  return (
    <div className={styles.codeViewer}>
      <div className={styles.lineNumbers}>
        {lines.map((_, i) => (
          <div key={i} className={styles.lineNumber}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className={styles.codeContent}>
        {lines.map((line, i) => (
          <div key={i} className={styles.codeLine}>
            <code>{line || ""}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
