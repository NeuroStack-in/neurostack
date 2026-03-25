"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface Achievement {
  stat: ReactNode;
  title: string;
  desc: string;
}

interface Props {
  achievements: Achievement[];
}

const cardAccents = [
  "#FF6B00",
  "#4A90D9",
];

function parseCountable(stat: ReactNode): { num: number; suffix: string } | null {
  if (typeof stat !== "string") return null;
  const kMatch = stat.match(/^(\d+)(K\+?)$/);
  if (kMatch) return { num: parseInt(kMatch[1]), suffix: kMatch[2] };
  const numMatch = stat.match(/^(\d+)(\+?)$/);
  if (numMatch) return { num: parseInt(numMatch[1]), suffix: numMatch[2] };
  return null;
}

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function AchievementCard({
  achievement,
  index,
}: {
  achievement: Achievement;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const color = cardAccents[index % cardAccents.length];
  const parsed = parseCountable(achievement.stat);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();

        // Start counter after card animates in
        if (!parsed) return;
        setTimeout(() => {
          const DURATION = 1600;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / DURATION, 1);
            setCount(Math.round(easeOutExpo(t) * parsed.num));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }, 300);
      },
      { threshold: 0.25, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayStat = parsed ? count + parsed.suffix : achievement.stat;

  return (
    <div
      ref={cardRef}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(80px)",
        transitionDelay: "0ms",
      }}
    >
      <div
        className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-8 rounded-2xl p-6 sm:p-8 border backdrop-blur-sm overflow-hidden group hover:scale-[1.01] transition-transform duration-300"
        style={{
          borderColor: color + "33",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        {/* Hover background glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at left center, ${color}14 0%, transparent 65%)`,
          }}
        />

        {/* Left colored accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ backgroundColor: color }}
        />

        {/* Stat — centered */}
        <div
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-none tabular-nums flex-shrink-0 w-full sm:w-44 text-center py-1 px-2"
          style={{ color }}
        >
          {displayStat}
        </div>

        {/* Divider */}
        <div
          className="hidden sm:block w-px self-stretch opacity-20 flex-shrink-0"
          style={{ backgroundColor: color }}
        />

        {/* Text */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3 className="text-white font-bold text-base sm:text-lg leading-snug mb-1.5">
            {achievement.title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed">
            {achievement.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AchievementDeck({ achievements }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {achievements.map((a, i) => (
        <AchievementCard key={a.title} achievement={a} index={i} />
      ))}
    </div>
  );
}
