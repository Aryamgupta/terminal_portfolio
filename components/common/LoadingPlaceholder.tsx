// components/common/LoadingPlaceholder.tsx
import React from "react";
import styles from "./LoadingPlaceholder.module.css";

interface LoadingPlaceholderProps {
  message?: string;
}

export function LoadingPlaceholder({ message = "Loading..." }: LoadingPlaceholderProps) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <p className={styles.message}>{message}</p>
    </div>
  );
}
