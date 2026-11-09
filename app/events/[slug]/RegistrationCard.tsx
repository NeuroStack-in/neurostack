import type { ReactNode } from "react";

// Dark card that holds the registration form or its closed/fallback states.
// Matches the "Send Us a Message" card on the contact page.
export default function RegistrationCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl px-7 py-10 sm:px-10 sm:py-12"
      style={{
        background: "linear-gradient(145deg, #0A2647 0%, #0d2f54 100%)",
        boxShadow: "0 25px 60px rgba(10, 38, 71, 0.3)",
      }}
    >
      <div className="absolute inset-0 rounded-3xl border border-white/[0.08] pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FF6B00] opacity-[0.06] blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
