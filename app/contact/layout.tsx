import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with NeuroStack. Reach out for AI consulting, custom development, demos, or partnerships. We'd love to hear from you.",
  alternates: { canonical: "https://neurostack.in/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
