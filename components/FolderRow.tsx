export function FolderRow({
  id,
  label,
  openFolders,
  onToggle,
  indent = 2,
}: {
  id: string;
  label: string;
  openFolders: Record<string, boolean>;
  onToggle: (id: string) => void;
  indent?: number;
}) {
  const isOpen = openFolders[id];
  return (
    <button
      onClick={() => onToggle(id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        padding: "8px 0",
        paddingLeft: `${indent * 8}px`,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: isOpen ? "#FFFFFF" : "#607B96",
        fontSize: "14px",
        textAlign: "left",
        transition: "color 0.1s",
      }}
    >
      <span
        style={{
          transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
          fontSize: "10px",
          opacity: 0.5,
        }}
      >
        ▶
      </span>
      <span style={{ fontSize: "14px" }}>{isOpen ? "📂" : "📁"}</span>
      {label}
    </button>
  );
}
