"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  // Show after scrolling 300px
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-5 z-50 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Link
        href="/contact"
        className="relative flex items-center gap-2.5 text-white font-semibold px-5 py-3.5 rounded-full text-sm whitespace-nowrap group"
        style={{
          background: "linear-gradient(135deg, #FF6B00, #FF8533)",
          boxShadow: "0 8px 32px rgba(255,107,0,0.40), 0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* Pulsing rings */}
        <span className="absolute inset-0 rounded-full border-2 border-[#FF6B00] animate-ping opacity-25" />
        <span
          className="absolute inset-0 rounded-full border border-[#FF8533] opacity-20 animate-ping"
          style={{ animationDelay: "0.6s", animationDuration: "1.8s" }}
        />

        {/* Phone icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 flex-shrink-0 group-hover:rotate-12 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"
          />
        </svg>
        Book a Call
      </Link>
    </div>
  );
}
