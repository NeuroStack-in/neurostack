"use client";

import { useEffect, useRef } from "react";

/*
  Neural Network Tree — a tree shape where the left side has organic leaves/branches
  and the right side transitions into circuit board traces with glowing nodes.
  Data pulses flow upward from roots through the trunk into branches.
*/

// Tree structure — all line segments [x1,y1, x2,y2] normalized 0-1
// Both sides use same organic diagonal neural network branch style

// Trunk
const TRUNK: [number, number, number, number][] = [
  [0.50, 0.90, 0.50, 0.82],
  [0.50, 0.82, 0.50, 0.72],
  [0.50, 0.72, 0.50, 0.62],
  [0.50, 0.62, 0.50, 0.52],
  [0.50, 0.52, 0.50, 0.44],
];

// Roots — symmetric organic
const ROOTS: [number, number, number, number][] = [
  [0.50, 0.90, 0.42, 0.95], [0.42, 0.95, 0.36, 0.97],
  [0.50, 0.90, 0.58, 0.95], [0.58, 0.95, 0.64, 0.97],
  [0.50, 0.90, 0.50, 0.97],
  [0.42, 0.95, 0.38, 0.99], [0.58, 0.95, 0.62, 0.99],
  [0.36, 0.97, 0.30, 0.99], [0.64, 0.97, 0.70, 0.99],
];

// ── LEFT BRANCHES (orange) — 7 main branches ──
const LEFT_BRANCHES: [number, number, number, number][] = [
  // L1 — lowest, wide sweep
  [0.50, 0.64, 0.44, 0.60], [0.44, 0.60, 0.36, 0.58],
  [0.36, 0.58, 0.28, 0.56], [0.28, 0.56, 0.20, 0.55],
  [0.36, 0.58, 0.32, 0.62], [0.28, 0.56, 0.24, 0.60],

  // L2
  [0.50, 0.58, 0.44, 0.52], [0.44, 0.52, 0.36, 0.48],
  [0.36, 0.48, 0.28, 0.46], [0.28, 0.46, 0.20, 0.44],
  [0.36, 0.48, 0.32, 0.52], [0.44, 0.52, 0.40, 0.56],

  // L3
  [0.50, 0.52, 0.44, 0.44], [0.44, 0.44, 0.36, 0.38],
  [0.36, 0.38, 0.28, 0.34], [0.28, 0.34, 0.20, 0.32],
  [0.36, 0.38, 0.32, 0.42], [0.28, 0.34, 0.24, 0.38],

  // L4
  [0.50, 0.48, 0.44, 0.38], [0.44, 0.38, 0.38, 0.30],
  [0.38, 0.30, 0.30, 0.24], [0.30, 0.24, 0.22, 0.20],
  [0.38, 0.30, 0.34, 0.34], [0.44, 0.38, 0.40, 0.42],

  // L5
  [0.50, 0.46, 0.46, 0.34], [0.46, 0.34, 0.40, 0.26],
  [0.40, 0.26, 0.34, 0.18], [0.34, 0.18, 0.28, 0.12],
  [0.40, 0.26, 0.36, 0.28], [0.46, 0.34, 0.42, 0.36],

  // L6
  [0.50, 0.44, 0.48, 0.32], [0.48, 0.32, 0.44, 0.22],
  [0.44, 0.22, 0.40, 0.14], [0.40, 0.14, 0.36, 0.08],
  [0.44, 0.22, 0.40, 0.24], [0.48, 0.32, 0.44, 0.34],

  // L7 — topmost
  [0.50, 0.44, 0.49, 0.28], [0.49, 0.28, 0.48, 0.18],
  [0.48, 0.18, 0.46, 0.10], [0.46, 0.10, 0.44, 0.04],
  [0.48, 0.18, 0.44, 0.16],
];

