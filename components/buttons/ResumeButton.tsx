"use client";
import React from "react";
import styles from "./ResumeButton.module.css";

interface ResumeButtonProps {
  resumeLink?: string;
}

export function ResumeButton({ resumeLink }: ResumeButtonProps) {
  if (!resumeLink) return null;

  const handleDownload = async () => {
    try {
      const res = await fetch(resumeLink);

      if (!res.ok) throw new Error("Failed to fetch file");

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf"; // file name
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className={styles.container}>
      <button
        onClick={handleDownload}
        className={styles.button}
        aria-label="Download resume"
      >
        <span className={styles.icon}>⬇</span>
        <span className={styles.text}>download-resume</span>
      </button>
    </div>
  );
}