"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// The /studio editor is full-screen, so the site's navbar, footer and cursor glow stay out of it.
export default function HideOnStudio({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;
  return children;
}
