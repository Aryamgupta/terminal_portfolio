import { Dir } from "../SnakeGame";
import DpadBtn from "./DpadButton";

export default function ControlPanelSnakeGame({ handleDirBtn }: { handleDirBtn: (d: Dir) => void }) {
  return (
    <div
      style={{
        background: "rgba(1, 20, 35, 0.19)",
        order: "1px solid rgba(67,217,173,0.25)",
        borderRadius: "10px",
        padding: "14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div style={{ width: "100%", marginBottom: "4px" }}>
        <p
          style={{
            margin: "0 0 1px",
          }}
          className="snake-game-instructions"
        >
          {"// use keyboard"}
        </p>
        <p className="snake-game-instructions">{" // arrows to play"}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 48px)",
          gridTemplateRows: "repeat(2, 36px)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ gridColumn: 2, gridRow: 1 }}>
          <DpadBtn label="▲" onClick={() => handleDirBtn("UP")} />
        </div>

        <div style={{ gridColumn: 1, gridRow: 2 }}>
          <DpadBtn label="◀" onClick={() => handleDirBtn("LEFT")} />
        </div>

        <div style={{ gridColumn: 2, gridRow: 2 }}>
          <DpadBtn label="▼" onClick={() => handleDirBtn("DOWN")} />
        </div>

        <div style={{ gridColumn: 3, gridRow: 2, margin: "0 auto" }}>
          <DpadBtn label="▶" onClick={() => handleDirBtn("RIGHT")} />
        </div>
      </div>
    </div>
  );
}
