import AnimateOnScroll from "../components/AnimateOnScroll";
import CTASection from "../components/CTASection";
import Link from "next/link";

/* ── Service Offerings ── */
const offerings = [
  {
    icon: "M9 3h6M9 3v5l-5 9a2 2 0 001.73 3h10.54A2 2 0 0018 17l-5-9V3M6 12h12",
    title: "Algorithm Design & Implementation",
    desc: "Custom algorithm development and optimization for complex computational problems. From concept to production-ready code with performance analysis and validation.",
    features: ["Custom Algorithm Development", "Performance Optimization", "Complexity Analysis", "Production-Ready Implementation", "Validation & Testing"],
    accent: "#FF6B00",
  },
  {
    icon: "M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
    title: "Conference Paper",
    desc: "Complete algorithm implementation + paper writing. IEEE/ACM/LNCS compliant, 4-8 pages with novel contributions, baseline comparisons, and plagiarism-safe content.",
    features: ["IEEE/ACM/LNCS Compliant Format", "4-8 Pages with Novel Contributions", "Baseline Comparisons & Analysis", "Plagiarism-Safe Content", "Camera-Ready Formatting"],
    accent: "#4A90D9",
  },
  {
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    title: "Journal Paper",
    desc: "Full research paper with extensive experiments, statistical validation, and ablation studies. 8-20+ pages, IEEE/ACM/LNCS compliant, essential for PhD thesis submission.",
    features: ["Extensive Experiments & Validation", "Statistical Analysis & Ablation Studies", "8-20+ Pages, IEEE/ACM/LNCS Compliant", "PhD Thesis Submission Ready", "Long-Term Academic Impact"],
    accent: "#FF6B00",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    title: "Research Assistantship",
    desc: "Comprehensive research support — from literature survey and gap analysis to experiment design, implementation, and manuscript preparation for students and scholars.",
    features: ["Literature Survey & Gap Analysis", "Experiment Design & Execution", "Manuscript Drafting & Review", "Mentor-Guided Research Workflow", "Publication Strategy Planning"],
    accent: "#4A90D9",
  },
];

/* ── Novel Research Works ── */
const novelWorks = [
  {
    title: "Opt-InNet",
    subtitle: "Deep Reinforcement Learning for Online Grooming Detection",
    desc: "Opt-InNet redefines grooming detection as a Markov Decision Process (MDP), enabling proactive, real-time intervention instead of post-facto classification. Unlike supervised methods, it uses reward shaping based on real trafficking profiles to minimize false alarms and detect grooming early.",
    novelty: "First system to introduce context-aware reinforcement learning with trafficking profiles, achieving proactive safety interventions.",
    algorithms: "Policy Gradient (REINFORCE), Actor-Critic, PPO, Sentence-BERT embeddings, Kalman filtering",
    accent: "#FF6B00",
  },
  {
    title: "MM-FuseNet",
    subtitle: "Dual-Stream Attention Model for Early Child Exploitation Risk Prediction",
    desc: "MM-FuseNet fuses chat logs (sequential text) and tabular trafficking case data using a dual-stream neural network. A novel attention-based fusion mechanism dynamically allocates importance across modalities for robust predictions.",
    novelty: "Pioneers multi-modal attention fusion of text + structured data for exploitation risk detection, with state-of-the-art performance (F1 = 0.86, AUC = 0.88).",
    algorithms: "LSTM for sequential chat modeling, MLP for tabular data, Attention-based fusion, Mixed Sampling, PyTorch pipeline",
    accent: "#4A90D9",
  },
  {
    title: "ACS-CEG",
    subtitle: "Cryptographically-Secured GNN for Robotic Misuse Detection",
    desc: "ACS-CEG secures robotic systems against insider misuse by encoding commands as cryptographic hashes and modeling them in a Command Evolving Graph (CEG). An inductive Graph Attention Network (GAT) detects subtle, malicious command sequences in real time.",
    novelty: "First to integrate cryptographic hashing (SHA-256) + GAT-based inductive learning for detecting insider robotic misuse.",
    algorithms: "SHA-256 hashing, Command Evolving Graphs, Graph Attention Networks (multi-head GAT), Global Mean Pooling, Inductive Learning",
    accent: "#FF6B00",
  },
  {
    title: "CHIM-FAST",
    subtitle: "Scalable Cellular Coverage Hole Mapping with Fuzzy Graphs",
    desc: "CHIM-FAST detects and maps cellular coverage holes across wide areas using crowdsourced data instead of expensive drive-tests. It transforms noisy, unreliable data into reliable insights by combining fuzzy logic, graph theory, and contraction hierarchies.",
    novelty: "First to apply fuzzy inference + contracted bidirectional graph search for nation-scale cellular coverage hole detection.",
    algorithms: "Fuzzy Inference System, Sigmoid Membership Functions, BFS for hole detection, Contraction Hierarchies, Bidirectional Dijkstra",
    accent: "#4A90D9",
  },
];

