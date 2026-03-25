import type { Metadata } from "next";
import Link from "next/link";
import CTASection from "../components/CTASection";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about NeuroStack — our vision, mission, founding leadership, and core values. A team of technologists and researchers making AI accessible for every business.",
  alternates: { canonical: "https://neurostack.in/about" },
};
import dynamic from "next/dynamic";
import AnimateOnScroll from "../components/AnimateOnScroll";
import Image from "next/image";

const CoreValuesChart = dynamic(() => import("../components/CoreValuesChart"), {
  loading: () => null,
});

const team = [
  {
    name: "Sakthi Mahendran",
    role: "Founder & CEO",
    initial: "S",
    image: "/ceo3.png",
    bio: "Sakthi leads the vision and direction of NeuroStack, driving innovation across AI-powered solutions. With a deep passion for technology and problem-solving, he has been instrumental in turning ideas into impactful products — building scalable systems that are accessible, intelligent, and built for real-world use.",
    linkedin: "https://www.linkedin.com/in/sakthimahendrank/",
    focus: ["Vision & Strategy", "AI Architecture", "Product Leadership"],
    gradient: "from-[#0A2647] via-[#0D3A6B] to-[#154360]",
    accent: "#FF6B00",
  },
  {
    name: "Kiran Parthiban",
    role: "Managing Director & Co-Founder",
    initial: "K",
    image: "/about2.jpg",
    bio: "Kiran oversees operations, strategy, and client delivery. With a strong foundation in engineering and leadership, he ensures every solution meets the highest standards of performance and usability — keeping the company aligned with its mission of making technology human-centric.",
    linkedin: "https://www.linkedin.com/in/kiran-parthiban/",
    focus: ["Operations", "Client Relations", "Engineering Excellence"],
    gradient: "from-[#0D3A6B] via-[#154360] to-[#0A2647]",
    accent: "#4A90D9",
  },
];

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <main>

      {/* ══════════════════════════════════════
          HERO — warm asymmetric layout
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[72vh] pt-20 flex items-center" style={{ background: "linear-gradient(135deg, #FFF5EE 0%, #FAFCFF 55%, #EEF4FF 100%)" }}>
        {/* Geometric decorations */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,107,0,0.04) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />

        {/* Large faint "N" watermark */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[22rem] font-black leading-none select-none pointer-events-none" style={{ color: "rgba(10,38,71,0.04)", fontFamily: "sans-serif" }}>
          N
        </div>

        {/* Decorative rings */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-accent/10 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-[350px] h-[350px] rounded-full border border-accent/15 pointer-events-none" />
        <div className="absolute top-8 right-8 w-[200px] h-[200px] rounded-full border border-accent/20 pointer-events-none" />
        {/* Orange accent blob */}
        <div className="blob-1 absolute bottom-0 left-1/3 w-80 h-40 rounded-full pointer-events-none blur-3xl opacity-20" style={{ backgroundColor: "#FF6B00" }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl hero-anim-1">
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-accent" />
              <span className="text-accent font-bold text-sm uppercase tracking-widest">About NeuroStack</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-black text-primary leading-[1.1] mb-6">
              We Make AI Work<br />
              <span className="text-accent">For Everyone.</span>
            </h1>

            <p className="text-gray-500 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              We are a team of technologists, researchers, and creative thinkers building intelligent systems that solve real-world problems. Our mission is to bridge the gap between cutting-edge AI and everyday business needs — making powerful technology approachable, ethical, and scalable. From startups to enterprises, we help teams integrate, innovate, and transform through AI-driven solutions tailored to their workflows.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          VISION — full-width horizontal band
      ══════════════════════════════════════ */}
      <AnimateOnScroll animation="fade-up">
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0A2647 0%, #0D3A6B 60%, #154360 100%)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ backgroundColor: "#FF6B00" }} />

          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 relative">
            {/* Giant outlined "VISION" watermark */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
              aria-hidden="true"
            >
              <span
                className="text-[8rem] sm:text-[12rem] lg:text-[16rem] font-black uppercase tracking-tight leading-none"
                style={{ WebkitTextStroke: "2.5px rgba(255,107,0,0.35)", color: "transparent" }}
              >
                VISION
              </span>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1 max-w-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-[2px] bg-accent rounded-full" />
                  <span className="text-accent font-semibold text-xs uppercase tracking-[0.2em]">Our Vision</span>
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-0">
                  AI That&apos;s Accessible <span className="text-accent">to All</span>
                </h3>
              </div>
              <div className="flex-shrink-0 max-w-md lg:text-right">
                <p className="text-white/50 text-base sm:text-lg leading-relaxed">
                  To make AI accessible, responsible, and transformative — for every business, team, and idea that dares to grow.
                </p>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* ══════════════════════════════════════
          MISSION — full-width horizontal band
      ══════════════════════════════════════ */}
      <AnimateOnScroll animation="fade-up" delay={100}>
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px] opacity-[0.04] pointer-events-none" style={{ backgroundColor: "#FF6B00" }} />

          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 relative">
            {/* Giant outlined "MISSION" watermark */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
              aria-hidden="true"
            >
              <span
                className="text-[7rem] sm:text-[11rem] lg:text-[14rem] font-black uppercase tracking-tight leading-none"
                style={{ WebkitTextStroke: "2.5px rgba(10,38,71,0.18)", color: "transparent" }}
              >
                MISSION
              </span>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row-reverse lg:items-center lg:justify-between gap-8">
              <div className="flex-1 max-w-2xl lg:text-right">
                <div className="flex items-center gap-3 mb-5 lg:justify-end">
                  <span className="text-primary font-semibold text-xs uppercase tracking-[0.2em]">Our Mission</span>
                  <div className="w-10 h-[2px] bg-primary rounded-full" />
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary leading-[1.1] mb-0">
                  Engineering Intelligence <span className="text-accent">That Lasts</span>
                </h3>
              </div>
              <div className="flex-shrink-0 max-w-md">
                <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                  To engineer intelligent systems that empower organizations to work smarter, move faster, and create with confidence — combining deep tech expertise with real-world understanding.
                </p>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* ══════════════════════════════════════
          FOUNDING LEADERSHIP — cinematic panels
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0A2647 0%, #071b34 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        {/* Section header */}
        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-10 text-center">
          <AnimateOnScroll animation="fade-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-[2px] bg-accent rounded-full" />
              <span className="text-accent font-semibold text-xs uppercase tracking-[0.2em]">Leadership</span>
              <div className="w-12 h-[2px] bg-accent rounded-full" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1]">
              Founding Leadership
            </h2>
          </AnimateOnScroll>
        </div>

        {/* Leader panels */}
        {team.map((member, i) => (
          <AnimateOnScroll key={member.name} animation={i % 2 === 0 ? "fade-left" : "fade-right"} delay={i * 120}>
            <div className="relative max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-16">
              <div className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-14 items-center justify-center`}>

                {/* Photo */}
                <div className="flex-shrink-0 mx-auto lg:mx-0">
                  <div
                    className="relative w-52 h-52 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-full overflow-hidden shadow-2xl"
                    style={{ border: `4px solid ${member.accent}`, boxShadow: `0 0 40px ${member.accent}25` }}
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Info panel */}
                <div className="flex-1">
                  {/* Role label */}
                  <p className="font-semibold text-sm uppercase tracking-[0.15em] mb-3" style={{ color: member.accent }}>
                    {member.role}
                  </p>

                  {/* Name — large */}
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-2">
                    {member.name}
                  </h3>

                  {/* Accent divider */}
                  <div className="w-16 h-[3px] rounded-full my-6" style={{ backgroundColor: member.accent }} />

                  {/* Bio */}
                  <p className="text-white/50 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
                    {member.bio}
                  </p>

                  {/* LinkedIn icon */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
                    style={{ backgroundColor: member.accent + "18", color: member.accent }}
                  >
                    <LinkedInIcon />
                  </a>
                </div>
              </div>

              {/* Separator line between leaders */}
              {i < team.length - 1 && (
                <div className="mt-14 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
              )}
            </div>
          </AnimateOnScroll>
        ))}

        {/* Bottom spacing */}
        <div className="h-16 sm:h-24" />
      </section>

      {/* ══════════════════════════════════════
          CORE VALUES — interactive donut chart
      ══════════════════════════════════════ */}
      <section className="py-20 sm:py-28 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #f8faff 0%, #ffffff 50%, #fff8f3 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-16 relative">
              {/* Giant watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
                <span className="text-[6rem] sm:text-[10rem] lg:text-[12rem] font-black tracking-tight leading-none" style={{ WebkitTextStroke: "2px rgba(10,38,71,0.06)", color: "transparent" }}>
                  Neuro
                </span>
                <span className="text-[6rem] sm:text-[10rem] lg:text-[12rem] font-black tracking-tight leading-none ml-4" style={{ WebkitTextStroke: "2px rgba(255,107,0,0.08)", color: "transparent" }}>
                  Stack
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-[2px] bg-accent rounded-full" />
                  <span className="text-accent font-semibold text-xs uppercase tracking-[0.2em]">What We Stand For</span>
                  <div className="w-10 h-[2px] bg-accent rounded-full" />
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary leading-[1.1]">
                  Our Core Values
                </h2>
                <p className="text-gray-500 mt-4 max-w-lg mx-auto text-base">
                  Hover over each segment to explore what drives us.
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={150}>
            <div className="flex justify-center">
              <CoreValuesChart />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DIVERSITY & INCLUSION
      ══════════════════════════════════════ */}
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0A2647 0%, #0D3A6B 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="blob-3 absolute top-1/2 -translate-y-1/2 -right-20 w-80 h-80 rounded-full opacity-[0.08] blur-3xl pointer-events-none" style={{ backgroundColor: "#FF6B00" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <AnimateOnScroll animation="fade-left">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Diversity &amp; <span className="text-accent">Inclusion</span>
                </h2>
                <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-4">
                  Innovation thrives when diverse minds work together. We actively build an environment where people from all backgrounds feel safe, seen, and supported.
                </p>
                <p className="text-white/65 text-base sm:text-lg leading-relaxed">
                  From hiring practices to team rituals, we prioritize inclusion not as a core strength — believing in equal opportunity, open collaboration, and space for every individual to lead, grow, and belong. Explore our <Link href="/services" className="text-accent font-semibold hover:underline">services</Link> or <Link href="/contact" className="text-accent font-semibold hover:underline">get in touch</Link> to learn how we work.
                </p>
              </div>
            </AnimateOnScroll>

            {/* Right: cards grid */}
            <AnimateOnScroll animation="fade-right" delay={120}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { d: "M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z", label: "Global Mindset", desc: "Voices from multiple cultures and disciplines", color: "#FF6B00" },
                  { d: "M12 3v18M3 6l9-3 9 3M6 10l-3 7c0 2 1.5 3 3 3s3-1 3-3L6 10zM18 10l-3 7c0 2 1.5 3 3 3s3-1 3-3l-3-7z", label: "Equal Opportunity", desc: "Fair and bias-free hiring practices", color: "#FF6B00" },
                  { d: "M19 11V5a2 2 0 00-2-2H7a2 2 0 00-2 2v6M3 11h18M3 11v6a2 2 0 002 2h14a2 2 0 002-2v-6", label: "Open Collaboration", desc: "Every voice is heard and valued", color: "#FF6B00" },
                  { d: "M3 20h18M3 20V10l5 4 4-7 4 5 5-8", label: "Growth for All", desc: "Mentorship and leadership for everyone", color: "#FF6B00" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl p-5 border transition-all duration-300 group"
                    style={{ borderColor: item.color + "25", background: "rgba(255,255,255,0.05)" }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 border" style={{ backgroundColor: item.color + "18", borderColor: item.color + "35" }}>
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ stroke: item.color }}>
                        <path d={item.d} />
                      </svg>
                    </div>
                    <p className="font-bold text-white text-sm mb-1">{item.label}</p>
                    <p className="text-white/50 text-xs leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <CTASection buttonText="Book a Demo" />
    </main>
  );
}
