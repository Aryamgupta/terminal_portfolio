"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const COLS = 15;
const ROWS = 20;
const CELL = 16;
const BOARD_W = COLS * CELL;
const BOARD_H = ROWS * CELL;
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
  const isMobile = useIsMobile();
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

    // ── Snake ─────────────────────────────────────────────────────────────
    if (snake.length > 1) {
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

    // ── Head ──────────────────────────────────────────────────────────────
    if (snake.length > 0) {
      const head = snake[0];
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "#43D9AD";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(
        head.x * CELL + CELL / 2,
        head.y * CELL + CELL / 2,
        6,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // ── Food ──────────────────────────────────────────────────────────────
    if (gState !== "idle") {
      ctx.fillStyle = "rgba(67,217,173,0.2)";
      ctx.shadowColor = "#43D9AD";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(
        food.x * CELL + CELL / 2,
        food.y * CELL + CELL / 2,
        8,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.fillStyle = "#43D9AD";
      ctx.shadowColor = "#43D9AD";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(
        food.x * CELL + CELL / 2,
        food.y * CELL + CELL / 2,
        4,
        0,
        Math.PI * 2,
      );
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
      className="cardSnake"
      style={{
        display: "flex",

        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "20px" : "20px",
        // background:
        //   "linear-gradient(135deg, #0d1b2a 0%, #0a1428 50%, #051015 100%)",
        backgroundColor: "transparent",
        border: "2px solid rgba(67,217,173,0.4)",
        borderRadius: "16px",
        padding: isMobile ? "20px" : "24px",

        position: "relative",
        userSelect: "none",
        alignItems: isMobile ? "center" : "flex-start",
        maxWidth: "100%",
        boxSizing: "border-box",
        
      }}
    >
      {/* ── Corner Pins (Decorative) ──────────────────────────────────────── */}
      {!isMobile && (
        <>
          {(
            [
              { top: "12px", left: "12px" },
              { top: "12px", right: "12px" },
              { bottom: "12px", left: "12px" },
              { bottom: "12px", right: "12px" },
            ] as React.CSSProperties[]
          ).map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                border: "1.5px solid #43D9AD",
                background: "#011627",
                boxShadow:
                  "0 0 12px rgba(67,217,173,0.6), 0 0 24px rgba(67,217,173,0.3)",
                ...pos,
                zIndex: 5,
              }}
            />
          ))}
        </>
      )}

      {/* ── Game Board (Left Side) ────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          flexShrink: 0,
          width: isMobile ? "100%" : "auto",
          display: "flex",
          justifyContent: "center",
          flex: isMobile ? "0 1 auto" : "1 1 auto",
        }}
      >
        <canvas
          ref={canvasRef}
          width={BOARD_W}
          height={BOARD_H}
          style={{
            display: "block",
            background:
              "linear-gradient(180deg, #050810 0%, #0a0f1a 50%, #060b15 100%)",
            borderRadius: "12px",
            border: "1px solid rgba(67,217,173,0.3)",
            boxShadow:
              "inset 0 0 30px rgba(67,217,173,0.1), 0 0 50px rgba(67,217,173,0.2)",
            width: isMobile ? "100%" : "280px",
            height: isMobile ? "auto" : "370px",
            maxWidth: "100%",
            aspectRatio: `${COLS} / ${ROWS}`,
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
              gap: "24px",
              background:
                "linear-gradient(180deg, rgba(5,8,16,0.9) 0%, rgba(5,8,16,0.95) 100%)",
              borderRadius: "12px",
              backdropFilter: "blur(6px)",
              zIndex: 10,
              width: isMobile ? "100%" : "280px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {gState === "over" && (
              <>
                <p
                  style={{
                    color: "#FF6B6B",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "14px",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  game over
                </p>
                <p
                  style={{
                    color: "#607B96",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "12px",
                    margin: 0,
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
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "14px",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  you won! 🎉
                </p>
                <p
                  style={{
                    color: "#607B96",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "12px",
                    margin: 0,
                  }}
                >
                  score: {score}
                </p>
              </>
            )}
            {gState === "idle" && (
              <p
                style={{
                  color: "#607B96",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "11px",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                press start to play
              </p>
            )}

            <button
              onClick={startGame}
              style={{
                padding: "12px 32px",
                background: "linear-gradient(135deg, #FFA34D 0%, #FF8C1A 100%)",
                color: "#011627",
                fontFamily: "'Fira Code', monospace",
                fontSize: "14px",
                fontWeight: 700,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow:
                  "0 0 30px rgba(255,140,26,0.6), 0 8px 30px rgba(255,140,26,0.4)",
                transition: "all 0.2s ease",
                letterSpacing: "0.5px",
              }}
            >
              {gState === "idle" ? "start-game" : "restart"}
            </button>
          </div>
        )}
      </div>

      {/* ── Right Panel (Controls & Stats) ────────────────────────────────── */}
      <div
        style={{
          width: isMobile ? "100%" : "180px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          position: "relative",
        }}
      >
        {/* Controls Box */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(1,12,21,0.8) 0%, rgba(5,15,25,0.7) 100%)",
            border: "1px solid rgba(67,217,173,0.25)",
            borderRadius: "10px",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            boxShadow:
              "0 0 20px rgba(67,217,173,0.1), inset 0 1px 0 rgba(67,217,173,0.15)",
          }}
        >
          {/* Comment Labels */}
          <div style={{ width: "100%", marginBottom: "4px" }}>
            <p
              style={{
                color: "#43D9AD",
                fontSize: "9px",
                fontFamily: "'Fira Code', monospace",
                margin: "0 0 1px",
                opacity: 0.8,
                letterSpacing: "0.3px",
              }}
            >
              {"// use keyboard"}
            </p>
            <p
              style={{
                color: "#43D9AD",
                fontSize: "9px",
                fontFamily: "'Fira Code', monospace",
                margin: 0,
                opacity: 0.8,
                letterSpacing: "0.3px",
              }}
            >
              {" // arrows to play"}
            </p>
          </div>

          {/* D-pad Controls */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 36px)",
              gridTemplateRows: "repeat(3, 36px)",
              gap: "6px",
              justifyContent: "center",
            }}
          >
            <span />
            <DpadBtn label="▲" onClick={() => handleDirBtn("UP")} />
            <span />
            <DpadBtn label="◀" onClick={() => handleDirBtn("LEFT")} />
            <span />
            <DpadBtn label="▶" onClick={() => handleDirBtn("RIGHT")} />
            <span />
            <DpadBtn label="▼" onClick={() => handleDirBtn("DOWN")} />
            <span />
          </div>
        </div>

        {/* Food Left Section */}
        <div>
          <p
            style={{
              color: "#43D9AD",
              fontSize: "9px",
              fontFamily: "'Fira Code', monospace",
              margin: "0 0 10px",
              opacity: 0.8,
              letterSpacing: "0.3px",
            }}
          >
            {"// food left"}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            {Array.from({ length: TOTAL_FOOD }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: i < foodLeft ? "#43D9AD" : "rgba(67,217,173,0.1)",
                  boxShadow:
                    i < foodLeft
                      ? "0 0 12px rgba(67,217,173,0.9), 0 0 24px rgba(67,217,173,0.5)"
                      : "none",
                  transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Score & Skip */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "auto",
          }}
        >
          {gState === "playing" && (
            <p
              style={{
                color: "#607B96",
                fontSize: "11px",
                fontFamily: "'Fira Code', monospace",
                margin: 0,
                textAlign: "center",
              }}
            >
              score:{" "}
              <span style={{ color: "#43D9AD", fontWeight: 700 }}>{score}</span>
            </p>
          )}

          <button
            onClick={() => {
              gStateRef.current = "idle";
              setGState("idle");
            }}
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "#607B96",
              fontFamily: "'Fira Code', monospace",
              fontSize: "11px",
              border: "1px solid rgba(96,123,150,0.6)",
              borderRadius: "7px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              letterSpacing: "0.5px",
            }}
          >
            skip
          </button>
        </div>
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
      onTouchStart={() => {
        setPressed(true);
        onClick();
      }}
      onTouchEnd={() => setPressed(false)}
      style={{
        width: "36px",
        height: "36px",
        background: pressed ? "rgba(67,217,173,0.25)" : "rgba(1,12,21,0.9)",
        border: `1px solid ${pressed ? "#43D9AD" : "rgba(67,217,173,0.35)"}`,
        borderRadius: "7px",
        color: pressed ? "#43D9AD" : "#FFFFFF",
        fontSize: "12px",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.1s ease",
        boxShadow: pressed
          ? "0 0 18px rgba(67,217,173,0.6), inset 0 0 8px rgba(67,217,173,0.25)"
          : "0 0 8px rgba(67,217,173,0.1)",
        fontWeight: 700,
        padding: 0,
      }}
    >
      {label}
    </button>
  );
}
