"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  prevX: number | null;
  prevY: number | null;
}

const COLORS = [
  { name: "Cyan", value: "#00f2ff" },
  { name: "Pink", value: "#ff00e5" },
  { name: "Gold", value: "#ffd700" },
  { name: "Lime", value: "#39ff14" },
];

export default function GeometricSandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentColor, setCurrentColor] = useState(COLORS[0].value);
  
  // Use a ref for touches to avoid stale closures in the animation loop
  const touchesRef = useRef<Map<number, TouchPoint>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      
      // Fill initial background
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    };

    resize();
    window.addEventListener("resize", resize);

    let animationFrameId: number;

    const render = () => {
      // Create the fading effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Draw lines for each active touch
      touchesRef.current.forEach((touch) => {
        if (touch.prevX !== null && touch.prevY !== null) {
          ctx.beginPath();
          ctx.moveTo(touch.prevX, touch.prevY);
          ctx.lineTo(touch.x, touch.y);
          
          // Outer glow
          ctx.strokeStyle = currentColor;
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.shadowBlur = 15;
          ctx.shadowColor = currentColor;
          ctx.stroke();

          // Inner white core
          ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
        
        // Update previous coordinates
        touch.prevX = touch.x;
        touch.prevY = touch.y;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentColor]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const newTouches = new Map(touchesRef.current);
    Array.from(e.changedTouches).forEach((t) => {
      newTouches.set(t.identifier, {
        id: t.identifier,
        x: t.clientX,
        y: t.clientY,
        prevX: null,
        prevY: null,
      });
    });
    touchesRef.current = newTouches;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const newTouches = new Map(touchesRef.current);
    Array.from(e.changedTouches).forEach((t) => {
      const touch = newTouches.get(t.identifier);
      if (touch) {
        touch.x = t.clientX;
        touch.y = t.clientY;
      }
    });
    touchesRef.current = newTouches;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const newTouches = new Map(touchesRef.current);
    Array.from(e.changedTouches).forEach((t) => {
      newTouches.delete(t.identifier);
    });
    touchesRef.current = newTouches;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      />
      
      <div className={styles.hint}>
        TOUCH TO CREATE
      </div>

      <div className={styles.overlay}>
        <button 
          className={styles.button} 
          onClick={clearCanvas}
          title="Clear Sandbox"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
        
        {COLORS.map((color) => (
          <button
            key={color.name}
            className={`${styles.colorButton} ${currentColor === color.value ? styles.colorButtonActive : ""}`}
            style={{ backgroundColor: color.value }}
            onClick={() => setCurrentColor(color.value)}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}
