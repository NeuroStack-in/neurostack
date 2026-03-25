"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  baseVx: number;
  baseVy: number;
}

interface Pulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  color: string;
}

const SCHEMES = {
  orange: {
    nodes: ["#FF6B00", "#FF8533", "#4A90D9", "#5BA4E6", "#FFB366"],
    line: "255,107,0",
  },
  blue: {
    nodes: ["#4A90D9", "#5BA4E6", "#3A78C4", "#7AB8F5", "#2980B9"],
    line: "74,144,217",
  },
};

interface Props {
  colorScheme?: "orange" | "blue";
}

export default function NeuralBackground({ colorScheme = "orange" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const schemeRef = useRef(SCHEMES[colorScheme]);

  useEffect(() => {
    const scheme = schemeRef.current;
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    const canvas = canvasEl;
    const ctx = context;

    let animId: number;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    const NODE_COUNT = 60;
    const MAX_DIST = 170;
    const MOUSE_RADIUS = 150;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function init() {
      resize();
      nodes = Array.from({ length: NODE_COUNT }, () => {
        const vx = (Math.random() - 0.5) * 0.45;
        const vy = (Math.random() - 0.5) * 0.45;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          radius: Math.random() * 2.5 + 1.5,
          color: scheme.nodes[Math.floor(Math.random() * scheme.nodes.length)],
        };
      });
    }

    // Spawn a random pulse along an existing connection
    function spawnPulse() {
      const fromIdx = Math.floor(Math.random() * nodes.length);
      const n = nodes[fromIdx];
      // Find nearby nodes to pulse toward
      const neighbors: number[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === fromIdx) continue;
        const dx = n.x - nodes[j].x;
        const dy = n.y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < MAX_DIST) neighbors.push(j);
      }
      if (neighbors.length === 0) return;
      const toIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
      pulses.push({
        fromIdx,
        toIdx,
        progress: 0,
        speed: 0.012 + Math.random() * 0.01,
        color: nodes[fromIdx].color,
      });
    }

    // Pulse spawner interval
    const pulseInterval = setInterval(spawnPulse, 500);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update nodes with mouse repulsion
      nodes.forEach((node) => {
        const dx = node.x - mx;
        const dy = node.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.6;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }
        // Gradually return to base velocity
        node.vx += (node.baseVx - node.vx) * 0.03;
        node.vy += (node.baseVy - node.vy) * 0.03;
        // Speed clamp
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 2.5) { node.vx = (node.vx / speed) * 2.5; node.vy = (node.vy / speed) * 2.5; }

        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) { node.vx *= -1; node.baseVx *= -1; }
        if (node.y < 0 || node.y > canvas.height) { node.vy *= -1; node.baseVy *= -1; }
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const base = (1 - dist / MAX_DIST) * 0.35;
            // Brighten if mouse is near the midpoint
            const midX = (nodes[i].x + nodes[j].x) / 2;
            const midY = (nodes[i].y + nodes[j].y) / 2;
            const md = Math.sqrt((midX - mx) ** 2 + (midY - my) ** 2);
            const boost = md < 120 ? (1 - md / 120) * 0.3 : 0;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${scheme.line},${base + boost})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw pulses
      pulses = pulses.filter((p) => p.progress < 1);
      pulses.forEach((p) => {
        const from = nodes[p.fromIdx];
        const to = nodes[p.toIdx];
        const px = from.x + (to.x - from.x) * p.progress;
        const py = from.y + (to.y - from.y) * p.progress;

        // Trail
        const trailLen = 0.12;
        const t0 = Math.max(0, p.progress - trailLen);
        const tx = from.x + (to.x - from.x) * t0;
        const ty = from.y + (to.y - from.y) * t0;
        const grad = ctx.createLinearGradient(tx, ty, px, py);
        grad.addColorStop(0, p.color + "00");
        grad.addColorStop(1, p.color + "cc");
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        p.progress += p.speed;
      });

      // Draw nodes
      nodes.forEach((node) => {
        const mdx = node.x - mx;
        const mdy = node.y - my;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        const glowing = md < MOUSE_RADIUS;

        // Outer glow ring (always visible, brighter near mouse)
        const glowRadius = glowing ? 16 : 10;
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
        glow.addColorStop(0, node.color + (glowing ? "66" : "33"));
        glow.addColorStop(1, node.color + "00");
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = glowing ? node.color + "ff" : node.color + "cc";
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; };
    canvas.parentElement?.addEventListener("mousemove", handleMouse);
    canvas.parentElement?.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(pulseInterval);
      ro.disconnect();
      canvas.parentElement?.removeEventListener("mousemove", handleMouse);
      canvas.parentElement?.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}
