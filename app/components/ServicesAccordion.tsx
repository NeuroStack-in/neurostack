"use client";

import { useEffect, useRef, useState } from "react";

interface Service {
  number: string;
  title: string;
  description: string;
  features: string[];
}

interface Props {
  services: Service[];
}

const palette = [
  { accent: "#FF6B00", bg: "from-[#0A2647] to-[#1a1f0d]" },
  { accent: "#4A90D9", bg: "from-[#0A2647] to-[#0b1e40]" },
  { accent: "#FF8533", bg: "from-[#0D3A6B] to-[#1a1500]" },
  { accent: "#5BA4E6", bg: "from-[#0A2647] to-[#071c36]" },
  { accent: "#E05500", bg: "from-[#0D3A6B] to-[#1a0f00]" },
  { accent: "#2E86C1", bg: "from-[#0A2647] to-[#061826]" },
];

const serviceIconPaths = [
  // Agentic AI — CPU chip
  "M7 7h10v10H7zM9 7V4M12 7V4M15 7V4M9 17v3M12 17v3M15 17v3M7 9H4M7 12H4M7 15H4M17 9h3M17 12h3M17 15h3",
  // RAG — stacked layers / database
  "M12 3C7.58 3 4 4.34 4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6c0-1.66-3.58-3-8-3zM4 6c0 1.66 3.58 3 8 3s8-1.34 8-3M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3",
  // Generative — sparkle / wand
  "M9.5 2l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5zM19 14l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1zM4 14l.75 1.75L6.5 16.5 4.75 17.25 4 19l-.75-1.75L1.5 16.5l1.75-.75z",
  // Vision & Language — eye
  "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
  // R&D — flask / science
  "M9 3h6M9 3v5l-5 9a2 2 0 001.73 3h10.54A2 2 0 0018 17l-5-9V3M6 12h12",
  // Web & Mobile — monitor
  "M2 4h20v14a2 2 0 01-2 2H4a2 2 0 01-2-2V4zM8 22h8M12 18v4",
];

function ServiceIcon({ path, color }: { path: string; color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" style={{ stroke: color }}>
      <path d={path} />
    </svg>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const color = palette[index % palette.length];
  const iconPath = serviceIconPaths[index % serviceIconPaths.length];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0)"
          : index % 2 === 0 ? "translateX(-50px)" : "translateX(50px)",
      }}
    >
      <div className="group rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 hover:-translate-y-1.5 h-full flex flex-col">

        {/* ── Card header (dark gradient) ── */}
        <div
          className={`relative p-7 sm:p-8 bg-gradient-to-br ${color.bg} overflow-hidden`}
        >
          {/* Blob glow */}
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-35"
            style={{ backgroundColor: color.accent }}
          />
          <div
            className="absolute bottom-0 left-1/3 w-24 h-24 rounded-full blur-2xl opacity-10"
            style={{ backgroundColor: color.accent }}
          />

          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Top row: number badge + icon */}
          <div className="relative flex items-center justify-between mb-5">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full border"
              style={{
                color: color.accent,
                borderColor: color.accent + "44",
                backgroundColor: color.accent + "18",
              }}
            >
              {service.number}
            </span>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ backgroundColor: color.accent + "18", borderColor: color.accent + "30" }}>
              <ServiceIcon path={iconPath} color={color.accent} />
            </div>
          </div>

          {/* Title */}
          <h2 className="relative text-white font-bold text-xl sm:text-2xl mb-3 leading-snug">
            {service.title}
          </h2>

          {/* Description */}
          <p className="relative text-white/65 text-sm leading-relaxed">
            {service.description}
          </p>

          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
            style={{ backgroundColor: color.accent }}
          />
        </div>

        {/* ── Card body (features) ── */}
        <div className="flex-1 bg-white p-6 sm:p-7 border-t" style={{ borderColor: color.accent + "22" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: color.accent }}>
            What&apos;s included
          </p>
          <ul className="space-y-2.5">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                  style={{ backgroundColor: color.accent }}
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ServicesAccordion({ services }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
      {services.map((service, i) => (
        <ServiceCard key={service.number} service={service} index={i} />
      ))}
    </div>
  );
}