// ── RIGHT BRANCHES (blue) — 7 main branches, same organic style ──
const RIGHT_BRANCHES: [number, number, number, number][] = [
  // R1 — lowest
  [0.50, 0.64, 0.56, 0.60], [0.56, 0.60, 0.64, 0.58],
  [0.64, 0.58, 0.72, 0.56], [0.72, 0.56, 0.80, 0.55],
  [0.64, 0.58, 0.68, 0.62], [0.72, 0.56, 0.76, 0.60],

  // R2
  [0.50, 0.58, 0.56, 0.52], [0.56, 0.52, 0.64, 0.48],
  [0.64, 0.48, 0.72, 0.46], [0.72, 0.46, 0.80, 0.44],
  [0.64, 0.48, 0.68, 0.52], [0.56, 0.52, 0.60, 0.56],

  // R3
  [0.50, 0.52, 0.56, 0.44], [0.56, 0.44, 0.64, 0.38],
  [0.64, 0.38, 0.72, 0.34], [0.72, 0.34, 0.80, 0.32],
  [0.64, 0.38, 0.68, 0.42], [0.72, 0.34, 0.76, 0.38],

  // R4
  [0.50, 0.48, 0.56, 0.38], [0.56, 0.38, 0.62, 0.30],
  [0.62, 0.30, 0.70, 0.24], [0.70, 0.24, 0.78, 0.20],
  [0.62, 0.30, 0.66, 0.34], [0.56, 0.38, 0.60, 0.42],

  // R5
  [0.50, 0.46, 0.54, 0.34], [0.54, 0.34, 0.60, 0.26],
  [0.60, 0.26, 0.66, 0.18], [0.66, 0.18, 0.72, 0.12],
  [0.60, 0.26, 0.64, 0.28], [0.54, 0.34, 0.58, 0.36],

  // R6
  [0.50, 0.44, 0.52, 0.32], [0.52, 0.32, 0.56, 0.22],
  [0.56, 0.22, 0.60, 0.14], [0.60, 0.14, 0.64, 0.08],
  [0.56, 0.22, 0.60, 0.24], [0.52, 0.32, 0.56, 0.34],

  // R7 — topmost
  [0.50, 0.44, 0.51, 0.28], [0.51, 0.28, 0.52, 0.18],
  [0.52, 0.18, 0.54, 0.10], [0.54, 0.10, 0.56, 0.04],
  [0.52, 0.18, 0.56, 0.16],
];

// Nodes at tips and junctions
const LEFT_NODES: [number, number][] = [
  [0.20, 0.55], [0.24, 0.60], [0.20, 0.44], [0.24, 0.38],
  [0.20, 0.32], [0.22, 0.20], [0.28, 0.12], [0.36, 0.08],
  [0.44, 0.04], [0.32, 0.62], [0.32, 0.52], [0.32, 0.42],
  [0.34, 0.34], [0.36, 0.28], [0.40, 0.24], [0.40, 0.14],
  [0.44, 0.16], [0.44, 0.34], [0.40, 0.42], [0.40, 0.56],
  [0.28, 0.46], [0.28, 0.34],
];

const RIGHT_NODES: [number, number][] = [
  [0.80, 0.55], [0.76, 0.60], [0.80, 0.44], [0.76, 0.38],
  [0.80, 0.32], [0.78, 0.20], [0.72, 0.12], [0.64, 0.08],
  [0.56, 0.04], [0.68, 0.62], [0.68, 0.52], [0.68, 0.42],
  [0.66, 0.34], [0.64, 0.28], [0.60, 0.24], [0.60, 0.14],
  [0.56, 0.16], [0.56, 0.34], [0.60, 0.42], [0.60, 0.56],
  [0.72, 0.46], [0.72, 0.34],
];

const ROOT_NODES: [number, number][] = [
  [0.30, 0.99], [0.36, 0.97], [0.38, 0.99],
  [0.50, 0.97], [0.62, 0.99], [0.64, 0.97], [0.70, 0.99],
];

interface Pulse {
  segments: [number, number, number, number][];
  segIdx: number;
  progress: number;
  speed: number;
  color: string;
}

