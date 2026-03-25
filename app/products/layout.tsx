import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Discover NeuroStack's AI-powered products — API Inferencing for vision, speech & language, Fine-Tuned LLM Solutions, and Posture Estimation & Tracking. Built to scale.",
  alternates: { canonical: "https://neurostack.in/products" },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
