"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CTASection from "../components/CTASection";

/* ── Service data ── */
const services = [
  {
    num: "01",
    title: "Agentic AI Systems",
    desc: "AI that reasons, plans, and acts like a human assistant — fully or semi-autonomous.",
    features: ["Task Automation Agents", "Tool-Using Agents", "Memory-Augmented Agents", "Workflow Orchestration Agents", "Personalized Assistants"],
    accent: "#FF6B00",
    iconD: "M7 7h10v10H7zM9 7V4M12 7V4M15 7V4M9 17v3M12 17v3M15 17v3M7 9H4M7 12H4M7 15H4M17 9h3M17 12h3M17 15h3",
  },
  {
    num: "02",
    title: "RAG Systems",
    desc: "AI that reads your files, websites, or databases before answering — smarter than plain GPT.",
    features: ["PDF / Data Search Chatbots", "Domain-Specific Q&A Bots", "API-Augmented Generative Apps", "Vector DB Integration"],
    accent: "#4A90D9",
    iconD: "M12 3C7.58 3 4 4.34 4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6c0-1.66-3.58-3-8-3zM4 6c0 1.66 3.58 3 8 3s8-1.34 8-3M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3",
  },
  {
    num: "03",
    title: "Generative AI Solutions",
    desc: "AI that creates new things — text, code, images, videos, and voices.",
    features: ["Text Generation", "Image Generation", "Code Generation", "Voice Generation", "Video Generation (Coming Soon)"],
    accent: "#FF6B00",
    iconD: "M9.5 2l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5zM19 14l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1zM4 14l.75 1.75L6.5 16.5 4.75 17.25 4 19l-.75-1.75L1.5 16.5l1.75-.75z",
  },
  {
    num: "04",
    title: "AI for Vision & Language",
    desc: "AI systems that can perceive the world through images, video, and speech.",
    features: ["Object Detection, Segmentation & Classification", "Image Captioning and OCR", "Pose Estimation and Medical Imaging", "Speech-to-Text Conversion"],
    accent: "#4A90D9",
    iconD: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
  },
  {
    num: "05",
    title: "AI R&D & Innovation",
    desc: "Custom AI experiments, research tools, and next-gen solutions.",
    features: ["Custom Model Training", "Federated & Edge AI", "IoT + AI Fusion", "Benchmarking & Evaluation", "Custom Algorithm Design"],
    accent: "#FF6B00",
    iconD: "M9 3h6M9 3v5l-5 9a2 2 0 001.73 3h10.54A2 2 0 0018 17l-5-9V3M6 12h12",
  },
  {
    num: "06",
    title: "Web & Mobile Development",
    desc: "Scalable apps built using modern tech and integrated with AI.",
    features: ["Web App Development", "Mobile App Development", "API & Cloud Integration", "Admin Dashboards"],
    accent: "#4A90D9",
    iconD: "M2 4h20v14a2 2 0 01-2 2H4a2 2 0 01-2-2V4zM8 22h8M12 18v4",
  },
];

/* ── Scroll reveal hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Hero typing effect ── */
function TypingHeading() {
  const text = "AI Solutions Built for Real Impact";
  const accentStart = 25; // "AI Solutions Built for " length
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setCount(n => n + 1), 55);
    return () => clearTimeout(t);
  }, [count, done]);

  const shown = text.slice(0, count);
  const white = shown.slice(0, Math.min(count, accentStart));
  const orange = count > accentStart ? shown.slice(accentStart) : "";

  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
      <span className="text-primary">{white}</span>
      <span className="text-accent">{orange}</span>
      {!done && (
        <span className="inline-block w-[3px] h-[0.85em] bg-accent rounded-sm align-middle ml-1" style={{ animation: "blink 1s step-end infinite" }} />
      )}
    </h1>
  );
}

