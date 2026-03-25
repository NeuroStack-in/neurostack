"use client";

import { useRef, ReactNode, MouseEvent } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export default function TiltCard({ children, className = "", intensity = 9 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    const shine = shineRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -intensity;
    const rotY = ((x - cx) / cx) * intensity;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`;

    // Shine gradient follows mouse
    if (shine) {
      const pctX = (x / rect.width) * 100;
      const pctY = (y / rect.height) * 100;
      shine.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255,255,255,0.13) 0%, transparent 60%)`;
      shine.style.opacity = "1";
    }
  };

  const onLeave = () => {
    const card = ref.current;
    const shine = shineRef.current;
    if (card) card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    if (shine) shine.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
      {/* Shine overlay */}
      <div
        ref={shineRef}
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 opacity-0"
        style={{ zIndex: 10 }}
      />
    </div>
  );
}
