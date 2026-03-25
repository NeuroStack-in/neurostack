"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ── Reusable canvas wrapper ── */
function CanvasAnim({ draw }: { draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
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
    resize();

    function loop(time: number) {
      if (!canvas || !ctx) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, time * 0.001);
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, [draw]);

  return <canvas ref={ref} className="w-full h-full" />;
}

/* ── Agent: orbiting nodes ── */
function AgentAnim() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w / 2, cy = h / 2;
    const unit = Math.min(w, h);

    const rings = [unit * 0.22, unit * 0.33, unit * 0.44];
    rings.forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = i === 0 ? "rgba(255,107,0,0.4)" : i === 1 ? "rgba(74,144,217,0.35)" : "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    const speeds = [0.8, -0.5, 0.3];
    const colors = ["#FF8533", "#5BA4E6", "rgba(255,255,255,0.7)"];
    const sizes = [unit * 0.025, unit * 0.02, unit * 0.015];
    speeds.forEach((speed, i) => {
      const angle = t * speed + i * 2.1;
      const x = cx + Math.cos(angle) * rings[i];
      const y = cy + Math.sin(angle) * rings[i];
      const grd = ctx.createRadialGradient(x, y, 0, x, y, sizes[i] * 3);
      grd.addColorStop(0, colors[i] + (i < 2 ? "aa" : ""));
      grd.addColorStop(1, "transparent");
      ctx.beginPath(); ctx.arc(x, y, sizes[i] * 3, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, sizes[i], 0, Math.PI * 2); ctx.fillStyle = colors[i]; ctx.fill();
    });

    // Second dot on ring 2
    const a2 = t * -0.5 + Math.PI;
    ctx.beginPath(); ctx.arc(cx + Math.cos(a2) * rings[1], cy + Math.sin(a2) * rings[1], unit * 0.015, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,107,0,0.8)"; ctx.fill();

    // Center core
    const pulse = 0.9 + Math.sin(t * 2) * 0.1;
    ctx.beginPath(); ctx.arc(cx, cy, unit * 0.09 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,107,0,0.2)"; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, unit * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,107,0,0.4)"; ctx.strokeStyle = "rgba(255,107,0,0.6)"; ctx.lineWidth = 1; ctx.fill(); ctx.stroke();

    const arm = unit * 0.07;
    ctx.strokeStyle = "#FF6B00"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx, cy - arm); ctx.lineTo(cx, cy - arm * 0.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy + arm * 0.5); ctx.lineTo(cx, cy + arm); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - arm, cy); ctx.lineTo(cx - arm * 0.5, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + arm * 0.5, cy); ctx.lineTo(cx + arm, cy); ctx.stroke();
  }, []);
  return <CanvasAnim draw={draw} />;
}

/* ── LLM: streaming tokens ── */
function LLMAnim() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const mx = w * 0.12;                // left margin
    const maxLineW = w * 0.76;          // max line width
    const lineH = h * 0.045;            // line thickness
    const gap = h * 0.065;              // gap between lines
    const widths = [0.65, 0.85, 0.55, 0.78, 0.48, 0.92, 0.6];
    const startY = h * 0.12;

    widths.forEach((frac, i) => {
      const y = startY + i * (lineH + gap);
      const phase = (t * 0.8 + i * 0.5) % 4;
      let lw: number, alpha: number;
      if (phase < 1.5) { const p = Math.min(phase / 1.2, 1); lw = frac * maxLineW * p; alpha = 0.5 + p * 0.5; }
      else { lw = frac * maxLineW; alpha = 1.0 - (phase - 1.5) * 0.2; }
      if (lw < 1) return;
      const grad = ctx.createLinearGradient(mx, y, mx + lw, y);
      grad.addColorStop(0, `rgba(255,133,51,${alpha})`);
      grad.addColorStop(1, `rgba(255,133,51,${alpha * 0.25})`);
      ctx.beginPath(); ctx.roundRect(mx, y, lw, lineH * 0.6, 2); ctx.fillStyle = grad; ctx.fill();
    });

    // Cursor
    const cursorY = startY + widths.length * (lineH + gap) + h * 0.02;
    const cursorPhase = (t * 0.8 + widths.length * 0.5) % 4;
    const cursorX = mx + Math.min(cursorPhase / 1.2, 1) * maxLineW * 0.35;
    ctx.beginPath(); ctx.roundRect(mx, cursorY, cursorX - mx, lineH * 0.6, 2); ctx.fillStyle = "rgba(91,164,230,0.7)"; ctx.fill();
    if (Math.sin(t * 4) > 0) { ctx.fillStyle = "#FF6B00"; ctx.fillRect(cursorX + 3, cursorY - h * 0.025, 2, h * 0.06); }

    // Labels
    ctx.font = `${Math.max(9, w * 0.04)}px monospace`;
    const la = 0.3 + Math.sin(t * 1.2) * 0.1;
    ctx.fillStyle = `rgba(255,255,255,${la})`; ctx.fillText("token", w * 0.78, h * 0.12 + Math.sin(t * 0.7) * 4);
    ctx.fillStyle = `rgba(255,133,51,${la})`; ctx.fillText("embed", w * 0.1, h * 0.92 + Math.sin(t * 0.9) * 3);
    ctx.fillText("query", w * 0.72, h * 0.9 + Math.sin(t * 0.6 + 2) * 4);
  }, []);
  return <CanvasAnim draw={draw} />;
}

