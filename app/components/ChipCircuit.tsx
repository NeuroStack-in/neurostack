"use client";

import { useEffect, useRef } from "react";

/*
  Neural chip circuit board animation.
  Central chip with radiating PCB traces, junction nodes, and data pulses.
*/

interface Trace {
  points: [number, number][];  // normalized 0-1
  width: number;
}

interface Junction {
  pos: [number, number];
  radius: number;
  filled: boolean;
}

// Central chip position & size (normalized)
const CHIP = { x: 0.5, y: 0.48, w: 0.14, h: 0.14 };
const CHIP2 = { x: 0.32, y: 0.58, w: 0.10, h: 0.10 };

// PCB traces — all use horizontal/vertical segments with explicit elbow waypoints
const TRACES: Trace[] = [
  // From main chip — right side (horizontal)
  { points: [[0.57, 0.42], [0.92, 0.42]], width: 1.5 },
  { points: [[0.57, 0.46], [0.68, 0.46], [0.68, 0.40], [0.88, 0.40]], width: 1 },
  { points: [[0.57, 0.50], [0.95, 0.50]], width: 1.5 },
  { points: [[0.57, 0.54], [0.67, 0.54], [0.67, 0.58], [0.90, 0.58]], width: 1 },
  { points: [[0.57, 0.48], [0.64, 0.48], [0.64, 0.45], [0.86, 0.45]], width: 0.8 },
  // From main chip — left side (horizontal)
  { points: [[0.43, 0.44], [0.32, 0.44], [0.32, 0.38], [0.12, 0.38]], width: 1 },
  { points: [[0.43, 0.48], [0.28, 0.48]], width: 1.5 },
  { points: [[0.43, 0.52], [0.37, 0.52]], width: 1 },
  // From main chip — top (vertical)
  { points: [[0.48, 0.41], [0.48, 0.26], [0.42, 0.26], [0.42, 0.20], [0.36, 0.20], [0.36, 0.14]], width: 1 },
  { points: [[0.52, 0.41], [0.52, 0.08]], width: 1.5 },
  { points: [[0.55, 0.41], [0.55, 0.28], [0.66, 0.28], [0.66, 0.22], [0.72, 0.22], [0.72, 0.16]], width: 1 },
  { points: [[0.46, 0.41], [0.46, 0.30], [0.40, 0.30], [0.40, 0.24], [0.32, 0.24], [0.32, 0.20]], width: 0.8 },
  // From main chip — bottom (vertical)
  { points: [[0.48, 0.55], [0.48, 0.68], [0.42, 0.68], [0.42, 0.74], [0.36, 0.74], [0.36, 0.82]], width: 1 },
  { points: [[0.52, 0.55], [0.52, 0.92]], width: 1.5 },
  { points: [[0.55, 0.55], [0.55, 0.62], [0.62, 0.62], [0.62, 0.74], [0.78, 0.74], [0.78, 0.80]], width: 1 },
  // From chip2 — left (horizontal)
  { points: [[0.27, 0.56], [0.14, 0.56], [0.14, 0.52], [0.08, 0.52]], width: 1 },
  { points: [[0.27, 0.60], [0.04, 0.60]], width: 1 },
  { points: [[0.27, 0.64], [0.22, 0.64], [0.22, 0.70], [0.16, 0.70], [0.16, 0.76], [0.10, 0.76]], width: 1 },
  // From chip2 — bottom (vertical)
  { points: [[0.34, 0.63], [0.34, 0.70], [0.30, 0.70], [0.30, 0.78], [0.26, 0.78], [0.26, 0.86]], width: 1 },
  // Interconnect chip1 ↔ chip2
  { points: [[0.43, 0.50], [0.38, 0.50], [0.38, 0.56], [0.37, 0.56]], width: 2 },
  // Extra horizontal/vertical traces
  { points: [[0.56, 0.55], [0.56, 0.60], [0.66, 0.60], [0.66, 0.66], [0.84, 0.66]], width: 0.8 },
];

// Junction nodes (at trace endpoints and intersections)
const JUNCTIONS: Junction[] = [
  // Right endpoints
  { pos: [0.92, 0.42], radius: 3, filled: false },
  { pos: [0.88, 0.40], radius: 2.5, filled: true },
  { pos: [0.95, 0.50], radius: 3.5, filled: false },
  { pos: [0.90, 0.58], radius: 3, filled: true },
  { pos: [0.86, 0.45], radius: 2, filled: false },
  // Left endpoints
  { pos: [0.12, 0.38], radius: 3, filled: false },
  { pos: [0.08, 0.52], radius: 2.5, filled: true },
  { pos: [0.04, 0.60], radius: 3, filled: false },
  { pos: [0.10, 0.76], radius: 2.5, filled: true },
  // Top endpoints
  { pos: [0.36, 0.14], radius: 3, filled: false },
  { pos: [0.52, 0.08], radius: 3.5, filled: true },
  { pos: [0.72, 0.16], radius: 3, filled: false },
  { pos: [0.32, 0.20], radius: 2, filled: true },
  // Bottom endpoints
  { pos: [0.36, 0.82], radius: 2.5, filled: false },
  { pos: [0.52, 0.92], radius: 3, filled: true },
  { pos: [0.78, 0.80], radius: 3, filled: false },
  { pos: [0.26, 0.86], radius: 2.5, filled: true },
  { pos: [0.84, 0.66], radius: 2, filled: false },
  // Mid junctions
  { pos: [0.65, 0.42], radius: 2, filled: true },
  { pos: [0.70, 0.50], radius: 2.5, filled: false },
  { pos: [0.28, 0.48], radius: 2, filled: true },
  { pos: [0.48, 0.26], radius: 2, filled: false },
  { pos: [0.60, 0.28], radius: 2, filled: true },
  { pos: [0.44, 0.68], radius: 2, filled: false },
  { pos: [0.62, 0.68], radius: 2, filled: true },
];