/* ── Interactive Service Tabs ── */
function ServiceTabs() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressMs, setProgressMs] = useState(0);
  const { ref, visible } = useReveal();
  const s = services[active];
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const AUTO_ROTATE_MS = 6000;

  // Auto-advance every 6s
  useEffect(() => {
    if (isPaused) return;

    progressIntervalRef.current = setInterval(() => {
      setProgressMs((prev) => {
        const next = prev + 50;
        if (next >= AUTO_ROTATE_MS) {
          return AUTO_ROTATE_MS;
        }
        return next;
      });
    }, 50);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPaused, active]);

  useEffect(() => {
    if (isPaused || progressMs < AUTO_ROTATE_MS) return;
    setActive((prev) => (prev + 1) % services.length);
    setProgressMs(0);
  }, [isPaused, progressMs]);

  // Reset timer on manual click
  function goTo(i: number) {
    if (i === active) {
      setIsPaused(prev => !prev);
      return;
    }

    setIsPaused(false);
    setActive(i);
    setProgressMs(0);
  }

  const progressWidth = `${Math.min((progressMs / AUTO_ROTATE_MS) * 100, 100)}%`;

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      {/* White container wrapping tabs + panel */}
      <div className="rounded-3xl overflow-hidden shadow-xl bg-white">
        {/* Tab row — inside white card */}
        <div className="flex overflow-x-auto gap-1 pl-2 pr-2 sm:px-6 lg:px-10 pt-0 pb-0 scrollbar-hide border-b border-gray-100/80 lg:justify-center" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {services.map((svc, i) => {
            const isActive = i === active;
            return (
              <button
                key={svc.title}
                onClick={() => goTo(i)}
                className="relative flex items-center gap-2 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-[12px] sm:text-[13px] font-semibold transition-all duration-300 rounded-t-lg flex-shrink-0 hover:bg-gray-50"
                style={{
                  backgroundColor: isActive ? `${svc.accent}10` : "transparent",
                  color: isActive ? svc.accent : "rgba(10,38,71,0.5)",
                  borderBottom: isActive ? `2px solid ${svc.accent}` : "2px solid transparent",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 hidden lg:block" style={{ stroke: "currentColor" }}>
                  <path d={svc.iconD} />
                </svg>
                <span className="whitespace-nowrap">{svc.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active service panel */}
        <div
          key={active}
          className="relative"
      >
        {/* Subtle accent blob */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-[120px] opacity-[0.06] pointer-events-none" style={{ backgroundColor: s.accent }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.03) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative p-8 sm:p-12 lg:p-14">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* Left — info */}
            <div className="flex-1">
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border"
                style={{ backgroundColor: `${s.accent}22`, borderColor: `${s.accent}45` }}
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8" style={{ stroke: s.accent }}>
                  <path d={s.iconD} />
                </svg>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-primary mb-4 leading-[1.1]">
                {s.title}
              </h2>

              <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
                {s.desc}
              </p>

              {/* CTA */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:brightness-110"
                style={{
                  backgroundColor: s.accent,
                  color: "#FFFFFF",
                }}
              >
                Get Started
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>

            {/* Right — features */}
            <div className="lg:w-[380px] flex-shrink-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: s.accent }}>
                What&apos;s Included
              </p>
              <ul className="space-y-4">
                {s.features.map((f, i) => (
                  <li
                    key={f}
                    className="flex items-start gap-4 text-primary/80 text-[15px] leading-relaxed animate-[heroFadeUp_0.4s_ease-out_both]"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border mt-0.5"
                      style={{ backgroundColor: `${s.accent}10`, borderColor: `${s.accent}25` }}
                    >
                      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" style={{ color: s.accent }}>
                        <path d="M3 8l3.5 3.5L13 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom timeline */}
        <div className="px-8 pb-8 sm:px-12 sm:pb-10 lg:px-14 lg:pb-12">
          <div className="h-px w-full overflow-hidden rounded-full bg-gray-200/90">
            <div
              className="h-full rounded-full transition-[width] duration-75 ease-linear"
              style={{ width: progressWidth, backgroundColor: s.accent }}
            />
          </div>
        </div>
      </div>
      </div>{/* /white container */}
    </div>
  );
}

/* ── Page ── */
export default function ServicesPage() {
  const statsReveal = useReveal(0.2);

  return (
    <main>
      {/* ═══════════ HERO ═══════════ */}
      <section className="min-h-[80vh] pt-28 pb-16 flex items-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FFF5EE 0%, #FAFCFF 50%, #EEF4FF 100%)" }}>
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        {/* Accent blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.08] pointer-events-none" style={{ backgroundColor: "#FF6B00" }} />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.05] pointer-events-none" style={{ backgroundColor: "#4A90D9" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-[0.15em] uppercase">Our Services</span>
            </div>

            <TypingHeading />

            <p className="text-gray-500 text-lg sm:text-xl leading-relaxed max-w-xl mb-14">
              From autonomous agents to fine-tuned models — we build, deploy, and
              maintain production-grade AI systems tailored to your exact needs.
            </p>

            {/* Stats row */}
            <div
              ref={statsReveal.ref}
              className={`flex flex-wrap gap-8 sm:gap-12 transition-all duration-1000 ${statsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              {[
                { val: "100+", label: "Projects Delivered" },
                { val: "12+", label: "Pipelines / Month" },
                { val: "18+", label: "Research Papers / Month" },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-center gap-8 sm:gap-12" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div>
                    <p className="text-3xl font-extrabold text-accent leading-none">{s.val}</p>
                    <p className="text-gray-400 text-xs mt-1 tracking-wide">{s.label}</p>
                  </div>
                  {i < arr.length - 1 && <div className="hidden sm:block w-px h-10 bg-gray-200" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ SERVICE CARDS ═══════════ */}
      <section className="py-20 sm:py-28 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0D3A6B 0%, #0A2647 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,107,0,0.03) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="mb-14 max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-accent rounded-full" />
              <span className="text-accent font-semibold text-xs uppercase tracking-[0.2em]">What We Do</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-[1.1]">
              Everything We <span className="text-accent">Build</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed">
              Select a service to explore what we offer — from strategy to deployment.
            </p>
          </div>

          {/* Interactive tabs */}
          <ServiceTabs />

        </div>
      </section>

      {/* ═══════════ CROSS-LINK ═══════════ */}
      <section className="py-12 bg-white text-center">
        <p className="text-gray-600 text-lg">
          Looking for ready-to-use AI solutions?{" "}
          <Link href="/products" className="text-accent font-semibold hover:underline">
            See our products
          </Link>.
        </p>
      </section>

      <CTASection buttonText="Schedule a Consultation" />
    </main>
  );
}
