import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NeuroStack — Commoditizing AI for Every Business",
  description:
    "Making intelligent systems accessible, affordable, and actionable — for everyone. Custom AI, LLM solutions, computer vision APIs, and agentic AI systems. 100+ projects delivered.",
  alternates: { canonical: "https://neurostack.in" },
};
import CTASection from "./components/CTASection";
import AnimateOnScroll from "./components/AnimateOnScroll";
import TypingHero from "./components/TypingHero";
import dynamic from "next/dynamic";
import AchievementDeck from "./components/AchievementDeck";
import TiltCard from "./components/TiltCard";
import OfferSection from "./components/OfferSection";

const NeuralBackground = dynamic(() => import("./components/NeuralBackground"), {
  loading: () => null,
});
const TestimonialsCarousel = dynamic(() => import("./components/TestimonialsCarousel"), {
  loading: () => null,
});


/* Legacy achievement copy retained temporarily for reference.
const achievements = [
  {
    stat: "100+",
    title: "Global GenAI Projects Delivered",
    desc: "Partnered with businesses worldwide to build cutting-edge Generative AI solutions tailored to their unique needs.",
  },
  {
    stat: "12+",
    title: "GenAI Pipelines Every Month",
    desc: "Building, deploying, and maintaining high-performance AI pipelines for clients across multiple industries.",
  },
  {
    stat: "5",
    title: "DeepSeek V3 Fine-Tuned Versions",
    desc: "Leveraged QLoRA to fine-tune the world's most powerful open-source model — only 5 versions on Hugging Face.",
  },
  {
    stat: "25K+",
    title: "Daily Users on AgreeUpon.ai",
    desc: "Built and deployed a scalable agentic legal document drafting suite for AgreeUpon.ai, Canada.",
  },
  {
    stat: "Vosk",
    title: "Multilingual ASR Model Distilled",
    desc: "Engineered a lightweight, low-compute ASR model for mobile devices for Delhi University's Dept. of Acoustics & Vocal Studies.",
  },
  {
    stat: "6‑Stage",
    title: "WorkEasy India Semantic AI Search",
    desc: "Created the Indian PoC for WorkEasy's Middle East job platform — featuring a 6-stage semantic AI search with natural language.",
  },
  {
    stat: "18+",
    title: "Research Papers Every Month",
    desc: "Providing mathematical modeling expertise for ML algorithms, contributing to research papers through our AI/ML R&D team.",
  },
  {
    stat: "App",
    title: "Accessible Mobile ASR App",
    desc: "Integrated the distilled ASR model with pitch analysis, intensity measurement, and voice diagnostics for differently-abled individuals.",
  },
];
*/

const homepageAchievements = [
  {
    stat: "100+",
    title: "Global GenAI Projects Delivered",
    desc: "Partnered with businesses worldwide to build cutting-edge Generative AI solutions tailored to their unique needs.",
  },
  {
    stat: "12+",
    title: "GenAI Pipelines Every Month",
    desc: "Building, deploying, and maintaining high-performance AI pipelines for clients across multiple industries.",
  },
  {
    stat: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16" aria-hidden="true">
        <path d="M4 21v-7" />
        <path d="M4 10V3" />
        <path d="M12 21v-9" />
        <path d="M12 8V3" />
        <path d="M20 21v-5" />
        <path d="M20 12V3" />
        <path d="M2 14h4" />
        <path d="M10 8h4" />
        <path d="M18 12h4" />
        <circle cx="4" cy="12" r="2" />
        <circle cx="12" cy="10" r="2" />
        <circle cx="20" cy="14" r="2" />
      </svg>
    ),
    title: "DeepSeek V3 Fine-Tuned Versions",
    desc: "Fine-tuned the world's largest open-source model.",
  },
  {
    stat: "25K+",
    title: "25K+ daily users for our application",
    desc: "Built and deployed a scalable agentic legal document drafting suite for lawyers in Canada.",
  },
  {
    stat: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16" aria-hidden="true">
        <path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 1 1-6 0V6a3 3 0 0 1 3-3z" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
        <path d="M12 18v3" />
        <path d="M8 21h8" />
      </svg>
    ),
    title: "Multilingual ASR Model Distilled",
    desc: "Engineered a lightweight, low-compute ASR model for mobile devices for Delhi University's Dept. of Acoustics & Vocal Studies.",
  },
  {
    stat: (
      <div className="mx-auto flex h-full items-center justify-center leading-none">
        <span className="whitespace-nowrap text-[1.65rem] sm:text-[1.9rem] lg:text-[2.15rem] font-extrabold tracking-tight">
          6-Stage
        </span>
      </div>
    ),
    title: "WorkEasy India Semantic AI Search",
    desc: "Created the Indian PoC for WorkEasy's Middle East job platform - featuring a 6-stage semantic AI search with natural language.",
  },
  {
    stat: "18+",
    title: "Research Papers Every Month",
    desc: "Providing mathematical modeling expertise for ML algorithms, contributing to research papers through our AI/ML R&D team.",
  },
];

