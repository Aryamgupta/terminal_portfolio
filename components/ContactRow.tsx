export function ContactRow({
  icon,
  label,
  id,
  activeTab,
  onOpen,
}: {
  icon: string;
  label?: string | null;
  id: string;
  activeTab: string;
  onOpen: (id: string) => void;
}) {
  const isActive = activeTab === id;
  return (
    <div
      onClick={() => onOpen(id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 20px",
        cursor: "pointer",
        color: isActive ? "#FFFFFF" : "#607B96",
        fontSize: "14px",
        transition: "color 0.1s",
      }}
    >
      <span style={{ fontSize: "14px" }}>{icon}</span>
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
    </div>
  );
}