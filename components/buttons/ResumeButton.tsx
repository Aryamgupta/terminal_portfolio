"use client";

import React, { useState } from "react";
import styles from "./ResumeButton.module.css";

interface ResumeButtonProps {
  name?: string;
  resumeLink?: string;
}

export function ResumeButton({ name, resumeLink }: ResumeButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  if (!resumeLink) return null;

  const getDownloadLink = (url: string) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);

    if (!match) return url;

    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const a = document.createElement("a");
      a.href = getDownloadLink(resumeLink);
      a.rel = "noopener noreferrer";

      a.download = `${name ? `${name.replace(/\s+/g, "_")}_` : ""
        }Resume.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      // keep loading briefly for smoother UX
      setTimeout(() => {
        setIsDownloading(false);
      }, 1200);
    } catch (error) {
      console.error(error);
      setIsDownloading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`${styles.button} ${isDownloading ? styles.loading : ""
          }`}
        aria-label="Download resume"
      >
        <span className={styles.icon}>
          {!isDownloading && "⬇"}
        </span>

        <span className={styles.text}>
          {isDownloading ? "downloading..." : "download-resume"}
        </span>
      </button>
    </div>
  );
}