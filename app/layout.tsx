import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const CursorGlow = dynamic(() => import("./components/CursorGlow"), {
  loading: () => null,
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://neurostack.in"),
  title: {
    default: "NeuroStack — Commoditizing AI for Every Business",
    template: "%s | NeuroStack",
  },
  description:
    "NeuroStack builds accessible, affordable, and actionable AI systems — from custom LLMs and computer vision APIs to agentic AI solutions. 100+ projects delivered across 10+ countries.",
  keywords: [
    "AI solutions", "artificial intelligence", "machine learning", "LLM", "large language models",
    "computer vision", "API inferencing", "agentic AI", "RAG systems", "generative AI",
    "AI consulting", "AI development", "NeuroStack", "AI for business", "posture estimation",
    "fine-tuned LLM", "AI R&D", "edge AI", "speech-to-text", "object detection",
  ],
  authors: [{ name: "NeuroStack", url: "https://neurostack.in" }],
  creator: "NeuroStack",
  publisher: "NeuroStack",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://neurostack.in",
    siteName: "NeuroStack",
    title: "NeuroStack — Commoditizing AI for Every Business",
    description:
      "Making intelligent systems accessible, affordable, and actionable — for everyone. Custom AI solutions, LLMs, computer vision, and agentic systems.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "NeuroStack Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroStack — Commoditizing AI",
    description:
      "Making intelligent systems accessible, affordable, and actionable — for everyone.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.ico",
    shortcut: "/logo.ico",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://neurostack.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${dmSans.variable} antialiased`}>
        <CursorGlow />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