export default function NeuralTree() {
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

    // Build paths from roots up through trunk to branch tips
    // Each branch group is 6 segments (4 main + 2 sub), except L7/R7 which are 5
    const trunkUp = TRUNK.slice().reverse();
    const upPaths = [
      [...ROOTS.slice(0, 2), ...trunkUp, ...LEFT_BRANCHES.slice(0, 4)],
      [...ROOTS.slice(2, 4), ...trunkUp, ...LEFT_BRANCHES.slice(6, 10)],
      [...ROOTS.slice(4, 5), ...trunkUp, ...LEFT_BRANCHES.slice(12, 16)],
      [...ROOTS.slice(0, 1), ...trunkUp, ...LEFT_BRANCHES.slice(18, 22)],
      [...ROOTS.slice(2, 3), ...trunkUp, ...LEFT_BRANCHES.slice(24, 28)],
      [...ROOTS.slice(4, 5), ...trunkUp, ...LEFT_BRANCHES.slice(30, 34)],
      [...ROOTS.slice(0, 1), ...trunkUp, ...LEFT_BRANCHES.slice(36, 40)],
      [...ROOTS.slice(2, 4), ...trunkUp, ...RIGHT_BRANCHES.slice(0, 4)],
      [...ROOTS.slice(4, 5), ...trunkUp, ...RIGHT_BRANCHES.slice(6, 10)],
      [...ROOTS.slice(0, 1), ...trunkUp, ...RIGHT_BRANCHES.slice(12, 16)],
      [...ROOTS.slice(2, 3), ...trunkUp, ...RIGHT_BRANCHES.slice(18, 22)],
      [...ROOTS.slice(4, 5), ...trunkUp, ...RIGHT_BRANCHES.slice(24, 28)],
      [...ROOTS.slice(0, 1), ...trunkUp, ...RIGHT_BRANCHES.slice(30, 34)],
      [...ROOTS.slice(2, 3), ...trunkUp, ...RIGHT_BRANCHES.slice(36, 40)],
    ];

    function spawnPulse() {
      const path = upPaths[Math.floor(Math.random() * upPaths.length)];
      pulses.push({
        segments: path,
        segIdx: 0,
        progress: 0,
        speed: 0.02 + Math.random() * 0.015,
        color: Math.random() > 0.5 ? "#FF6B00" : "#5BA4E6",
      });
      if (pulses.length > 12) pulses.shift();
    }
    const pulseTimer = setInterval(spawnPulse, 600);

    function s(v: number, size: number) { return v * size; }

    function drawSegments(
      ctx: CanvasRenderingContext2D, segs: [number, number, number, number][],
      w: number, h: number, color: string, width: number
    ) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      segs.forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(s(x1, w), s(y1, h));
        ctx.lineTo(s(x2, w), s(y2, h));
        ctx.stroke();
      });
    }

    function drawNodes(
      ctx: CanvasRenderingContext2D, nodes: [number, number][],
      w: number, h: number, t: number, baseColor: string, glowColor: string
    ) {
      nodes.forEach(([nx, ny], i) => {
        const x = s(nx, w), y = s(ny, h);
        const pulse = 0.6 + Math.sin(t * 1.5 + i * 1.1) * 0.3;
        const r = 3 + Math.sin(t * 1.2 + i * 0.8) * 1;

        // Glow
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
        grd.addColorStop(0, glowColor + Math.round(pulse * 140).toString(16).padStart(2, "0"));
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(x, y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.fill();
      });
    }

    function draw(time: number) {
      if (!canvas || !ctx) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const t = time * 0.001;

      ctx.clearRect(0, 0, w, h);

      // ── Roots ──
      drawSegments(ctx, ROOTS, w, h, "rgba(91,164,230,0.5)", 2);

      // ── Trunk ── gradient from blue (bottom) to green-orange (top)
      TRUNK.forEach(([x1, y1, x2, y2], i) => {
        const frac = i / TRUNK.length;
        const r = Math.round(74 + frac * 181);   // 74→255
        const g2 = Math.round(144 - frac * 37);  // 144→107
        const b = Math.round(217 - frac * 217);  // 217→0
        ctx.strokeStyle = `rgba(${r},${g2},${b},0.8)`;
        ctx.lineWidth = 3.5 - frac * 1;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s(x1, w), s(y1, h));
        ctx.lineTo(s(x2, w), s(y2, h));
        ctx.stroke();
      });

      // ── Left branches (orange) ──
      drawSegments(ctx, LEFT_BRANCHES, w, h, "rgba(255,133,51,0.55)", 1.8);

      // ── Right branches (blue) ──
      drawSegments(ctx, RIGHT_BRANCHES, w, h, "rgba(91,164,230,0.55)", 1.8);

      // ── Nodes ──
      drawNodes(ctx, LEFT_NODES, w, h, t, "#FF8533", "#FF6B00");
      drawNodes(ctx, RIGHT_NODES, w, h, t, "#5BA4E6", "#4A90D9");
      drawNodes(ctx, ROOT_NODES, w, h, t, "#5BA4E6", "#4A90D9");

      // ── Trunk center node (main junction) ──
      const tcx = s(0.50, w), tcy = s(0.52, h);
      const tp = 0.6 + Math.sin(t * 2) * 0.3;
      const tgrd = ctx.createRadialGradient(tcx, tcy, 0, tcx, tcy, 22);
      tgrd.addColorStop(0, `rgba(255,107,0,${tp * 0.6})`);
      tgrd.addColorStop(1, "transparent");
      ctx.beginPath(); ctx.arc(tcx, tcy, 22, 0, Math.PI * 2); ctx.fillStyle = tgrd; ctx.fill();
      ctx.beginPath(); ctx.arc(tcx, tcy, 5, 0, Math.PI * 2); ctx.fillStyle = "#FF6B00"; ctx.fill();

      // ── Data pulses ──
      for (let pi = pulses.length - 1; pi >= 0; pi--) {
        const p = pulses[pi];
        if (p.segIdx >= p.segments.length) { pulses.splice(pi, 1); continue; }
        const seg = p.segments[p.segIdx];
        const px = s(seg[0] + (seg[2] - seg[0]) * p.progress, w);
        const py = s(seg[1] + (seg[3] - seg[1]) * p.progress, h);

        // Glow
        const pgrd = ctx.createRadialGradient(px, py, 0, px, py, 8);
        pgrd.addColorStop(0, p.color + "cc");
        pgrd.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fillStyle = pgrd; ctx.fill();

        // Dot
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();

        p.progress += p.speed;
        if (p.progress >= 1) { p.progress = 0; p.segIdx++; }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    animId = requestAnimationFrame(draw);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => { cancelAnimationFrame(animId); clearInterval(pulseTimer); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