/* ── Vision: scan + detect ── */
function VisionAnim() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w / 2, cy = h / 2;
    const gs = Math.min(w, h) * 0.82;   // grid covers most of the canvas
    const gx = cx - gs / 2, gy = cy - gs / 2;
    const cells = 5, cw = gs / cells;

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 0.5;
    for (let i = 0; i <= cells; i++) {
      ctx.beginPath(); ctx.moveTo(gx + i * cw, gy); ctx.lineTo(gx + i * cw, gy + gs); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx, gy + i * cw); ctx.lineTo(gx + gs, gy + i * cw); ctx.stroke();
    }

    // Scan line
    const scanY = gy + (((t * 0.4) % 1) * gs);
    const sg = ctx.createLinearGradient(gx, scanY, gx + gs, scanY);
    sg.addColorStop(0, "transparent"); sg.addColorStop(0.3, "rgba(255,133,51,0.9)"); sg.addColorStop(0.7, "rgba(255,133,51,0.9)"); sg.addColorStop(1, "transparent");
    ctx.beginPath(); ctx.moveTo(gx, scanY); ctx.lineTo(gx + gs, scanY); ctx.strokeStyle = sg; ctx.lineWidth = 1.5; ctx.stroke();
    const tg = ctx.createLinearGradient(0, scanY - gs * 0.12, 0, scanY);
    tg.addColorStop(0, "transparent"); tg.addColorStop(1, "rgba(255,107,0,0.04)");
    ctx.fillStyle = tg; ctx.fillRect(gx, scanY - gs * 0.12, gs, gs * 0.12);

    // Detection box
    const pulse = 0.95 + Math.sin(t * 2.5) * 0.05;
    const bw = gs * 0.52 * pulse, bh = gs * 0.44 * pulse;
    const bx = cx - bw / 2, by = cy - bh / 2 - gs * 0.03;
    ctx.strokeStyle = "rgba(91,164,230,0.6)"; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh);

    // Corners
    const co = gs * 0.05;
    ctx.strokeStyle = "#FF6B00"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(bx, by + co); ctx.lineTo(bx, by); ctx.lineTo(bx + co, by); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx + bw - co, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + co); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx, by + bh - co); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + co, by + bh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx + bw - co, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - co); ctx.stroke();

    ctx.font = `bold ${Math.max(9, w * 0.04)}px monospace`; ctx.fillStyle = "#FF6B00"; ctx.fillText("detect", bx, by - gs * 0.03);
    const conf = 95 + Math.floor(Math.sin(t * 1.5) * 3);
    const dp = 0.5 + Math.sin(t * 3) * 0.5;
    ctx.beginPath(); ctx.arc(bx + bw - gs * 0.08, by + bh + gs * 0.07, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(74,210,128,${dp})`; ctx.fill();
    ctx.font = `${Math.max(8, w * 0.035)}px monospace`; ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillText(`${conf}%`, bx + bw - gs * 0.04, by + bh + gs * 0.08);
  }, []);
  return <CanvasAnim draw={draw} />;
}

/* ── Dev: code editor ── */
function DevAnim() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const pad = 0.06;
    const x = w * pad, y = h * pad;
    const edW = w * (1 - pad * 2), edH = h * (1 - pad * 2);

    // Editor bg
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath(); ctx.roundRect(x, y, edW, edH, 8); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1; ctx.stroke();

    // Title bar
    const tbH = edH * 0.1;
    ctx.fillStyle = "rgba(255,255,255,0.02)"; ctx.fillRect(x, y, edW, tbH);
    ctx.beginPath(); ctx.moveTo(x, y + tbH); ctx.lineTo(x + edW, y + tbH); ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.stroke();
    const dotR = Math.max(2.5, edW * 0.012);
    [["rgba(255,107,0,0.5)", 0], ["rgba(74,144,217,0.35)", dotR * 4], ["rgba(255,255,255,0.15)", dotR * 8]].forEach(([c, ox]) => {
      ctx.beginPath(); ctx.arc(x + dotR * 5 + (ox as number), y + tbH / 2, dotR, 0, Math.PI * 2); ctx.fillStyle = c as string; ctx.fill();
    });

    // Code lines
    const codeY = y + tbH + edH * 0.06;
    const lineGap = (edH - tbH - edH * 0.2) / 8;
    const lines = [
      { frac: 0.6, color: "rgba(255,133,51,0.8)" },
      { frac: 0.85, color: "rgba(91,164,230,0.65)" },
      { frac: 0.4, color: "rgba(255,255,255,0.25)" },
      { frac: 0.72, color: "rgba(255,133,51,0.6)" },
      { frac: 0.55, color: "rgba(91,164,230,0.55)" },
      { frac: 0.65, color: "rgba(255,255,255,0.2)" },
      { frac: 0.48, color: "rgba(255,133,51,0.5)" },
    ];
    const codeW = edW - edW * 0.12;
    lines.forEach((line, i) => {
      const ly = codeY + i * lineGap;
      const phase = ((t * 0.6 + i * 0.7) % 5);
      let prog: number;
      if (phase < 2) prog = phase / 2; else if (phase < 4) prog = 1; else prog = 1 - (phase - 4);
      const lw = line.frac * codeW * prog;
      if (lw > 1) { ctx.beginPath(); ctx.roundRect(x + edW * 0.06, ly, lw, Math.max(3, lineGap * 0.22), 1.5); ctx.fillStyle = line.color; ctx.fill(); }
    });

    // Cursor
    const cli = Math.floor((t * 0.6) % lines.length);
    const cp = ((t * 0.6 + cli * 0.7) % 5);
    if (cp < 2 && Math.sin(t * 5) > 0) {
      const curX = x + edW * 0.06 + lines[cli].frac * codeW * (cp / 2);
      ctx.fillStyle = "#FF6B00"; ctx.fillRect(curX + 2, codeY + cli * lineGap - lineGap * 0.3, 1.5, lineGap * 0.7);
    }

    // Status bar
    const sbY = y + edH - edH * 0.08;
    ctx.beginPath(); ctx.moveTo(x, sbY); ctx.lineTo(x + edW, sbY); ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.stroke();
    const gdp = 0.4 + Math.sin(t * 2) * 0.3;
    ctx.beginPath(); ctx.arc(x + edW * 0.06, sbY + edH * 0.04, 2.5, 0, Math.PI * 2); ctx.fillStyle = `rgba(74,210,128,${gdp})`; ctx.fill();
    ctx.font = `${Math.max(7, edW * 0.04)}px monospace`; ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.fillText("deployed", x + edW - edW * 0.3, sbY + edH * 0.05);
  }, []);
  return <CanvasAnim draw={draw} />;
}

/* ── API: hub + pulses ── */
function APIAnim() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w / 2, cy = h / 2;
    const unit = Math.min(w, h);
    const reach = unit * 0.38;

    const endpoints = [
      { angle: -Math.PI * 0.75, dist: reach, label: "v1" },
      { angle: -Math.PI * 0.25, dist: reach * 1.05, label: "v2" },
      { angle: Math.PI * 0.25, dist: reach, label: "ws" },
      { angle: Math.PI * 0.75, dist: reach * 1.05, label: "gql" },
    ];

    endpoints.forEach((ep, i) => {
      const ex = cx + Math.cos(ep.angle) * ep.dist;
      const ey = cy + Math.sin(ep.angle) * ep.dist;

      // Dashed line
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey);
      ctx.strokeStyle = "rgba(91,164,230,0.3)"; ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]); ctx.lineDashOffset = -t * 15; ctx.stroke(); ctx.setLineDash([]);

      // Traveling pulse
      const pt = ((t * 0.7 + i * 0.6) % 2) / 2;
      const px = cx + (ex - cx) * pt, py = cy + (ey - cy) * pt;
      const pa = pt < 0.8 ? 0.9 : (1 - pt) * 4.5;
      ctx.beginPath(); ctx.arc(px, py, unit * 0.018, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,107,0,${pa})`; ctx.fill();
      const grd = ctx.createRadialGradient(px, py, 0, px, py, unit * 0.05);
      grd.addColorStop(0, `rgba(255,107,0,${pa * 0.3})`); grd.addColorStop(1, "transparent");
      ctx.beginPath(); ctx.arc(px, py, unit * 0.05, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();

      // Endpoint node
      const nr = unit * 0.03;
      ctx.beginPath(); ctx.arc(ex, ey, nr, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(91,164,230,0.2)"; ctx.strokeStyle = "rgba(91,164,230,0.5)"; ctx.lineWidth = 1.5; ctx.fill(); ctx.stroke();
      ctx.font = `${Math.max(8, unit * 0.04)}px monospace`; ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillText(ep.label, ex - nr, ey + nr + unit * 0.05);
    });

    // Central hub
    const hr = unit * 0.07 + Math.sin(t * 2) * unit * 0.01;
    ctx.beginPath(); ctx.arc(cx, cy, hr, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,133,51,0.2)"; ctx.strokeStyle = "rgba(255,133,51,0.5)"; ctx.lineWidth = 1.5; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, unit * 0.03, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,133,51,0.8)"; ctx.fill();
    ctx.font = `bold ${Math.max(8, unit * 0.04)}px monospace`; ctx.fillStyle = "rgba(255,133,51,0.8)"; ctx.fillText("API", cx - unit * 0.04, cy + hr + unit * 0.06);
  }, []);
  return <CanvasAnim draw={draw} />;
}

