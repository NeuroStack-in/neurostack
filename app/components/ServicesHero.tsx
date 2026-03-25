"use client";

import { useEffect, useState, useRef } from "react";
import NeuralBackground from "./NeuralBackground";

const HEADING = "AI Solutions Built for Real Impact";
const ACCENT_START = "AI Solutions Built for ".length; // chars before accent word

const stats = [
  { value: "6",    label: "Service Areas" },
  { value: "100+", label: "Projects Delivered" },
  { value: "12+",  label: "Pipelines / Month" },
  { value: "18+",  label: "Research Papers / Month" },
];


// Animation phases:
// 0 → typing the heading (centered)
// 1 → badge + description + stats fade in (centered)
type Phase = 0 | 1;

export default function ServicesHero() {
  const [typedCount, setTypedCount] = useState(0);
  const [phase, setPhase] = useState<Phase>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const typingDone = typedCount >= HEADING.length;

  // Typing effect
  useEffect(() => {
    if (typingDone) return;
    timerRef.current = setTimeout(() => setTypedCount((n) => n + 1), 58);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [typedCount, typingDone]);

  // After typing → phase 1 (show details)
  useEffect(() => {
    if (!typingDone || phase !== 0) return;
    timerRef.current = setTimeout(() => setPhase(1), 250);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [typingDone, phase]);

  const shownText  = HEADING.slice(0, typedCount);
  const whiteText  = shownText.slice(0, Math.min(typedCount, ACCENT_START));
  const accentText = typedCount > ACCENT_START ? shownText.slice(ACCENT_START) : "";
  const showCursor = !typingDone;
  const detailsIn  = phase >= 1;

  return (
    <section
      className="min-h-[82vh] pt-20 flex items-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #040d1e 0%, #081428 50%, #050f22 100%)" }}
    >
      {/* Blue neural network canvas */}
      <NeuralBackground colorScheme="blue" />

      {/* Subtle blue dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(74,144,217,0.07) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* ── TEXT CONTENT ── */}
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge — fades in at phase 1 */}
          <div
            className="mb-6 transition-all duration-500"
            style={{
              opacity: detailsIn ? 1 : 0,
              transform: detailsIn ? "translateY(0)" : "translateY(-8px)",
            }}
          >
            <span className="inline-block font-semibold px-4 py-1.5 rounded-full text-sm border"
              style={{ backgroundColor: "rgba(74,144,217,0.15)", color: "#7AB8F5", borderColor: "rgba(74,144,217,0.35)" }}>
              What We Build
            </span>
          </div>

          {/* Heading — types in */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-tight mb-6 text-white">
            {whiteText}
            <span style={{ color: "#FF6B00" }}>{accentText}</span>
            {showCursor && (
              <span
                className="inline-block w-[3px] rounded-sm align-middle ml-1"
                style={{
                  height: "0.85em",
                  backgroundColor: "#FF6B00",
                  animation: "blink 1s step-end infinite",
                }}
              />
            )}
          </h1>

          {/* Description + Stats — fade in at phase 1 */}
          <div
            className="transition-all duration-600"
            style={{
              opacity: detailsIn ? 1 : 0,
              transform: detailsIn ? "translateY(0)" : "translateY(12px)",
              transitionDelay: detailsIn ? "80ms" : "0ms",
            }}
          >
            <p
              className="text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              From autonomous agents to fine-tuned models — we build, deploy, and
              maintain production-grade AI systems tailored to your exact needs.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105"
                  style={{
                    border: "1px solid rgba(74,144,217,0.2)",
                    backgroundColor: "rgba(74,144,217,0.08)",
                    transitionDelay: `${detailsIn ? i * 60 : 0}ms`,
                    opacity: detailsIn ? 1 : 0,
                    transform: detailsIn ? "translateY(0)" : "translateY(8px)",
                  }}
                >
                  <p className="text-2xl font-extrabold mb-0.5" style={{ color: "#FF6B00" }}>
                    {s.value}
                  </p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
