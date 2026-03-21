import React from "react";

export default function DpadBtn({ label, onClick }: { label: string; onClick: () => void }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <button
      onMouseDown={() => {
        setPressed(true);
        onClick();
      }}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => {
        setPressed(true);
        onClick();
      }}
      onTouchEnd={() => setPressed(false)}
      className="game-control-button"
    >
      {label}
    </button>
  );
}
