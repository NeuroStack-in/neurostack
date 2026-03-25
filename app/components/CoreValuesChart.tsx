"use client";

import { useState } from "react";

const values = [
  {
    title: "User-Centric Innovation",
    desc: "We build with empathy, always putting the user's needs at the center of every decision.",
    color: "#FF6B00",
    iconPath: "M12 22a10 10 0 100-20 10 10 0 000 20zM12 16a4 4 0 100-8 4 4 0 000 8z",
  },
  {
    title: "Transparency",
    desc: "We keep our processes, decisions, and data practices clear, open, and honest.",
    color: "#0A2647",
    iconPath: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35",
  },
  {
    title: "Quality First",
    desc: "No shortcuts — we focus on excellence in every product, pipeline, and line of code.",
    color: "#FF6B00",
    iconPath: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  },
  {
    title: "Curiosity & Learning",
    desc: "We grow by exploring, experimenting, and staying on the cutting edge of what's possible.",
    color: "#0A2647",
    iconPath: "M9 18h6M10 22h4M15 14c.2-1 .7-1.7 1.5-2.5C17.5 10.6 18 9.3 18 8A6 6 0 006 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5",
  },
  {
    title: "Sustainability",
    desc: "We care about long-term impact — for our clients, our people, and the planet.",
    color: "#FF6B00",
    iconPath: "M12 22V12m0 0c-4-2-8-7-6-11 2 0 4.5 2.5 6 5 1.5-2.5 4-5 6-5 2 4-2 9-6 11z",
  },
];

// Tooltip positions: where each tooltip should appear (as % of the wrapper)
// Segments go clockwise from top: 0=top-right, 1=right, 2=bottom, 3=left, 4=top-left
const tooltipPositions = [
  { top: "10%", left: "72%", align: "left" },   // User-Centric: right side, top
  { top: "45%", left: "75%", align: "left" },   // Transparency: right side, middle
  { top: "75%", left: "55%", align: "left" },   // Quality First: right side, bottom
  { top: "65%", right: "72%", align: "right" }, // Curiosity: left side, lower
  { top: "18%", right: "72%", align: "right" }, // Sustainability: left side, upper
];

const segmentAngle = 360 / values.length;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSegment(cx: number, cy: number, outerR: number, innerR: number, start: number, end: number) {
  const os = polar(cx, cy, outerR, end);
  const oe = polar(cx, cy, outerR, start);
  const is_ = polar(cx, cy, innerR, end);
  const ie = polar(cx, cy, innerR, start);
  const large = end - start > 180 ? 1 : 0;
  return `M${os.x} ${os.y} A${outerR} ${outerR} 0 ${large} 0 ${oe.x} ${oe.y} L${ie.x} ${ie.y} A${innerR} ${innerR} 0 ${large} 1 ${is_.x} ${is_.y} Z`;
}

export default function CoreValuesChart() {
  const [hovered, setHovered] = useState<number | null>(null);

  const cx = 250;
  const cy = 250;
  const outerR = 210;
  const innerR = 120;
  const gap = 3;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Wrapper with enough room for side tooltips */}
      <div className="relative mx-auto" style={{ maxWidth: 900, minHeight: 520 }}>

        {/* Donut chart — centered */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2" style={{ width: "min(460px, 80vw)", height: "min(460px, 80vw)" }}>
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <defs>
              <filter id="segGlow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Rotating group for segments — pauses on hover */}
            <g
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                animation: "spin 30s linear infinite",
                animationPlayState: hovered !== null ? "paused" : "running",
              }}
            >
              {values.map((v, i) => {
                const start = i * segmentAngle + gap / 2;
                const end = (i + 1) * segmentAngle - gap / 2;
                const isH = hovered === i;
                const oR = isH ? outerR + 12 : outerR;
                const iR = isH ? innerR - 6 : innerR;
                const d = donutSegment(cx, cy, oR, iR, start, end);

                const midAngle = (start + end) / 2;
                const iconR = (outerR + innerR) / 2;
                const iconPos = polar(cx, cy, iconR, midAngle);

                return (
                  <g
                    key={i}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="cursor-pointer"
                  >
                    <path
                      d={d}
                      fill={v.color}
                      opacity={hovered === null ? 0.9 : isH ? 1 : 0.3}
                      className="transition-all duration-300"
                      filter={isH ? "url(#segGlow)" : undefined}
                    />
                    <g transform={`translate(${iconPos.x - 14}, ${iconPos.y - 14})`} className="pointer-events-none">
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="white" opacity={hovered === null ? 0.9 : isH ? 1 : 0.4}>
                        <path d={v.iconPath} />
                      </svg>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* Logo stays static in center */}
            <image href="/logo.png" x={cx - 50} y={cy - 50} width="100" height="100" className="select-none pointer-events-none" />
          </svg>
        </div>

        {/* Tooltips — absolutely positioned beside segments */}
        {hovered !== null && (
          <div
            key={hovered}
            className="absolute z-20 animate-[heroFadeUp_0.15s_ease-out] hidden lg:block"
            style={{
              top: tooltipPositions[hovered].top,
              ...(tooltipPositions[hovered].align === "left"
                ? { left: tooltipPositions[hovered].left }
                : { right: tooltipPositions[hovered].right }),
            }}
          >
            <div
              className="rounded-2xl px-6 py-5 shadow-2xl border min-w-[280px] max-w-[320px]"
              style={{ backgroundColor: "#0A2647", borderColor: values[hovered].color + "50" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0" style={{ stroke: "#FF6B00" }}>
                  <path d={values[hovered].iconPath} />
                </svg>
                <span className="font-bold text-base" style={{ color: "#FF6B00" }}>
                  {values[hovered].title}
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{values[hovered].desc}</p>
            </div>
          </div>
        )}

        {/* Mobile/tablet: tooltip below chart */}
        {hovered !== null && (
          <div
            key={`m${hovered}`}
            className="lg:hidden absolute left-1/2 -translate-x-1/2 z-20 animate-[heroFadeUp_0.15s_ease-out]"
            style={{ bottom: -10 }}
          >
            <div
              className="rounded-2xl px-6 py-5 shadow-2xl border min-w-[280px] max-w-[340px]"
              style={{ backgroundColor: "#0A2647", borderColor: values[hovered].color + "50" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0" style={{ stroke: "#FF6B00" }}>
                  <path d={values[hovered].iconPath} />
                </svg>
                <span className="font-bold text-base" style={{ color: "#FF6B00" }}>
                  {values[hovered].title}
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{values[hovered].desc}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