/* ── Data ── */
const offers = [
  { title: "Agentic AI Systems", desc: "AI that reasons, plans, and acts autonomously. Build intelligent assistants that handle complex workflows end-to-end — from task decomposition to multi-step execution.", anim: <AgentAnim /> },
  { title: "LLM Solutions", desc: "Fine-tuned, secure large language models tailored to your domain. From contract analysis to medical summarization — production-grade language intelligence.", anim: <LLMAnim /> },
  { title: "Computer Vision", desc: "Real-time object detection, image classification, and visual understanding. We help machines see, interpret, and act on the visual world.", anim: <VisionAnim /> },
  { title: "Development", desc: "Build, scale, and deploy digital products with AI at the core. Full-stack engineering from prototype to production with modern frameworks.", anim: <DevAnim /> },
  { title: "API-as-a-Service", desc: "Plug in AI features with one line of code. Our inference APIs handle vision, speech, and language tasks with autoscaling and low latency.", anim: <APIAnim /> },
];

/* ── Section ── */
export default function OfferSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#0A2647] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,107,0,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14">
          <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold leading-[1.15]">
            <span className="block text-white">What</span>
            <span className="block"><span className="text-white">Neuro</span><span className="text-accent">Stack</span></span>
            <span className="block text-white/30">Offers</span>
          </h2>
        </div>

        {/* Rows */}
        <div>
          {offers.map((offer, i) => (
            <OfferRow key={offer.title} offer={offer} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-start">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 bg-accent text-white font-semibold px-8 py-3.5 rounded-full text-sm hover:bg-[#e05f00] transition-all duration-300 hover:shadow-[0_4px_24px_rgba(255,107,0,0.25)]"
          >
            Explore All Services
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function OfferRow({ offer, index }: { offer: typeof offers[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`border-t border-white/[0.06] py-8 sm:py-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Text */}
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">{offer.title}</h3>
        <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-lg">{offer.desc}</p>
      </div>

      {/* Animation — fixed uniform size */}
      <div className="flex justify-center md:justify-end">
        <div className="w-56 h-44 sm:w-64 sm:h-48">
          {offer.anim}
        </div>
      </div>
    </div>
  );
}
