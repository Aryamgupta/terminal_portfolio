import { TechIcon } from "@/types/types-about";
import styles from "./CodeViewer.module.css";

interface CodeViewerProps {
  lines: string[];
  techIcons?: TechIcon[];
}

export function CodeViewer({ lines, techIcons }: CodeViewerProps) {
  const renderLineContent = (line: string) => {
    if (!line.includes("[icon:")) return line;

    // Split line by icon markers: [icon:ID]
    const parts = line.split(/(\[icon:[^\]]+\])/g);

    return parts.map((part, i) => {
      if (techIcons && part.startsWith("[icon:") && part.endsWith("]")) {
        const iconId = part.slice(6, -1);
        const icon = techIcons.find((t) => t.id === iconId);

        if (icon) {
          return (
            <span
              key={i}
              className={styles.techIconInline}
              title={icon.name}
              dangerouslySetInnerHTML={{ __html: icon.icon }}
            />
          );
        }
      }

      const isTechHeader = part.includes("Technologies:");
      return (
        <span
          key={i}
          className={isTechHeader ? styles.technologiesSection : ""}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div className={styles.codeViewer}>
      <div className={styles.codeContainer}>
        {lines.map((line, i) => {
          // Detect common code prefixes (* , /**, */)
          const prefixMatch = line.match(/^(\s*\/\*\*?|\s*\*\/|\s*\*)\s+/);
          const prefix = prefixMatch ? prefixMatch[0] : "";
          const content = prefixMatch ? line.slice(prefix.length) : line;

          return (
            <div key={i} className={styles.codeRow}>
              <div className={styles.lineNumber}>
                {i + 1}
              </div>
              <div className={styles.codeLine}>
                {prefix && <span className={styles.codePrefix}>{prefix}</span>}
                <code className={styles.codeText}>{renderLineContent(content || "")}</code>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
