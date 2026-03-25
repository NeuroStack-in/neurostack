"use client";

import { useEffect, useState } from "react";

const phrases = [
  { main: "Commoditizing ", accent: "AI" },
  { main: "Democratizing ", accent: "AI" },
  { main: "Scaling ", accent: "Intelligence" },
  { main: "Commoditizing ", accent: "AI" },
];

export default function TypingHero() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrase = phrases[phraseIdx];
  const fullText = currentPhrase.main + currentPhrase.accent;
  const isLast = phraseIdx === phrases.length - 1;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayed.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayed(fullText.slice(0, displayed.length + 1));
        }, 65);
      } else if (!isLast) {
        timeout = setTimeout(() => setIsDeleting(true), 2200);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 32);
      } else {
        setIsDeleting(false);
        setPhraseIdx((i) => i + 1);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, fullText, isLast]);

  const mainLen = currentPhrase.main.length;
  const shownMain = displayed.slice(0, Math.min(displayed.length, mainLen));
  const shownAccent =
    displayed.length > mainLen ? displayed.slice(mainLen) : "";

  return (
    <h1
      className="font-bold text-white leading-tight mb-6 whitespace-nowrap"
      style={{ fontSize: "clamp(2rem, 7.5vw, 5.5rem)" }}
    >
      {shownMain && <span>{shownMain}</span>}
      {shownAccent && <span className="gradient-text">{shownAccent}</span>}
      <span className="typewriter-cursor" />
    </h1>
  );
}
