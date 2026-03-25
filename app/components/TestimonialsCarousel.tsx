"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const ACCENT = "#FF6B00";
const TYPING_SPEED = 28;
const HOLD_DURATION = 1800;

const testimonials = [
  {
    quote:
      "The team is very intelligent and knowledgable, very few have good grip on LLMs and they do have very deep subject knowledge. If given the roadmap clearly at the initial stages they will bring exponential results, otherwise they can also overkill out of the passion towards their work.",
    name: "Ajay Shokar",
    title: "Jobkart Canada",
  },
  {
    quote:
      "Working with NeuroStack has been a great experience. Their skills are top-notch (4.5/5), availability is excellent (5/5), and communication is strong (4.5/5). A reliable and capable professional to work with.",
    name: "Araving Gajjela",
    title: "CEO — APPit & Workisy",
  },
  {
    quote:
      "NeuroStack's unmatched technical depth in AI is truly impressive. They understood our unique challenges and delivered innovative, scalable solutions faster than expected.",
    name: "Kishore",
    title: "Zrae Global",
  },
  {
    quote:
      "The ASR model integration for our department was completely seamless. Their attention to detail, technical precision, and dedication to accessibility was genuinely remarkable.",
    name: "Dr. Chandrasekhar",
    title: "Linguistics Department, Delhi University",
  },
  {
    quote:
      "A brilliant and dependable partner for AI research projects. Their expertise in fine-tuning models and providing robust, well-documented research support is absolutely invaluable.",
    name: "Dr. Deepika",
    title: "AI Researcher",
  },
];

function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [fading, setFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progressMs, setProgressMs] = useState(0);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeQuote = testimonials[current].quote;
  const totalDuration = activeQuote.length * TYPING_SPEED + HOLD_DURATION;
  const typingDone = displayed.length >= activeQuote.length;

  const goTo = useCallback((idx: number) => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    setIsPaused(false);
    setFading(true);
    fadeTimerRef.current = setTimeout(() => {
      setCurrent(idx);
      setDisplayed("");
      setProgressMs(0);
      setFading(false);
    }, 300);
  }, []);

  const advance = useCallback(() => {
    goTo((current + 1) % testimonials.length);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (fading || isPaused) return;

    const interval = setInterval(() => {
      setProgressMs((value) => {
        const nextValue = value + 50;
        if (nextValue >= totalDuration) {
          clearInterval(interval);
          advance();
          return totalDuration;
        }
        return nextValue;
      });
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [advance, fading, isPaused, totalDuration]);

  // Typing effect
  useEffect(() => {
    if (typingDone || fading || isPaused) return;

    const timeout = setTimeout(() => {
      setDisplayed(activeQuote.slice(0, displayed.length + 1));
    }, TYPING_SPEED);

    return () => clearTimeout(timeout);
  }, [activeQuote, displayed, fading, isPaused, typingDone]);

  const t = testimonials[current];
  const progressWidth = `${Math.min((progressMs / totalDuration) * 100, 100)}%`;

  function handleDotClick(idx: number) {
    if (idx === current) {
      setIsPaused((value) => !value);
      return;
    }

    goTo(idx);
  }

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* Card */}
      <div
        className={`relative rounded-3xl overflow-hidden transition-opacity duration-300 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
        style={{
          background: "linear-gradient(135deg, #0A2647 0%, #0D3A6B 60%, #154360 100%)",
        }}
      >
        {/* Animated background blobs inside card */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none blob-1"
          style={{ backgroundColor: ACCENT }}
        />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white blur-3xl opacity-[0.04] pointer-events-none blob-2" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full blur-3xl opacity-10 pointer-events-none blob-3"
          style={{ backgroundColor: ACCENT }}
        />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />


        <div className="relative p-8 sm:p-12">
          {/* Stars + quote mark row */}
          <div className="flex items-start justify-between mb-6">
            <div className="text-lg tracking-widest" style={{ color: ACCENT }}>
              ★★★★★
            </div>
            {/* Decorative large quote */}
            <div
              className="text-7xl sm:text-8xl font-serif leading-none select-none opacity-25"
              style={{ color: ACCENT }}
            >
              &rdquo;
            </div>
          </div>

          {/* Quote with typing effect */}
          <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed min-h-[5rem] sm:min-h-[6rem] mb-8">
            {displayed}
            {!typingDone && (
              <span
                className="inline-block w-0.5 h-[1em] rounded-sm align-middle ml-0.5 animate-[blink_1s_step-end_infinite]"
                style={{ backgroundColor: ACCENT }}
              />
            )}
          </p>

          {/* Author row */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg"
              style={{ backgroundColor: ACCENT }}
            >
              {t.name[0]}
            </div>
            <div>
              <p className="font-bold text-white text-sm sm:text-base">{t.name}</p>
              <p className="text-white/50 text-xs sm:text-sm mt-0.5">{t.title}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-px bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-75 ease-linear"
              style={{
                width: progressWidth,
                backgroundColor: ACCENT,
              }}
            />
          </div>
        </div>
      </div>

      {/* Dots only */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {testimonials.map((tt, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? "28px" : "10px",
              height: "10px",
              backgroundColor: i === current ? ACCENT : "#D1D5DB",
            }}
          />
        ))}
      </div>
    </div>
  );
}
