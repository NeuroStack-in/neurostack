import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",
  description:
    "NeuroStack Research — Algorithm design, conference papers, and journal publications. IEEE/ACM/LNCS compliant academic research with novel contributions.",
  alternates: { canonical: "https://neurostack.in/research" },
};

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
