"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

// Portrait board — 15 cols × 20 rows, like Figma
const COLS = 15;
const ROWS = 20;
const CELL = 16;
const BOARD_W = COLS * CELL; // 240px
const BOARD_H = ROWS * CELL; // 320px
const TOTAL_FOOD = 10;
const SPEED_MS = 130;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pt = { x: number; y: number };
type State = "idle" | "playing" | "over" | "won";

const OPPOSITE: Record<Dir, Dir> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};
const INIT_SNAKE: Pt[] = [
  { x: 7, y: 5 },
  { x: 7, y: 6 },
  { x: 7, y: 7 },
  { x: 7, y: 8 },
  { x: 8, y: 8 },
  { x: 9, y: 8 },
];

function rndFood(snake: Pt[]): Pt {
  let p: Pt;
  do {
    p = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gState, setGState] = useState<State>("idle");
  const [snake, setSnake] = useState<Pt[]>(INIT_SNAKE);
  const [food, setFood] = useState<Pt>({ x: 10, y: 5 });
  const [score, setScore] = useState(0);
  const [foodLeft, setFoodLeft] = useState(TOTAL_FOOD);

  const dirRef = useRef<Dir>("UP");
  const snakeRef = useRef<Pt[]>(INIT_SNAKE);
  const foodRef = useRef<Pt>({ x: 10, y: 5 });
  const foodLeftRef = useRef(TOTAL_FOOD);
  const gStateRef = useRef<State>("idle");

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  useEffect(() => {
    foodRef.current = food;
  }, [food]);
  useEffect(() => {
    foodLeftRef.current = foodLeft;
  }, [foodLeft]);
  useEffect(() => {
    gStateRef.current = gState;
  }, [gState]);

  // ── Draw ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, BOARD_W, BOARD_H);

    // Faint grid
    ctx.strokeStyle = "rgba(67,217,173,0.04)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, BOARD_H);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(BOARD_W, y * CELL);
      ctx.stroke();
    }

    // ── Snake: draw as thick glowing path ──────────────────────────────────
    if (snake.length > 1) {
      // Outer glow layer
      ctx.beginPath();
      ctx.moveTo(snake[0].x * CELL + CELL / 2, snake[0].y * CELL + CELL / 2);
      for (let i = 1; i < snake.length; i++) {
        ctx.lineTo(snake[i].x * CELL + CELL / 2, snake[i].y * CELL + CELL / 2);
      }
      ctx.strokeStyle = "rgba(67,217,173,0.25)";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "#43D9AD";
      ctx.shadowBlur = 5;
      ctx.stroke();

      // Core bright line
      ctx.beginPath();
      ctx.moveTo(snake[0].x * CELL + CELL / 2, snake[0].y * CELL + CELL / 2);
      for (let i = 1; i < snake.length; i++) {
        ctx.lineTo(snake[i].x * CELL + CELL / 2, snake[i].y * CELL + CELL / 2);
      }
      ctx.strokeStyle = "#43D9AD";
      ctx.lineWidth = 10;
      ctx.shadowColor = "#43D9AD";
      ctx.shadowBlur = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // ── Head dot ────────────────────────────────────────────────────────────
    if (snake.length > 0) {
      const head = snake[0];
      // Bright white with strong teal glow — matches Figma head dot
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "#43D9AD";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(head.x * CELL + CELL / 2, head.y * CELL + CELL / 2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // ── Food — green glowing dot matching Figma ─────────────────────────────
    if (gState !== "idle") {
      // Outer glow ring
      ctx.fillStyle = "rgba(67,217,173,0.2)";
      ctx.shadowColor = "#43D9AD";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, 8, 0, Math.PI * 2);
      ctx.fill();
      // Inner bright core
      ctx.fillStyle = "#43D9AD";
      ctx.shadowColor = "#43D9AD";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [snake, food, gState]);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
      };
      const nd = map[e.key];
      if (!nd) return;
      e.preventDefault();
      if (nd !== OPPOSITE[dirRef.current]) dirRef.current = nd;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleDirBtn = useCallback((d: Dir) => {
    if (d !== OPPOSITE[dirRef.current]) dirRef.current = d;
  }, []);

  // ── Tick ──────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    if (gStateRef.current !== "playing") return;
    const prev = snakeRef.current;
    const head = prev[0];
    const d = dirRef.current;
    const newHead: Pt = {
      x: d === "LEFT" ? head.x - 1 : d === "RIGHT" ? head.x + 1 : head.x,
      y: d === "UP" ? head.y - 1 : d === "DOWN" ? head.y + 1 : head.y,
    };
    if (
      newHead.x < 0 ||
      newHead.x >= COLS ||
      newHead.y < 0 ||
      newHead.y >= ROWS
    ) {
      gStateRef.current = "over";
      setGState("over");
      return;
    }
    if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
      gStateRef.current = "over";
      setGState("over");
      return;
    }
    const ateFood =
      newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
    const newSnake = ateFood
      ? [newHead, ...prev]
      : [newHead, ...prev.slice(0, -1)];
    snakeRef.current = newSnake;
    setSnake([...newSnake]);
    if (ateFood) {
      const nf = rndFood(newSnake);
      foodRef.current = nf;
      setFood(nf);
      const rem = foodLeftRef.current - 1;
      foodLeftRef.current = rem;
      setFoodLeft(rem);
      setScore((s) => s + 1);
      if (rem <= 0) {
        gStateRef.current = "won";
        setGState("won");
      }
    }
  }, []);

  useEffect(() => {
    if (gState !== "playing") return;
    const id = setInterval(tick, SPEED_MS);
    return () => clearInterval(id);
  }, [gState, tick]);

  const startGame = useCallback(() => {
    const s = [...INIT_SNAKE];
    const f = rndFood(s);
    snakeRef.current = s;
    foodRef.current = f;
    foodLeftRef.current = TOTAL_FOOD;
    dirRef.current = "UP";
    setSnake(s);
    setFood(f);
    setScore(0);
    setFoodLeft(TOTAL_FOOD);
    gStateRef.current = "playing";
    setGState("playing");
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display: "flex",
        gap: "14px",
        // Rich teal-dark glassmorphism card matching Figma
        // Fully opaque — prevents page background glow from bleeding through
        background: "#011B2D",
        border: "1.5px solid rgba(67,217,173,0.25)",
        borderRadius: "16px",
        padding: "18px",
        boxShadow: [
          "0 0 0 1px rgba(67,217,173,0.08)",
          "0 0 40px rgba(67,217,173,0.12)",
          "0 0 80px rgba(67,217,173,0.06)",
          "0 20px 60px rgba(0,0,0,0.6)",
          "inset 0 1px 0 rgba(67,217,173,0.1)",
        ].join(","),
        position: "relative",
        userSelect: "none",
      }}
    >
      {/* Corner pins */}
      {(
        [
          { top: "8px", left: "8px" },
          { top: "8px", right: "8px" },
          { bottom: "8px", left: "8px" },
          { bottom: "8px", right: "8px" },
        ] as React.CSSProperties[]
      ).map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            border: "1.5px solid #1E2D3D",
            background: "#011221",
            ...pos,
          }}
        />
      ))}

      {/* ── Game Board ────────────────────────────────────────────────── */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <canvas
          ref={canvasRef}
          width={BOARD_W}
          height={BOARD_H}
          style={{
            display: "block",
            background: "linear-gradient(180deg, #010C15 0%, #010810 100%)",
            borderRadius: "8px",
            border: "1px solid rgba(67,217,173,0.15)",
            boxShadow: "inset 0 0 30px rgba(67,217,173,0.04)",
          }}
        />

        {/* Overlay when not playing */}
        {gState !== "playing" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              background: "rgba(1,8,14,0.75)",
              borderRadius: "8px",
              backdropFilter: "blur(3px)",
            }}
          >
            {gState === "over" && (
              <>
                <p
                  style={{
                    color: "#E99287",
                    fontFamily: "'Fira Code',monospace",
                    fontSize: "13px",
                  }}
                >
                  {"// game over"}
                </p>
                <p
                  style={{
                    color: "#607B96",
                    fontFamily: "'Fira Code',monospace",
                    fontSize: "11px",
                  }}
                >
                  score: {score}
                </p>
              </>
            )}
            {gState === "won" && (
              <>
                <p
                  style={{
                    color: "#43D9AD",
                    fontFamily: "'Fira Code',monospace",
                    fontSize: "13px",
                  }}
                >
                  {"// you won! 🎉"}
                </p>
                <p
                  style={{
                    color: "#607B96",
                    fontFamily: "'Fira Code',monospace",
                    fontSize: "11px",
                  }}
                >
                  score: {score}
                </p>
              </>
            )}
            <button
              onClick={startGame}
              style={{
                padding: "8px 22px",
                background: "linear-gradient(135deg, #FEA55F, #e8923f)",
                color: "#011627",
                fontFamily: "'Fira Code',monospace",
                fontSize: "13px",
                fontWeight: 700,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(254,165,95,0.35)",
              }}
            >
              {gState === "idle" ? "start-game" : "restart"}
            </button>
          </div>
        )}
      </div>

      {/* ── Right Panel ───────────────────────────────────────────────── */}
      <div
        style={{
          width: "148px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          paddingTop: "4px",
          position: "relative",
        }}
      >
        {/* Controls */}
        <div
          style={{
            background: "rgba(1,12,21,0.7)",
            border: "1px solid rgba(67,217,173,0.12)",
            borderRadius: "10px",
            padding: "14px",
          }}
        >
          <p
            style={{
              color: "#607B96",
              fontSize: "10px",
              fontFamily: "'Fira Code',monospace",
              marginBottom: "2px",
            }}
          >
            {"// use keyboard"}
          </p>
          <p
            style={{
              color: "#607B96",
              fontSize: "10px",
              fontFamily: "'Fira Code',monospace",
              marginBottom: "16px",
            }}
          >
            {"// arrows to play"}
          </p>

          {/* D-pad */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 32px)",
              gridTemplateRows: "repeat(2, 32px)",
              gap: "4px",
              justifyContent: "center",
            }}
          >
            <span />
            <DpadBtn label="▲" onClick={() => handleDirBtn("UP")} />
            <span />
            <DpadBtn label="◀" onClick={() => handleDirBtn("LEFT")} />
            <DpadBtn label="▼" onClick={() => handleDirBtn("DOWN")} />
            <DpadBtn label="▶" onClick={() => handleDirBtn("RIGHT")} />
          </div>
        </div>

        {/* Food left */}
        <div>
          <p
            style={{
              color: "#607B96",
              fontSize: "10px",
              fontFamily: "'Fira Code',monospace",
              marginBottom: "10px",
            }}
          >
            {"// food left"}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "6px",
            }}
          >
            {Array.from({ length: TOTAL_FOOD }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: i < foodLeft ? "#43D9AD" : "rgba(67,217,173,0.1)",
                  boxShadow: i < foodLeft ? "0 0 8px #43D9AD" : "none",
                  transition: "all 0.35s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Score */}
        {gState === "playing" && (
          <p
            style={{
              color: "#607B96",
              fontSize: "10px",
              fontFamily: "'Fira Code',monospace",
            }}
          >
            score: <span style={{ color: "#43D9AD" }}>{score}</span>
          </p>
        )}

        {/* Skip */}
        <button
          onClick={() => {
            gStateRef.current = "idle";
            setGState("idle");
          }}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            padding: "4px 14px",
            background: "transparent",
            color: "#607B96",
            fontFamily: "'Fira Code',monospace",
            fontSize: "11px",
            border: "1px solid rgba(96,123,150,0.5)",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          skip
        </button>
      </div>
    </div>
  );
}

function DpadBtn({ label, onClick }: { label: string; onClick: () => void }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <button
      onMouseDown={() => {
        setPressed(true);
        onClick();
      }}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        width: "32px",
        height: "32px",
        background: pressed ? "rgba(67,217,173,0.15)" : "rgba(1,12,21,0.8)",
        border: `1px solid ${pressed ? "rgba(67,217,173,0.5)" : "rgba(30,45,61,0.8)"}`,
        borderRadius: "7px",
        color: pressed ? "#43D9AD" : "#FFFFFF",
        fontSize: "9px",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.1s",
        boxShadow: pressed ? "0 0 12px rgba(67,217,173,0.3)" : "none",
      }}
    >
      {label}
    </button>
  );
}
