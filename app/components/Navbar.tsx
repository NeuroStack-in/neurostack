"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Research", href: "/research" },
  { label: "About Us", href: "/about" },
];

// Pages whose hero section has a light background
const LIGHT_HERO_PAGES = ["/about", "/services", "/products", "/contact", "/research"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Light mode = light hero background AND not yet scrolled
  const isLightHero = LIGHT_HERO_PAGES.includes(pathname);
  const useDarkText = isLightHero && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  // Color tokens that flip based on background
  const textColor = useDarkText ? "#0A2647" : "#ffffff";
  const textMuted = useDarkText ? "rgba(10,38,71,0.75)" : "rgba(255,255,255,0.75)";
  const hamburgerColor = useDarkText ? "bg-[#0A2647]" : "bg-white";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Outer wrapper — adds padding when scrolled to float the bar */}
      <div
        className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? "px-4 sm:px-6 lg:px-10 pt-3" : isLightHero ? "px-4 sm:px-6 lg:px-10 pt-3" : "px-0 pt-0"
        }`}
      >
        <nav
          className={`max-w-7xl mx-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled
              ? "bg-[#0a1628]/80 backdrop-blur-2xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.35)] border border-white/[0.07]"
              : isLightHero
                ? "bg-[#0A2647]/[0.04] backdrop-blur-md rounded-2xl border border-[#0A2647]/[0.06]"
                : "bg-transparent rounded-none border border-transparent"
          }`}
        >
          <div className={`flex items-center justify-between transition-all duration-700 ${
            scrolled ? "h-[58px] px-5" : "h-[72px] px-4 sm:px-6 lg:px-8"
          }`}>

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className={`relative flex-shrink-0 transition-all duration-500 ${scrolled ? "w-8 h-8" : "w-9 h-9"}`}>
                <Image
                  src="/logo.png"
                  alt="NeuroStack"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <span
                className={`font-bold tracking-tight transition-all duration-500 ${scrolled ? "text-base" : "text-lg"}`}
                style={{ color: textColor }}
              >
                Neuro<span className="text-accent">Stack</span>
              </span>
            </Link>

            {/* ── Desktop Nav — centered ── */}
            <div className="hidden md:flex items-center gap-10">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="relative py-1 text-[0.85rem] font-medium transition-colors duration-300 group"
                    style={{ color: active ? "#FF6B00" : textMuted }}
                  >
                    {l.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-accent transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* ── Right side ── */}
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className={`hidden md:inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-300 bg-accent text-white hover:bg-[#e05f00] hover:shadow-[0_4px_24px_rgba(255,107,0,0.25)] ${
                  scrolled ? "text-xs px-5 py-2" : "text-sm px-6 py-2.5"
                }`}
              >
                Contact Us
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              {/* Hamburger */}
              <button
                className="md:hidden relative w-10 h-10 flex items-center justify-center"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                <div className="w-[22px] h-[14px] flex flex-col justify-between">
                  <span className={`block h-[1.5px] ${hamburgerColor} rounded-full transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[6.25px]" : ""}`} />
                  <span className={`block h-[1.5px] ${hamburgerColor} rounded-full transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
                  <span className={`block h-[1.5px] ${hamburgerColor} rounded-full transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[6.25px]" : ""}`} />
                </div>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden fixed inset-x-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ top: scrolled ? "74px" : "72px" }}
      >
        <div className="mx-4 mt-2 bg-[#0a1628]/95 backdrop-blur-2xl rounded-2xl border border-white/[0.07] shadow-[0_16px_48px_rgba(0,0,0,0.4)] p-5">
          <div className="space-y-1">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-accent bg-accent/10"
                      : "text-white/80 hover:text-white hover:bg-white/[0.05]"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />}
                  {l.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-accent text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[#e05f00] transition-colors"
              onClick={() => setOpen(false)}
            >
              Contact Us
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
