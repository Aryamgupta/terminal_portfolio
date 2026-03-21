"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import SnakeFood from "./UI/SnakeFood";
import DpadBtn from "./UI/DpadButton";
import ControlPanelSnakeGame from "./UI/ControlPanelSnakeGame";

const COLS = 15;
const ROWS = 20;
const CELL = 16;
const BOARD_W = COLS * CELL;
const BOARD_H = ROWS * CELL;
const TOTAL_FOOD = 10;
const SPEED_MS = 200;

export type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
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

  function drawSmoothSnake(
    ctx: CanvasRenderingContext2D,
    snake: Pt[],
    CELL: number,
  ) {
    if (snake.length < 2) return;

    const getPoint = (p: Pt) => ({
      x: p.x * CELL + CELL / 2,
      y: p.y * CELL + CELL / 2,
    });

    const head = getPoint(snake[0]);
    const tail = getPoint(snake[snake.length - 1]);

    const gradient = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
    gradient.addColorStop(0, "rgba(67,217,173,1)");
    gradient.addColorStop(0.5, "rgba(67,217,173,0.6)");
    gradient.addColorStop(1, "rgba(67,217,173,0.1)");

    ctx.beginPath();

    const first = getPoint(snake[0]);
    ctx.moveTo(first.x, first.y);

    for (let i = 1; i < snake.length - 1; i++) {
      const curr = getPoint(snake[i]);
      const next = getPoint(snake[i + 1]);

      const midX = (curr.x + next.x) / 2;
      const midY = (curr.y + next.y) / 2;

      ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
    }

    const last = getPoint(snake[snake.length - 1]);
    ctx.lineTo(last.x, last.y);

    ctx.strokeStyle = gradient;
    ctx.globalAlpha = 0.25;
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.lineWidth = 10;
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, BOARD_W, BOARD_H);

    drawSmoothSnake(ctx, snake, CELL);

    // draw food (keep this as-is)
    if (gState !== "idle") {
      ctx.fillStyle = "rgba(1, 22, 39, 1)";

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

  return (
    <div className="cardSnake-wrapper">
      <div
        className="cardSnake"
        style={{
          display: "flex",
          background:
            "linear-gradient(150.26deg, rgba(23, 85, 83, 0.7) 1.7%, rgba(67, 217, 173, 0.091) 81.82%)",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "20px" : "20px",
          borderRadius: "16px",
          padding: isMobile ? "20px" : "24px",
          position: "relative",
          userSelect: "none",
          alignItems: isMobile ? "center" : "flex-start",
          maxWidth: "100%",
          boxSizing: "border-box",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(30, 45, 61, 1)",
        }}
      >
        {/* ── Corner Pins (Decorative) ──────────────────────────────────────── */}
        {!isMobile && (
          <>
            {(
              [
                { top: "10px", left: "10px" },
                { top: "10px", right: "10px" },
                { bottom: "10px", left: "10px" },
                { bottom: "10px", right: "10px" },
              ] as React.CSSProperties[]
            ).map((pos, i) => (
              <div key={i} className="corner-close" style={{ ...pos }}>
                ✕
              </div>
            ))}
          </>
        )}

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
              background: "rgba(1, 22, 39, 1)",
              borderRadius: "12px",
              boxShadow: "inset 1px 5px 11px rgba(2, 18, 27, 0.71)",
              width: isMobile ? "100%" : "280px",
              height: isMobile ? "auto" : "370px",
              maxWidth: "100%",
              aspectRatio: `${COLS} / ${ROWS}`,
            }}
          />

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
                      fontFamily: "Fira Code', monospace",
                      margin: 0,
                      background: "rgba(1, 22, 39, 0.84)",
                      boxShadow: "inset 1px 5px 11px rgba(2, 18, 27, 0.71)",
                      fontStyle: "normal",
                      borderRadius: "8px",
                      fontWeight: 450,
                      fontSize: "24px",
                      lineHeight: "100%",
                      textAlign: "center",
                      color: "#43D9AD",
                      width: "100%",
                      padding: "10px 0px",
                    }}
                  >
                    GAME OVER
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
                  background:
                    "linear-gradient(135deg, #FFA34D 0%, #FF8C1A 100%)",
                  color: "#011627",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "14px",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.5px",
                }}
              >
                {gState === "idle" ? "start-game" : "restart"}
              </button>
            </div>
          )}
        </div>

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
          <ControlPanelSnakeGame handleDirBtn={handleDirBtn}/>

          {/* Food Left Section */}
          <div>
            <p
              style={{
                color: "white",
                fontSize: "11px",
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
                <SnakeFood key={i} i={i} foodLeft={foodLeft} />
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "auto",
              alignItems: "flex-end",
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
                <span style={{ color: "#43D9AD", fontWeight: 700 }}>
                  {score}
                </span>
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
                color: "white",
                fontFamily: "'Fira Code', monospace",
                fontSize: "11px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                letterSpacing: "0.5px",
                border: "1px solid #FFFFFF",
                borderRadius: "8px",
              }}
            >
              skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}