"use client";

import { useEffect, useRef } from "react";

/*
  Animated brain — side-view outline drawn with glowing strokes,
  internal neural pathways that pulse, and gentle breathing animation.
  No particles — just the brain shape itself, alive.
*/

// Side-view brain contour points (normalized 0–1)
const CONTOUR: [number, number][] = [
  // Top of head → frontal lobe
  [0.42, 0.10], [0.36, 0.09], [0.30, 0.10], [0.24, 0.13],
  [0.19, 0.17], [0.14, 0.22], [0.10, 0.28], [0.08, 0.35],
  // Forehead → down to temporal
  [0.07, 0.42], [0.08, 0.50], [0.10, 0.56], [0.14, 0.61],
  [0.19, 0.64], [0.25, 0.66], [0.31, 0.67],
  // Temporal floor
  [0.37, 0.68], [0.43, 0.70], [0.48, 0.72],
  // Brainstem
  [0.51, 0.75], [0.53, 0.80], [0.54, 0.85], [0.56, 0.88],
  [0.60, 0.89], [0.63, 0.87], [0.62, 0.82], [0.60, 0.76],
  // Cerebellum
  [0.62, 0.70], [0.66, 0.65], [0.71, 0.61], [0.76, 0.56],
  // Occipital
  [0.81, 0.50], [0.85, 0.43], [0.87, 0.36], [0.88, 0.28],
  [0.86, 0.21], [0.82, 0.16],
  // Parietal → back to start
  [0.77, 0.12], [0.71, 0.10], [0.65, 0.08], [0.58, 0.07],
  [0.52, 0.08], [0.47, 0.09],
];

// Internal folds / sulci paths (pairs of points for curves)
const FOLDS: [number, number][][] = [
  // Central sulcus
  [[0.40, 0.14], [0.36, 0.22], [0.33, 0.32], [0.35, 0.42], [0.38, 0.50]],
  // Lateral sulcus
  [[0.22, 0.48], [0.30, 0.45], [0.40, 0.44], [0.50, 0.48]],
  // Frontal folds
  [[0.15, 0.32], [0.20, 0.28], [0.28, 0.26]],
  [[0.14, 0.42], [0.22, 0.38], [0.30, 0.36]],
  // Parietal folds
  [[0.50, 0.14], [0.55, 0.20], [0.58, 0.30], [0.56, 0.40]],
  [[0.62, 0.15], [0.68, 0.22], [0.72, 0.32]],
  // Occipital folds
  [[0.74, 0.38], [0.78, 0.44], [0.76, 0.52]],
  // Temporal fold
  [[0.28, 0.55], [0.36, 0.56], [0.44, 0.58]],
  // Deep connections
  [[0.35, 0.35], [0.45, 0.32], [0.55, 0.34], [0.65, 0.30]],
  [[0.30, 0.48], [0.42, 0.52], [0.54, 0.50], [0.62, 0.54]],
];

// Key neural junction nodes (where folds meet)
const NODES: [number, number][] = [
  [0.36, 0.22], [0.33, 0.32], [0.35, 0.42], [0.38, 0.50],
  [0.22, 0.38], [0.30, 0.36], [0.20, 0.28],
  [0.55, 0.20], [0.58, 0.30], [0.56, 0.40],
  [0.68, 0.22], [0.72, 0.32], [0.78, 0.44],
  [0.45, 0.32], [0.50, 0.48], [0.42, 0.52],
  [0.54, 0.50], [0.30, 0.45], [0.40, 0.44],
  [0.36, 0.56], [0.62, 0.54], [0.76, 0.52],
  [0.50, 0.14], [0.15, 0.32], [0.14, 0.42],
];

function smoothPath(ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[], close = false) {
  if (pts.length < 2) return;
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2;
    ctx.quadraticCurveTo(p0.x, p0.y, mx, my);
  }
  const last = pts[pts.length - 1];
  if (close) {
    const first = pts[0];
    const mx = (last.x + first.x) / 2;
    const my = (last.y + first.y) / 2;
    ctx.quadraticCurveTo(last.x, last.y, mx, my);
    ctx.quadraticCurveTo(first.x, first.y, first.x, first.y);
  } else {
    ctx.lineTo(last.x, last.y);
  }
}

