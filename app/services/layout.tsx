import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore NeuroStack's AI services — Agentic AI Systems, RAG Systems, Generative AI, Computer Vision, AI R&D, and Web & Mobile Development. Production-grade solutions tailored to your needs.",
  alternates: { canonical: "https://neurostack.in/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
