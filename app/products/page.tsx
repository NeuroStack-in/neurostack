"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CTASection from "../components/CTASection";
import AnimateOnScroll from "../components/AnimateOnScroll";

const products = [
  {
    badge: "Vision · Speech · Language",
    id: "api-inferencing",
    title: "API Inferencing",
    description:
      "We provide high-speed AI inferencing APIs for vision, speech, and language tasks that you can plug into your existing platforms effortlessly. From object detection and image captioning to speech-to-text and summarization — our APIs are optimized for low latency and high accuracy.",
    accent: "#FF6B00",
    features: ["Low Latency", "Autoscaling", "Pay-as-you-go"],
    image: "/api.png",
  },
  {
    badge: "Legal · Healthcare · Finance",
    id: "llm-solutions",
    title: "Fine-Tuned LLM Solutions",
    description:
      "Tailored Large Language Model (LLM) solutions fine-tuned for real business use cases. From contract analysis for the legal sector to medical summarization for healthcare, our solutions are secure, scalable, and on-brand.",
    accent: "#4A90D9",
    features: ["Domain-Specific", "Secure", "Scalable"],
    image: "/fine.png",
  },
  {
    badge: "Healthcare · Sports · Workplace",
    id: "posture-estimation",
    title: "Posture Estimation & Tracking",
    description:
      "Real-time body movement tracking using cloud-based API inference or on-device edge deployment. Perfect for athlete motion tracking, workplace posture monitoring, and physiotherapy analytics.",
    accent: "#FF6B00",
    features: ["Real-time", "Edge-ready", "Clinical Grade"],
    image: "/posture.png",
  },
];

/* ── Typing hero ── */
function ProductsTyping() {
  const text = "AI-Powered Products Built to Scale.";
  const accentStart = 20; // "AI-Powered Products " length
  const [count, setCount] = useState(0);
  const [showDesc, setShowDesc] = useState(false);
  const done = count >= text.length;

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setCount(n => n + 1), 55);
    return () => clearTimeout(t);
  }, [count, done]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setShowDesc(true), 300);
    return () => clearTimeout(t);
  }, [done]);

  const shown = text.slice(0, count);
  const white = shown.slice(0, Math.min(count, accentStart));
  const orange = count > accentStart ? shown.slice(accentStart) : "";

  return (
    <>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-[1.1] mb-6">
        <span>{white}</span>
        <span className="text-accent">{orange}</span>
        {!done && (
          <span className="inline-block w-[3px] h-[0.85em] bg-accent rounded-sm align-middle ml-1" style={{ animation: "blink 1s step-end infinite" }} />
        )}
      </h1>
      <p
        className="text-gray-500 text-lg sm:text-xl leading-relaxed max-w-xl transition-all duration-700"
        style={{ opacity: showDesc ? 1 : 0, transform: showDesc ? "translateY(0)" : "translateY(10px)" }}
      >
        Whether you&apos;re looking to upgrade your existing software or
        launch a new AI-powered platform, we&apos;ve got you covered.
      </p>
    </>
  );
}

/* ── Toast notification ── */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-[heroFadeUp_0.3s_ease-out]">
      <div className="flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border border-accent/30" style={{ backgroundColor: "#0A2647", color: "#FF6B00" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
        </svg>
        <span className="text-sm font-semibold text-white">{message}</span>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function ProductsPage() {
  const [toast, setToast] = useState<string | null>(null);

  function handleTryNow() {
    setToast("Coming Soon");
  }

  return (
    <main>
      {/* Hero — light gradient with typing effect */}
      <section className="relative overflow-hidden min-h-[60vh] pt-28 pb-16 flex items-center" style={{ background: "linear-gradient(135deg, #FFF5EE 0%, #FAFCFF 50%, #EEF4FF 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.08] pointer-events-none" style={{ backgroundColor: "#FF6B00" }} />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.05] pointer-events-none" style={{ backgroundColor: "#4A90D9" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-[0.15em] uppercase">Our Products</span>
            </div>
            <ProductsTyping />
          </div>
        </div>
      </section>

      {/* Products — dark section */}
      <section className="py-20 sm:py-28 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0A2647 0%, #071b34 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-16 max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-[2px] bg-accent rounded-full" />
                <span className="text-accent font-semibold text-xs uppercase tracking-[0.2em]">What We Build</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1]">
                Our <span className="text-accent">Products</span>
              </h2>
            </div>
          </AnimateOnScroll>

          {/* Product panels */}
          <div className="space-y-10">
            {products.map((product, i) => (
              <AnimateOnScroll
                key={product.title}
                animation={i % 2 === 0 ? "fade-left" : "fade-right"}
                delay={80}
              >
                <div
                  id={product.id}
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    background: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                    scrollMarginTop: "120px",
                  }}
                >
                  {/* Glow blob */}
                  <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ backgroundColor: product.accent }} />
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

                  <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-14 p-8 sm:p-10 lg:p-14 items-center">
                    {/* Product image */}
                    <div className="flex-shrink-0">
                      <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-3xl overflow-hidden relative shadow-lg border border-white/10" style={{ backgroundColor: `${product.accent}10` }}>
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-contain p-3 rounded-3xl"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-5 leading-[1.1]">
                        {product.title}
                      </h2>

                      <p className="text-white/45 text-base sm:text-lg leading-relaxed mb-6 max-w-2xl">
                        {product.description}
                      </p>

                      {/* Feature pills */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {product.features.map((f) => (
                          <span
                            key={f}
                            className="text-[11px] font-semibold px-3 py-1 rounded-full"
                            style={{ color: product.accent, backgroundColor: `${product.accent}12` }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={handleTryNow}
                        className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:brightness-110 cursor-pointer"
                        style={{
                          backgroundColor: product.accent,
                          color: "#fff",
                        }}
                      >
                        Try Now
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-link */}
      <section className="py-12 text-center" style={{ background: "#f8faff" }}>
        <p className="text-gray-600 text-lg">
          Need a custom solution?{" "}
          <Link href="/services" className="text-accent font-semibold hover:underline">
            Explore our services
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="text-accent font-semibold hover:underline">
            contact us
          </Link>{" "}
          to discuss your project.
        </p>
      </section>

      <CTASection buttonText="Book a Demo" />

      {/* Toast notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </main>
  );
}
