"use client";

import { useState } from "react";
import AnimateOnScroll from "../components/AnimateOnScroll";

const contactInfo = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Phone",
    value: "+91 6382624227",
    href: "tel:+916382624227",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "business@neurostack.in",
    href: "mailto:business@neurostack.in",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#FF6B00]">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    label: "LinkedIn",
    value: "NeuroStack",
    href: "https://www.linkedin.com/company/neurostack-org/",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Location",
    value: "India",
    href: "#",
  },
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "contact",
          ...form,
        }).toString(),
      });

      if (!response.ok) throw new Error("Form submission failed");
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <main>
      {/* ── Hero Section ── */}
      <section
        className="relative pt-36 pb-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #FFF5EE 0%, #FAFCFF 50%, #EEF4FF 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0A2647 0.8px, transparent 0.8px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#FF6B00] opacity-[0.06] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#0A2647] opacity-[0.04] blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll animation="fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF6B00] mb-4">
              Get in Touch
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#0A2647] mb-6 leading-[1.1]">
              Let&apos;s Build<br />
              <span className="text-[#FF6B00]">Something Great</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Ready to transform your ideas into reality? Reach out and
              let&apos;s start the conversation.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Two-Column Contact Section ── */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0A2647 0.6px, transparent 0.6px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
            {/* ── Left: Contact Info ── */}
            <AnimateOnScroll animation="fade-right">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF6B00] mb-3">
                  Contact Information
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2647] mb-6 leading-tight">
                  We&apos;d love to<br />hear from you
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-12 max-w-md">
                  Reach out to us directly or fill out the form and we&apos;ll
                  get back to you promptly.
                </p>

                {/* Contact Cards */}
                <div className="space-y-6 mb-12">
                  {contactInfo.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-5 group p-4 rounded-2xl hover:bg-[#0A2647]/[0.03] transition-colors duration-300"
                    >
                      <div className="w-14 h-14 bg-[#FF6B00]/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6B00]/15 transition-colors duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#0A2647]/50 uppercase tracking-[0.15em] mb-1">
                          {item.label}
                        </p>
                        <p className="text-[#0A2647] font-semibold text-base group-hover:text-[#FF6B00] transition-colors duration-300">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>

              </div>
            </AnimateOnScroll>

            {/* ── Right: Contact Form (Dark Card) with Netlify Forms ── */}
            <AnimateOnScroll animation="fade-left" delay={150}>
              <div className="relative h-full min-h-[720px] lg:min-h-[780px]">
                <div
                  className="relative flex h-full flex-col overflow-hidden rounded-3xl px-8 py-12 md:px-10 md:py-14"
                  style={{
                    background: "linear-gradient(145deg, #0A2647 0%, #0d2f54 100%)",
                    boxShadow: "0 25px 60px rgba(10, 38, 71, 0.3)",
                  }}
                >
                  <div className="absolute inset-0 rounded-3xl border border-white/[0.08] pointer-events-none" />
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FF6B00] opacity-[0.06] blur-3xl pointer-events-none" />
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #ffffff 0.5px, transparent 0.5px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  <div className="relative flex h-full flex-col">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Send Us a Message
                    </h3>
                    <p className="text-white/50 text-sm mb-8">
                      Tell us about your project and needs
                    </p>

                    {status === "sent" ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-[#FF6B00]/20 flex items-center justify-center mx-auto mb-5">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Message Sent!
                        </h3>
                        <p className="text-white/50 mb-6">
                          Thank you for reaching out. We&apos;ll get back to you
                          shortly.
                        </p>
                        <button
                          onClick={() => setStatus("idle")}
                          className="text-[#FF6B00] text-sm font-semibold hover:underline"
                        >
                          Send another message
                        </button>
                      </div>
                    ) : (
                      <form
                        name="contact"
                        method="POST"
                        data-netlify="true"
                        onSubmit={handleSubmit}
                        className="flex h-full flex-col space-y-6"
                      >
                        <input type="hidden" name="form-name" value="contact" />
                        <div>
                          <label className="block text-xs font-semibold text-white uppercase tracking-[0.15em] mb-2">
                            Full Name <span className="text-[#FF6B00]">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full bg-transparent border-0 border-b border-white/15 pb-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FF6B00] transition-colors duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white uppercase tracking-[0.15em] mb-2">
                            Email Address <span className="text-[#FF6B00]">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@company.com"
                            className="w-full bg-transparent border-0 border-b border-white/15 pb-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FF6B00] transition-colors duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white uppercase tracking-[0.15em] mb-2">
                            Subject <span className="text-[#FF6B00]">*</span>
                          </label>
                          <input
                            type="text"
                            name="subject"
                            required
                            value={form.subject}
                            onChange={handleChange}
                            placeholder="How can we help?"
                            className="w-full bg-transparent border-0 border-b border-white/15 pb-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FF6B00] transition-colors duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white uppercase tracking-[0.15em] mb-2">
                            Message <span className="text-[#FF6B00]">*</span>
                          </label>
                          <textarea
                            name="message"
                            required
                            value={form.message}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Tell us about your project..."
                            className="w-full bg-transparent border-0 border-b border-white/15 pb-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FF6B00] transition-colors duration-300 resize-none"
                          />
                        </div>

                        {/* Error message */}
                        {status === "error" && (
                          <div className="flex items-center gap-2 text-red-400 text-sm">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                            </svg>
                            Something went wrong. Please try again.
                          </div>
                        )}

                        <div className="mt-auto pt-6">
                          <button
                            type="submit"
                            disabled={status === "sending"}
                            className="w-full bg-[#FF6B00] text-white font-semibold py-4 rounded-full hover:bg-[#e05f00] hover:shadow-[0_8px_30px_rgba(255,107,0,0.35)] transition-all duration-300 text-sm tracking-wide uppercase disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {status === "sending" ? (
                              <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                                  <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                                Sending...
                              </>
                            ) : (
                              "Send Message"
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </main>
  );
}