/* ── Stats ── */
const stats = [
  { value: "18+", label: "Papers / Month" },
  { value: "450+", label: "researches so far" },
  { value: "95%", label: "Acceptance Rate" },
  { value: "10+", label: "Journals & Conferences" },
];

/* ── Process ── */
const steps = [
  { num: "01", title: "Topic & Scope Analysis", desc: "Analyze your research domain, identify gaps, and define clear objectives." },
  { num: "02", title: "Algorithm & Implementation", desc: "Custom algorithm design, implementation, and benchmarking against SOTA baselines." },
  { num: "03", title: "Paper Writing & Formatting", desc: "Professional writing following IEEE/ACM/LNCS templates with proper citations and formulations." },
  { num: "04", title: "Review & Submission", desc: "Internal peer review, plagiarism check, camera-ready formatting, and submission guidance." },
];

/* ── Who We Help ── */
const audiences = [
  { title: "Students & Scholars", desc: "Guidance on thesis, projects, and publications.", icon: "M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422A12.083 12.083 0 0112 21a12.083 12.083 0 01-6.16-10.422L12 14z" },
  { title: "Startups & SMEs", desc: "End-to-end AI solutions to launch faster and smarter.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { title: "Enterprises", desc: "Scalable systems that integrate AI seamlessly into existing workflows.", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
];

export default function ResearchPage() {
  return (
    <main>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden min-h-[70vh] pt-28 pb-20 flex items-center" style={{ background: "linear-gradient(135deg, #FFF5EE 0%, #FAFCFF 50%, #EEF4FF 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.08] pointer-events-none" style={{ backgroundColor: "#FF6B00" }} />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.05] pointer-events-none" style={{ backgroundColor: "#4A90D9" }} />
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-[8rem] sm:text-[14rem] lg:text-[20rem] font-black leading-none select-none pointer-events-none hidden sm:block" style={{ color: "rgba(10,38,71,0.03)" }}>R&amp;D</div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-[0.15em] uppercase">AI Research</span>
            </div>
            <h1 className="hero-anim-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-[1.1] mb-6">
              Academic Research<br /><span className="text-accent">Powered by AI.</span>
            </h1>
            <p className="hero-anim-2 text-gray-500 text-lg sm:text-xl leading-relaxed max-w-xl mb-12">
              From algorithm design to journal-ready publications — we help researchers and PhD scholars produce high-impact, publication-ready work.
            </p>
            <div className="hero-anim-3 flex flex-wrap gap-8 sm:gap-12">
              {stats.map((s, i, arr) => (
                <div key={s.label} className="flex items-center gap-8 sm:gap-12">
                  <div>
                    <p className="text-3xl font-extrabold text-accent leading-none">{s.value}</p>
                    <p className="text-gray-400 text-xs mt-1 tracking-wide">{s.label}</p>
                  </div>
                  {i < arr.length - 1 && <div className="hidden sm:block w-px h-10 bg-gray-300" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ OFFERINGS ═══════════ */}
      <section className="py-20 sm:py-28 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0A2647 0%, #071b34 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-16 max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-[2px] bg-accent rounded-full" />
                <span className="text-accent font-semibold text-xs uppercase tracking-[0.2em]">What We Offer</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1]">Research Services</h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {offerings.map((item, i) => (
              <AnimateOnScroll key={item.title} animation="fade-up" delay={i * 100}>
                <div className="h-full rounded-3xl overflow-hidden bg-white shadow-xl flex flex-col">
                  <div className="h-[3px]" style={{ backgroundColor: item.accent }} />
                  <div className="p-7 sm:p-8 flex flex-col flex-1">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border" style={{ backgroundColor: `${item.accent}12`, borderColor: `${item.accent}25` }}>
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" style={{ stroke: item.accent }}><path d={item.icon} /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-3 leading-snug">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                    <div className="mt-auto pt-5 border-t border-gray-100">
                      <ul className="space-y-2.5">
                        {item.features.map((f) => (
                          <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                            <svg viewBox="0 0 16 16" className="w-3 h-3 flex-shrink-0" style={{ color: item.accent }}><path d="M3 8l3.5 3.5L13 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ NOVEL RESEARCH WORKS (blue cards) ═══════════ */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-[2px] bg-accent rounded-full" />
                <span className="text-accent font-semibold text-xs uppercase tracking-[0.2em]">Published Work</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary leading-[1.1]">
                Our Novel Research Works
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="space-y-8">
            {novelWorks.map((work, i) => (
              <AnimateOnScroll key={work.title} animation={i % 2 === 0 ? "fade-left" : "fade-right"} delay={80}>
                <div className="rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300" style={{ background: "linear-gradient(160deg, #0A2647 0%, #0D3A6B 100%)" }}>
                  <div className="h-[3px]" style={{ backgroundColor: work.accent }} />
                  <div className="p-8 sm:p-10">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border" style={{ backgroundColor: "rgba(255,107,0,0.2)", borderColor: "rgba(255,107,0,0.35)" }}>
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" style={{ stroke: "#FF6B00" }}>
                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">{work.title}</h3>
                        <p className="text-sm text-white/50 mt-1">{work.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-white/65 text-sm sm:text-[15px] leading-relaxed mb-6">{work.desc}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl p-4 border border-white/10 bg-white/[0.05]">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-2">Novelty</p>
                        <p className="text-sm text-white/60 leading-relaxed">{work.novelty}</p>
                      </div>
                      <div className="rounded-xl p-4 border border-white/10 bg-white/[0.05]">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-2">Key Algorithms</p>
                        <p className="text-sm text-white/60 leading-relaxed">{work.algorithms}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ GLOBAL CLIENT RESEARCH ═══════════ */}
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0A2647 0%, #0D3A6B 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-[2px] bg-accent rounded-full" />
                <span className="text-accent font-semibold text-xs uppercase tracking-[0.2em]">Industry Impact</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1]">
                Global Client <span className="text-accent">Research</span>
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={100}>
            <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="p-8 sm:p-12">
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug mb-2">
                  6G Beamforming Optimization
                </h3>
                <p className="text-white/50 text-sm mb-6">Federated Learning | Vision Transformers | Privacy-Preserving AI</p>
                <span className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full bg-accent/15 text-accent border border-accent/25 mb-4">InterDigital, Canada</span>
                <p className="text-white text-base leading-relaxed mb-8">
                  We developed a 6G Beamforming algorithm powered by Federated Nova, enabling distributed model training and secure weight aggregation for online training with strong privacy guarantees. Raw user data never leaves the edge devices while still contributing to the global optimization model.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl p-5 border border-white/10 bg-white/[0.04]">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-2">Novelty</p>
                    <p className="text-white/80 text-sm leading-relaxed">First to combine federated optimization with spatio-temporal Vision Transformers to analyze beam spatial data, predict interference patterns, and compute the optimal trajectory for adaptive beam steering.</p>
                  </div>
                  <div className="rounded-xl p-5 border border-white/10 bg-white/[0.04]">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-2">Key Algorithms</p>
                    <p className="text-white/80 text-sm leading-relaxed">Federated Nova, Secure Weight Aggregation, Vision Transformers for spatio-temporal beam analysis, RL for dynamic beam trajectory control, Graph-based modeling of beam-user associations.</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════ WHO WE HELP ═══════════ */}
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f8faff 0%, #ffffff 50%, #fff8f3 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-primary leading-[1.1] mb-4">Who We <span className="text-accent">Help</span></h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                We collaborate with students, researchers, startups, and enterprises who want to leverage AI to solve real-world problems. Explore our <Link href="/services" className="text-accent font-semibold hover:underline">full range of services</Link> or <Link href="/contact" className="text-accent font-semibold hover:underline">reach out</Link> to start a conversation.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {audiences.map((a, i) => (
              <AnimateOnScroll key={a.title} animation="fade-up" delay={i * 100}>
                <div className="rounded-2xl p-8 border border-white/10 shadow-sm hover:shadow-lg transition-all duration-300 text-center" style={{ background: "linear-gradient(160deg, #0A2647 0%, #0D3A6B 100%)" }}>
                  <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-6 bg-accent/20 border border-accent/30">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-accent" stroke="currentColor"><path d={a.icon} /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{a.title}</h3>
                  <p className="text-white/65 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SAMPLE RESEARCH PAPERS ═══════════ */}
      <CTASection
        heading="Have a Research Idea?"
        description="Whether it's an algorithm, a paper, or full research support — let's turn your idea into a published contribution."
        buttonText="Get in Touch"
      />
    </main>
  );
}