interface Pulse {
  traceIdx: number;
  progress: number;
  speed: number;
  forward: boolean;
}

export default function ChipCircuit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;
    const pulses: Pulse[] = [];

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Spawn pulses periodically
    function spawnPulse() {
      const idx = Math.floor(Math.random() * TRACES.length);
      pulses.push({
        traceIdx: idx,
        progress: 0,
        speed: 0.005 + Math.random() * 0.008,
        forward: Math.random() > 0.3,
      });
      if (pulses.length > 25) pulses.shift();
    }
    const pulseTimer = setInterval(spawnPulse, 250);

    function toScreen(pt: [number, number], w: number, h: number): [number, number] {
      return [pt[0] * w, pt[1] * h];
    }

    function drawChip(ctx: CanvasRenderingContext2D, chip: typeof CHIP, w: number, h: number, t: number) {
      const cx = chip.x * w, cy = chip.y * h;
      const cw = chip.w * w, ch = chip.h * h;
      const x = cx - cw / 2, y = cy - ch / 2;

      // Chip body
      ctx.fillStyle = "rgba(4,13,30,0.8)";
      ctx.strokeStyle = "rgba(255,107,0,0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y, cw, ch, 4);
      ctx.fill();
      ctx.stroke();

      // Inner die
      const pad = cw * 0.2;
      const pulse = 0.3 + Math.sin(t * 2) * 0.1;
      ctx.fillStyle = `rgba(255,107,0,${pulse * 0.15})`;
      ctx.strokeStyle = `rgba(255,107,0,${pulse})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x + pad, y + pad, cw - pad * 2, ch - pad * 2, 2);
      ctx.fill();
      ctx.stroke();

      // Pin stubs along edges
      const pins = 5;
      ctx.strokeStyle = "rgba(255,107,0,0.3)";
      ctx.lineWidth = 1.2;
      const pinLen = cw * 0.15;
      for (let i = 0; i < pins; i++) {
        const frac = (i + 0.5) / pins;
        // Top
        const tx = x + frac * cw;
        ctx.beginPath(); ctx.moveTo(tx, y); ctx.lineTo(tx, y - pinLen); ctx.stroke();
        // Bottom
        ctx.beginPath(); ctx.moveTo(tx, y + ch); ctx.lineTo(tx, y + ch + pinLen); ctx.stroke();
        // Left
        const ly = y + frac * ch;
        ctx.beginPath(); ctx.moveTo(x, ly); ctx.lineTo(x - pinLen, ly); ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(x + cw, ly); ctx.lineTo(x + cw + pinLen, ly); ctx.stroke();
      }
    }

    function lerp(a: [number, number], b: [number, number], t: number): [number, number] {
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }

    function getPointOnTrace(trace: Trace, progress: number, w: number, h: number): [number, number] {
      const pts = trace.points;
      const totalSegs = pts.length - 1;
      const segFloat = progress * totalSegs;
      const segIdx = Math.min(Math.floor(segFloat), totalSegs - 1);
      const segT = segFloat - segIdx;
      const a = toScreen(pts[segIdx], w, h);
      const b = toScreen(pts[segIdx + 1], w, h);
      return lerp(a, b, segT);
    }

    function draw(time: number) {
      if (!canvas || !ctx) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const t = time * 0.001;

      ctx.clearRect(0, 0, w, h);

      // Draw traces — straight line segments only
      TRACES.forEach((trace) => {
        ctx.beginPath();
        const pts = trace.points.map(p => toScreen(p, w, h));
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i][0], pts[i][1]);
        }
        ctx.strokeStyle = "rgba(74,144,217,0.2)";
        ctx.lineWidth = trace.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      });

      // Draw junctions
      JUNCTIONS.forEach((j) => {
        const [jx, jy] = toScreen(j.pos, w, h);
        if (j.filled) {
          ctx.beginPath();
          ctx.arc(jx, jy, j.radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(74,144,217,0.4)";
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(jx, jy, j.radius, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(74,144,217,0.3)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // Draw chips
      drawChip(ctx, CHIP, w, h, t);
      drawChip(ctx, CHIP2, w, h, t);

      // Draw pulses traveling along traces
      pulses.forEach((p) => {
        const trace = TRACES[p.traceIdx];
        if (!trace) return;
        const prog = p.forward ? p.progress : 1 - p.progress;
        const pos = getPointOnTrace(trace, prog, w, h);

        // Trail
        const trailProg = p.forward
          ? Math.max(0, prog - 0.15)
          : Math.min(1, prog + 0.15);
        const trailPos = getPointOnTrace(trace, trailProg, w, h);

        const grad = ctx.createLinearGradient(trailPos[0], trailPos[1], pos[0], pos[1]);
        grad.addColorStop(0, "rgba(255,107,0,0)");
        grad.addColorStop(1, "rgba(255,107,0,0.7)");
        ctx.beginPath();
        ctx.moveTo(trailPos[0], trailPos[1]);
        ctx.lineTo(pos[0], pos[1]);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();

        // Glow head
        const grd = ctx.createRadialGradient(pos[0], pos[1], 0, pos[0], pos[1], 8);
        grd.addColorStop(0, "rgba(255,107,0,0.5)");
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 8, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#FF6B00";
        ctx.fill();

        p.progress += p.speed;
      });

      // Remove finished pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        if (pulses[i].progress > 1) pulses.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    animId = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(pulseTimer);
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
