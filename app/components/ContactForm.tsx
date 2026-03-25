"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setSubmitted(true);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 4000);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-primary mb-2">Message Sent!</h3>
        <p className="text-gray-500">
          Thank you for reaching out. We&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition";

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <input type="hidden" name="form-name" value="contact" />
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Full Name <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          className={inputClass}
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Email Address <span className="text-accent">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          className={inputClass}
          placeholder="john@company.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Subject <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className={inputClass}
          placeholder="How can we help?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          name="message"
          required
          value={form.message}
          onChange={handleChange}
          rows={5}
          className={`${inputClass} resize-none`}
          placeholder="Tell us about your project and needs"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        className="w-full bg-accent text-white font-semibold py-3.5 rounded-lg hover:bg-[#e05f00] transition-colors text-sm"
      >
        Submit Message
      </button>
    </form>
  );
}
