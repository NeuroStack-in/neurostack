import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";

interface CTASectionProps {
  buttonText?: string;
  buttonHref?: string;
  heading?: string;
  description?: string;
}

/* Colors matching NeuroStack brand */
const O = "rgba(255,107,0,"; // orange
const B = "rgba(74,144,217,"; // blue
const N = "rgba(10,38,71,"; // navy (subtle traces on white bg)

export default function CTASection({
  buttonText = "Talk to Our Team",
  buttonHref = "/contact",
  heading = "Ready to see what AI can do for You?",
  description = "Let\u2019s talk. Whether you\u2019re just exploring or ready to scale, we\u2019re here to build with you.",
}: CTASectionProps) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.035) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="blob-1 absolute -top-10 -right-10 w-80 h-80 rounded-full bg-accent opacity-[0.05] blur-3xl pointer-events-none" />
      <div className="blob-2 absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-primary opacity-[0.03] blur-3xl pointer-events-none" />

      {/* ── Dense PCB traces — left & right clusters ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg className="absolute w-full h-full" viewBox="0 0 1400 400" fill="none" preserveAspectRatio="xMidYMid slice">

          {/* ════════ LEFT CLUSTER ════════ */}
          {/* Layer 1 — dark traces (background depth) */}
          <path d="M0 60 L80 60 L110 90 L200 90"          stroke={`${N}0.12)`} strokeWidth="1.5" />
          <path d="M0 90 L60 90 L90 120 L180 120"          stroke={`${N}0.10)`} strokeWidth="1.5" />
          <path d="M0 130 L100 130 L130 100 L220 100"      stroke={`${N}0.08)`} strokeWidth="1.5" />
          <path d="M0 160 L120 160 L150 130 L260 130"      stroke={`${N}0.12)`} strokeWidth="1.5" />
          <path d="M0 200 L90 200 L120 230 L240 230"       stroke={`${N}0.10)`} strokeWidth="1.5" />
          <path d="M0 240 L70 240 L100 210 L200 210"       stroke={`${N}0.08)`} strokeWidth="1.5" />
          <path d="M0 270 L110 270 L140 300 L280 300"      stroke={`${N}0.12)`} strokeWidth="1.5" />
          <path d="M0 310 L80 310 L110 280 L230 280"       stroke={`${N}0.10)`} strokeWidth="1.5" />
          <path d="M0 340 L130 340 L160 310 L300 310"      stroke={`${N}0.08)`} strokeWidth="1.5" />
          <path d="M0 370 L60 370 L90 340 L190 340"        stroke={`${N}0.10)`} strokeWidth="1.5" />

          {/* Layer 2 — orange accent traces */}
          <path d="M0 80 L120 80 L150 50 L300 50"          stroke={`${O}0.35)`} strokeWidth="2.5" />
          <path d="M0 150 L140 150 L170 180 L340 180"      stroke={`${O}0.30)`} strokeWidth="2.5" />
          <path d="M0 220 L100 220 L130 250 L310 250"      stroke={`${O}0.35)`} strokeWidth="2.5" />
          <path d="M0 300 L90 300 L120 330 L280 330"       stroke={`${O}0.25)`} strokeWidth="2.5" />

          {/* Layer 3 — blue accent traces */}
          <path d="M0 110 L80 110 L110 140 L250 140"       stroke={`${B}0.30)`} strokeWidth="2.5" />
          <path d="M0 180 L110 180 L140 150 L290 150"      stroke={`${B}0.25)`} strokeWidth="2.5" />
          <path d="M0 260 L130 260 L160 290 L320 290"      stroke={`${B}0.22)`} strokeWidth="2.5" />
          <path d="M0 350 L100 350 L130 320 L270 320"      stroke={`${B}0.25)`} strokeWidth="2.5" />

          {/* Left endpoint nodes */}
          {[
            [200,90,"o"],[180,120,"b"],[220,100,"o"],[260,130,"b"],[240,230,"o"],
            [200,210,"b"],[280,300,"o"],[230,280,"b"],[300,310,"o"],[190,340,"b"],
            [300,50,"o"],[340,180,"o"],[310,250,"o"],[280,330,"o"],
            [250,140,"b"],[290,150,"b"],[320,290,"b"],[270,320,"b"],
          ].map(([x, y, c], i) => (
            <circle key={`ln${i}`} cx={x as number} cy={y as number} r={c === "o" ? 2.5 : 2}
              fill={c === "o" ? `${O}0.35)` : `${B}0.35)`} />
          ))}

          {/* ════════ RIGHT CLUSTER ════════ */}
          {/* Layer 1 — dark traces */}
          <path d="M1400 50 L1300 50 L1270 80 L1180 80"    stroke={`${N}0.12)`} strokeWidth="1.5" />
          <path d="M1400 90 L1320 90 L1290 120 L1200 120"  stroke={`${N}0.10)`} strokeWidth="1.5" />
          <path d="M1400 120 L1280 120 L1250 90 L1160 90"  stroke={`${N}0.08)`} strokeWidth="1.5" />
          <path d="M1400 170 L1260 170 L1230 200 L1130 200" stroke={`${N}0.12)`} strokeWidth="1.5" />
          <path d="M1400 210 L1310 210 L1280 180 L1170 180" stroke={`${N}0.10)`} strokeWidth="1.5" />
          <path d="M1400 250 L1290 250 L1260 280 L1140 280" stroke={`${N}0.08)`} strokeWidth="1.5" />
          <path d="M1400 280 L1330 280 L1300 250 L1190 250" stroke={`${N}0.12)`} strokeWidth="1.5" />
          <path d="M1400 320 L1270 320 L1240 350 L1120 350" stroke={`${N}0.10)`} strokeWidth="1.5" />
          <path d="M1400 350 L1310 350 L1280 320 L1160 320" stroke={`${N}0.08)`} strokeWidth="1.5" />
          <path d="M1400 380 L1290 380 L1260 350 L1150 350" stroke={`${N}0.10)`} strokeWidth="1.5" />

          {/* Layer 2 — orange accent traces */}
          <path d="M1400 70 L1260 70 L1230 100 L1080 100"  stroke={`${O}0.35)`} strokeWidth="2.5" />
          <path d="M1400 150 L1280 150 L1250 120 L1100 120" stroke={`${O}0.30)`} strokeWidth="2.5" />
          <path d="M1400 240 L1300 240 L1270 270 L1100 270" stroke={`${O}0.35)`} strokeWidth="2.5" />
          <path d="M1400 340 L1280 340 L1250 310 L1090 310" stroke={`${O}0.25)`} strokeWidth="2.5" />

          {/* Layer 3 — blue accent traces */}
          <path d="M1400 110 L1300 110 L1270 140 L1120 140" stroke={`${B}0.30)`} strokeWidth="2.5" />
          <path d="M1400 190 L1270 190 L1240 160 L1100 160" stroke={`${B}0.25)`} strokeWidth="2.5" />
          <path d="M1400 300 L1290 300 L1260 330 L1110 330" stroke={`${B}0.22)`} strokeWidth="2.5" />
          <path d="M1400 370 L1270 370 L1240 340 L1110 340" stroke={`${B}0.25)`} strokeWidth="2.5" />

          {/* Right endpoint nodes */}
          {[
            [1180,80,"o"],[1200,120,"b"],[1160,90,"o"],[1130,200,"b"],[1170,180,"o"],
            [1140,280,"b"],[1190,250,"o"],[1120,350,"b"],[1160,320,"o"],[1150,350,"b"],
            [1080,100,"o"],[1100,120,"o"],[1100,270,"o"],[1090,310,"o"],
            [1120,140,"b"],[1100,160,"b"],[1110,330,"b"],[1110,340,"b"],
          ].map(([x, y, c], i) => (
            <circle key={`rn${i}`} cx={x as number} cy={y as number} r={c === "o" ? 2.5 : 2}
              fill={c === "o" ? `${O}0.35)` : `${B}0.35)`} />
          ))}

          {/* Glow filter for pulses */}
          <defs>
            <filter id="glowO" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glowB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ════════ ANIMATED PULSES ════════ */}
          {/* Left orange pulse 1 */}
          <circle r="3" fill="#FF6B00" opacity="0.9" filter="url(#glowO)">
            <animateMotion dur="2.5s" repeatCount="indefinite">
              <mpath href="#pL1" />
            </animateMotion>
          </circle>
          <path id="pL1" d="M0 80 L120 80 L150 50 L300 50" fill="none" />

          {/* Left orange pulse 2 */}
          <circle r="2.5" fill="#FF6B00" opacity="0.85" filter="url(#glowO)">
            <animateMotion dur="2.8s" repeatCount="indefinite" begin="1s">
              <mpath href="#pL2" />
            </animateMotion>
          </circle>
          <path id="pL2" d="M0 220 L100 220 L130 250 L310 250" fill="none" />

          {/* Left blue pulse 1 */}
          <circle r="2.5" fill="#4A90D9" opacity="0.9" filter="url(#glowB)">
            <animateMotion dur="2.6s" repeatCount="indefinite" begin="0.5s">
              <mpath href="#pL3" />
            </animateMotion>
          </circle>
          <path id="pL3" d="M0 110 L80 110 L110 140 L250 140" fill="none" />

          {/* Left blue pulse 2 */}
          <circle r="2" fill="#4A90D9" opacity="0.8" filter="url(#glowB)">
            <animateMotion dur="3s" repeatCount="indefinite" begin="1.5s">
              <mpath href="#pL4" />
            </animateMotion>
          </circle>
          <path id="pL4" d="M0 260 L130 260 L160 290 L320 290" fill="none" />

          {/* Left extra orange */}
          <circle r="2.5" fill="#FF6B00" opacity="0.8" filter="url(#glowO)">
            <animateMotion dur="3.2s" repeatCount="indefinite" begin="2s">
              <mpath href="#pL5" />
            </animateMotion>
          </circle>
          <path id="pL5" d="M0 150 L140 150 L170 180 L340 180" fill="none" />

          {/* Left extra blue */}
          <circle r="2" fill="#4A90D9" opacity="0.75" filter="url(#glowB)">
            <animateMotion dur="3.4s" repeatCount="indefinite" begin="0.8s">
              <mpath href="#pL6" />
            </animateMotion>
          </circle>
          <path id="pL6" d="M0 350 L100 350 L130 320 L270 320" fill="none" />

          {/* Right orange pulse 1 */}
          <circle r="3" fill="#FF6B00" opacity="0.9" filter="url(#glowO)">
            <animateMotion dur="2.4s" repeatCount="indefinite" begin="0.3s">
              <mpath href="#pR1" />
            </animateMotion>
          </circle>
          <path id="pR1" d="M1400 70 L1260 70 L1230 100 L1080 100" fill="none" />

          {/* Right orange pulse 2 */}
          <circle r="2.5" fill="#FF6B00" opacity="0.85" filter="url(#glowO)">
            <animateMotion dur="2.7s" repeatCount="indefinite" begin="1.2s">
              <mpath href="#pR2" />
            </animateMotion>
          </circle>
          <path id="pR2" d="M1400 240 L1300 240 L1270 270 L1100 270" fill="none" />

          {/* Right blue pulse 1 */}
          <circle r="2.5" fill="#4A90D9" opacity="0.9" filter="url(#glowB)">
            <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.8s">
              <mpath href="#pR3" />
            </animateMotion>
          </circle>
          <path id="pR3" d="M1400 110 L1300 110 L1270 140 L1120 140" fill="none" />

          {/* Right blue pulse 2 */}
          <circle r="2" fill="#4A90D9" opacity="0.8" filter="url(#glowB)">
            <animateMotion dur="3.1s" repeatCount="indefinite" begin="1.8s">
              <mpath href="#pR4" />
            </animateMotion>
          </circle>
          <path id="pR4" d="M1400 300 L1290 300 L1260 330 L1110 330" fill="none" />

          {/* Right extra orange */}
          <circle r="2.5" fill="#FF6B00" opacity="0.8" filter="url(#glowO)">
            <animateMotion dur="2.9s" repeatCount="indefinite" begin="1.6s">
              <mpath href="#pR5" />
            </animateMotion>
          </circle>
          <path id="pR5" d="M1400 340 L1280 340 L1250 310 L1090 310" fill="none" />

          {/* Right extra blue */}
          <circle r="2" fill="#4A90D9" opacity="0.75" filter="url(#glowB)">
            <animateMotion dur="3.3s" repeatCount="indefinite" begin="0.4s">
              <mpath href="#pR6" />
            </animateMotion>
          </circle>
          <path id="pR6" d="M1400 190 L1270 190 L1240 160 L1100 160" fill="none" />

        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimateOnScroll animation="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {heading}
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll animation="fade-up" delay={120}>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            {description}
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll animation="fade-up" delay={240}>
          <Link
            href={buttonHref}
            className="btn-shimmer inline-block bg-accent text-white font-semibold px-10 py-4 rounded-full text-lg hover:bg-[#e05f00] transition-colors"
          >
            {buttonText}
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