export default function BrainNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function toScreen(pt: [number, number], w: number, h: number, t: number, i: number) {
      const scale = Math.min(w, h) * 0.85;
      const ox = (w - scale) / 2;
      const oy = (h - scale) / 2;
      // Gentle breathing
      const breath = 1 + Math.sin(t * 0.8) * 0.008;
      const cx = w / 2, cy = h / 2;
      const x = ox + pt[0] * scale;
      const y = oy + pt[1] * scale;
      return {
        x: cx + (x - cx) * breath + Math.sin(t * 0.5 + i * 0.7) * 0.8,
        y: cy + (y - cy) * breath + Math.cos(t * 0.4 + i * 0.9) * 0.8,
      };
    }

    function draw(time: number) {
      if (!canvas || !ctx) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const t = time * 0.001;

      ctx.clearRect(0, 0, w, h);

      // ── Brain outline ──
      const contourPts = CONTOUR.map((p, i) => toScreen(p, w, h, t, i));

      // Outer glow
      ctx.beginPath();
      smoothPath(ctx, contourPts, true);
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,107,0,0.08)";
      ctx.lineWidth = 12;
      ctx.stroke();

      // Mid glow
      ctx.beginPath();
      smoothPath(ctx, contourPts, true);
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,107,0,0.15)";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Main outline
      ctx.beginPath();
      smoothPath(ctx, contourPts, true);
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,133,51,0.6)";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // ── Internal folds with pulsing glow ──
      FOLDS.forEach((fold, fi) => {
        const pts = fold.map((p, i) => toScreen(p, w, h, t, fi * 10 + i));
        const pulsePhase = (t * 0.6 + fi * 0.8) % (Math.PI * 2);
        const pulse = 0.15 + Math.sin(pulsePhase) * 0.15;
        const glowPulse = 0.05 + Math.sin(pulsePhase) * 0.08;

        // Glow layer
        ctx.beginPath();
        smoothPath(ctx, pts, false);
        ctx.strokeStyle = `rgba(91,164,230,${glowPulse})`;
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.stroke();

        // Main stroke
        ctx.beginPath();
        smoothPath(ctx, pts, false);
        ctx.strokeStyle = `rgba(91,164,230,${pulse})`;
        ctx.lineWidth = 1.2;
        ctx.lineCap = "round";
        ctx.stroke();
      });

      // ── Neural junction nodes ──
      NODES.forEach((node, i) => {
        const p = toScreen(node, w, h, t, i + 100);
        const nodePulse = (t * 1.2 + i * 0.9) % (Math.PI * 2);
        const alpha = 0.3 + Math.sin(nodePulse) * 0.25;
        const r = 2 + Math.sin(nodePulse) * 0.8;

        // Glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
        grd.addColorStop(0, `rgba(255,107,0,${alpha * 0.4})`);
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,133,51,${alpha + 0.2})`;
        ctx.fill();
      });

      // ── Synapse flashes — brief bright flashes at random nodes ──
      const flashIdx = Math.floor((t * 3) % NODES.length);
      const flashAlpha = Math.max(0, Math.sin(t * 8) * 0.6);
      if (flashAlpha > 0.1) {
        const fp = toScreen(NODES[flashIdx], w, h, t, flashIdx + 100);
        const fgrd = ctx.createRadialGradient(fp.x, fp.y, 0, fp.x, fp.y, 18);
        fgrd.addColorStop(0, `rgba(255,107,0,${flashAlpha})`);
        fgrd.addColorStop(0.3, `rgba(255,133,51,${flashAlpha * 0.3})`);
        fgrd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(fp.x, fp.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = fgrd;
        ctx.fill();
      }

      // Second flash (blue)
      const flashIdx2 = Math.floor((t * 2.3 + 7) % NODES.length);
      const flashAlpha2 = Math.max(0, Math.sin(t * 6 + 2) * 0.5);
      if (flashAlpha2 > 0.1) {
        const fp2 = toScreen(NODES[flashIdx2], w, h, t, flashIdx2 + 100);
        const fgrd2 = ctx.createRadialGradient(fp2.x, fp2.y, 0, fp2.x, fp2.y, 15);
        fgrd2.addColorStop(0, `rgba(91,164,230,${flashAlpha2})`);
        fgrd2.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(fp2.x, fp2.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = fgrd2;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    animId = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