const ticker = [
  "Agentic AI", "RAG Systems", "Computer Vision", "LLM Fine-tuning",
  "API Inferencing", "Posture Estimation", "Generative AI",
  "Speech Recognition", "AI R&D",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NeuroStack",
  url: "https://neurostack.in",
  logo: "https://neurostack.in/logo.png",
  description: "Making intelligent systems accessible, affordable, and actionable — for everyone.",
  foundingDate: "2023",
  sameAs: [
    "https://www.linkedin.com/company/neurostack",
    "https://github.com/neurostack",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    url: "https://neurostack.in/contact",
  },
  offers: {
    "@type": "AggregateOffer",
    description: "AI Solutions — Agentic AI, LLM, Computer Vision, RAG, Generative AI, Web & Mobile Development",
  },
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Hero ── */}
      <section
        className="min-h-[88vh] pt-20 flex items-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #040d1e 0%, #081428 50%, #050f22 100%)" }}
      >
        {/* Blue neural network */}
        <NeuralBackground colorScheme="blue" />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(74,144,217,0.07) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* Floating blobs — blue tinted */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="blob-1 absolute top-16 right-12 w-[520px] h-[520px] rounded-full blur-3xl" style={{ backgroundColor: "#4A90D9", opacity: 0.07 }} />
          <div className="blob-2 absolute bottom-8 left-8 w-[380px] h-[380px] rounded-full blur-3xl" style={{ backgroundColor: "#FF6B00", opacity: 0.05 }} />
          <div className="blob-3 absolute top-1/2 left-1/3 w-[280px] h-[280px] rounded-full blur-2xl" style={{ backgroundColor: "#4A90D9", opacity: 0.04 }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <TypingHero />

            <p className="hero-anim-3 text-base sm:text-lg md:text-xl text-white/70 mb-10 leading-relaxed">
              Making intelligent systems accessible, affordable, and actionable
              — for everyone.
            </p>
            <div className="hero-anim-4 flex flex-wrap gap-4 justify-center">
              <Link
                href="/services"
                className="btn-shimmer inline-block bg-accent text-white font-semibold px-8 sm:px-10 py-4 rounded-full text-lg hover:bg-[#e05f00] transition-colors"
              >
                Our Services
              </Link>
              <Link
                href="/contact"
                className="inline-block border-2 border-white/30 text-white font-semibold px-8 sm:px-10 py-4 rounded-full text-lg hover:border-accent hover:text-accent transition-all"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </section>

      {/* ── Ticker ── */}
      <div className="bg-primary/95 border-y border-white/10 py-3 overflow-hidden">
        <div className="marquee-track">
          {[...ticker, ...ticker].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-6 text-sm font-medium text-white/60 whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Welcome ── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Welcome to NeuroStack
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={120}>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              We&apos;re not just building AI — we&apos;re simplifying it, scaling
              it, and putting it to work for businesses like yours. From
              custom-trained LLMs to powerful vision APIs and edge-ready agents,
              our <Link href="/services" className="text-accent font-semibold">solutions</Link> are built to plug into your world without the
              complexity.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={240}>
            <p className="text-gray-600 text-lg leading-relaxed">
              Whether you want to transform your existing workflow or launch an
              AI-native <Link href="/products" className="text-accent font-semibold">product</Link>, we help you move faster — with solutions that are
              smart, scalable, and production-ready. <Link href="/about" className="text-accent font-semibold">Learn more about us</Link>.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── What We Offer ── */}
      <OfferSection />

      {/* ── Testimonials ── */}
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #fff7f0 50%, #f5f0ff 100%)" }}>
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="blob-1 absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-[0.12] blur-3xl pointer-events-none" style={{ backgroundColor: "#FF6B00" }} />
        <div className="blob-2 absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-[0.08] blur-3xl pointer-events-none" style={{ backgroundColor: "#0A2647" }} />
        <div className="blob-3 absolute top-1/2 right-1/4 w-56 h-56 rounded-full opacity-[0.06] blur-2xl pointer-events-none" style={{ backgroundColor: "#FF8533" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-4">
              What Our Clients Say
            </h2>
            <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
              Trusted by founders, researchers, and enterprises across industries.
            </p>
          </AnimateOnScroll>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* ── Achievements ── */}
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: "#0A2647" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,107,0,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="blob-1 absolute top-0 right-0 w-96 h-96 rounded-full bg-accent opacity-[0.06] blur-3xl pointer-events-none" />
        <div className="blob-2 absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white opacity-[0.03] blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Our Achievements
            </h2>
            <p className="text-center text-white/55 mb-12 max-w-xl mx-auto">
              Milestones that reflect our commitment to AI excellence.
            </p>
          </AnimateOnScroll>

          <AchievementDeck achievements={homepageAchievements} />
        </div>
      </section>

      <CTASection />
    </main>
  );
}
