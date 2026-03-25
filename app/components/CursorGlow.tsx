"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    let raf: number;
    let cx = -600;
    let cy = -600;
    let tx = -600;
    let ty = -600;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    // Smooth follow via lerp
    const tick = () => {
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;
      el.style.transform = `translate(${cx - 300}px, ${cy - 300}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[9999] w-[600px] h-[600px] rounded-full"
      ref={glowRef}
      style={{
        background:
          "radial-gradient(circle at center, rgba(255,107,0,0.07) 0%, rgba(74,144,217,0.04) 40%, transparent 70%)",
        mixBlendMode: "normal",
        willChange: "transform",
      }}
    />
  );
}
