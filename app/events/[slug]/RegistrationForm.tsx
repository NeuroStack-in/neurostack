"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { sendGAEvent } from "@next/third-parties/google";
import RegistrationCard from "./RegistrationCard";
import { CalendarIcon, CheckIcon, WhatsAppIcon } from "../icons";
import { OTHER_OPTION, type FormQuestion, type PublicForm } from "@/lib/googleForm";
import type { CommunityInvite } from "@/sanity/lib/events";

type Value = string | string[];

interface RegistrationFormProps {
  slug: string;
  eventTitle: string;
  eventDate: string;
  calendarUrl: string;
  form: PublicForm;
  seatsNote?: string;
  fallbackUrl?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const underlineInput =
  "w-full bg-transparent border-0 border-b border-white/15 pb-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FF6B00] transition-colors duration-300";
const optionBox =
  "flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 cursor-pointer transition-colors duration-200 hover:border-white/25 has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-white";

function fieldId(key: string) {
  return `field-${key.replace(/\./g, "-")}`;
}

function isEmpty(value: Value | undefined) {
  return Array.isArray(value) ? value.length === 0 : !value?.trim();
}

// Guess a better keyboard for short-answer questions from their wording.
function inputTypeFor(title: string) {
  if (/e-?mail/i.test(title)) return "email";
  if (/phone|mobile|whatsapp|contact (no|number)/i.test(title)) return "tel";
  return "text";
}

export default function RegistrationForm({
  slug,
  eventTitle,
  eventDate,
  calendarUrl,
  form,
  seatsNote,
  fallbackUrl,
}: RegistrationFormProps) {
  const [answers, setAnswers] = useState<Record<string, Value>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [community, setCommunity] = useState<CommunityInvite | null>(null);
  const [website, setWebsite] = useState(""); // hidden from people; bots fill it in
  const topRef = useRef<HTMLDivElement>(null);

  const questions = form.items.filter((item): item is FormQuestion => item.type === "question");

  const setAnswer = (key: string, value: Value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const found: Record<string, string> = {};
    if (form.collectsEmail && !EMAIL_PATTERN.test(String(answers.emailAddress ?? "").trim())) {
      found.emailAddress = "Enter a valid email address.";
    }
    for (const q of questions) {
      const value = answers[q.key];
      if (q.required && isEmpty(value)) {
        found[q.key] = "This question is required.";
        continue;
      }
      const chose = Array.isArray(value) ? value : [value];
      if (chose.includes(OTHER_OPTION) && isEmpty(answers[`${q.key}.other_option_response`])) {
        found[q.key] = 'Fill in your "Other" answer.';
      }
    }
    return found;
  };

  const showFirstError = (found: Record<string, string>) => {
    const first = Object.keys(found)[0];
    if (first) document.getElementById(fieldId(first))?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      showFirstError(found);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`/api/events/${slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setCommunity(data.community ?? null);
        setStatus("done");
        sendGAEvent("event", "sign_up", { method: "event_registration", event_slug: slug });
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (data.fieldErrors) {
        setErrors(data.fieldErrors);
        showFirstError(data.fieldErrors);
      }
      setMessage(data.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setMessage("We couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div ref={topRef} className="scroll-mt-28">
        <RegistrationCard>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#FF6B00]/20 flex items-center justify-center mx-auto mb-5">
              <CheckIcon className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">You&apos;re registered!</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
              We&apos;ve got your registration for {eventTitle}. See you on {eventDate}.
            </p>
          </div>

          {community && (
            <div className="mt-8 rounded-2xl bg-white p-6">
              <div className="flex items-center gap-4">
                {community.photoUrl ? (
                  <Image src={community.photoUrl} alt="" width={64} height={64} unoptimized className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#15803d]/10 text-[#15803d] flex items-center justify-center flex-shrink-0">
                    <WhatsAppIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#15803d] mb-1">Next step</p>
                  <h4 className="text-lg font-bold text-primary leading-snug">{community.name || "Join our WhatsApp community"}</h4>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mt-4">
                {community.description || "Event updates, joining details and reminders are shared here."}
              </p>
              <a
                href={community.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-[#15803d] hover:bg-[#166534] text-white font-semibold py-3.5 text-sm transition-colors duration-300"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Join on WhatsApp
              </a>
            </div>
          )}

          <div className="mt-6 text-center">
            <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200">
              <CalendarIcon className="w-4 h-4" />
              Add to Google Calendar
            </a>
          </div>
        </RegistrationCard>
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      <RegistrationCard>
        <h3 className="text-2xl font-bold text-white mb-2">Register for this event</h3>
        <p className="text-white/50 text-sm mb-8">
          {seatsNote ? `${seatsNote} · ` : ""}Takes under a minute.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-7">
          {/* Honeypot: off-screen, skipped by keyboard and screen readers */}
          <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
            <label>
              Website
              <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </label>
          </div>

          {form.collectsEmail && (
            <Field id={fieldId("emailAddress")} label="Email" required error={errors.emailAddress}>
              <input
                id={`${fieldId("emailAddress")}-input`}
                type="email"
                autoComplete="email"
                value={String(answers.emailAddress ?? "")}
                onChange={(e) => setAnswer("emailAddress", e.target.value)}
                placeholder="you@example.com"
                className={underlineInput}
              />
            </Field>
          )}

          {form.items.map((item) =>
            item.type === "heading" ? (
              <div key={item.key} className="pt-4 border-t border-white/10">
                {item.title && <h4 className="text-base font-bold text-white">{item.title}</h4>}
                {item.help && <p className="text-white/50 text-sm mt-1 whitespace-pre-line">{item.help}</p>}
              </div>
            ) : (
              <Question
                key={item.key}
                question={item}
                value={answers[item.key]}
                otherValue={String(answers[`${item.key}.other_option_response`] ?? "")}
                error={errors[item.key]}
                onChange={(value) => setAnswer(item.key, value)}
                onOtherChange={(value) => setAnswer(`${item.key}.other_option_response`, value)}
              />
            ),
          )}

          {status === "error" && (
            <div role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {message}
              {fallbackUrl && (
                <>
                  {" "}
                  <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline">
                    Register on Google Forms instead
                  </a>
                  .
                </>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-[#FF6B00] text-white font-semibold py-4 rounded-full hover:bg-[#e05f00] hover:shadow-[0_8px_30px_rgba(255,107,0,0.35)] transition-all duration-300 text-sm tracking-wide uppercase disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "sending" ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                    <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Registering...
                </>
              ) : (
                "Complete registration"
              )}
            </button>
          </div>
        </form>
      </RegistrationCard>
    </div>
  );
}

/* ── Fields ── */

function Field({
  id,
  label,
  help,
  required,
  error,
  children,
  asGroup,
}: {
  id: string;
  label: string;
  help?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  asGroup?: boolean;
}) {
  const heading = (
    <>
      {label}
      {required && <span className="text-[#FF6B00]"> *</span>}
    </>
  );
  return (
    <div id={id} className="scroll-mt-32">
      {asGroup ? (
        <p className="block text-sm font-semibold text-white mb-1.5" id={`${id}-label`}>{heading}</p>
      ) : (
        <label htmlFor={`${id}-input`} className="block text-sm font-semibold text-white mb-1.5">{heading}</label>
      )}
      {help && <p className="text-xs text-white/45 mb-3 whitespace-pre-line">{help}</p>}
      <div className={help ? "" : "mt-3"}>{children}</div>
      {error && <p className="text-xs text-red-300 mt-2">{error}</p>}
    </div>
  );
}

function Question({
  question: q,
  value,
  otherValue,
  error,
  onChange,
  onOtherChange,
}: {
  question: FormQuestion;
  value: Value | undefined;
  otherValue: string;
  error?: string;
  onChange: (value: Value) => void;
  onOtherChange: (value: string) => void;
}) {
  const id = fieldId(q.key);
  const inputId = `${id}-input`;
  const single = typeof value === "string" ? value : "";
  const many = Array.isArray(value) ? value : [];
  const fieldProps = { id, label: q.title, help: q.help, required: q.required, error };

  switch (q.kind) {
    case "short":
      return (
        <Field {...fieldProps}>
          <input id={inputId} type={inputTypeFor(q.title)} value={single} onChange={(e) => onChange(e.target.value)} className={underlineInput} placeholder="Your answer" />
        </Field>
      );
    case "paragraph":
      return (
        <Field {...fieldProps}>
          <textarea id={inputId} rows={4} value={single} onChange={(e) => onChange(e.target.value)} className={`${underlineInput} resize-none`} placeholder="Your answer" />
        </Field>
      );
    case "dropdown":
      return (
        <Field {...fieldProps}>
          <select
            id={inputId}
            value={single}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#0d2f54] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF6B00] transition-colors duration-300"
          >
            <option value="">Choose</option>
            {q.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </Field>
      );
    case "choice":
    case "checkboxes": {
      const multiple = q.kind === "checkboxes";
      const isChecked = (opt: string) => (multiple ? many.includes(opt) : single === opt);
      const toggle = (opt: string) => {
        if (!multiple) return onChange(opt);
        onChange(many.includes(opt) ? many.filter((v) => v !== opt) : [...many, opt]);
      };
      const options = q.allowOther ? [...q.options, OTHER_OPTION] : q.options;
      return (
        <Field {...fieldProps} asGroup>
          <div role={multiple ? "group" : "radiogroup"} aria-labelledby={`${id}-label`} className="space-y-2.5">
            {options.map((opt) => (
              <label key={opt} className={optionBox}>
                <input
                  type={multiple ? "checkbox" : "radio"}
                  name={q.key}
                  value={opt}
                  checked={isChecked(opt)}
                  onChange={() => toggle(opt)}
                  className="w-4 h-4 accent-[#FF6B00] flex-shrink-0"
                />
                {opt === OTHER_OPTION ? "Other" : opt}
              </label>
            ))}
            {q.allowOther && isChecked(OTHER_OPTION) && (
              <input
                type="text"
                aria-label={`${q.title}: other`}
                value={otherValue}
                onChange={(e) => onOtherChange(e.target.value)}
                placeholder="Please specify"
                className={`${underlineInput} mt-2`}
                autoFocus
              />
            )}
          </div>
        </Field>
      );
    }
    case "scale":
      return (
        <Field {...fieldProps} asGroup>
          <div role="radiogroup" aria-labelledby={`${id}-label`}>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => (
                <label
                  key={opt}
                  className="w-11 h-11 rounded-xl border border-white/15 flex items-center justify-center text-sm font-semibold text-white/80 cursor-pointer transition-colors duration-200 hover:border-white/40 has-[:checked]:bg-accent has-[:checked]:border-accent has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white/60"
                >
                  <input type="radio" name={q.key} value={opt} checked={single === opt} onChange={() => onChange(opt)} className="sr-only" />
                  {opt}
                </label>
              ))}
            </div>
            {q.scaleLabels && (q.scaleLabels[0] || q.scaleLabels[1]) && (
              <div className="flex justify-between text-xs text-white/45 mt-2 max-w-md">
                <span>{q.scaleLabels[0]}</span>
                <span>{q.scaleLabels[1]}</span>
              </div>
            )}
          </div>
        </Field>
      );
    case "date":
    case "time":
      return (
        <Field {...fieldProps}>
          <input id={inputId} type={q.kind} value={single} onChange={(e) => onChange(e.target.value)} className={`${underlineInput} [color-scheme:dark]`} />
        </Field>
      );
  }
}
